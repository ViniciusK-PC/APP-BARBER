import express from "express";
import { z } from "zod";
import { authenticate } from "../auth.js";
import { all, get, insert, run } from "../db.js";
import { asyncRoute } from "./route-utils.js";

export function registerAppointmentRoutes(app: express.Express) {
  app.get("/api/appointments", authenticate, asyncRoute(async (req, res) => {
      const from = String(req.query.from || "2000-01-01");
      const to = String(req.query.to || "2100-01-01");
      const rows = await all(`
        SELECT a.*, c.name client_name, c.phone client_phone, u.name professional_name,
          p.color professional_color, s.name service_name, s.duration_minutes
        FROM appointments a JOIN clients c ON c.id=a.client_id
        JOIN professionals p ON p.id=a.professional_id JOIN users u ON u.id=p.user_id
        JOIN services s ON s.id=a.service_id
        WHERE a.starts_at::date BETWEEN ? AND ?
        ORDER BY a.starts_at
      `, [from, to]);
      res.json(rows);
    }));

    app.post("/api/appointments", authenticate, asyncRoute(async (req, res) => {
      const schema = z.object({
        clientId: z.coerce.number().positive(),
        professionalId: z.coerce.number().positive(),
        serviceId: z.coerce.number().positive(),
        startsAt: z.string().min(10),
        notes: z.string().optional().default(""),
        source: z.string().optional().default("admin")
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados do agendamento inválidos." });
      let clientId = parsed.data.clientId;
      if (req.user!.role === "client") {
        const ownClient = await get<{ id: number }>("SELECT id FROM clients WHERE user_id=?", [req.user!.id]);
        if (!ownClient) return res.status(403).json({ message: "Cadastro de cliente não localizado." });
        clientId = ownClient.id;
      }
      const service = await get<any>("SELECT * FROM services WHERE id=? AND active=1", [parsed.data.serviceId]);
      if (!service) return res.status(404).json({ message: "Serviço não encontrado." });
      const start = new Date(parsed.data.startsAt);
      const end = new Date(start.getTime() + service.duration_minutes * 60_000);
      const conflict = await get("SELECT id FROM appointments WHERE professional_id=? AND status NOT IN ('cancelled','no_show') AND starts_at < ? AND ends_at > ?", [
        parsed.data.professionalId, end.toISOString(), start.toISOString()
      ]);
      if (conflict) return res.status(409).json({ message: "Este profissional já possui atendimento no horário." });
      const id = await insert(`
        INSERT INTO appointments (client_id,professional_id,service_id,starts_at,ends_at,price,notes,source)
        VALUES (?,?,?,?,?,?,?,?)
      `, [clientId, parsed.data.professionalId, parsed.data.serviceId, start.toISOString(), end.toISOString(), service.price, parsed.data.notes, parsed.data.source]);
      res.status(201).json({ id });
    }));

    app.patch("/api/appointments/:id/status", authenticate, asyncRoute(async (req, res) => {
      const status = z.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"]).safeParse(req.body.status);
      if (!status.success) return res.status(400).json({ message: "Status inválido." });
      await run("UPDATE appointments SET status=? WHERE id=?", [status.data, req.params.id]);
      res.json({ ok: true });
    }));

  
}
