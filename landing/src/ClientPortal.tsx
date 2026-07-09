import {
  Apple, BadgeHelp, Bell, Building2, CalendarDays, ChevronDown, CircleUserRound,
  Clock3, CreditCard, Heart, History, Instagram,
  ListChecks, LocateFixed, LogOut, MapPin, Menu, Moon, Package, Search,
  Scissors, Store, Sun, Twitter, UserRound, X
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type AuthMode = "login" | "signup" | null;
type SearchMode = "nome" | "cidade" | "proximas";
type ClientUser = { id: number; name: string; email: string; role: "client"; avatar?: string | null };
type PendingGoogleRegistration = { credential: string; name: string; email: string; avatar?: string | null };
type VerificationResult = { status: "loading" | "success" | "error"; email?: string; message?: string; token?: string };
type PortalLanguage = "BR" | "US" | "PT" | "ES" | "FR";

const phoneCountries = [
  { flag: "/img/flags/br.png", name: "Brasil", code: "+55" },
  { flag: "/img/flags/pt.png", name: "Portugal", code: "+351" },
  { flag: "/img/flags/es.png", name: "Spain", code: "+34" },
  { flag: "/img/flags/ad.png", name: "Andorra", code: "+376" },
  { flag: "/img/flags/ao.png", name: "Angola", code: "+244" },
  { flag: "/img/flags/ag.png", name: "Antigua and Barbuda", code: "+1268" },
  { flag: "/img/flags/ar.png", name: "Argentina", code: "+54" },
  { flag: "/img/flags/am.png", name: "Armenia", code: "+374" },
  { flag: "/img/flags/aw.png", name: "Aruba", code: "+297" },
  { flag: "/img/flags/au.png", name: "Australia", code: "+61" },
  { flag: "/img/flags/at.png", name: "Austria", code: "+43" },
  { flag: "/img/flags/az.png", name: "Azerbaijan", code: "+994" },
  { flag: "/img/flags/bs.png", name: "Bahamas", code: "+1242" },
  { flag: "/img/flags/bh.png", name: "Bahrain", code: "+973" },
  { flag: "/img/flags/bd.png", name: "Bangladesh", code: "+880" },
  { flag: "/img/flags/bb.png", name: "Barbados", code: "+1246" },
  { flag: "/img/flags/be.png", name: "Belgium", code: "+32" },
  { flag: "/img/flags/bo.png", name: "Bolivia", code: "+591" },
  { flag: "/img/flags/bg.png", name: "Bulgaria", code: "+359" },
  { flag: "/img/flags/bf.png", name: "Burkina Faso", code: "+226" },
  { flag: "/img/flags/bi.png", name: "Burundi", code: "+257" },
  { flag: "/img/flags/kh.png", name: "Cambodia", code: "+855" },
  { flag: "/img/flags/cm.png", name: "Cameroon", code: "+237" },
  { flag: "/img/flags/ca.png", name: "Canada", code: "+1" },
  { flag: "/img/flags/cv.png", name: "Cape Verde", code: "+238" },
  { flag: "/img/flags/cl.png", name: "Chile", code: "+56" },
  { flag: "/img/flags/cn.png", name: "China", code: "+86" },
  { flag: "/img/flags/co.png", name: "Colombia", code: "+57" },
  { flag: "/img/flags/cz.png", name: "Czech Republic", code: "+420" },
  { flag: "/img/flags/dk.png", name: "Denmark", code: "+45" },
  { flag: "/img/flags/dj.png", name: "Djibouti", code: "+253" },
  { flag: "/img/flags/us.png", name: "United States", code: "+1" },
  { flag: "/img/flags/fr.png", name: "France", code: "+33" },
  { flag: "/img/flags/ir.png", name: "Iran", code: "+98" },
  { flag: "/img/flags/iq.png", name: "Iraq", code: "+964" },
  { flag: "/img/flags/ie.png", name: "Ireland", code: "+353" },
  { flag: "/img/flags/nl.png", name: "Netherlands", code: "+31" },
  { flag: "/img/flags/nc.png", name: "New Caledonia", code: "+687" },
  { flag: "/img/flags/nz.png", name: "New Zealand", code: "+64" },
  { flag: "/img/flags/tg.png", name: "Togo", code: "+228" },
  { flag: "/img/flags/to.png", name: "Tonga", code: "+676" },
  { flag: "/img/flags/tt.png", name: "Trinidad and Tobago", code: "+1868" },
  { flag: "/img/flags/tn.png", name: "Tunisia", code: "+216" },
  { flag: "/img/flags/tv.png", name: "Tuvalu", code: "+688" },
  { flag: "/img/flags/ug.png", name: "Uganda", code: "+256" },
  { flag: "/img/flags/ua.png", name: "Ukraine", code: "+380" },
  { flag: "/img/flags/ae.png", name: "United Arab Emirates", code: "+971" },
  { flag: "/img/flags/ve.png", name: "Venezuela", code: "+58" },
  { flag: "/img/flags/vn.png", name: "Vietnam", code: "+84" },
  { flag: "/img/flags/ye.png", name: "Yemen", code: "+967" },
  { flag: "/img/flags/zm.png", name: "Zambia", code: "+260" }
];

const brazilStates = [
  "Acre", "Alagoas", "Amap\u00e1", "Amazonas", "Bahia", "Cear\u00e1", "Distrito Federal", "Esp\u00edrito Santo",
  "Goi\u00e1s", "Maranh\u00e3o", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Par\u00e1", "Para\u00edba",
  "Paran\u00e1", "Pernambuco", "Piau\u00ed", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul",
  "Rond\u00f4nia", "Roraima", "Santa Catarina", "S\u00e3o Paulo", "Sergipe", "Tocantins"
];

const citiesByState: Record<string, string[]> = {
  "Rio Grande do Sul": ["Pelotas", "Porto Alegre", "Caxias do Sul", "Canoas", "Santa Maria"],
  "S\u00e3o Paulo": ["S\u00e3o Paulo", "Campinas", "Santos", "Ribeir\u00e3o Preto", "Sorocaba"],
  "Santa Catarina": ["Florian\u00f3polis", "Joinville", "Blumenau", "Chapec\u00f3", "Itaja\u00ed"],
  "Paran\u00e1": ["Curitiba", "Londrina", "Maring\u00e1", "Ponta Grossa", "Cascavel"],
  "Minas Gerais": ["Belo Horizonte", "Uberl\u00e2ndia", "Contagem", "Juiz de Fora", "Betim"]
};

const portalLanguages: Array<{ code: PortalLanguage; label: string; flag: string; alt: string }> = [
  { code: "BR", label: "Portugu\u00eas - Brasil", flag: "/img/flags/br.png", alt: "Portugu\u00eas - Brasil" },
  { code: "US", label: "English - United States", flag: "/img/flags/us.png", alt: "English - United States" },
  { code: "PT", label: "Portugu\u00eas - Portugal", flag: "/img/flags/pt.png", alt: "Portugu\u00eas - Portugal" },
  { code: "ES", label: "Espa\u00f1ol - Espa\u00f1a", flag: "/img/flags/es.png", alt: "Espa\u00f1ol - Espa\u00f1a" },
  { code: "FR", label: "Fran\u00e7ais - France", flag: "/img/flags/fr.png", alt: "Fran\u00e7ais - France" }
];

const portalText = {
  BR: {
    home: "In\u00edcio", search: "Buscar", appointments: "Meus Agendamentos", notifications: "Notifica\u00e7\u00f5es",
    theme: "Alternar tema", profile: "Perfil", enter: "Entrar", favorites: "Favoritos", cards: "Meus Cart\u00f5es",
    subscriptions: "Assinaturas", packages: "Pacotes", history: "Hist\u00f3rico", waitlist: "Lista de espera",
    help: "Central de ajuda", logout: "Sair", welcome: "Seja bem vindo(a)", hello: "Ol\u00e1",
    find: "Encontre um estabelecimento", nearbyCompanies: "Empresas pr\u00f3ximas", byName: "Nome", city: "Cidade",
    nearby: "Pr\u00f3ximas", location: "Habilitar localiza\u00e7\u00e3o",
    locationCopy: "Habilite o acesso \u00e0 localiza\u00e7\u00e3o para encontrarmos os estabelecimentos mais pr\u00f3ximos a voc\u00ea =)",
    searchHint: "Pesquise pelo nome ou cidade do estabelecimento", filter: "Filtrar por estabelecimento",
    noAppointments: "Nenhum agendamento em aberto", logoutTitle: "Sair da conta",
    logoutQuestion: "Deseja realmente sair da sua conta?", no: "N\u00e3o", yes: "Sim",
    loggedOut: "Desconectado com sucesso", loggedIn: "Ol\u00e1, seja bem vindo(a) :)"
  },
  US: {
    home: "Home", search: "Search", appointments: "My Appointments", notifications: "Notifications",
    theme: "Change theme", profile: "Profile", enter: "Sign in", favorites: "Favorites", cards: "My Cards",
    subscriptions: "Subscriptions", packages: "Packages", history: "History", waitlist: "Waiting list",
    help: "Help center", logout: "Sign out", welcome: "Welcome", hello: "Hello",
    find: "Find an establishment", nearbyCompanies: "Nearby businesses", byName: "Name", city: "City",
    nearby: "Nearby", location: "Enable location",
    locationCopy: "Enable location access so we can find the establishments closest to you =)",
    searchHint: "Search by establishment name or city", filter: "Filter by establishment",
    noAppointments: "No open appointments", logoutTitle: "Sign out",
    logoutQuestion: "Do you really want to sign out?", no: "No", yes: "Yes",
    loggedOut: "Signed out successfully", loggedIn: "Hello, welcome :)"
  },
  PT: {
    home: "In\u00edcio", search: "Pesquisar", appointments: "Os meus agendamentos", notifications: "Notifica\u00e7\u00f5es",
    theme: "Alterar tema", profile: "Perfil", enter: "Entrar", favorites: "Favoritos", cards: "Os meus cart\u00f5es",
    subscriptions: "Assinaturas", packages: "Pacotes", history: "Hist\u00f3rico", waitlist: "Lista de espera",
    help: "Centro de ajuda", logout: "Sair", welcome: "Bem-vindo(a)", hello: "Ol\u00e1",
    find: "Encontre um estabelecimento", nearbyCompanies: "Estabelecimentos pr\u00f3ximos", byName: "Nome", city: "Cidade",
    nearby: "Pr\u00f3ximos", location: "Ativar localiza\u00e7\u00e3o",
    locationCopy: "Ative o acesso \u00e0 localiza\u00e7\u00e3o para encontrarmos os estabelecimentos mais pr\u00f3ximos de si =)",
    searchHint: "Pesquise pelo nome ou cidade do estabelecimento", filter: "Filtrar por estabelecimento",
    noAppointments: "Nenhum agendamento em aberto", logoutTitle: "Sair da conta",
    logoutQuestion: "Deseja realmente sair da sua conta?", no: "N\u00e3o", yes: "Sim",
    loggedOut: "Sess\u00e3o terminada com sucesso", loggedIn: "Ol\u00e1, seja bem-vindo(a) :)"
  },
  ES: {
    home: "Inicio", search: "Buscar", appointments: "Mis citas", notifications: "Notificaciones",
    theme: "Cambiar tema", profile: "Perfil", enter: "Entrar", favorites: "Favoritos", cards: "Mis tarjetas",
    subscriptions: "Suscripciones", packages: "Paquetes", history: "Historial", waitlist: "Lista de espera",
    help: "Centro de ayuda", logout: "Salir", welcome: "Bienvenido(a)", hello: "Hola",
    find: "Encuentra un establecimiento", nearbyCompanies: "Empresas cercanas", byName: "Nombre", city: "Ciudad",
    nearby: "Cercanas", location: "Activar ubicaciÃ³n",
    locationCopy: "Activa el acceso a la ubicaciÃ³n para encontrar los establecimientos mÃ¡s cercanos a ti =)",
    searchHint: "Busca por nombre o ciudad del establecimiento", filter: "Filtrar por establecimiento",
    noAppointments: "No hay citas abiertas", logoutTitle: "Salir de la cuenta",
    logoutQuestion: "¿Realmente deseas salir de tu cuenta?", no: "No", yes: "Sí",
    loggedOut: "SesiÃ³n cerrada correctamente", loggedIn: "Hola, bienvenido(a) :)"
  },
  FR: {
    home: "Accueil", search: "Rechercher", appointments: "Mes rendez-vous", notifications: "Notifications",
    theme: "Changer le thÃ¨me", profile: "Profil", enter: "Connexion", favorites: "Favoris", cards: "Mes cartes",
    subscriptions: "Abonnements", packages: "Forfaits", history: "Historique", waitlist: "Liste dâ€™attente",
    help: "Centre dâ€™aide", logout: "DÃ©connexion", welcome: "Bienvenue", hello: "Bonjour",
    find: "Trouver un Ã©tablissement", nearbyCompanies: "Ã‰tablissements proches", byName: "Nom", city: "Ville",
    nearby: "Ã€ proximitÃ©", location: "Activer la localisation",
    locationCopy: "Activez la localisation pour trouver les Ã©tablissements les plus proches de vous =)",
    searchHint: "Recherchez par nom ou ville de lâ€™Ã©tablissement", filter: "Filtrer par Ã©tablissement",
    noAppointments: "Aucun rendez-vous en cours", logoutTitle: "Se dÃ©connecter",
    logoutQuestion: "Voulez-vous vraiment vous déconnecter ?", no: "Non", yes: "Oui",
    loggedOut: "DÃ©connexion rÃ©ussie", loggedIn: "Bonjour, bienvenue :)"
  }
} satisfies Record<PortalLanguage, Record<string, string>>;

class ClientApiError extends Error {
  code?: string;
  email?: string;

  constructor(body: { message?: string; code?: string; email?: string }) {
    super(body.message || "N\u00e3o foi possÃ­vel concluir a autenticaÃ§Ã£o.");
    this.code = body.code;
    this.email = body.email;
  }
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(options: { client_id: string; callback(response: { credential: string }): void }): void;
          renderButton(element: HTMLElement, options: Record<string, string | number>): void;
        };
      };
    };
  }
}

const clientApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:3333/api";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

async function clientApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("barbe_token");
  const response = await fetch(`${clientApiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ?{ Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ClientApiError(body);
  return body as T;
}

const shops = [
  { name: "Barbearia Central", city: "S?o Paulo â€” SP", distance: "1,2 km", rating: "4,9" },
  { name: "Studio Developer Barber", city: "Campinas â€” SP", distance: "3,8 km", rating: "4,8" },
  { name: "Barber Club", city: "S?o Paulo â€” SP", distance: "5,1 km", rating: "4,7" }
];

function portalPath(path: string) {
  return `/cliente${path}`;
}

function Brand() {
  return <a className="client-brand" href={portalPath("")}>
    <span><Scissors /></span>
    <strong>DEVELOPER BARBER</strong>
  </a>;
}

function EmailVerificationPage({ result, onAccess, onConfirm }: { result: VerificationResult; onAccess: () => void; onConfirm: () => void }) {
  return <main className="email-verification-page">
    <section className="email-verification-card">
      <div className="email-verification-brand"><Scissors /><strong>MEU BARBER</strong></div>
      {result.status === "loading" ?<>
        <h1>Confirme seu e-mail</h1>
        <p>Clique no bot\u00e3o abaixo para confirmar seu cadastro.</p>
        <button className="email-verification-retry" onClick={onConfirm}>Confirmar meu e-mail</button>
      </> : result.status === "success" ?<>
        <h1>Muito Obrigado!</h1>
        <strong className="email-verification-success">Seu e-mail foi confirmado com sucesso!</strong>
        <div className="email-verification-next">
          <h2>Pr\u00f3ximos Passos</h2>
          <p>Agora basta acessar o aplicativo/site e realizar o seu login.</p>
          <button onClick={onAccess}>Acessar agora</button>
        </div>
      </> : <>
        <h1>N\u00e3o foi poss\u00edvel confirmar</h1>
        <p>{result.message || "Este link \u00e9 inv\u00e1lido ou j\u00e1 foi utilizado."}</p>
        <button className="email-verification-retry" onClick={onAccess}>Voltar para o acesso</button>
      </>}
    </section>
  </main>;
}

function LocationAnimation() {
  return <svg className="location-vector-animation" viewBox="0 0 180 170" aria-hidden="true">
    <ellipse className="location-ring outer" cx="90" cy="130" rx="80" ry="36" />
    <ellipse className="location-ring inner" cx="90" cy="134" rx="23.74" ry="11.6" />
    <g className="location-pin">
      <path d="M90 18c-27.51 0-49.92 21-49.92 48 0 36 49.92 70 49.92 70s49.92-34 49.92-70c0-27-22.41-48-49.92-48Z" />
      <circle cx="90" cy="63.5" r="23.5" />
    </g>
  </svg>;
}

function EmptySearchAnimation() {
  return <svg className="search-vector-animation" viewBox="0 0 190 170" aria-hidden="true">
    <circle className="search-disc" cx="88" cy="79" r="58" />
    <circle className="search-orbit-dot d1" cx="24" cy="65" r="6" />
    <circle className="search-orbit-dot d2" cx="154" cy="38" r="5" />
    <circle className="search-orbit-dot d3" cx="157" cy="117" r="4" />
    <circle className="search-orbit-dot d4" cx="38" cy="135" r="5" />
    <g className="search-magnifier">
      <circle cx="88" cy="77" r="29" />
      <circle className="search-lens" cx="88" cy="77" r="20" />
      <path d="m109 99 28 39" />
    </g>
  </svg>;
}

function AppointmentAnimation() {
  return <svg className="appointment-vector-animation" viewBox="0 0 240 190" aria-hidden="true">
    <path className="appointment-blob" d="M57 42C38 51 31 72 36 94c5 22 22 43 44 54 19 10 41 8 61 6 22-2 47-2 60-19 12-16 8-39-4-55-12-17-31-24-49-31-30-12-65-19-91-7Z" />
    <g className="appointment-document">
      <path className="paper-sheet" d="M78 42h67c10 0 16 7 16 17v12h-18v59c0 13-7 21-19 21H79c-12 0-19-8-19-20V61c0-12 7-19 18-19Z" />
      <path className="paper-sheet-highlight" d="M78 48h53c5 0 8 4 8 9v75c0 7-4 12-11 12H81c-8 0-13-5-13-13V62c0-9 4-14 10-14Z" />
      <path className="paper-top-curl" d="M143 42h18c10 0 17 7 17 17v12h-35V59c0-7-4-13-10-17Z" />
      <path className="paper-rolled-band" d="M68 44h78v15H68c-6 0-10-3-10-7.5S62 44 68 44Z" />
      <path className="paper-bottom-curl" d="M45 130h80v7c0 8 6 14 16 14H64c-12 0-19-8-19-21Z" />
      <g className="paper-lines">
        <path className="paper-line l1" d="M81 72h42" />
        <path className="paper-line l2" d="M81 94h42" />
        <path className="paper-line l3" d="M81 116h28" />
      </g>
    </g>
    <g className="appointment-magnifier">
      <circle className="appointment-glass-frame" cx="138" cy="105" r="25" />
      <circle className="appointment-lens" cx="138" cy="105" r="19" />
      <path className="appointment-handle" d="m156 123 23 23" />
      <circle className="appointment-dot" cx="138" cy="105" r="3.2" />
      <path className="appointment-x" d="m130 97 16 16m0-16-16 16" />
    </g>
    <circle className="appointment-particle particle-one" cx="186" cy="69" r="4" />
    <path className="appointment-particle particle-x" d="m39 117 8 8m0-8-8 8" />
  </svg>;
}

function AuthModal({ mode, onClose, onMode, onAuthenticated }: {
  mode: Exclude<AuthMode, null>;
  onClose: () => void;
  onMode: (mode: Exclude<AuthMode, null>) => void;
  onAuthenticated: (user: ClientUser) => void;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [pendingGoogle, setPendingGoogle] = useState<PendingGoogleRegistration | null>(null);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePhone, setGooglePhone] = useState("");
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [registrationSucceeded, setRegistrationSucceeded] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPassword, setManualPassword] = useState("");
  const [lastGoogleAccess] = useState(() => localStorage.getItem("barbe_last_login_provider") === "google");
  const googleButtonRef = useRef<HTMLDivElement>(null);

  function showUnverifiedAccount(error: unknown) {
    if (!(error instanceof ClientApiError) || error.code !== "EMAIL_NOT_VERIFIED" || !error.email) return false;
    localStorage.removeItem("barbe_token");
    setRegistrationSucceeded(false);
    setConfirmationEmail(error.email);
    return true;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSubmittingGoogle(true);
      setGoogleError("");
      const result = pendingGoogle
        ?await clientApi<{ token: string; user: ClientUser }>("/auth/google/complete", {
          method: "POST",
          body: JSON.stringify({
            credential: pendingGoogle.credential,
            name: googleName,
            email: googleEmail,
            phone: googlePhone
          })
        })
        : signup
          ?await clientApi<{ token: string; user: ClientUser }>("/auth/register", {
            method: "POST",
            body: JSON.stringify({
              name: manualName,
              phone: manualPhone,
              email: manualEmail,
              password: manualPassword
            })
          })
          : await clientApi<{ token: string; user: ClientUser }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: manualEmail, password: manualPassword })
          });
      localStorage.setItem("barbe_token", result.token);
      localStorage.setItem("barbe_last_login_provider", pendingGoogle ?"google" : "password");
      onAuthenticated(result.user);
      if (signup) {
        setRegistrationSucceeded(true);
        setConfirmationEmail(result.user.email);
      }
      else onClose();
    } catch (error) {
      if (showUnverifiedAccount(error)) return;
      setGoogleError(error instanceof Error ?error.message : "Não foi possível concluir o cadastro.");
    } finally {
      setSubmittingGoogle(false);
    }
  };
  const signup = mode === "signup";

  useEffect(() => {
    if (!googleClientId) {
      setGoogleError("Login Google n\u00e3o configurado.");
      return;
    }

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          try {
            setGoogleError("");
            const result = await clientApi<
              | { token: string; user: ClientUser; needsRegistration?: false }
              | { needsRegistration: true; googleProfile: { name: string; email: string; avatar?: string | null } }
            >("/auth/google", {
              method: "POST",
              body: JSON.stringify({ credential })
            });
            if ("needsRegistration" in result && result.needsRegistration) {
              setPendingGoogle({ credential, ...result.googleProfile });
              setGoogleName(result.googleProfile.name);
              setGoogleEmail(result.googleProfile.email);
              setGooglePhone("");
              onMode("signup");
              return;
            }
            localStorage.setItem("barbe_token", result.token);
            localStorage.setItem("barbe_last_login_provider", "google");
            onAuthenticated(result.user);
            onClose();
          } catch (error) {
            if (showUnverifiedAccount(error)) return;
            setGoogleError(error instanceof Error ?error.message : "Não foi possível acessar com o Google.");
          }
        }
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: signup ?"signup_with" : "signin_with",
        shape: "rectangular",
        width: 188,
        locale: "pt-BR"
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", renderGoogleButton);
    return () => script?.removeEventListener("load", renderGoogleButton);
  }, [signup, onAuthenticated, onClose]);

  return <div className="client-modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    {confirmationEmail && registrationSucceeded && <div className="client-success-toast">{"\u2713"} Cadastrado com sucesso.</div>}
    <section className={`client-modal${confirmationEmail ?" client-confirmation-modal" : ""}`} role="dialog" aria-modal="true" aria-label={confirmationEmail ?"Confirmação de cadastro" : signup ?"Cadastro" : "Acessar conta"}>
      <button className="client-modal-close" onClick={onClose} aria-label="Fechar"><X /></button>
      {confirmationEmail ?<>
        <h2>Confirma\u00e7\u00e3o de cadastro</h2>
        <div className="client-confirmation-icon" aria-hidden="true">
          <span />
        </div>
        <p className="client-confirmation-copy">Acesse seu e-mail e confirme seu cadastro para come\u00e7ar a desfrutar de todos os recursos e benef\u00edcios do Developer Barber :)</p>
        <strong className="client-confirmation-email">{confirmationEmail}</strong>
        <button className="client-auth-submit client-confirmation-button" onClick={onClose}>Entendido</button>
      </> : <>
      <h2>{signup ?"Cadastro" : "Acessar conta"}</h2>
      <p className="client-social-label">Continuar com</p>
      <div className="client-social-login">
        <div
          className={`client-google-card${lastGoogleAccess ?" last-access" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => googleButtonRef.current?.querySelector<HTMLElement>('[role="button"]')?.click()}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              googleButtonRef.current?.querySelector<HTMLElement>('[role="button"]')?.click();
            }
          }}
        >
          <div className="client-google-visual" aria-hidden="true">
            <svg className="client-google-mark" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z" />
              <path fill="#FBBC05" d="M10.53 28.59A14.6 14.6 0 0 1 9.77 24c0-1.6.27-3.14.76-4.59l-7.98-6.19A24 24 0 0 0 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19Z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
            </svg>
            <strong>Google</strong>
          </div>
          {lastGoogleAccess && <small>Ãšltimo acesso</small>}
          <div className="client-google-login" ref={googleButtonRef} />
        </div>
        <button><Apple /><span>Apple</span></button>
      </div>
      {googleError && <p className="client-google-error">{googleError}</p>}
      <div className="client-or"><span>ou</span></div>
      <form className="client-auth-form" onSubmit={submit}>
        {signup && <>
          <label>Nome completo*<input value={pendingGoogle ?googleName : manualName} onChange={event => pendingGoogle ?setGoogleName(event.target.value) : setManualName(event.target.value)} placeholder="Informe seu nome e sobrenome" required /></label>
          <label>Celular*<div className="client-phone"><button type="button"><img src="/img/flags/br.png" alt="Brasil" /> +55 <ChevronDown /></button><input type="tel" value={pendingGoogle ?googlePhone : manualPhone} onChange={event => pendingGoogle ?setGooglePhone(event.target.value) : setManualPhone(event.target.value)} placeholder="(11) 99999-9999" required /></div></label>
          <label>Email*<input type="email" value={pendingGoogle ?googleEmail : manualEmail} onChange={event => pendingGoogle ?setGoogleEmail(event.target.value) : setManualEmail(event.target.value)} placeholder="Informe seu email" required /></label>
        </>}
        {!signup && <label>Email ou telefone*<input type="email" value={manualEmail} onChange={event => setManualEmail(event.target.value)} placeholder="Informe o email ou telefone" required /></label>}
        {!pendingGoogle && <label>{signup ?"Senha (mínimo 6 caracteres)*" : "Senha*"}
          <div className="client-password"><input type={passwordVisible ?"text" : "password"} value={manualPassword} onChange={event => setManualPassword(event.target.value)} placeholder="Informe sua senha" minLength={6} required /><button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ?"Ocultar" : "Mostrar"}</button></div>
        </label>}
        {!signup && <button type="button" className="client-recover">Recuperar senha</button>}
        <button className="client-auth-submit" disabled={submittingGoogle}>{submittingGoogle ?"Cadastrando..." : signup ?"Cadastrar" : "Acessar"}</button>
      </form>
      <footer>
        <p>{signup ?"Já tem uma conta?" : "Não possui uma conta?"} <button onClick={() => onMode(signup ?"login" : "signup")}>{signup ?"Acesse" : "Cadastre-se"}</button></p>
        <small>Acessando voc\u00ea concorda com o <a href="/termos" target="_blank">termo de uso</a></small>
      </footer>
      </>}
    </section>
  </div>;
}

