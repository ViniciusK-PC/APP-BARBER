import {
  ArrowLeft, ArrowRight, BarChart3, CalendarDays, Clock3, MessageCircle,
  Scissors, TrendingUp, Users
} from "lucide-react";

const posts = [
  {
    category: "GESTÃO",
    icon: CalendarDays,
    title: "Como organizar a agenda e reduzir horários vazios",
    excerpt: "Práticas para melhorar a ocupação, reduzir cancelamentos e dar previsibilidade à equipe.",
    date: "18 de junho de 2026",
    time: "6 min"
  },
  {
    category: "FIDELIZAÇÃO",
    icon: Users,
    title: "Estratégias para fazer o cliente voltar mais vezes",
    excerpt: "Relacionamento, lembretes e benefícios que fortalecem a recorrência na sua barbearia.",
    date: "12 de junho de 2026",
    time: "5 min"
  },
  {
    category: "FINANCEIRO",
    icon: BarChart3,
    title: "Indicadores essenciais para acompanhar sua barbearia",
    excerpt: "Entenda faturamento, ticket médio, custos e desempenho profissional sem complicação.",
    date: "5 de junho de 2026",
    time: "8 min"
  },
  {
    category: "CRESCIMENTO",
    icon: TrendingUp,
    title: "Como aumentar o faturamento sem perder qualidade",
    excerpt: "Descubra oportunidades em serviços, produtos, pacotes e experiência do cliente.",
    date: "29 de maio de 2026",
    time: "7 min"
  },
  {
    category: "ATENDIMENTO",
    icon: MessageCircle,
    title: "Comunicação que transforma clientes em promotores",
    excerpt: "Use mensagens, pesquisas e retornos no momento certo para criar proximidade.",
    date: "22 de maio de 2026",
    time: "4 min"
  },
  {
    category: "OPERAÇÃO",
    icon: Clock3,
    title: "Rotina eficiente: da abertura ao fechamento do caixa",
    excerpt: "Um fluxo simples para manter agenda, comandas, estoque e financeiro organizados.",
    date: "15 de maio de 2026",
    time: "9 min"
  }
];

export function BlogPage() {
  return <div className="blog-page">
    <header className="blog-header">
      <a className="logo" href="/"><span><Scissors /></span><strong>DEVELOPER BARBER</strong></a>
      <nav><a href="/">INÍCIO</a><a href="/#funcoes">FUNÇÕES</a><a href="/#precos">PREÇOS</a><a className="blog-current" href="/blog">BLOG</a><a className="free-trial" href="/#cadastro">TESTE GRÁTIS</a></nav>
    </header>

    <section className="blog-hero">
      <a href="/"><ArrowLeft /> Voltar para o site</a>
      <span>CONTEÚDO PARA BARBEARIAS</span>
      <h1>Blog Developer Barber</h1>
      <p>Gestão, atendimento e crescimento explicados de forma prática para quem vive a rotina da barbearia.</p>
    </section>

    <main className="blog-content">
      <div className="blog-featured">
        <div className="featured-art"><CalendarDays /></div>
        <div><span>DESTAQUE · GESTÃO</span><h2>Como organizar a agenda e reduzir horários vazios</h2><p>Uma agenda organizada melhora a experiência dos clientes, reduz ociosidade e dá mais previsibilidade ao faturamento. Veja como estruturar horários, confirmações e retornos.</p><small>18 de junho de 2026 · 6 minutos de leitura</small><a href="/#cadastro">Ler artigo <ArrowRight /></a></div>
      </div>

      <div className="blog-heading"><div><span>ARTIGOS RECENTES</span><h2>Conteúdo para melhorar sua operação</h2></div><p>Novas ideias para aplicar no dia a dia.</p></div>
      <div className="blog-posts">{posts.map(({ icon: Icon, ...post }) => <article key={post.title}>
        <div className="post-icon"><Icon /></div><span>{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p>
        <footer><small>{post.date} · {post.time}</small><a href="/#cadastro"><ArrowRight /></a></footer>
      </article>)}</div>
    </main>

    <section className="blog-cta"><h2>Quer organizar sua barbearia?</h2><p>Conheça o Developer Barber e transforme sua rotina.</p><a href="/#cadastro">COMEÇAR AGORA <ArrowRight /></a></section>
    <footer className="blog-footer"><span>© 2026 DEVELOPER BARBER</span><a href="/">Voltar ao site</a></footer>
  </div>;
}
