import {
  BarChart3, BookOpen, CalendarDays, ChevronDown, ClipboardList, DollarSign,
  GraduationCap, HelpCircle, ImageIcon, LogOut, Mail, Menu, MessageCircle,
  Palette, Scissors, Settings, Shield, ShoppingBag, Store, User, UserPlus,
  UserRound, Users, Video, X, Megaphone, Heart, PackageSearch
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

type MenuItem = { label: string; to: string; icon: ComponentType<{ size?: number; className?: string }>; children?: { label: string; to: string }[] };

const adminMenu: MenuItem[] = [
  { label: "Agenda", to: "/agenda", icon: CalendarDays },
  { label: "Cadastros", to: "/clientes", icon: Users, children: [
    { label: "Clientes", to: "/clientes" }, { label: "Profissionais", to: "/profissionais" },
    { label: "Serviços", to: "/servicos" }, { label: "Produtos", to: "/produtos" },
    { label: "Pacotes", to: "/pacotes" }, { label: "Fornecedores", to: "/fornecedores" },
    { label: "Convênios", to: "/modulo/convenios" }
  ] },
  { label: "Tipos (Configurações)", to: "/formas-pagamento", icon: Settings, children: [
    { label: "Formas de Pagamento", to: "/formas-pagamento" },
    { label: "Categorias Financeiras", to: "/categorias-financeiras" }
  ] },
  { label: "Comandas", to: "/comandas", icon: ClipboardList, children: [
    { label: "Abertas", to: "/comandas" }, { label: "Histórico de Comandas", to: "/modulo/historico-comandas" }
  ] },
  { label: "Financeiro", to: "/financeiro", icon: DollarSign, children: [
    { label: "Caixa", to: "/modulo/caixa" }, { label: "Histórico de Caixa", to: "/modulo/historico-caixa" },
    { label: "Entrada / Saída", to: "/modulo/entradas-saidas" }, { label: "Comissões", to: "/modulo/comissoes" },
    { label: "Conta do Cliente", to: "/modulo/contas-clientes" }, { label: "Estoque", to: "/produtos" },
    { label: "Fluxo de Caixa", to: "/financeiro" }, { label: "Conta do Profissional", to: "/modulo/contas-profissionais" }
  ] },
  { label: "Relatórios", to: "/relatorios", icon: BarChart3, children: [
    { label: "Agendamentos", to: "/modulo/rel-agendamentos" }, { label: "Gerencial", to: "/relatorios" },
    { label: "Programa de Fidelidade", to: "/modulo/fidelidade" }, { label: "Clientes", to: "/modulo/rel-clientes" },
    { label: "Resumo", to: "/relatorios" }, { label: "Aniversariantes", to: "/modulo/aniversariantes" }
  ] },
  { label: "Marketing", to: "/noticias", icon: Megaphone, children: [
    { label: "Notícias / Promoções", to: "/noticias" },
    { label: "Mensagens Automáticas", to: "/mensagens" },
    { label: "Pesquisa de Satisfação", to: "/modulo/pesquisa" }
  ] },
  { label: "Fidelização", to: "/cupons", icon: Heart, children: [
    { label: "Cupons de Desconto", to: "/cupons" },
    { label: "Clubes de Assinatura", to: "/assinaturas" },
    { label: "Clube de Clientes", to: "/modulo/clube-clientes" }
  ] },
  { label: "Configurações", to: "/configuracoes", icon: Settings, children: [
    { label: "Parâmetros", to: "/modulo/parametros" }, { label: "Rodízio de Profissionais", to: "/modulo/rodizio" },
    { label: "Ordem de Chegada", to: "/modulo/ordem-chegada" }, { label: "Lista de Espera", to: "/modulo/lista-espera" },
    { label: "Anamnese", to: "/modulo/anamnese" }, { label: "Documentos", to: "/modulo/documentos" },
    { label: "Preferências Locais", to: "/modulo/preferencias" }, { label: "Avaliações", to: "/modulo/avaliacoes" },
    { label: "Lista de Restrições", to: "/modulo/restricoes" }, { label: "Funcionamento", to: "/modulo/funcionamento" },
    { label: "Alertas", to: "/modulo/alertas" }
  ] },
  { label: "Vídeos Tutoriais", to: "/modulo/videos", icon: Video },
  { label: "Cursos", to: "/modulo/cursos", icon: GraduationCap },
  { label: "Ajuda", to: "/modulo/ajuda", icon: HelpCircle, children: [
    { label: "Central de Ajuda", to: "/modulo/central-ajuda" }, { label: "Fale Conosco", to: "/modulo/fale-conosco" }
  ] },
  { label: "Imagens de Divulgação", to: "/modulo/divulgacao", icon: ImageIcon }
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("Cadastros");
  const [profileOpen, setProfileOpen] = useState(false);

  return <div className="barber-shell">
    {mobileOpen && <div className="barber-overlay" onClick={() => setMobileOpen(false)} />}
    <aside className={`barber-sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="barber-logo"><Scissors size={21} /><strong>AppBarber</strong><button onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
      <nav>
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const open = expanded === item.label;
          return <div key={item.label}>
            <NavLink to={item.to} onClick={(e) => { if (item.children) { e.preventDefault(); setExpanded(open ? null : item.label); } setMobileOpen(false); }} className={({ isActive }) => isActive || open ? "active" : ""}>
              <Icon size={17} /><span>{item.label}</span>{item.children && <ChevronDown className={open ? "rotated" : ""} size={16} />}
            </NavLink>
            {item.children && open && <div className="barber-submenu">{item.children.map((child) =>
              <NavLink key={child.to} to={child.to} onClick={() => setMobileOpen(false)}><span>»</span>{child.label}</NavLink>
            )}</div>}
          </div>;
        })}
      </nav>
    </aside>

    <section className="barber-panel">
      <header className="barber-topbar">
        <button onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
        <button><span>★</span></button>
        <label>Profissionais:<select><option>{user?.name || "Junior"}</option></select><ChevronDown size={14} /></label>
        <div className="barber-actions">
          <button onClick={() => navigate("/comandas")}><BookOpen size={18} /></button>
          <button onClick={() => navigate("/financeiro")}><DollarSign size={18} /></button>
          <button onClick={() => navigate("/produtos")}><ClipboardList size={18} /></button>
          <button onClick={() => navigate("/profissionais")}><Users size={18} /></button>
          <button><Mail size={18} /></button>
          <button onClick={() => navigate("/clientes")}><UserPlus size={18} /></button>
          <div className="barber-profile">
            <button onClick={() => setProfileOpen((v) => !v)}><span>{user?.name?.slice(0, 1) || "J"}</span><ChevronDown size={14} /></button>
            {profileOpen && <div className="profile-menu">
              <div><span>{user?.name?.slice(0, 1) || "J"}</span><strong>{user?.name || "junior"}</strong></div>
              <button><User size={15} />Conta</button><button><Shield size={15} />Acessos</button><button><Palette size={15} />Temas</button><button onClick={logout}><LogOut size={15} />Sair</button>
            </div>}
          </div>
        </div>
      </header>
      <button className="barber-caixa" onClick={() => navigate("/modulo/caixa")}>Caixa !</button>
      <main className="barber-content"><Outlet /></main>
      <div className="barber-trial">Faltam 30 dias para expirar o período de teste. <button>Contratar</button></div>
      <button className="barber-chat"><MessageCircle size={24} /></button>
    </section>
  </div>;
}

export function ClientLayout() {
  const { user, logout } = useAuth();
  return <div className="client-shell">
    <header className="client-header">
      <NavLink to="/app" className="brand"><span className="brand-mark"><Scissors size={20} /></span><strong>BARBE</strong></NavLink>
      <nav>
        <NavLink to="/app"><Store size={18} /> Início</NavLink>
        <NavLink to="/app/agendar"><CalendarDays size={18} /> Agendar</NavLink>
        <NavLink to="/app/loja"><ShoppingBag size={18} /> Loja</NavLink>
        <NavLink to="/app/chat"><MessageCircle size={18} /> Chat</NavLink>
        <NavLink to="/app/perfil"><UserRound size={18} /> Perfil</NavLink>
      </nav>
      <div className="client-user"><span>{user?.name}</span><button onClick={logout}><LogOut size={18} /></button></div>
    </header>
    <main className="client-main"><Outlet /></main>
  </div>;
}
