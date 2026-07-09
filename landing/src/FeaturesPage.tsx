import {
  BarChart3, BellRing, CalendarCheck, CalendarDays, Check,
  ClipboardList, Clock3, CreditCard, Facebook, Gift, Globe2, ListChecks,
  MessageCircle, Package, Scissors, Share2, ShoppingBag, Star, TrendingUp,
  UserRound, Users, WalletCards
} from "lucide-react";
import { useEffect } from "react";

type Feature = {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  intro: string;
  paragraphs: string[];
  bullets?: string[];
};

const details: Feature[] = [
  {
    id: "lembrete-horarios", title: "Lembrete de Horários", icon: BellRing,
    intro: "Diminua esquecimentos e ausências com lembretes automáticos antes do atendimento.",
    paragraphs: [
      "Ao agendar um horário, o cliente pode receber notificações pelo aplicativo e por e-mail no momento configurado pela barbearia.",
      "A equipe também pode configurar alertas para os profissionais, mantendo todos informados sobre os próximos atendimentos."
    ],
    bullets: ["Notificações automáticas", "Configuração de antecedência", "Avisos para clientes e profissionais", "Canais de aplicativo, e-mail, SMS ou WhatsApp"]
  },
  {
    id: "flexibilizacao-agenda", title: "Flexibilização da Agenda dos Profissionais", icon: CalendarDays,
    intro: "Cada profissional trabalha com sua própria jornada e suas exceções de horário.",
    paragraphs: [
      "Configure horários por dia da semana, intervalos e períodos especiais. O sistema impede agendamentos fora da jornada cadastrada.",
      "Encaixes e extensões temporárias permitem atender situações excepcionais sem alterar definitivamente a escala."
    ],
    bullets: ["Jornada semanal individual", "Jornada temporária por período", "Intervalos de trabalho", "Encaixes fora da rotina"]
  },
  {
    id: "noticias-promocoes", title: "Envio de Notícias e Promoções", icon: MessageCircle,
    intro: "Comunique eventos, horários especiais e promoções diretamente aos clientes.",
    paragraphs: [
      "Envie publicações para todos os clientes, grupos específicos ou pessoas selecionadas.",
      "Acompanhe a entrega e leitura das comunicações para entender o alcance de cada campanha."
    ],
    bullets: ["Segmentação por grupos", "Período de exibição", "Aplicativo, e-mail, SMS ou WhatsApp", "Controle de entrega e leitura"]
  },
  {
    id: "gestao-financeira", title: "Gestão Financeira", icon: TrendingUp,
    intro: "Tenha visão clara do dinheiro que entra, sai e ainda está pendente.",
    paragraphs: [
      "Controle caixa, contas a pagar, contas a receber, transferências e fluxo financeiro em uma única área.",
      "Registre taxas de cartões, categorias e formas de pagamento para analisar valores brutos e líquidos."
    ],
    bullets: ["Caixa diário", "Receitas e despesas", "Contas a pagar e receber", "Fluxo de caixa e taxas"]
  },
  {
    id: "controle-agenda", title: "Controle Automatizado da Agenda", icon: CalendarCheck,
    intro: "A agenda se ajusta automaticamente conforme os horários são ocupados.",
    paragraphs: [
      "Clientes e profissionais visualizam apenas horários realmente disponíveis, considerando duração do serviço, jornada, intervalos e outros agendamentos.",
      "Isso reduz conflitos e diminui a necessidade de intervenção manual."
    ],
    bullets: ["Prevenção de conflitos", "Duração por serviço", "Disponibilidade em tempo real", "Agenda por profissional"]
  },
  {
    id: "relatorios-gerenciais", title: "Relatórios Gerenciais", icon: BarChart3,
    intro: "Transforme dados da operação em informações para tomar decisões.",
    paragraphs: [
      "Analise agendamentos por período, dia da semana, horário, profissional, serviço, cliente e origem.",
      "Identifique horários de baixa ocupação, serviços mais procurados e oportunidades de campanhas."
    ],
    bullets: ["Filtros por período", "Desempenho profissional", "Perfil e retorno dos clientes", "Exportação e indicadores"]
  },
  {
    id: "pacotes", title: "Pacotes de Serviços e Produtos", icon: Package,
    intro: "Fidelize clientes, ofereça vantagens e antecipe receitas.",
    paragraphs: [
      "Monte pacotes combinando serviços e produtos com valores especiais, validade e regras próprias.",
      "Acompanhe a quantidade comprada, utilizada e disponível para cada cliente."
    ],
    bullets: ["Combinação de itens", "Validade configurável", "Controle de utilizações", "Comissão e disponibilidade no aplicativo"]
  },
  {
    id: "gestao-estoque", title: "Gestão de Estoque", icon: ShoppingBag,
    intro: "Controle produtos de uso interno e de venda sem perder dinheiro.",
    paragraphs: [
      "Registre entradas, saídas, custos, fornecedores, lotes e vencimentos.",
      "Receba alertas de estoque baixo e acompanhe o valor financeiro do inventário."
    ],
    bullets: ["Saldo por produto", "Histórico de movimentações", "Custo, venda e lucro", "Estoque mínimo e validade", "Inventário financeiro"]
  },
  {
    id: "comandas", title: "Comandas e Controle de Consumo", icon: WalletCards,
    intro: "Registre tudo o que o cliente consome durante o atendimento.",
    paragraphs: [
      "O agendamento pode originar uma comanda com o serviço contratado. Outros serviços e produtos podem ser incluídos durante o atendimento.",
      "Também é possível abrir comandas avulsas, conceder descontos e definir pagamentos."
    ],
    bullets: ["Serviços e produtos", "Comanda vinculada ao agendamento", "Descontos e cortesias", "Parcelamento e múltiplos pagamentos"]
  },
  {
    id: "online-24h", title: "On-line 24 horas por dia", icon: Globe2,
    intro: "Sua barbearia fica disponível mesmo quando as portas estão fechadas.",
    paragraphs: [
      "O cliente pode consultar serviços e agendar a qualquer momento pelo celular ou computador.",
      "O gestor acompanha a operação remotamente, com informações centralizadas e seguras."
    ],
    bullets: ["Agendamento fora do horário comercial", "Acesso remoto", "Experiência responsiva", "Dados centralizados"]
  },
  {
    id: "lista-espera", title: "Lista de Espera", icon: ListChecks,
    intro: "Não perca oportunidades quando a agenda estiver cheia.",
    paragraphs: [
      "O cliente entra na lista de um dia ou serviço e pode ser avisado quando surgir uma vaga.",
      "A barbearia reduz horários vazios provocados por cancelamentos e mantém a fila organizada."
    ],
    bullets: ["Preferência de data e profissional", "Aviso de disponibilidade", "Histórico da lista", "Conversão em agendamento"]
  },
  {
    id: "mensagens-retorno", title: "Mensagens de Retorno Automáticas", icon: Clock3,
    intro: "Convide o cliente a retornar no momento ideal para cada serviço.",
    paragraphs: [
      "Defina o prazo de retorno de um corte, barba ou procedimento e personalize a mensagem.",
      "No dia previsto, o sistema prepara ou envia a comunicação pelo canal configurado."
    ],
    bullets: ["Prazo por serviço", "Modelos de mensagem", "Segmentação por profissional", "Histórico de comunicações"]
  },
  {
    id: "pesquisa-satisfacao", title: "Pesquisa de Satisfação", icon: Star,
    intro: "Meça a experiência do cliente depois de cada atendimento.",
    paragraphs: [
      "Após a conclusão do serviço, o cliente recebe uma pesquisa com opções de avaliação.",
      "As respostas ajudam a identificar pontos fortes e situações que precisam de atenção."
    ],
    bullets: ["Envio pós-atendimento", "Período de ativação", "Avaliação por serviço e profissional", "Consulta das respostas"]
  },
  {
    id: "clube-clientes", title: "Clube de Clientes", icon: Users,
    intro: "Crie vantagens exclusivas para grupos de clientes.",
    paragraphs: [
      "Associe clientes a clubes e ofereça descontos especiais em produtos ou serviços.",
      "As regras podem ser aplicadas automaticamente durante o agendamento e fechamento da comanda."
    ],
    bullets: ["Grupos de membros", "Descontos por item", "Aplicação automática", "Benefícios e cortesias"]
  },
  {
    id: "site-estabelecimento", title: "Site do Estabelecimento", icon: Globe2,
    intro: "Apresente sua barbearia e permita agendamentos pela internet.",
    paragraphs: [
      "Personalize nome, cores, fotos, horários, localização, formas de pagamento, serviços e profissionais.",
      "Novos clientes encontram as informações necessárias e seguem direto para o agendamento."
    ],
    bullets: ["Identidade personalizável", "Serviços e profissionais", "Contato e localização", "Agendamento integrado"]
  },
  {
    id: "agendamento-site-social", title: "Agendar pelo Site ou Redes Sociais", icon: Facebook,
    intro: "Leve o agendamento para os canais onde seus clientes já estão.",
    paragraphs: [
      "Compartilhe o endereço de agendamento em seu site, redes sociais, campanhas e perfil comercial.",
      "O cliente escolhe serviço, profissional, data e horário sem precisar telefonar."
    ],
    bullets: ["Link de agendamento", "Integração com site", "Compartilhamento social", "Fluxo responsivo"]
  },
  {
    id: "aniversariantes", title: "Aniversariantes", icon: Gift,
    intro: "Lembre datas importantes e fortaleça o relacionamento.",
    paragraphs: [
      "O painel identifica clientes aniversariantes para envio de mensagens ou benefícios especiais.",
      "Crie campanhas de aniversário e acompanhe os contatos realizados."
    ],
    bullets: ["Lista automática", "Mensagem personalizada", "Cupom ou benefício", "Histórico de contato"]
  },
  {
    id: "pagamento-online", title: "Pagamento On-line", icon: CreditCard,
    intro: "Ofereça praticidade ao cliente e mais segurança ao recebimento.",
    paragraphs: [
      "Serviços, produtos, pacotes e assinaturas podem ser pagos por meios digitais.",
      "O pagamento antecipado reduz faltas e facilita a aplicação de políticas de cancelamento."
    ],
    bullets: ["Pagamento antecipado", "Produtos e serviços", "Registro de transação", "Conciliação financeira"]
  },
  {
    id: "rede-social", title: "Conteúdo e Rede Social", icon: Share2,
    intro: "Divulgue resultados, novidades e momentos da barbearia.",
    paragraphs: [
      "Publique conteúdos para clientes e facilite o compartilhamento de promoções e transformações.",
      "A comunicação integrada amplia o alcance da marca e aproxima a comunidade."
    ],
    bullets: ["Publicações e novidades", "Antes e depois", "Promoções compartilháveis", "Relacionamento com clientes"]
  },
  {
    id: "programa-fidelidade", title: "Programa de Fidelidade", icon: Gift,
    intro: "Recompense a frequência e transforme consumo em benefícios.",
    paragraphs: [
      "Defina quantos pontos cada serviço ou produto gera e quais itens podem ser resgatados.",
      "O cliente acompanha o extrato e solicita recompensas pela área do cliente."
    ],
    bullets: ["Pontos por consumo", "Validade de pontos", "Catálogo de recompensas", "Extrato e resgates"]
  },
  {
    id: "comissoes-profissionais", title: "Comissões, Vales e Consumo Profissional", icon: UserRound,
    intro: "Faça o fechamento da equipe com clareza e transparência.",
    paragraphs: [
      "Configure comissão por serviço, produto, pacote ou assinatura e registre vales e adiantamentos.",
      "As comandas de consumo profissional e deduções entram no extrato para calcular o saldo."
    ],
    bullets: ["Comissão por item", "Vales e adiantamentos", "Consumo profissional", "Extrato, recibo e pagamento"]
  }
];

