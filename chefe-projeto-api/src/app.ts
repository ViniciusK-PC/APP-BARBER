import cors from "cors";
import express from "express";
import { errorHandler } from "./http/error-handler.js";
import { registerRoutes } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  registerRoutes(app);

  app.use(errorHandler);

  return app;
}
