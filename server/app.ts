import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerApiRoutes } from "./routes/api.routes.js";
import "./seed.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  registerApiRoutes(app);

  const webDist = path.resolve(dirname, "../dist");
  app.use(express.static(webDist));
  app.use((_req, res) => res.sendFile(path.join(webDist, "index.html")));

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);
    res.status(500).json({ message: "Ocorreu um erro interno." });
  });

  return app;
}
