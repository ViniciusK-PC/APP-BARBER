import { Scissors } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);

  if (user) return <Navigate to={registered ? "/wizard" : user.role === "client" ? "/app" : "/agenda"} replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (mode === "login") {
        await login(String(data.email), String(data.password));
        navigate(String(data.email).startsWith("cliente") ? "/app" : "/agenda");
      } else {
        await register({ name: String(data.name), email: String(data.email), phone: String(data.phone), password: String(data.password) });
        setRegistered(true);
        navigate("/wizard", { replace: true });
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao entrar."); }
    finally { setBusy(false); }
  }

  return <main className="auth-page">
    <section className="auth-art">
      <div className="brand light"><span className="brand-mark"><Scissors /></span><div><strong>BARBE</strong><small>GESTÃO INTELIGENTE</small></div></div>
      <div className="auth-copy"><span className="eyebrow">Sua barbearia, no controle</span><h1>Gestão precisa.<br />Experiência memorável.</h1><p>Agenda, atendimento, vendas e relacionamento em uma única plataforma.</p></div>
      <div className="auth-stat"><strong>+40%</strong><span>mais organização e previsibilidade no dia a dia</span></div>
    </section>
    <section className="auth-form-wrap">
      <form className="auth-form" onSubmit={submit}>
        <span className="eyebrow">{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</span>
        <h2>{mode === "login" ? "Acesse sua conta" : "Comece agora"}</h2>
        <p>{mode === "login" ? "Entre com seus dados para continuar." : "Cadastre-se como cliente da barbearia."}</p>
        {mode === "register" && <label>Nome completo<input name="name" required minLength={3} /></label>}
        <label>E-mail<input name="email" type="email" required defaultValue={mode === "login" ? "admin@barbe.local" : ""} /></label>
        {mode === "register" && <label>Celular<input name="phone" required /></label>}
        <label>Senha<input name="password" type="password" required minLength={6} defaultValue={mode === "login" ? "Admin@123" : ""} /></label>
        {error && <div className="form-error">{error}</div>}
        <button className="button primary full" disabled={busy}>{busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}</button>
        <button type="button" className="text-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Ainda não tem conta? Cadastre-se" : "Já possui conta? Entrar"}
        </button>
        {mode === "login" && <div className="demo-hint"><strong>Acesso demonstrativo</strong><span>Admin: admin@barbe.local · Admin@123</span><span>Cliente: cliente@barbe.local · Admin@123</span></div>}
      </form>
    </section>
  </main>;
}
