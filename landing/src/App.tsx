import {
  BarChart3, BellRing, CalendarDays, ClipboardList, CreditCard,
  CheckCircle, Gift, Instagram, Loader2, Mail, Menu, MessageCircle, Package, Phone, Scissors,
  ShoppingBag, Star, TrendingUp, Twitter, UserRound, Users, WalletCards, X
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const systemUrl = "http://localhost:3333/login";
const apiUrl = (import.meta.env.VITE_API_URL?.startsWith("http") ? import.meta.env.VITE_API_URL : "http://localhost:3333/api");

const features = [
  [BellRing, "Lembrete de Horários", "lembrete-horarios"],
  [Gift, "Programa de Fidelidade", "programa-fidelidade"],
  [MessageCircle, "Envio de Notícias e Promoções", "noticias-promocoes"],
  [TrendingUp, "Gestão Financeira", "gestao-financeira"],
  [CreditCard, "Pagamento On-line", "pagamento-online"],
  [BarChart3, "Relatórios Gerenciais", "relatorios-gerenciais"],
  [Package, "Pacotes de Serviços e Produtos", "pacotes"],
  [ShoppingBag, "Gestão de Estoque", "gestao-estoque"],
  [WalletCards, "Comandas e Controle de Consumo", "comandas"],
  [Gift, "Aniversariantes", "aniversariantes"],
  [ClipboardList, "Lista de Espera", "lista-espera"],
  [MessageCircle, "Mensagens de Retorno Automáticas", "mensagens-retorno"],
  [Star, "Pesquisa de Satisfação", "pesquisa-satisfacao"],
  [Users, "Clube de Clientes", "clube-clientes"],
  [CalendarDays, "Site do Estabelecimento", "site-estabelecimento"],
  [UserRound, "Comissões e Vales Profissionais", "comissoes-profissionais"]
] as const;

const prices = {
  anual: [
    ["1 Profissional", "55,90", "670,80"], ["2 a 5 Profissionais", "76,90", "922,80"],
    ["6 a 15 Profissionais", "115,15", "1.381,80"], ["+15 Profissionais", "153,90", "1.846,80"]
  ],
  semestral: [
    ["1 Profissional", "67,90", "407,40"], ["2 a 5 Profissionais", "93,40", "560,40"],
    ["6 a 15 Profissionais", "139,80", "838,80"], ["+15 Profissionais", "186,90", "1.121,40"]
  ],
  mensal: [
    ["1 Profissional", "79,90", "79,90"], ["2 a 5 Profissionais", "109,90", "109,90"],
    ["6 a 15 Profissionais", "164,50", "164,50"], ["+15 Profissionais", "219,90", "219,90"]
  ]
};

const faqs = [
  ["Não possuo CNPJ. Posso utilizar o Developer Barber?", "Sim. O Developer Barber pode ser utilizado tanto por Pessoa Jurídica quanto Pessoa Física."],
  ["O período gratuito possui alguma limitação das funcionalidades?", "Não. Durante o período de teste você pode utilizar o sistema com todas as funcionalidades."],
  ["Meus profissionais têm acesso ao sistema?", "Sim. Podem ter acesso ao módulo web e aplicativo, podendo ter restrições de acesso definidas pelo gestor."],
  ["Posso alterar meu plano futuramente?", "Na contratação do plano mensal, você pode fazer a alteração do seu plano a cada vencimento da fatura."],
  ["O cliente da barbearia precisa pagar para baixar o aplicativo?", "Não. O download do aplicativo Developer Barber é gratuito e está disponível para iOS e Android."],
  ["Consigo exportar minha base de dados?", "Sim. Entre em contato conosco pelo chat on-line que informamos como proceder."]
];

export function App() {
  const [menu, setMenu] = useState(false);
  const [period, setPeriod] = useState<keyof typeof prices>("anual");
  const [profile, setProfile] = useState<"barber" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [signupStep, setSignupStep] = useState<"idle" | "summary" | "loading" | "success">("idle");
  const [barberSignup, setBarberSignup] = useState({ barbershop: "", contact: "", phone: "", email: "", password: "" });
  const [barberToken, setBarberToken] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 90);
      const sections = ["home", "sobre", "funcoes", "precos", "cadastro"];
      const current = sections.reduce((selected, id) => {
        const element = document.getElementById(id);
        return element && element.getBoundingClientRect().top <= 130 ? id : selected;
      }, "home");
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.location.hash === "#cadastro") {
      window.setTimeout(() => {
        document.getElementById("cadastro")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, []);

  const handleBarberSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBarberSignup({
      barbershop: String(data.get("barbershop") || ""),
      contact: String(data.get("contact") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      password: String(data.get("password") || "")
    });
    setSignupStep("summary");
  };

  const confirmBarberSignup = async () => {
    setSignupStep("loading");
    const response = await fetch(`${apiUrl}/auth/register-barber`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barbershop: barberSignup.barbershop,
        name: barberSignup.contact,
        phone: barberSignup.phone,
        email: barberSignup.email,
        password: barberSignup.password
      })
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.message || "Não foi possível concluir o cadastro.");
      setSignupStep("summary");
      return;
    }
    setBarberToken(result.token);
    window.setTimeout(() => setSignupStep("success"), 650);
  };

  return <>
    <header className={`top-nav ${scrolled ? "scrolled" : ""}`}>
      <a className="logo" href="#home"><span><Scissors /></span><strong>DEVELOPER BARBER</strong></a>
      <button className="menu-btn" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      <nav className={menu ? "open" : ""}>
        <a className={activeSection === "home" ? "active" : ""} href="#home">HOME</a>
        <a className={activeSection === "sobre" ? "active" : ""} href="#sobre">SOBRE</a>
        <a className={activeSection === "funcoes" ? "active" : ""} href="#funcoes">FUNÇÕES</a>
        <a className={activeSection === "precos" ? "active" : ""} href="#precos">PREÇOS</a>
        <a className="free-trial" href="#cadastro">TESTE GRÁTIS</a>
        <a href="/blog">BLOG</a>
        <a href={systemUrl}>ACESSAR</a>
        <a className="client-access" href="/cliente">SOU CLIENTE</a>
      </nav>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-mark"><Scissors /></span>
          <h1>Developer Barber</h1>
          <p>Uma nova experiência para uma antiga tradição.</p>
          <a className="hero-button" href="#cadastro">INICIE ESSA EXPERIÊNCIA</a>
          <small>Gestão completa no painel e uma experiência simples para seus clientes</small>
        </div>
      </section>

      <section className="about-objectives" id="sobre">
        <div className="about-objectives-inner">
          <h2>Sobre o Developer Barber</h2>
          <p>O Developer Barber é um sistema de gestão on-line para barbearias que permite agendamentos de horários com diversos serviços previamente cadastrados, organizando a agenda e otimizando os processos do estabelecimento.</p>
          <p>O sistema é dividido em dois módulos:</p>
          <ul className="module-list">
            <li><strong>Módulo WebAdmin</strong> onde você pode fazer toda gestão do estabelecimento, com controle de cada profissional, histórico de clientes, estoque e excelentes relatórios financeiros. O sistema é armazenado em nuvem, proporcionando acesso seguro a qualquer hora e local.</li>
            <li><strong>Módulo aplicativo</strong> que pode ser acessado tanto pelo profissional — para acompanhar agenda, comissões e atendimentos — quanto pelo cliente, para realizar agendamentos, receber notícias, promoções e lembretes automáticos.</li>
          </ul>
          <h2 className="objective-title">Nosso Objetivo</h2>
          <div className="objective-cards">
            <article><CalendarDays /><div><h3>Otimizar seu Tempo</h3><p>Organize sua agenda e estimule mais agendamentos através do aplicativo.</p></div></article>
            <article><Star /><div><h3>Fidelizar seu Cliente</h3><p>Fidelize através do agendamento on-line, programa de fidelidade, promoções e mensagens automáticas.</p></div></article>
            <article><BarChart3 /><div><h3>Aumentar seu Faturamento</h3><p>Aumente seu movimento e tenha um maior faturamento em sua barbearia.</p></div></article>
          </div>
        </div>
      </section>

      <section className="section functions" id="funcoes">
        <div className="title"><span>RECURSOS</span><h2>Funcionalidades do Developer Barber</h2><i /></div>
        <div className="feature-grid">{features.map(([Icon, name, slug]) => <article key={name}><Icon /><h3>{name}</h3><a href={`/funcionalidades#${slug}`}>Ver Detalhes</a></article>)}</div>
        <a className="primary-button" href="/funcionalidades">VEJA TODAS AS FUNCIONALIDADES</a>
      </section>

      <section className="getting-started">
        <div className="section">
          <h2>Como começar</h2>
          <div className="start-layout">
            <div className="steps">
              <article><strong>1</strong><div><h3>Faça o Cadastro</h3><p>Faça o cadastro no Developer Barber, informando os dados básicos do seu estabelecimento.</p></div></article>
              <article><strong>2</strong><div><h3>Preencha o Passo a Passo inicial</h3><p>Informe os cadastros básicos do estabelecimento, como serviços, profissionais e jornada de trabalho.</p></div></article>
              <article><strong>3</strong><div><h3>Teste grátis por 30 dias</h3><p>Usufrua de todas as funcionalidades do sistema por 30 dias gratuitamente.</p></div></article>
            </div>
            <div className="devices-mockup" aria-label="Developer Barber em diferentes dispositivos">
              <div className="laptop">
                <div className="laptop-screen">
                  <div className="mock-top"><span>DEVELOPER BARBER</span><i /><i /><i /></div>
                  <div className="mock-calendar"><b>Agenda</b>{Array.from({length:15},(_,i)=><span key={i} className={`slot s${i%5}`} />)}</div>
                </div>
                <div className="laptop-base" />
              </div>
              <div className="tablet"><div className="device-screen"><Scissors /><strong>DEVELOPER BARBER</strong><small>Gestão inteligente</small></div></div>
              <div className="mobile"><div className="device-screen"><Scissors /><strong>MB</strong><small>Agenda</small></div></div>
            </div>
          </div>
          <a className="outline-button" href="#cadastro">CLIQUE AQUI E CADASTRE-SE AGORA</a>
        </div>
      </section>

      <section className="section pricing" id="precos">
        <div className="title"><span>PLANOS FLEXÍVEIS</span><h2>Preços</h2><i /></div>
        <div className="period-tabs">
          <button className={period === "anual" ? "active" : ""} onClick={() => setPeriod("anual")}><strong>ANUAL</strong><small>30% de desconto</small></button>
          <button className={period === "semestral" ? "active" : ""} onClick={() => setPeriod("semestral")}><strong>SEMESTRAL</strong><small>15% de desconto</small></button>
          <button className={period === "mensal" ? "active" : ""} onClick={() => setPeriod("mensal")}><strong>MENSAL</strong><small>Pagamento mensal</small></button>
        </div>
        <div className="price-grid">{prices[period].map(([name, value, total]) => <article key={name}>
          {period !== "mensal" && <span className="discount">{period === "anual" ? "30%" : "15%"} OFF</span>}
          <h3>{name}</h3><div className="price"><sup>R$</sup><strong>{value}</strong><small>/mês</small></div>
          <p>Valor total: R$ {total}</p><ul><li>Agenda on-line</li><li>Painel administrativo</li><li>Área do cliente</li><li>Todos os módulos</li></ul>
          <a href="#cadastro">COMEÇAR AGORA</a>
        </article>)}</div>
      </section>

      <section className="signup" id="cadastro">
        <div className="section">
          <h2>Selecione a opção e Cadastre-se!</h2>
          <p className="signup-lead">Experimente todas as funcionalidades grátis por 30 dias, sem compromisso.</p>
          <div className="profile-switch">
            <button className={profile === "barber" ? "active" : ""} onClick={() => setProfile("barber")}><strong>TENHO UMA BARBEARIA</strong><span>SOU BARBEIRO</span></button>
            <button onClick={() => { window.location.href = "/cliente"; }}><strong>SOU CLIENTE</strong><span>DE BARBEARIA/ESTABELECIMENTO</span></button>
          </div>
          {profile === "barber" && <form className="signup-form barber-signup" onSubmit={handleBarberSignup}>
            <label className="signup-full">Nome da Barbearia*<input name="barbershop" placeholder="Nome Da Barbearia*" required /></label>
            <label>Nome do contato*<input name="contact" placeholder="Nome Do Contato (Ex: João da Silva)" required /></label>
            <label>Telefone do Contato*<input name="phone" type="tel" placeholder="+55 (11) 96123-4567" required /></label>
            <label>E-mail Para Acesso*<input name="email" type="email" placeholder="E-mail Para Acesso" required /></label>
            <label>Senha <small>(Mínimo de 6 e máximo de 15 caracteres)*</small><input name="password" type="password" placeholder="Senha*" minLength={6} maxLength={15} required /></label>
            <label className="terms-check signup-full"><input type="checkbox" required /><span>Li e aceito o <a href="/termos" target="_blank">Termo de Condição de Uso.</a></span></label>
            <button>CADASTRAR</button>
          </form>}
        </div>
      </section>

      <section className="section faq" id="faq">
        <h2>Perguntas Frequentes</h2>
        <div className="faq-list">{faqs.map(([question, answer]) => <article key={question}>
          <h3>{question}</h3>
          <p>{answer}</p>
        </article>)}</div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h4>Ajuda</h4>
          <a href="/ajuda" target="_blank" rel="noreferrer">Central de Ajuda</a>
          <a href="/funcionalidades" target="_blank" rel="noreferrer">Funcionalidades</a>
          <a href="mailto:contato@meubarber.app" target="_blank" rel="noreferrer">Contato</a>
        </div>
        <div>
          <h4>Interesse</h4>
          <a href="/interesse/modulo-fiscal" target="_blank" rel="noreferrer">Módulo Fiscal</a>
          <a href="/interesse/aplicativo-proprio" target="_blank" rel="noreferrer">Aplicativo Próprio</a>
        </div>
        <div>
          <h4>Conteúdo</h4>
          <a href="/blog" target="_blank" rel="noreferrer">Blog</a>
        </div>
      </div>
      <div className="footer-contact">
        <a className="footer-contact-brand" href="#home">
          <span><Scissors /></span>
          <strong>DEVELOPER BARBER</strong>
        </a>
        <div className="footer-contact-info">
          <a href="mailto:contato@developerbarber.com.br"><Mail /> contato@developerbarber.com.br</a>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer"><Phone /> +55 (11) 99999-9999</a>
        </div>
        <div className="footer-socials">
          <a href="https://instagram.com/developerbarber" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
          <a href="https://twitter.com/developerbarber" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter /></a>
        </div>
      </div>
      <div className="footer-copyright">© 2026. TODOS OS DIREITOS RESERVADOS. <strong>DEVELOPER BARBER</strong></div>
    </footer>
    <a className="whatsapp" href="#cadastro"><MessageCircle /></a>
    {signupStep !== "idle" && <div className="signup-modal-overlay" role="dialog" aria-modal="true">
      <div className={`signup-modal signup-modal-${signupStep}`}>
        {signupStep !== "loading" && <button className="signup-modal-close" onClick={() => setSignupStep("idle")} aria-label="Fechar"><X /></button>}
        {signupStep === "summary" && <>
          <h2>Resumo</h2>
          <div className="signup-summary-list">
            <p><span>Barbearia</span><strong>{barberSignup.barbershop}</strong></p>
            <p><span>Nome</span><strong>{barberSignup.contact}</strong></p>
            <p><span>E-mail</span><strong>{barberSignup.email}</strong></p>
            <p><span>Fone</span><strong>{barberSignup.phone}</strong></p>
          </div>
          <div className="signup-modal-actions">
            <button type="button" className="signup-cancel" onClick={() => setSignupStep("idle")}>CANCELAR</button>
            <button type="button" className="signup-confirm" onClick={confirmBarberSignup}>CONFIRMAR</button>
          </div>
        </>}
        {signupStep === "loading" && <>
          <Loader2 className="signup-spinner" />
          <h2>Carregando...</h2>
        </>}
        {signupStep === "success" && <>
          <CheckCircle className="signup-success-icon" />
          <h2>Cadastro efetuado com sucesso.</h2>
          <button type="button" className="signup-start-button" onClick={() => { window.location.href = `http://localhost:3333/wizard?token=${encodeURIComponent(barberToken)}`; }}>CLIQUE AQUI E COMECE A USAR!</button>
        </>}
      </div>
    </div>}
  </>;
}
