import express from "express";
import { z } from "zod";
import { allow, authenticate } from "../auth.js";
import { all, get, insert, run, transaction } from "../db.js";
import { asyncRoute } from "./route-utils.js";

export function registerCommandRoutes(app: express.Express) {
  app.get("/api/commands", authenticate, allow("admin", "professional"), asyncRoute(async (_req, res) => {
      res.json(await all(`
        SELECT c.*, cl.name client_name, u.name professional_name,
          coalesce((SELECT sum((quantity * unit_price) - discount) FROM command_items ci WHERE ci.command_id=c.id), c.total) calculated_total
        FROM commands c
        LEFT JOIN clients cl ON cl.id=c.client_id
        LEFT JOIN professionals p ON p.id=c.professional_id
        LEFT JOIN users u ON u.id=p.user_id
        ORDER BY c.opened_at DESC
      `));
    }));

    app.post("/api/commands", authenticate, allow("admin", "professional"), asyncRoute(async (req, res) => {
      const parsed = z.object({
        clientId: z.coerce.number().positive(),
        professionalId: z.coerce.number().positive(),
        notes: z.string().optional().default("")
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados da comanda inválidos." });
      const id = await insert("INSERT INTO commands (client_id,professional_id,notes) VALUES (?,?,?)",
        [parsed.data.clientId, parsed.data.professionalId, parsed.data.notes]);
      res.status(201).json({ id });
    }));

    app.post("/api/commands/:id/items", authenticate, allow("admin", "professional"), asyncRoute(async (req, res) => {
      const parsed = z.object({
        itemType: z.enum(["service", "product"]),
        itemId: z.coerce.number().positive(),
        quantity: z.coerce.number().int().positive().default(1),
        professionalId: z.coerce.number().positive().optional()
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Item da comanda inválido." });
      const source = parsed.data.itemType === "service" ? "services" : "products";
      const item = await get<any>(`SELECT id,name,price FROM ${source} WHERE id=?`, [parsed.data.itemId]);
      if (!item) return res.status(404).json({ message: "Item não encontrado." });
      await run("INSERT INTO command_items (command_id,item_type,item_id,description,quantity,unit_price,professional_id) VALUES (?,?,?,?,?,?,?)",
        [req.params.id, parsed.data.itemType, item.id, item.name, parsed.data.quantity, item.price, parsed.data.professionalId || null]);
      await run("UPDATE commands SET total=(SELECT coalesce(sum((quantity*unit_price)-discount),0) FROM command_items WHERE command_id=?) WHERE id=?",
        [req.params.id, req.params.id]);
      res.status(201).json({ ok: true });
    }));

    app.patch("/api/commands/:id/close", authenticate, allow("admin", "professional"), asyncRoute(async (req, res) => {
      const parsed = z.object({ method: z.string().min(1) }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Informe a forma de pagamento." });
      const command = await get<any>("SELECT * FROM commands WHERE id=? AND status='open'", [req.params.id]);
      if (!command) return res.status(404).json({ message: "Comanda aberta não encontrada." });
      await transaction(async client => {
        await run("UPDATE commands SET status='paid',closed_at=CURRENT_TIMESTAMP WHERE id=?", [req.params.id], client);
        await run("INSERT INTO payments (command_id,method,amount) VALUES (?,?,?)", [req.params.id, parsed.data.method, command.total], client);
        await run("INSERT INTO cash_entries (type,category,description,amount,paid_at,status) VALUES ('income','Comandas',?,?,CURRENT_TIMESTAMP,'paid')",
          [`Comanda #${req.params.id}`, command.total], client);
      });
      res.json({ ok: true });
    }));

  
}
