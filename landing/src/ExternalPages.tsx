import { ArrowLeft, BookOpen, CheckCircle2, FileText, HelpCircle, Mail, Scissors, Search, Store, Users } from "lucide-react";
import { FormEvent, useState } from "react";

const interestConfig = {
  "/interesse/modulo-fiscal": {
    eyebrow: "INTERESSE",
    title: "Módulo Fiscal Developer Barber",
    description: "Preencha os dados abaixo para receber mais informações sobre emissão fiscal integrada.",
    kind: "fiscal"
  },
  "/interesse/aplicativo-proprio": {
    eyebrow: "PLANO PRIME",
    title: "Aplicativo Próprio — Developer Barber",
    description: "Solicite uma apresentação do aplicativo personalizado com a identidade da sua barbearia.",
    kind: "app"
  },
  "/interesse/revenda": {
    eyebrow: "PARCERIA",
    title: "Seja um Revendedor Developer Barber",
    description: "Cadastre sua empresa para conhecer nosso programa de parceiros e revendedores.",
    kind: "reseller"
  }
} as const;

const states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

function Brand() {
  return <a className="external-brand" href="/"><span><Scissors /></span><strong>DEVELOPER BARBER</strong></a>;
}

export function InterestPage() {
  const config = interestConfig[window.location.pathname as keyof typeof interestConfig] ?? interestConfig["/interesse/modulo-fiscal"];
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return <main className="external-page">
    <section className="external-side">
      <Brand />
      <div>
        <span>{config.eyebrow}</span>
        <h1>{config.title}</h1>
        <p>{config.description}</p>
        <ul>
          <li><CheckCircle2 /> Atendimento especializado</li>
          <li><CheckCircle2 /> Implantação acompanhada</li>
          <li><CheckCircle2 /> Integração com a gestão Developer Barber</li>
        </ul>
      </div>
      <a className="external-back" href="/"><ArrowLeft /> Voltar para o site</a>
    </section>

    <section className="external-form-panel">
      {sent ? <div className="form-success">
        <CheckCircle2 />
        <h2>Solicitação recebida!</h2>
        <p>Nossa equipe entrará em contato pelos dados informados.</p>
        <button onClick={() => setSent(false)}>ENVIAR OUTRA SOLICITAÇÃO</button>
      </div> : <>
        <div className="external-form-title">
          <span>FALE COM NOSSA EQUIPE</span>
          <h2>Preencha os dados abaixo</h2>
          <p>Todos os campos marcados são necessários para o atendimento.</p>
        </div>
        <form className="interest-form" onSubmit={submit}>
          <label>Empresa<input name="empresa" required /></label>
          <label>CNPJ<input name="cnpj" inputMode="numeric" required /></label>
          <label>Nome para contato<input name="nome" required /></label>
          <label>Celular para contato<input name="celular" type="tel" required /></label>
          <label>E-mail<input name="email" type="email" required /></label>
          <label>Cidade<input name="cidade" required /></label>
          <label className="full-field">Estado<select name="estado" defaultValue="" required><option value="" disabled>Selecione o estado</option>{states.map(state => <option key={state}>{state}</option>)}</select></label>
          {config.kind === "fiscal" && <fieldset className="full-field interest-options">
            <legend>Interesse em:</legend>
            <label><input type="checkbox" name="interesse" value="servicos" /> Serviços</label>
            <label><input type="checkbox" name="interesse" value="produtos" /> Produtos</label>
            <label><input type="checkbox" name="interesse" value="salao-parceiro" /> Salão Parceiro</label>
          </fieldset>}
          <button className="external-submit" type="submit">ENVIAR</button>
        </form>
      </>}
    </section>
  </main>;
}

const helpItems = [
  [BookOpen, "Primeiros passos", "Aprenda a configurar sua barbearia e realizar os cadastros iniciais."],
  [FileText, "Agenda e atendimentos", "Veja como criar horários, bloquear períodos e controlar a agenda."],
  [Users, "Clientes e profissionais", "Gerencie sua equipe, permissões e a base de clientes."],
  [Store, "Produtos e serviços", "Cadastre serviços, produtos, pacotes e controle seu estoque."],
  [HelpCircle, "Dúvidas frequentes", "Encontre respostas rápidas sobre planos, acesso e funcionalidades."],
  [Mail, "Fale com o suporte", "Entre em contato com a equipe Developer Barber para receber ajuda."]
] as const;

export function HelpCenterPage() {
  const [query, setQuery] = useState("");
  const filtered = helpItems.filter(([, title, text]) => `${title} ${text}`.toLowerCase().includes(query.toLowerCase()));

  return <main className="help-page">
    <header className="help-header">
      <Brand />
      <a href="/">VOLTAR AO SITE</a>
    </header>
    <section className="help-hero">
      <span>CENTRAL DE AJUDA</span>
      <h1>Olá, como podemos ajudar?</h1>
      <label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Pesquise uma dúvida ou assunto..." /></label>
    </section>
    <section className="help-content">
      <h2>Encontre a ajuda que precisa</h2>
      <div className="help-grid">{filtered.map(([Icon, title, text]) => <article key={title}>
        <span><Icon /></span><h3>{title}</h3><p>{text}</p><a href={title === "Fale com o suporte" ? "mailto:contato@meubarber.app" : "/funcionalidades"}>VER CONTEÚDO</a>
      </article>)}</div>
      {!filtered.length && <p className="help-empty">Nenhum conteúdo encontrado para sua pesquisa.</p>}
    </section>
  </main>;
}
