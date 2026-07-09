import bcrypt from "bcryptjs";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import crypto from "node:crypto";
import { z } from "zod";
import { authenticate, signToken } from "../auth.js";
import { get, insert, run, transaction } from "../db.js";
import { sendVerificationEmail } from "../email.js";
import { asyncRoute } from "./route-utils.js";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;
const publicAppUrl = (process.env.PUBLIC_APP_URL || process.env.FRONTEND_URL || "http://127.0.0.1:4174").replace(/\/$/, "");

function hashVerificationToken(token: string) { return crypto.createHash("sha256").update(token).digest("hex"); }

async function issueEmailVerification(user: { id: number; name: string; email: string }) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashVerificationToken(token);
  await run(`UPDATE users SET email_verification_token_hash=?, email_verification_sent_at=CURRENT_TIMESTAMP WHERE id=?`, [tokenHash, user.id]);
  const verificationUrl = `${publicAppUrl}/cliente?verifyEmail=${encodeURIComponent(token)}`;
  return sendVerificationEmail({ name: user.name, email: user.email, verificationUrl });
}

export function registerAuthRoutes(app: express.Express) {
  app.post("/api/auth/login", asyncRoute(async (req, res) => {
      const parsed = z.object({ email: z.email(), password: z.string().min(6) }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "E-mail ou senha inválidos." });
      const user = await get<any>("SELECT * FROM users WHERE lower(email)=lower(?) AND active=1", [parsed.data.email]);
      if (!user || !user.password_hash || !bcrypt.compareSync(parsed.data.password, user.password_hash)) {
        return res.status(401).json({ message: "E-mail ou senha incorretos." });
      }
      if (user.role === "client" && !user.email_verified_at) {
        return res.status(403).json({
          code: "EMAIL_NOT_VERIFIED",
          message: "Confirme seu e-mail para acessar sua conta.",
          email: user.email
        });
      }
      const session = { id: user.id, name: user.name, email: user.email, role: user.role };
      res.json({ token: signToken(session), user: session });
    }));

    app.post("/api/auth/register", asyncRoute(async (req, res) => {
      const parsed = z.object({
        name: z.string().min(3),
        email: z.email(),
        phone: z.string().min(8),
        password: z.string().min(6)
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Confira os dados informados." });
      if (await get("SELECT id FROM users WHERE lower(email)=lower(?)", [parsed.data.email])) {
        return res.status(409).json({ message: "Este e-mail já está cadastrado." });
      }
      const id = await transaction(async client => {
        const userId = await insert(
          "INSERT INTO users (name,email,password_hash,phone,role) VALUES (?,?,?,?,?)",
          [parsed.data.name, parsed.data.email, bcrypt.hashSync(parsed.data.password, 10), parsed.data.phone, "client"],
          client
        );
        await run(
          "INSERT INTO clients (user_id,name,email,phone) VALUES (?,?,?,?)",
          [userId, parsed.data.name, parsed.data.email, parsed.data.phone],
          client
        );
        return userId;
      });
      const session = { id, name: parsed.data.name, email: parsed.data.email, role: "client" as const };
      const emailVerification = await issueEmailVerification(session);
      res.status(201).json({ token: signToken(session), user: session, emailVerification });
    }));

    app.post("/api/auth/register-barber", asyncRoute(async (req, res) => {
      const parsed = z.object({
        barbershop: z.string().min(2),
        name: z.string().min(3),
        email: z.email(),
        phone: z.string().min(8),
        password: z.string().min(6).max(15)
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Confira os dados informados." });
      if (await get("SELECT id FROM users WHERE lower(email)=lower(?)", [parsed.data.email])) {
        return res.status(409).json({ message: "Este e-mail já está cadastrado." });
      }
      const id = await insert(
        "INSERT INTO users (name,email,password_hash,phone,role) VALUES (?,?,?,?,?)",
        [parsed.data.name, parsed.data.email, bcrypt.hashSync(parsed.data.password, 10), parsed.data.phone, "admin"]
      );
      const session = { id, name: parsed.data.name, email: parsed.data.email, role: "admin" as const };
      res.status(201).json({ token: signToken(session), user: session, barbershop: parsed.data.barbershop });
    }));

    app.post("/api/auth/google", asyncRoute(async (req, res) => {
      if (!googleClient || !googleClientId) {
        return res.status(503).json({ message: "Login com Google ainda não foi configurado na API." });
      }

      const parsed = z.object({ credential: z.string().min(20) }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Credencial do Google inválida." });

      let ticket;
      try {
        ticket = await googleClient.verifyIdToken({
          idToken: parsed.data.credential,
          audience: googleClientId
        });
      } catch {
        return res.status(401).json({ message: "Credencial do Google inválida ou expirada." });
      }
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || !payload.email_verified) {
        return res.status(401).json({ message: "Não foi possível validar sua conta Google." });
      }

      let user = await get<any>(
        "SELECT * FROM users WHERE google_sub=? OR lower(email)=lower(?)",
        [payload.sub, payload.email]
      );

      if (!user) {
        return res.json({
          needsRegistration: true,
          googleProfile: {
            name: payload.name || payload.email.split("@")[0],
            email: payload.email,
            avatar: payload.picture || null
          }
        });
      }

      await run(`
        UPDATE users
        SET google_sub=coalesce(google_sub, ?), name=?, avatar=coalesce(?, avatar)
        WHERE id=?
      `, [payload.sub, payload.name || user.name, payload.picture || null, user.id]);
      user = await get<any>("SELECT * FROM users WHERE id=?", [user.id]);

      if (!String(user.phone || "").trim()) {
        return res.json({
          needsRegistration: true,
          googleProfile: {
            name: user.name,
            email: user.email,
            avatar: user.avatar || null
          }
        });
      }

      if (!user.active) return res.status(403).json({ message: "Esta conta está desativada." });
      if (user.role === "client" && !user.email_verified_at) {
        return res.status(403).json({
          code: "EMAIL_NOT_VERIFIED",
          message: "Confirme seu e-mail para acessar sua conta.",
          email: user.email
        });
      }
      const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null
      };
      res.json({ token: signToken(session), user: session });
    }));

    app.post("/api/auth/google/complete", asyncRoute(async (req, res) => {
      if (!googleClient || !googleClientId) {
        return res.status(503).json({ message: "Login com Google ainda não foi configurado na API." });
      }

      const parsed = z.object({
        credential: z.string().min(20),
        name: z.string().trim().min(3),
        email: z.email(),
        phone: z.string().trim().min(8)
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Informe um número de telefone válido." });

      let ticket;
      try {
        ticket = await googleClient.verifyIdToken({
          idToken: parsed.data.credential,
          audience: googleClientId
        });
      } catch {
        return res.status(401).json({ message: "A confirmação do Google expirou. Tente novamente." });
      }

      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || !payload.email_verified) {
        return res.status(401).json({ message: "Não foi possível validar sua conta Google." });
      }

      const existing = await get<any>(
        "SELECT * FROM users WHERE google_sub=? OR lower(email)=lower(?)",
        [payload.sub, payload.email]
      );

      const name = parsed.data.name;
      const email = parsed.data.email.toLowerCase();
      const emailOwner = await get<any>("SELECT id FROM users WHERE lower(email)=lower(?) AND id<>?", [email, existing?.id || 0]);
      if (emailOwner) return res.status(409).json({ message: "Este e-mail já está cadastrado em outra conta." });

      if (existing) {
        if (String(existing.phone || "").trim()) {
          return res.status(409).json({ message: "Esta conta já está cadastrada. Acesse novamente pelo Google." });
        }
        await transaction(async clientConnection => {
          await run(
            "UPDATE users SET phone=?,email=?,google_sub=coalesce(google_sub, ?),name=?,avatar=coalesce(?, avatar) WHERE id=?",
            [parsed.data.phone, email, payload.sub, name, payload.picture || null, existing.id],
            clientConnection
          );
          const client = await get<any>("SELECT id FROM clients WHERE user_id=?", [existing.id], clientConnection);
          if (client) {
            await run(
              "UPDATE clients SET phone=?,name=?,email=? WHERE user_id=?",
              [parsed.data.phone, name, email, existing.id],
              clientConnection
            );
          } else {
            await run(
              "INSERT INTO clients (user_id,name,email,phone) VALUES (?,?,?,?)",
              [existing.id, name, email, parsed.data.phone],
              clientConnection
            );
          }
        });
        const session = {
          id: existing.id,
          name,
          email,
          role: existing.role,
          avatar: payload.picture || existing.avatar || null
        };
        const emailVerification = await issueEmailVerification(session);
        return res.json({ token: signToken(session), user: session, emailVerification });
      }

      const id = await transaction(async client => {
        const userId = await insert(`
          INSERT INTO users (name,email,password_hash,phone,role,avatar,google_sub)
          VALUES (?,?,?,?,?,?,?)
        `, [name, email, "", parsed.data.phone, "client", payload.picture || null, payload.sub], client);
        await run(
          "INSERT INTO clients (user_id,name,email,phone) VALUES (?,?,?,?)",
          [userId, name, email, parsed.data.phone],
          client
        );
        return userId;
      });
      const session = {
        id,
        name,
        email,
        role: "client" as const,
        avatar: payload.picture || null
      };
      const emailVerification = await issueEmailVerification(session);
      res.status(201).json({ token: signToken(session), user: session, emailVerification });
    }));

    app.post("/api/auth/verify-email", asyncRoute(async (req, res) => {
      const parsed = z.object({ token: z.string().min(32) }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Token de verificação inválido." });

      const tokenHash = hashVerificationToken(parsed.data.token);
      const user = await get<any>("SELECT * FROM users WHERE email_verification_token_hash=?", [tokenHash]);
      if (!user) return res.status(404).json({ message: "Link de verificação inválido ou expirado." });

      await run(`
        UPDATE users
        SET email_verified_at=CURRENT_TIMESTAMP,
            email_verification_token_hash=NULL
        WHERE id=?
      `, [user.id]);

      const session = {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null
      };

      res.json({ ok: true, email: user.email, token: signToken(session), user: session });
    }));

    app.get("/api/auth/me", authenticate, (req, res) => res.json({ user: req.user }));

  
}
