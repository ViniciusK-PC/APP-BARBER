import type { Express } from "express";
import { registerAuthRoutes } from "./modules/auth.routes.js";
import { registerLandingRoutes } from "./modules/landing.routes.js";
import { registerProjectRoutes } from "./modules/project.routes.js";

export function registerRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, name: "Chefe Projeto API", status: "standby" });
  });

  registerAuthRoutes(app);
  registerLandingRoutes(app);
  registerProjectRoutes(app);

  app.use("/api", (_req, res) => {
    res.status(404).json({ message: "Rota não encontrada no Chefe Projeto API." });
  });
}
