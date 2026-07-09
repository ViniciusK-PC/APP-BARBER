import type { Express } from "express";

export function registerProjectRoutes(app: Express) {
  app.get("/api/project/overview", (_req, res) => {
    res.json({
      status: "standby",
      modules: ["landing", "client-area", "main-api", "barber-admin"]
    });
  });
}
