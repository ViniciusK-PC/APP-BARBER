import { ArrowRight, CalendarDays, CheckCircle2, MessageCircle, ShoppingBag, Star } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Field, PageHeader, Spinner } from "../components/ui";

type Catalog = { services: any[]; products: any[]; professionals: any[] };

function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  useEffect(() => { api<Catalog>("/store/catalog").then(setCatalog); }, []);
  return catalog;
}

export function ClientHome() {
  const catalog = useCatalog();
  const [business, setBusiness] = useState<any>({});
  useEffect(() => { api("/settings/business").then(setBusiness); }, []);
  if (!catalog) return <Spinner />;
  return <>
    <section className="client-hero" style={{ "--brand-color": business.primaryColor || "#c9a96e" } as React.CSSProperties}>
      <div><span className="eyebrow">Cuidado em cada detalhe</span><h1>{business.name || "Sua Barbearia"}</h1><p>{business.slogan}</p><Link className="button primary" to="/app/agendar">Agendar agora <ArrowRight size={18}/></Link></div>
      <div className="hero-card"><ScissorArt/><span>ATENDIMENTO<br/>COM HORA MARCADA</span></div>
    </section>
    <section className="client-section"><div className="section-title"><div><span className="eyebrow">Escolha sua experiência</span><h2>Serviços em destaque</h2></div><Link to="/app/agendar">Ver todos <ArrowRight size={16}/></Link></div>
      <div className="service-cards">{catalog.services.slice(0,3).map((s)=><article key={s.id}><div className="service-number">0{s.id}</div><h3>{s.name}</h3><p>{s.description}</p><div><strong>{money(s.price)}</strong><span>{s.duration_minutes} min</span></div></article>)}</div>
    </section>
    <section className="client-features"><div><CalendarDays/><strong>Agenda online</strong><span>Escolha o melhor horário.</span></div><div><ShoppingBag/><strong>Produtos selecionados</strong><span>Cuidados para levar.</span></div><div><MessageCircle/><strong>Contato direto</strong><span>Fale com a barbearia.</span></div><div><Star/><strong>Programa de pontos</strong><span>Benefícios para clientes.</span></div></section>
  </>;
}

function ScissorArt() {
  return <div className="scissor-art">✦<span>✂</span>✦</div>;
}

export function ClientBooking() {
  const catalog = useCatalog();
  const [client, setClient] = useState<any>(null);
  const [message, setMessage] = useState("");
  useEffect(() => { api("/client/profile").then(setClient).catch(()=>{}); }, []);
  if (!catalog) return <Spinner />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const v = Object.fromEntries(new FormData(event.currentTarget));
    try { await api("/appointments", { method:"POST", body:JSON.stringify({clientId:v.clientId,professionalId:v.professionalId,serviceId:v.serviceId,startsAt:new Date(String(v.startsAt)).toISOString(),source:"app"}) }); setMessage("Agendamento realizado com sucesso."); }
    catch(err){ setMessage(err instanceof Error ? err.message : "Não foi possível agendar."); }
  }
  return <section className="client-section narrow"><PageHeader title="Agende seu horário" description="Selecione serviço, profissional e o melhor momento."/>
    <form className="booking-form panel" onSubmit={submit}>
      <Field label="Cliente"><input value={client?.name || "Carregando..."} readOnly /><input name="clientId" type="hidden" value={client?.id || ""} /></Field>
      <Field label="Serviço"><select name="serviceId" required><option value="">Selecione</option>{catalog.services.map(x=><option value={x.id} key={x.id}>{x.name} — {money(x.price)}</option>)}</select></Field>
      <Field label="Profissional"><select name="professionalId" required><option value="">Selecione</option>{catalog.professionals.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></Field>
      <Field label="Data e horário"><input name="startsAt" type="datetime-local" required/></Field>
      {message && <div className="booking-message"><CheckCircle2/>{message}</div>}
      <button className="button primary">Confirmar agendamento</button>
    </form>
  </section>;
}

export function StorePage() {
  const catalog=useCatalog(); if(!catalog)return <Spinner/>;
  return <section className="client-section"><PageHeader title="Loja" description="Produtos escolhidos para manter seu estilo todos os dias."/><div className="product-grid">{catalog.products.map(p=><article className="product-card" key={p.id}><div className="product-image"><ShoppingBag/></div><span className="eyebrow">CUIDADOS</span><h3>{p.name}</h3><p>{p.description}</p><footer><strong>{money(p.price)}</strong><button className="button small">Adicionar</button></footer></article>)}</div></section>;
}

export function ChatPage() {
  const {user}=useAuth(); const [messages,setMessages]=useState<any[]>([]); const [body,setBody]=useState(""); const otherId=user?.role==="client"?2:3;
  const load=()=>api<any[]>(`/messages?with=${otherId}`).then(setMessages).catch(()=>setMessages([]));
  useEffect(()=>{ void load(); },[otherId]);
  async function send(e:FormEvent){e.preventDefault();if(!body.trim())return;await api("/messages",{method:"POST",body:JSON.stringify({receiverId:otherId,body})});setBody("");load();}
  return <section className="client-section narrow"><PageHeader title="Chat" description="Converse diretamente com a barbearia."/><article className="chat panel"><div className="chat-head"><div className="avatar">B</div><div><strong>Atendimento Barbe</strong><span><i/> Online</span></div></div><div className="chat-messages">{messages.length?messages.map(m=><div className={`bubble ${m.sender_id===user?.id?"mine":""}`} key={m.id}><p>{m.body}</p><small>{new Date(m.created_at+"Z").toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</small></div>):<div className="chat-welcome"><MessageCircle/><h3>Como podemos ajudar?</h3><p>Envie sua primeira mensagem.</p></div>}</div><form onSubmit={send}><input value={body} onChange={e=>setBody(e.target.value)} placeholder="Digite uma mensagem..."/><button className="button primary">Enviar</button></form></article></section>;
}

export function ProfilePage() {
  const {user}=useAuth();
  return <section className="client-section narrow"><PageHeader title="Meu perfil" description="Seus dados e benefícios."/><article className="profile-card panel"><div className="profile-avatar">{user?.name[0]}</div><div><h2>{user?.name}</h2><p>{user?.email}</p><span className="badge badge-gold">120 pontos</span></div></article><div className="profile-links panel"><button>Meus agendamentos <ArrowRight/></button><button>Meus pedidos <ArrowRight/></button><button>Programa de fidelidade <ArrowRight/></button></div></section>;
}