function PortalFooter() {
  return <footer className="client-footer">
    <div className="client-footer-grid">
      <div className="client-footer-brand">
        <Brand />
        <p>Uma nova experiÃªncia<br />para uma antiga tradiÃ§Ã£o.</p>
        <div><a href="https://instagram.com/developerbarber" aria-label="Instagram"><Instagram /></a><a href="https://twitter.com/developerbarber" aria-label="Twitter"><Twitter /></a></div>
      </div>
      <nav><h3>Acesso rÃ¡pido</h3><a href={portalPath("")}>In\u00edcio</a><a href={portalPath("/buscar")}>Encontrar estabelecimentos</a><a href={portalPath("/agendamentos")}>Meus agendamentos</a><a href={portalPath("/favoritos")}>Favoritos</a></nav>
      <nav><h3>Mais</h3><a href="/termos" target="_blank">Termos de uso</a><button>PreferÃªncias de cookies</button></nav>
      <div className="client-download"><h3>Baixe nosso App</h3><button><Apple /> App Store</button><button>â–¶ Google Play</button></div>
      <div className="client-manager"><h3>Ã‰ um gestor?</h3><p>Cadastre seu estabelecimento e comece a receber agendamentos online.</p><a href="/#cadastro">Saiba mais</a></div>
    </div>
    <p className="client-copy">Â© 2026 Developer Barber. Todos os direitos reservados.</p>
  </footer>;
}

