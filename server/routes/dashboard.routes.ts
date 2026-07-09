import express from "express";
import { allow, authenticate } from "../auth.js";
import { all, get } from "../db.js";
import { asyncRoute } from "./route-utils.js";

export function registerDashboardRoutes(app: express.Express) {
  app.get("/api/dashboard", authenticate, allow("admin", "professional"), asyncRoute(async (_req, res) => {
      const today = new Date().toISOString().slice(0, 10);
      const month = today.slice(0, 7);
      const stats = {
        appointmentsToday: Number((await get<any>("SELECT count(*) total FROM appointments WHERE starts_at::date=?", [today]))?.total || 0),
        clients: Number((await get<any>("SELECT count(*) total FROM clients"))?.total || 0),
        revenueMonth: Number((await get<any>("SELECT coalesce(sum(amount),0) total FROM cash_entries WHERE type='income' AND to_char(coalesce(paid_at,created_at),'YYYY-MM')=?", [month]))?.total || 0),
        openCommands: Number((await get<any>("SELECT count(*) total FROM commands WHERE status='open'"))?.total || 0),
        lowStock: Number((await get<any>("SELECT count(*) total FROM products WHERE stock <= min_stock AND active=1"))?.total || 0)
      };
      const nextAppointments = await all(`
        SELECT a.*, c.name client_name, u.name professional_name, s.name service_name
        FROM appointments a JOIN clients c ON c.id=a.client_id
        JOIN professionals p ON p.id=a.professional_id JOIN users u ON u.id=p.user_id
        JOIN services s ON s.id=a.service_id
        WHERE a.starts_at >= CURRENT_TIMESTAMP AND a.status NOT IN ('cancelled','completed')
        ORDER BY a.starts_at LIMIT 6
      `);
      const cashFlow = (await all(`
        SELECT to_char(coalesce(paid_at,created_at),'YYYY-MM-DD') AS "day",
          sum(CASE WHEN type='income' THEN amount ELSE 0 END) income,
          sum(CASE WHEN type='expense' THEN amount ELSE 0 END) expense
        FROM cash_entries GROUP BY 1 ORDER BY 1 DESC LIMIT 14
      `)).reverse();
      const popularServices = await all(`
        SELECT s.name, count(a.id) total FROM services s
        LEFT JOIN appointments a ON a.service_id=s.id GROUP BY s.id ORDER BY total DESC LIMIT 5
      `);
      res.json({ stats, nextAppointments, cashFlow, popularServices });
    }));

  
}
