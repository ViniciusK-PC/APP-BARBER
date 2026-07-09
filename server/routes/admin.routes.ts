import express from "express";
import { z } from "zod";
import { allow, authenticate } from "../auth.js";
import { all, get, insert, run } from "../db.js";
import { asyncRoute } from "./route-utils.js";

export function registerAdminRoutes(app: express.Express) {
  type CrudConfig = { table: string; select: string; order?: string };
    const crud: Record<string, CrudConfig> = {
      clients: { table: "clients", select: "*" , order: "name" },
      professionals: { table: "professionals", select: "professionals.*, users.name, users.email, users.phone", order: "users.name" },
      services: { table: "services", select: "services.*, categories.name category_name", order: "services.name" },
      products: { table: "products", select: "products.*, categories.name category_name", order: "products.name" },
      categories: { table: "categories", select: "*", order: "name" },
      coupons: { table: "coupons", select: "*", order: "code" },
      finance: { table: "cash_entries", select: "*", order: "created_at DESC" }
    };

    app.get("/api/:resource", authenticate, asyncRoute(async (req, res, next) => {
      const resource = String(req.params.resource);
      const config = crud[resource];
      if (!config) return next();
      let from = `${config.table}`;
      if (resource === "professionals") from += " JOIN users ON users.id=professionals.user_id";
      if (resource === "services" || resource === "products") from += ` LEFT JOIN categories ON categories.id=${config.table}.category_id`;
      res.json(await all(`SELECT ${config.select} FROM ${from} ORDER BY ${config.order || "id DESC"}`));
    }));

    app.post("/api/clients", authenticate, allow("admin", "professional"), asyncRoute(async (req, res) => {
      const parsed = z.object({ name: z.string().min(2), phone: z.string().min(8), email: z.union([z.email(), z.literal("")]).optional(), notes: z.string().optional() }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados do cliente inválidos." });
      const id = await insert("INSERT INTO clients (name,phone,email,notes) VALUES (?,?,?,?)",
        [parsed.data.name, parsed.data.phone, parsed.data.email || null, parsed.data.notes || null]);
      res.status(201).json({ id });
    }));

    app.post("/api/services", authenticate, allow("admin"), asyncRoute(async (req, res) => {
      const p = z.object({ name: z.string().min(2), durationMinutes: z.coerce.number().min(5), price: z.coerce.number().nonnegative(), categoryId: z.coerce.number().optional(), description: z.string().optional() }).safeParse(req.body);
      if (!p.success) return res.status(400).json({ message: "Dados do serviço inválidos." });
      const id = await insert("INSERT INTO services (name,duration_minutes,price,category_id,description) VALUES (?,?,?,?,?)",
        [p.data.name, p.data.durationMinutes, p.data.price, p.data.categoryId || null, p.data.description || null]);
      res.status(201).json({ id });
    }));

    app.post("/api/products", authenticate, allow("admin"), asyncRoute(async (req, res) => {
      const p = z.object({ name: z.string().min(2), price: z.coerce.number().nonnegative(), cost: z.coerce.number().nonnegative().default(0), stock: z.coerce.number().int().nonnegative(), minStock: z.coerce.number().int().nonnegative().default(0), sku: z.string().optional(), description: z.string().optional() }).safeParse(req.body);
      if (!p.success) return res.status(400).json({ message: "Dados do produto inválidos." });
      const id = await insert("INSERT INTO products (name,price,cost,stock,min_stock,sku,description) VALUES (?,?,?,?,?,?,?)",
        [p.data.name, p.data.price, p.data.cost, p.data.stock, p.data.minStock, p.data.sku || null, p.data.description || null]);
      res.status(201).json({ id });
    }));

    app.post("/api/finance", authenticate, allow("admin"), asyncRoute(async (req, res) => {
      const p = z.object({ type: z.enum(["income", "expense"]), category: z.string().min(2), description: z.string().min(2), amount: z.coerce.number().positive(), dueDate: z.string().optional(), status: z.enum(["paid", "pending"]).default("paid") }).safeParse(req.body);
      if (!p.success) return res.status(400).json({ message: "Dados financeiros inválidos." });
      const id = await insert("INSERT INTO cash_entries (type,category,description,amount,due_date,paid_at,status) VALUES (?,?,?,?,?,?,?)",
        [p.data.type, p.data.category, p.data.description, p.data.amount, p.data.dueDate || null, p.data.status === "paid" ? new Date().toISOString() : null, p.data.status]);
      res.status(201).json({ id });
    }));

    app.get("/api/settings/business", asyncRoute(async (_req, res) => {
      const row = await get<{ value: string }>("SELECT value FROM settings WHERE key='business'");
      res.json(row ? JSON.parse(row.value) : {});
    }));

    app.put("/api/settings/business", authenticate, allow("admin"), asyncRoute(async (req, res) => {
      const p = z.object({ name: z.string().min(2), slogan: z.string().default(""), primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/), address: z.string().default(""), phone: z.string().default("") }).safeParse(req.body);
      if (!p.success) return res.status(400).json({ message: "Configurações inválidas." });
      await run("INSERT INTO settings (key,value) VALUES ('business',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", [JSON.stringify(p.data)]);
      res.json(p.data);
    }));

    app.get("/api/modules/:module", authenticate, allow("admin", "professional"), asyncRoute(async (req, res) => {
      const module = String(req.params.module);
      const rows = (await all<any>("SELECT * FROM module_records WHERE module=? ORDER BY id DESC", [module]))
        .map((row) => ({ ...row, data: typeof row.data === "string" ? JSON.parse(row.data) : row.data }));
      res.json(rows);
    }));

    app.post("/api/modules/:module", authenticate, allow("admin"), asyncRoute(async (req, res) => {
      const parsed = z.object({
        title: z.string().trim().min(1),
        data: z.record(z.string(), z.unknown()).default({}),
        status: z.enum(["active", "inactive", "pending", "completed"]).default("active")
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Confira os dados do cadastro." });
      const id = await insert("INSERT INTO module_records (module,title,data,status) VALUES (?,?,?::jsonb,?)",
        [String(req.params.module), parsed.data.title, JSON.stringify(parsed.data.data), parsed.data.status]);
      res.status(201).json({ id });
    }));

    app.put("/api/modules/:module/:id", authenticate, allow("admin"), asyncRoute(async (req, res) => {
      const parsed = z.object({
        title: z.string().trim().min(1),
        data: z.record(z.string(), z.unknown()).default({}),
        status: z.enum(["active", "inactive", "pending", "completed"]).default("active")
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Confira os dados do cadastro." });
      await run("UPDATE module_records SET title=?,data=?::jsonb,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND module=?",
        [parsed.data.title, JSON.stringify(parsed.data.data), parsed.data.status, req.params.id, String(req.params.module)]);
      res.json({ ok: true });
    }));

    app.delete("/api/modules/:module/:id", authenticate, allow("admin"), asyncRoute(async (req, res) => {
      await run("DELETE FROM module_records WHERE id=? AND module=?", [req.params.id, String(req.params.module)]);
      res.json({ ok: true });
    }));

  
}
