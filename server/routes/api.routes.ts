import express from "express";
import { registerAdminRoutes } from "./admin.routes.js";
import { registerAppointmentRoutes } from "./appointments.routes.js";
import { registerAuthRoutes } from "./auth.routes.js";
import { registerClientRoutes } from "./client.routes.js";
import { registerCommandRoutes } from "./commands.routes.js";
import { registerDashboardRoutes } from "./dashboard.routes.js";

export function registerApiRoutes(app: express.Express) {
  app.get("/api/health", (_req, res) => res.json({ ok: true, name: "Barbe API" }));

  registerAuthRoutes(app);
  registerDashboardRoutes(app);
  registerAppointmentRoutes(app);
  registerCommandRoutes(app);
  registerAdminRoutes(app);
  registerClientRoutes(app);

  app.use("/api", (_req, res) => res.status(404).json({ message: "Rota n?o encontrada." }));
}