type ClientPageProps = { user: ClientUser | null; t: typeof portalText.BR; onUserUpdate?: (user: ClientUser) => void };

function ProfilePage({ user, onUserUpdate }: ClientPageProps) {
  const [tab, setTab] = useState<"dados" | "endereco" | "seguranca" | "acessos">("dados");
  const [saved, setSaved] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", phone: "", birthDate: "", gender: "masculino",
    country: "Brasil", phoneCountry: "+55", zip: "", address: "", district: "", number: "", complement: "", state: "", city: ""
  });
  const name = form.name || user?.name || "USU\u00c1RIO N\u00c3O IDENTIFICADO";
  const email = user?.email || "email@exemplo.com";
  useEffect(() => {
    if (!user) return;
    clientApi<any>("/client/profile").then(profile => setForm(current => ({
      ...current,
      name: profile.name || user.name || "",
      phone: profile.phone || "",
      birthDate: profile.birth_date ?String(profile.birth_date).slice(0, 10) : "",
      gender: profile.gender || "masculino",
      country: profile.country || "Brasil",
      phoneCountry: current.phoneCountry || "+55",
      zip: profile.zip || "",
      address: profile.address || "",
      district: profile.district || "",
      number: profile.number || "",
      complement: profile.complement || "",
      state: profile.state || "",
      city: profile.city || ""
    }))).catch(() => {});
  }, [user]);
  async function saveProfile(extra = {}) {
    const updated = await clientApi<any>("/client/profile", { method: "PUT", body: JSON.stringify({ ...form, ...extra }) });
    setForm(current => ({ ...current, ...updated, birthDate: updated.birth_date ?String(updated.birth_date).slice(0, 10) : current.birthDate }));
    if (user && updated.name) onUserUpdate?.({ ...user, name: updated.name });
    setSaved(true); window.setTimeout(() => setSaved(false), 3500);
  }
  function setField(field: keyof typeof form, value: string) { setForm(current => ({ ...current, [field]: value })); }
  const selectedPhoneCountry = phoneCountries.find(item => item.code === form.phoneCountry) || phoneCountries[0];
  const stateCities = form.state ?citiesByState[form.state] || [form.state] : [];
  const phoneDisplay = `${selectedPhoneCountry.code} ${form.phone}`.trim();
  function setPhoneValue(value: string) {
    const escaped = selectedPhoneCountry.code.replace("+", "\\+");
    setField("phone", value.replace(new RegExp(`^${escaped}\\s*`), ""));
  }
  function selectState(value: string) {
    setForm(current => ({ ...current, state: value, city: citiesByState[value]?.[0] || "" }));
  }
  function fillCep(value: string) {
    setField("zip", value);
    if (value.replace(/\D/g, "").length >= 8) setForm(current => ({ ...current, address: current.address || "Rua Santos Dumont, 311", district: current.district || "Centro", number: current.number || "311", state: current.state || "Rio Grande do Sul", city: current.city || "Pelotas" }));
  }
  const profileTabs = [
    { id: "dados", label: "Meus Dados", icon: UserRound },
    { id: "endereco", label: "Endere\u00e7o", icon: Building2 },
    { id: "seguranca", label: "Seguran\u00e7a", icon: Clock3 },
    { id: "acessos", label: "Acessos", icon: Search, badge: "Novo" }
  ] as const;

  return <section className="client-account-page">
    {saved && <div className="client-login-toast client-profile-saved"><span>{"\u2713"}</span> Alterado com sucesso<button onClick={() => setSaved(false)}>{"\u00d7"}</button></div>}
    <aside className="client-account-sidebar">
      <div className="client-account-avatar"><CircleUserRound /></div>
      <strong>{name}</strong>
      <small>{email}</small>
      <nav>
        {profileTabs.map(item => {
          const Icon = item.icon;
          return <button key={item.id} className={tab === item.id ?"active" : ""} onClick={() => setTab(item.id)}>
            <Icon /> {item.label} {"badge" in item && <span>{item.badge}</span>}
          </button>;
        })}
      </nav>
    </aside>
    <div className="client-account-content">
      {tab === "dados" && <form className="client-account-form" onSubmit={event => { event.preventDefault(); saveProfile(); }}>
        <label>Nome completo*<input value={form.name} onChange={e => setField("name", e.target.value)} /></label>
        <label>Data de nascimento<input type="date" value={form.birthDate} onChange={e => setField("birthDate", e.target.value)} /></label>
        <label>Celular*<div className="client-account-phone">
          <button type="button" className="client-phone-trigger" onClick={() => setPhoneOpen(open => !open)}>
            <img src={selectedPhoneCountry.flag} alt={selectedPhoneCountry.name} />
          </button>
          <input value={phoneDisplay} onFocus={() => setPhoneOpen(true)} onChange={e => setPhoneValue(e.target.value)} />
          {phoneOpen && <div className="client-phone-list">
            {phoneCountries.map(item => <button type="button" key={item.code} onClick={() => { setField("phoneCountry", item.code); setPhoneOpen(false); }}>
              <img src={item.flag} alt="" /><strong>{item.name}</strong><small>{item.code}</small>
            </button>)}
          </div>}
        </div></label>
        <fieldset><legend>G\u00eanero</legend>
          {["masculino", "feminino", "outros"].map(item => <label key={item}><input type="radio" name="gender" checked={form.gender === item} onChange={() => setField("gender", item)} /> {item[0].toUpperCase() + item.slice(1)}</label>)}
        </fieldset>
        <button>Salvar</button>
        <a href="#excluir">Excluir conta</a>
      </form>}
      {tab === "endereco" && <form className="client-account-form client-address-form" onSubmit={event => { event.preventDefault(); saveProfile(); }}>
        <label>{"Pa\u00eds"}<select value={form.country} onChange={e => setField("country", e.target.value)}><option>Brasil</option></select></label>
        <label>CEP*<input value={form.zip} onChange={e => fillCep(e.target.value)} placeholder="CEP" /></label>
        <label>{"Endere\u00e7o"}*<input value={form.address} onChange={e => setField("address", e.target.value)} placeholder={"Endere\u00e7o"} /></label>
        <div><label>Bairro*<input value={form.district} onChange={e => setField("district", e.target.value)} placeholder="Bairro" /></label><label>{"N\u00famero"}*<input value={form.number} onChange={e => setField("number", e.target.value)} placeholder={"N\u00famero"} /></label></div>
        <label>Complemento<input value={form.complement} onChange={e => setField("complement", e.target.value)} placeholder="Complemento" /></label>
        <label>Estado<select value={form.state} onChange={e => selectState(e.target.value)}><option value="">Selecione um estado</option>{brazilStates.map(state => <option key={state}>{state}</option>)}</select></label>
        <label>Cidade<select value={form.city} onChange={e => setField("city", e.target.value)}><option value="">Selecione uma cidade</option>{stateCities.map(city => <option key={city}>{city}</option>)}</select></label>
        <button>Salvar</button>
      </form>}
      {tab === "seguranca" && <form className="client-account-form" onSubmit={event => { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 3500); }}>
        {["Senha atual*", "Nova Senha*", "Confirma\u00e7\u00e3o senha*"].map(label => <label key={label}>{label}<div className="client-password"><input type="password" placeholder={label.replace("*", "")} /><button type="button">Mostrar</button></div></label>)}
        <button>Salvar</button>
      </form>}
      {tab === "acessos" && <div className="client-access-card">
        <div><svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"/><path fill="#FBBC05" d="M10.53 28.59A14.6 14.6 0 0 1 9.77 24c0-1.6.27-3.14.76-4.59l-7.98-6.19A24 24 0 0 0 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg><strong>{email}</strong></div>
        <button><X /></button>
        <label>Vincular acesso<input type="text" placeholder="Continuar com Email e Senha" /></label>
      </div>}
    </div>
  </section>;
}