export function FeaturesPage() {
  useEffect(() => {
    if (window.location.hash) {
      window.setTimeout(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, []);

  return <div className="features-page">
    <header className="features-header">
      <a className="logo" href="/"><span><Scissors /></span><strong>DEVELOPER BARBER</strong></a>
      <nav>
        <a className="current" href="/">INÍCIO</a>
        <a className="free-trial" href="/#cadastro">TESTE GRÁTIS</a>
        <a href="/blog">BLOG</a>
        <a href="http://localhost:3333/login">ACESSAR</a>
        <a className="features-client" href="http://localhost:3333/login?perfil=cliente">SOU CLIENTE</a>
      </nav>
    </header>

    <h1 className="features-page-title">Funcionalidades do Developer Barber</h1>

    <main className="feature-details">
      {details.map(({ id, title, icon: Icon, intro, paragraphs, bullets }, index) =>
        <section id={id} className={`feature-detail ${index % 2 ? "alternate" : ""}`} key={id}>
          <div className="feature-detail-number">{String(index + 1).padStart(2, "0")}</div>
          <div className="feature-detail-icon"><Icon size={42} /></div>
          <div className="feature-detail-content">
            <span>FUNCIONALIDADE</span><h2>{title}</h2><h3>{intro}</h3>
            {paragraphs.map((text) => <p key={text}>{text}</p>)}
            {bullets && <ul>{bullets.map((item) => <li key={item}><Check />{item}</li>)}</ul>}
          </div>
        </section>
      )}
    </main>

    <section className="features-cta">
      <h2>Pronto para organizar sua barbearia?</h2>
      <p>Experimente todos os recursos do Developer Barber.</p>
      <a href="/#cadastro">CADASTRE-SE AGORA</a>
    </section>
    <footer className="blog-footer"><span>© 2026 DEVELOPER BARBER</span><a href="/">Voltar ao site</a></footer>
  </div>;
}
