import type { Express } from "express";

export function registerLandingRoutes(app: Express) {
  app.get("/api/landing/config", (_req, res) => {
    res.json({
      status: "standby",
      module: "landing",
      message: "Gerenciamento da landing page será implementado aqui."
    });
  });
}