function BrokenHeart() {
  return <svg viewBox="0 0 120 110" aria-hidden="true"><path d="M60 96C28 70 14 54 14 35c0-15 11-26 25-26 9 0 17 5 21 12 4-7 12-12 21-12 14 0 25 11 25 26 0 19-14 35-46 61Z" fill="#d9dde4"/><path d="m62 20-12 28h18L56 82" fill="none" stroke="#0a0b0f" strokeWidth="7" strokeLinejoin="round"/></svg>;
}

function CardsIllustration() {
  return <div className="client-cards-illustration"><div>VISA<small>â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢</small></div><span /></div>;
}

function SimpleClientPage({ kind }: { kind: "favoritos" | "cartoes" | "assinaturas" | "pacotes" | "historico" | "lista" }) {
  const data = {
    favoritos: { title: "Favoritos", copy: "", empty: "Nenhuma empresa encontrada" },
    cartoes: { title: "Meus Cart\u00f5es", copy: "Com o recurso de pagamento online, voc\u00ea agiliza o pagamento de seus agendamentos de maneira segura e ainda tem a chance de explorar e aderir a clubes de assinatura, alÃ©m de comprar pacotes diversos.", empty: "Nenhum cartÃ£o encontrado." },
    assinaturas: { title: "Minhas Assinaturas", copy: "Gerencie suas assinaturas ativas aqui. Nesta tela, voc\u00ea pode visualizar todas as suas assinaturas e explorar detalhadamente os serviÃ§os e produtos incluÃ­dos em cada uma.", empty: "Nenhuma assinatura encontrada" },
    pacotes: { title: "Meus Pacotes", copy: "Aqui, voc\u00ea pode verificar todos os seus pacotes, entender o quanto jÃ¡ utilizou de cada um e acessar o histÃ³rico completo de uso.", empty: "Nenhum pacote encontrado" },
    historico: { title: "Hist\u00f3rico de agendamentos", copy: "Explore seu histÃ³rico de agendamentos. Use o filtro de data para revisar seus agendamentos anteriores.", empty: "Nenhum agendamento encontrado no perÃ­odo." },
    lista: { title: "Lista de espera", copy: "Acompanhe suas solicitaÃ§Ãµes na fila de espera e remova quando quiser.", empty: "VocÃª n?o est? em nenhuma lista de espera." }
  }[kind];
  return <section className={`client-section-page ${kind}`}>
    <h1>{data.title}</h1>
    {data.copy && <p>{data.copy}</p>}
    {["assinaturas", "pacotes", "historico"].includes(kind) && <label className="client-page-search"><Search /><input placeholder="Pesquisar" /></label>}
    {kind === "historico" && <div className="client-history-filter"><small>Filtrando de 24/06/2026 atÃ© 24/06/2026</small><button>Filtrar</button></div>}
    <div className="client-page-empty">
      {kind === "favoritos" && <BrokenHeart />}
      {kind === "cartoes" && <CardsIllustration />}
      <span>{data.empty}</span>
      {kind === "cartoes" && <button>+ Adicionar CartÃ£o</button>}
    </div>
  </section>;
}

