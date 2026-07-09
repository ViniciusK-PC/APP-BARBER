import express from "express";
import { z } from "zod";
import { allow, authenticate } from "../auth.js";
import { all, get, insert, transaction } from "../db.js";
import { asyncRoute } from "./route-utils.js";

export function registerClientRoutes(app: express.Express) {
  app.get("/api/store/catalog", asyncRoute(async (_req, res) => {
      res.json({
        services: await all("SELECT * FROM services WHERE active=1 AND online_booking=1 ORDER BY name"),
        products: await all("SELECT * FROM products WHERE active=1 AND online_store=1 ORDER BY name"),
        professionals: await all("SELECT p.*,u.name,u.avatar FROM professionals p JOIN users u ON u.id=p.user_id WHERE u.active=1 AND p.available_online=1")
      });
    }));

    app.get("/api/client/profile", authenticate, allow("client"), asyncRoute(async (req, res) => {
      const client = await get("SELECT * FROM clients WHERE user_id=?", [req.user!.id]);
      if (!client) return res.status(404).json({ message: "Perfil de cliente não encontrado." });
      res.json(client);
    }));

    app.put("/api/client/profile", authenticate, allow("client"), asyncRoute(async (req, res) => {
      const parsed = z.object({
        name: z.string().min(2).optional(), phone: z.string().min(8).optional(),
        birthDate: z.string().optional(), gender: z.string().optional(),
        country: z.string().optional(), zip: z.string().optional(), address: z.string().optional(),
        district: z.string().optional(), number: z.string().optional(), complement: z.string().optional(),
        state: z.string().optional(), city: z.string().optional()
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados de perfil inválidos." });
      const d = parsed.data;
      await transaction(async client => {
        await client.query("UPDATE users SET name=coalesce($1,name), phone=coalesce($2,phone) WHERE id=$3", [d.name || null, d.phone || null, req.user!.id]);
        await client.query(`
          UPDATE clients SET name=coalesce($1,name), phone=coalesce($2,phone), birth_date=coalesce($3,birth_date),
          gender=coalesce($4,gender), country=coalesce($5,country), zip=coalesce($6,zip), address=coalesce($7,address),
          district=coalesce($8,district), number=coalesce($9,number), complement=coalesce($10,complement),
          state=coalesce($11,state), city=coalesce($12,city) WHERE user_id=$13
        `, [d.name || null, d.phone || null, d.birthDate || null, d.gender || null, d.country || null, d.zip || null, d.address || null, d.district || null, d.number || null, d.complement || null, d.state || null, d.city || null, req.user!.id]);
      });
      res.json(await get("SELECT * FROM clients WHERE user_id=?", [req.user!.id]));
    }));

    app.get("/api/messages", authenticate, asyncRoute(async (req, res) => {
      const otherId = Number(req.query.with);
      if (!otherId) return res.status(400).json({ message: "Informe o contato." });
      res.json(await all(`
        SELECT m.*, su.name sender_name, ru.name receiver_name FROM messages m
        JOIN users su ON su.id=m.sender_id JOIN users ru ON ru.id=m.receiver_id
        WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?)
        ORDER BY created_at
      `, [req.user!.id, otherId, otherId, req.user!.id]));
    }));

    app.post("/api/messages", authenticate, asyncRoute(async (req, res) => {
      const p = z.object({ receiverId: z.coerce.number().positive(), body: z.string().trim().min(1).max(2000) }).safeParse(req.body);
      if (!p.success) return res.status(400).json({ message: "Mensagem inválida." });
      const id = await insert("INSERT INTO messages (sender_id,receiver_id,body) VALUES (?,?,?)", [req.user!.id, p.data.receiverId, p.data.body]);
      res.status(201).json({ id });
    }));

  
}
