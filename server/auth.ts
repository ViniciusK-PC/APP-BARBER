import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type Role = "admin" | "professional" | "client";
export type SessionUser = { id: number; name: string; email: string; role: Role; avatar?: string | null };

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

const secret = process.env.JWT_SECRET || "barbe-development-secret";

export function signToken(user: SessionUser) {
  return jwt.sign(user, secret, { expiresIn: "7d" });
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ message: "Autenticação necessária." });
  try {
    req.user = jwt.verify(token, secret) as SessionUser;
    next();
  } catch {
    res.status(401).json({ message: "Sessão inválida ou expirada." });
  }
}

export function allow(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Você não tem permissão para esta ação." });
    }
    next();
  };
}