const helpGroups = [
  ["1. Sobre o AppBarber e Responsabilidades", [
    ["O que é o AppBarber?", "O AppBarber é uma plataforma tecnológica de gestão e agendamento online, utilizada por barbearias para administrar serviços, planos e relacionamento com clientes."],
    ["O AppBarber é responsável pelos serviços prestados pela barbearia?", "Não. Os serviços, valores e atendimento são de responsabilidade do estabelecimento contratado."],
    ["InformaÃ§Ãµes importantes:", "O AppBarber atua como provedor de tecnologia. QuestÃµes comerciais, cancelamentos ou reembolsos devem ser tratadas diretamente com o estabelecimento."]
  ]],
  ["2. Agendamentos e Uso do App", [
    ["Não encontro horários disponíveis na Agenda. O que eu faço?", "A disponibilidade de horários é definida em tempo real pela barbearia. Se não encontrar horários, tente outro profissional ou outro dia."],
    ["Como faço para remarcar ou cancelar um horário?", "Acesse Meus Agendamentos e escolha a ação disponível no agendamento. Algumas barbearias podem limitar prazos de cancelamento."],
    ["Posso agendar para outra pessoa (como meu filho) no meu perfil?Ou então, posso agendar para nós dois?", "Sim, quando o estabelecimento permitir. Se precisar de horários simultâneos, selecione profissionais diferentes."],
    ["Como posso avaliar o serviço ou o profissional?", "Após a conclusão do serviço, uma notificação poderá ser enviada para avaliação."]
  ]],
  ["3. Planos e Assinaturas (RecorrÃªncia)", [
    ["Como funciona a assinatura mensal?", "A assinatura pode ter cobrança recorrente e serviços vinculados conforme o plano do estabelecimento."],
    ["Assinei um Plano de Assinatura, mas no agendamento aparece valor a pagar. O que houve?", "Verifique se o serviço escolhido está incluso no plano e se o plano está ativo."],
    ["Como cancelar minha assinatura?", "O cancelamento deve ser realizado pelo próprio usuário ou conforme orientação do estabelecimento."],
    ["Meus serviços não utilizados acumulam para o mês seguinte?", "As regras de acúmulo são definidas exclusivamente pelo estabelecimento."],
    ["Como faço para trocar ou atualizar meu cartão de crédito?", "Acesse Meus Cartões para adicionar um novo cartão e remover o antigo."]
  ]],
  ["4. Pagamentos e Reembolsos", [
    ["Cancelei, mas houve nova cobrança. O que pode ter ocorrido?", "Pode haver processamento em andamento. Entre em contato com o estabelecimento para conferência."],
    ["Não utilizei o plano. Tenho direito a reembolso?", "A política de reembolso é definida pelo estabelecimento."],
    ["Houve cobrança indevida/duplicada. O que devo fazer?", "Entre em contato com o estabelecimento e envie os comprovantes da cobrança."],
    ["Paguei minha fatura/assinatura, mas continua aparecendo como â€œInadimplente/Atrasadoâ€ no App. O que houve?", "Pode existir atraso na atualizaÃ§Ã£o do status. Se persistir, acione o suporte do estabelecimento."]
  ]],
  ["5. Dicas de Seguran\u00e7a", [
    ["Proteja seu Acesso e Dados", "Mantenha seu aplicativo atualizado e n?o compartilhe cÃ³digos de acesso."],
    ["AtenÃ§Ã£o aos Pagamentos", "Pagamentos pelo app sÃ£o exibidos no prÃ³prio aplicativo. Desconfie de cobranÃ§as externas."],
    ["ComunicaÃ§Ã£o Oficial", "E-mails e mensagens oficiais usam canais informados pelo estabelecimento."]
  ]],
  ["6. Suporte e Inconformidade no app", [
    ["O aplicativo está apresentando erro ou fechando. O que fazer?", "Verifique sua conexão, atualize o app e tente novamente."],
    ["Como falo com o suporte?", "Use os canais de atendimento informados no aplicativo ou pelo estabelecimento."]
  ]]
] as const;

function HelpCenterPage() {
  return <section className="client-help-page">
    <h1>Central de ajuda</h1>
    <p>Perguntas frequentes e suporte</p>
    {helpGroups.map(([group, items]) => <div className="client-help-group" key={group}>
      <h2>{group}</h2>
      {items.map(([question, answer]) => <details key={question}>
        <summary>{question}<ChevronDown /></summary>
        <p>{answer}</p>
      </details>)}
    </div>)}
  </section>;
}

