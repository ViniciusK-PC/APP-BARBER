import { BarChart3, Globe2, LockKeyhole, Settings } from "lucide-react";

const modules = [
  { title: "Landing Page", description: "Gerenciamento futuro da página pública.", icon: Globe2 },
  { title: "Acessos", description: "Controle futuro dos usuários internos do chefe.", icon: LockKeyhole },
  { title: "Projeto", description: "Visão global futura dos módulos do sistema.", icon: BarChart3 },
  { title: "Configurações", description: "Configurações globais em standby.", icon: Settings }
];

export function App() {
  return <main className="chefe-shell">
    <aside className="chefe-sidebar">
      <strong>CHEFE PROJETO</strong>
      <span>Admin interno</span>
    </aside>
    <section className="chefe-content">
      <p className="chefe-kicker">Standby</p>
      <h1>Painel do chefe do projeto</h1>
      <p className="chefe-copy">Base inicial para gerenciamento global da landing, acessos e módulos internos.</p>
      <div className="chefe-grid">
        {modules.map(item => {
          const Icon = item.icon;
          return <article key={item.title}>
            <Icon />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>;
        })}
      </div>
    </section>
  </main>;
}
