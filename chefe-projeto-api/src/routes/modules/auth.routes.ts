import type { Express } from "express";
import { z } from "zod";
import { asyncRoute } from "../../http/async-route.js";

export function registerAuthRoutes(app: Express) {
  app.post("/api/auth/login", asyncRoute(async (req, res) => {
    const parsed = z.object({
      email: z.email(),
      password: z.string().min(6)
    }).safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Dados inválidos." });
    }

    res.status(501).json({
      message: "Autenticação do chefe em standby.",
      status: "standby"
    });
  }));
}