export function ClientPortal() {
  const authModalEnabled: boolean = true;
  const path = window.location.pathname.replace(/^\/cliente/, "") || "/";
  const [dark, setDark] = useState(true);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState<PortalLanguage>(() =>
    (localStorage.getItem("barbe_language") as PortalLanguage) || "BR"
  );
  const [mobileMenu, setMobileMenu] = useState(false);
  const [auth, setAuth] = useState<AuthMode>(null);
  const [user, setUser] = useState<ClientUser | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState(false);
  const [loginNotice, setLoginNotice] = useState(false);
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("nome");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [searching, setSearching] = useState<SearchMode | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(() => {
    const token = new URLSearchParams(window.location.search).get("verifyEmail");
    return token ?{ status: "loading", token } : null;
  });

  const date = useMemo(() => {
    const locale = language === "BR" ?"pt-BR" : language === "PT" ?"pt-PT" : language === "US" ?"en-US" : language === "ES" ?"es-ES" : "fr-FR";
    const formatted = new Intl.DateTimeFormat(locale, { weekday: "long", day: "2-digit", month: "short", year: "numeric" }).format(new Date());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [language]);

  const filteredShops = shops.filter(shop => {
    if (!query || searchMode === "proximas") return false;
    const value = searchMode === "cidade" ?shop.city : shop.name;
    return value.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    if (!searching) return;
    const timer = window.setTimeout(() => {
      setSearching(null);
    }, 1700);
    return () => window.clearTimeout(timer);
  }, [searching]);

  useEffect(() => {
    if (!logoutNotice) return;
    const timer = window.setTimeout(() => setLogoutNotice(false), 4200);
    return () => window.clearTimeout(timer);
  }, [logoutNotice]);

  useEffect(() => {
    if (!loginNotice) return;
    const timer = window.setTimeout(() => setLoginNotice(false), 4200);
    return () => window.clearTimeout(timer);
  }, [loginNotice]);

  useEffect(() => {
    if (!localStorage.getItem("barbe_token")) return;
    clientApi<{ user: ClientUser }>("/auth/me")
      .then(result => setUser(result.user))
      .catch(() => localStorage.removeItem("barbe_token"));
  }, []);

  useEffect(() => {
    if (!user) { setProfileName(""); return; }
    clientApi<any>("/client/profile")
      .then(profile => setProfileName(profile.name || user.name || ""))
      .catch(() => setProfileName(user.name || ""));
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("verifyEmail");
    if (!token) return;

    setVerificationResult({ status: "loading", token });
  }, []);

  async function confirmVerificationEmail() {
    if (!verificationResult?.token) return;
    try {
      const result = await clientApi<{ ok: boolean; email: string; token: string; user: ClientUser }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token: verificationResult.token })
      });
      localStorage.setItem("barbe_token", result.token);
      setUser(result.user);
      setVerificationResult({ status: "success", email: result.email });
      const params = new URLSearchParams(window.location.search);
      params.delete("verifyEmail");
      const nextSearch = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${nextSearch ?`?${nextSearch}` : ""}`);
    } catch (error) {
      setVerificationResult({
        status: "error",
        message: error instanceof Error ?error.message : "Não foi possível confirmar este e-mail."
      });
    }
  }

  function chooseSearchMode(mode: SearchMode) {
    setSearchMode(mode);
    setQuery("");
    setLocationEnabled(false);
    setSearching(mode === "nome" ?null : mode);
  }

  function confirmLogout() {
    localStorage.removeItem("barbe_token");
    setUser(null);
    setProfileOpen(false);
    setLogoutConfirmationOpen(false);
    setLogoutNotice(true);
  }

  const searchPage = path === "/buscar";
  const appointmentsPage = path === "/agendamentos";
  const profilePage = path === "/perfil";
  const helpPage = path === "/central-ajuda" || path === "/ajuda";
  const selectedLanguage = portalLanguages.find(item => item.code === language)!;
  const t = portalText[language];

  useEffect(() => {
    localStorage.setItem("barbe_language", language);
    document.documentElement.lang = language === "BR" ?"pt-BR" : language === "PT" ?"pt-PT" : language === "US" ?"en-US" : language === "ES" ?"es-ES" : "fr-FR";
  }, [language]);

  if (verificationResult) {
    return <EmailVerificationPage
      result={verificationResult}
      onConfirm={confirmVerificationEmail}
      onAccess={() => {
        setVerificationResult(null);
        window.location.href = "http://localhost:3333/wizard";
      }}
    />;
  }

  return <div className={`client-portal ${dark ?"client-dark" : "client-light"}`}>
    {loginNotice && <div className="client-login-toast"><span>{"\u2713"}</span> {t.loggedIn}<button onClick={() => setLoginNotice(false)} aria-label="Fechar">{"\u00d7"}</button></div>}
    {logoutNotice && <div className="client-logout-toast">{"\u2713"} {t.loggedOut}</div>}
    <header className="client-header">
      <Brand />
      <nav className={mobileMenu ?"open" : ""}>
        <a className={path === "/" ?"active" : ""} href={portalPath("")}>{t.home}</a>
        <a className={searchPage ?"active" : ""} href={portalPath("/buscar")}>{t.search}</a>
        <a className={path === "/agendamentos" ?"active" : ""} href={portalPath("/agendamentos")}>{t.appointments}</a>
      </nav>
      <div className="client-controls">
        <button aria-label={t.notifications}><Bell /></button>
        <button onClick={() => setDark(!dark)} aria-label={t.theme}>{dark ?<Sun /> : <Moon />}</button>
        <div className="client-language">
          <button onClick={() => setLanguageOpen(!languageOpen)} aria-expanded={languageOpen}>
            <img src={selectedLanguage.flag} alt={selectedLanguage.alt} width="24" height="18" />
            <b>{selectedLanguage.code}</b>
            <ChevronDown className={languageOpen ?"open" : ""} />
          </button>
          {languageOpen && <div className="client-language-popover" data-placement="bottom-end" data-arrow="true">
            <div className="client-language-popover-content">
              <div className="client-language-menu">
                {portalLanguages.map(item => <button
                  key={item.code}
                  className={language === item.code ?"active" : ""}
                  onClick={() => {
                    setLanguage(item.code);
                    setLanguageOpen(false);
                  }}
                >
                  <img src={item.flag} alt={item.alt} width="24" height="18" />
                  <span>{item.label}</span>
                  {language === item.code && <i aria-label="Selecionado">?</i>}
                </button>)}
              </div>
            </div>
          </div>}
        </div>
        <div className="client-profile-menu">
          <button className={`client-login${user ?"" : " logged-out"}`} onClick={() => user ?setProfileOpen(!profileOpen) : setAuth("login")} aria-label={user ?"Perfil" : "Entrar"}>
            {user ?<>
              <span className="client-login-avatar" aria-label="avatar" role="img">
                <svg aria-hidden="true" fill="none" height="80%" role="presentation" viewBox="0 0 24 24" width="80%">
                  <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="currentColor" />
                  <path d="M17.0809 14.1489C14.2909 12.2889 9.74094 12.2889 6.93094 14.1489C5.66094 14.9989 4.96094 16.1489 4.96094 17.3789C4.96094 18.6089 5.66094 19.7489 6.92094 20.5889C8.32094 21.5289 10.1609 21.9989 12.0009 21.9989C13.8409 21.9989 15.6809 21.5289 17.0809 20.5889C18.3409 19.7389 19.0409 18.5989 19.0409 17.3589C19.0309 16.1289 18.3409 14.9889 17.0809 14.1489Z" fill="currentColor" />
                </svg>
              </span>
              <span className="client-profile-chevron"><ChevronDown className={profileOpen ?"open" : ""} /></span>
            </> : <>
              <span className="client-login-avatar" aria-label="avatar" role="img">
                <svg aria-hidden="true" fill="none" height="80%" role="presentation" viewBox="0 0 24 24" width="80%">
                  <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="currentColor" />
                  <path d="M17.0809 14.1489C14.2909 12.2889 9.74094 12.2889 6.93094 14.1489C5.66094 14.9989 4.96094 16.1489 4.96094 17.3789C4.96094 18.6089 5.66094 19.7489 6.92094 20.5889C8.32094 21.5289 10.1609 21.9989 12.0009 21.9989C13.8409 21.9989 15.6809 21.5289 17.0809 20.5889C18.3409 19.7389 19.0409 18.5989 19.0409 17.3589C19.0309 16.1289 18.3409 14.9889 17.0809 14.1489Z" fill="currentColor" />
                </svg>
              </span>
              <h1 className="client-login-label">{t.enter}</h1>
            </>}
          </button>
          {profileOpen && <aside className="client-profile-dropdown">
            <header><strong>{profileName || user?.name || "USU\u00c1RIO N\u00c3O IDENTIFICADO"}</strong><small>{user?.email || "E-mail n\u00e3o identificado"}</small></header>
            <a href={portalPath("/perfil")}><UserRound /> {t.profile}</a>
            <a href={portalPath("/favoritos")}><Heart /> {t.favorites}</a>
            <a href={portalPath("/cartoes")}><CreditCard /> {t.cards}</a>
            <a href={portalPath("/assinaturas")}><ListChecks /> {t.subscriptions}</a>
            <a href={portalPath("/pacotes")}><Package /> {t.packages}</a>
            <a href={portalPath("/historico")}><History /> {t.history}</a>
            <a href={portalPath("/lista-espera")}><Clock3 /> {t.waitlist}</a>
            <a href={portalPath("/central-ajuda")}><BadgeHelp /> {t.help}</a>
            <button onClick={() => { setProfileOpen(false); setLogoutConfirmationOpen(true); }}><LogOut /> {t.logout}</button>
          </aside>}
        </div>
        <button className="client-menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ?<X /> : <Menu />}</button>
      </div>
    </header>

    <main className="client-main">
      {profilePage ?<ProfilePage user={user} t={t} onUserUpdate={updatedUser => { setUser(updatedUser); setProfileName(updatedUser.name); }} /> : path === "/favoritos" ?<SimpleClientPage kind="favoritos" /> : path === "/cartoes" ?<SimpleClientPage kind="cartoes" /> : path === "/assinaturas" ?<SimpleClientPage kind="assinaturas" /> : path === "/pacotes" ?<SimpleClientPage kind="pacotes" /> : path === "/historico" ?<SimpleClientPage kind="historico" /> : path === "/lista-espera" ?<SimpleClientPage kind="lista" /> : helpPage ?<HelpCenterPage /> : appointmentsPage ?<section className="client-appointments">
        <h1>{t.appointments}</h1>
        <label><select defaultValue=""><option value="">{t.filter}</option><option>Barbearia Central</option><option>Studio Developer Barber</option></select><ChevronDown /></label>
        <div className="client-empty-appointments">
          <AppointmentAnimation />
          <p>{t.noAppointments}</p>
        </div>
      </section> : <>
        <section className="client-welcome">
          <h1>{user ?<>{t.hello}, <span>{user.name.trim().split(/\s+/)[0]}</span></> : t.welcome}</h1>
          <p>{date}</p>
        </section>
        <section className="client-search-area">
          <label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={!searchPage ?t.find : searchMode === "cidade" ?t.city : searchMode === "proximas" ?t.nearby : t.byName} />{searchPage && searchMode === "cidade" && <ChevronDown className="client-city-chevron" />}</label>
          {searchPage && <div className="client-search-tabs">
            <button className={searchMode === "nome" ?"active" : ""} onClick={() => chooseSearchMode("nome")}><Store /> {t.byName}</button>
            <button className={searchMode === "cidade" ?"active" : ""} onClick={() => chooseSearchMode("cidade")}><Building2 /> {t.city}</button>
            <button className={searchMode === "proximas" ?"active" : ""} onClick={() => chooseSearchMode("proximas")}><MapPin /> {t.nearby}</button>
          </div>}
        </section>
        <section className="client-results">
          <h2>{searchPage ?t.find : t.nearbyCompanies}</h2>
          {searching && <div className={`client-searching ${searching}`} aria-live="polite">
            {searching === "cidade" ?<Search /> : <LocateFixed />}
            <strong>{searching === "cidade" ?"Buscando cidades..." : "Procurando sua localização..."}</strong>
          </div>}
          {!searching && searchPage && !query && searchMode !== "proximas" && <div className="client-empty-search">
            <EmptySearchAnimation />
            <strong>{t.find}</strong>
            <span>{t.searchHint}</span>
          </div>}
          {!searching && ((!searchPage && !locationEnabled) || (searchPage && searchMode === "proximas")) && <button className="client-location" onClick={() => setSearching("proximas")}>
            <LocationAnimation />
            <strong>{t.location}</strong>
            <span>{t.locationCopy}</span>
          </button>}
          {!searching && query && searchMode !== "proximas" && <div className="client-shop-grid">{filteredShops.map(shop => <article key={shop.name}>
            <div className="client-shop-cover"><Scissors /></div>
            <button className="client-heart"><Heart /></button>
            <h3>{shop.name}</h3><p><MapPin /> {shop.city}</p><footer><span>â˜… {shop.rating}</span><small>{shop.distance}</small></footer>
          </article>)}</div>}
        </section>
      </>}
    </main>

    <PortalFooter />
    <nav className="client-mobile-nav">
      <a className={path === "/" ?"active" : ""} href={portalPath("")}><span>âŒ‚</span>In\u00edcio</a>
      <a className={searchPage ?"active" : ""} href={portalPath("/buscar")}><Search />Buscar</a>
      <a className={path === "/agendamentos" ?"active" : ""} href={portalPath("/agendamentos")}><CalendarDays />Agendamentos</a>
      <button onClick={() => user ?setProfileOpen(!profileOpen) : setAuth("login")}><CircleUserRound />Perfil</button>
    </nav>
    {logoutConfirmationOpen && <div
      className="client-logout-backdrop"
      role="presentation"
      onMouseDown={event => event.target === event.currentTarget && setLogoutConfirmationOpen(false)}
    >
      <section className="client-logout-dialog" role="dialog" aria-modal="true" aria-labelledby="client-logout-title">
        <button className="client-logout-close" onClick={() => setLogoutConfirmationOpen(false)} aria-label="Fechar"><X /></button>
        <h2 id="client-logout-title">{t.logoutTitle}</h2>
        <p>{t.logoutQuestion}</p>
        <footer>
          <button className="client-logout-no" onClick={() => setLogoutConfirmationOpen(false)}>{t.no}</button>
          <button className="client-logout-yes" onClick={confirmLogout}>{t.yes}</button>
        </footer>
      </section>
    </div>}
    {authModalEnabled && auth && <AuthModal
      mode={auth}
      onClose={() => setAuth(null)}
      onMode={setAuth}
      onAuthenticated={authenticatedUser => {
        setUser(authenticatedUser);
        setLoginNotice(true);
      }}
    />}
  </div>;
}
