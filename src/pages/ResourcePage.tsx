import { Plus, Search } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { api, money } from "../lib/api";
import { Badge, Empty, Field, Modal, PageHeader, Spinner } from "../components/ui";

const configs = {
  clientes: { title: "Clientes", description: "Cadastro, relacionamento, pontos e histórico.", endpoint: "/clients", columns: ["name", "phone", "email", "loyalty_points"], labels: ["Nome", "Celular", "E-mail", "Pontos"] },
  profissionais: { title: "Profissionais", description: "Equipe, comissões e disponibilidade.", endpoint: "/professionals", columns: ["name", "nickname", "email", "commission_rate"], labels: ["Nome", "Apelido", "E-mail", "Comissão"] },
  servicos: { title: "Serviços", description: "Catálogo, duração, preços e disponibilidade.", endpoint: "/services", columns: ["name", "duration_minutes", "price", "category_name"], labels: ["Serviço", "Duração", "Valor", "Categoria"] },
  produtos: { title: "Produtos e estoque", description: "Venda, custo e controle de reposição.", endpoint: "/products", columns: ["name", "sku", "price", "stock"], labels: ["Produto", "SKU", "Valor", "Estoque"] },
  pacotes: { title: "Pacotes", description: "Crie pacotes de serviços para vender antecipadamente.", endpoint: "/packages", columns: ["name", "price", "services_count"], labels: ["Nome do Pacote", "Valor", "Qtd Serviços"] },
  fornecedores: { title: "Fornecedores", description: "Gestão de fornecedores de produtos e equipamentos.", endpoint: "/suppliers", columns: ["name", "cnpj", "phone"], labels: ["Razão Social", "CNPJ", "Telefone"] },
  formas_pagamento: { title: "Formas de Pagamento", description: "Tipos de pagamento aceitos no caixa.", endpoint: "/payment-methods", columns: ["name", "tax_rate", "days_to_receive"], labels: ["Descrição", "Taxa (%)", "Dias para Recebimento"] },
  categorias_financeiras: { title: "Categorias Financeiras", description: "Categorias para receitas e despesas.", endpoint: "/financial-categories", columns: ["name", "type"], labels: ["Descrição", "Tipo (Receita/Despesa)"] },
  cupons: { title: "Cupons de Desconto", description: "Códigos promocionais para fidelização.", endpoint: "/coupons", columns: ["code", "discount", "status"], labels: ["Código", "Desconto (%)", "Status"] },
  assinaturas: { title: "Planos de Assinatura", description: "Clubes e planos recorrentes.", endpoint: "/subscriptions", columns: ["name", "price", "billing_cycle"], labels: ["Plano", "Valor", "Ciclo"] },
  noticias: { title: "Notícias e Promoções", description: "Avisos enviados para os clientes.", endpoint: "/news", columns: ["title", "target", "status"], labels: ["Título", "Público Alvo", "Status"] },
  mensagens: { title: "Mensagens Automáticas", description: "Lembretes e mensagens de aniversário.", endpoint: "/messages", columns: ["type", "content"], labels: ["Tipo", "Mensagem"] },
} as const;

export function ResourcePage({ type }: { type: keyof typeof configs }) {
  const config = configs[type];
  const [rows, setRows] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const editable = type !== "profissionais";
  const load = () => api<any[]>(config.endpoint).then(setRows);
  useEffect(() => { void load(); }, [config.endpoint]);
  const filtered = useMemo(() => (rows || []).filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const render = (key: string, value: any, row: any) => {
    if (key === "price") return money(value);
    if (key === "duration_minutes") return `${value} min`;
    if (key === "commission_rate" || key === "tax_rate") return `${value}%`;
    if (key === "discount") return `${value}%`;
    if (key === "loyalty_points") return <Badge tone="gold">{value} pts</Badge>;
    if (key === "stock") return <Badge tone={value <= row.min_stock ? "red" : "green"}>{value} un.</Badge>;
    return value || "—";
  };

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const v = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (type === "clientes") await api("/clients", { method: "POST", body: JSON.stringify(v) });
      else if (type === "servicos") await api("/services", { method: "POST", body: JSON.stringify(v) });
      else if (type === "produtos") await api("/products", { method: "POST", body: JSON.stringify(v) });
      else await api(config.endpoint, { method: "POST", body: JSON.stringify(v) });
      setModal(false); load();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao salvar."); }
  }

  return <>
    <PageHeader title={config.title} description={config.description} action={editable && <button className="button primary" onClick={() => setModal(true)}><Plus size={18} /> Novo</button>} />
    <article className="panel">
      <div className="panel-tools"><label className="search"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar..." /></label><Badge>{filtered.length} registros</Badge></div>
      {!rows ? <Spinner /> : filtered.length ? <div className="table-wrap"><table><thead><tr>{config.labels.map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id}>{config.columns.map((key) => <td key={key}>{render(key, row[key], row)}</td>)}</tr>)}</tbody></table></div> : <Empty title="Nenhum registro" text="Cadastre o primeiro item para começar." />}
    </article>
    {modal && <Modal title={`Novo — ${config.title}`} onClose={() => setModal(false)}><form className="form-grid" onSubmit={create}>
      {["clientes", "profissionais", "servicos", "produtos", "pacotes", "fornecedores", "formas_pagamento", "categorias_financeiras", "assinaturas"].includes(type) && <Field label="Nome / Descrição"><input name="name" required /></Field>}
      {type === "cupons" && <Field label="Código do Cupom"><input name="code" required /></Field>}
      {type === "noticias" && <Field label="Título"><input name="title" required /></Field>}
      {type === "clientes" && <><Field label="Celular"><input name="phone" required /></Field><Field label="E-mail"><input name="email" type="email" /></Field><Field label="Observações"><textarea name="notes" /></Field></>}
      {type === "servicos" && <><Field label="Duração (min)"><input name="durationMinutes" type="number" min="5" required /></Field><Field label="Valor"><input name="price" type="number" step=".01" required /></Field><Field label="Descrição"><textarea name="description" /></Field></>}
      {type === "produtos" && <><Field label="SKU"><input name="sku" /></Field><Field label="Valor de venda"><input name="price" type="number" step=".01" required /></Field><Field label="Custo"><input name="cost" type="number" step=".01" /></Field><Field label="Estoque"><input name="stock" type="number" required /></Field><Field label="Estoque mínimo"><input name="minStock" type="number" /></Field><Field label="Descrição"><textarea name="description" /></Field></>}
      {type === "pacotes" && <><Field label="Valor"><input name="price" type="number" step=".01" required /></Field><Field label="Qtd de Serviços"><input name="servicesCount" type="number" required /></Field></>}
      {type === "fornecedores" && <><Field label="CNPJ"><input name="cnpj" /></Field><Field label="Telefone"><input name="phone" /></Field></>}
      {type === "formas_pagamento" && <><Field label="Taxa (%)"><input name="taxRate" type="number" step=".01" /></Field><Field label="Dias para receber"><input name="daysToReceive" type="number" /></Field></>}
      {type === "categorias_financeiras" && <Field label="Tipo"><select name="type"><option>Receita</option><option>Despesa</option></select></Field>}
      {type === "cupons" && <><Field label="Desconto (%)"><input name="discount" type="number" /></Field><Field label="Status"><select name="status"><option>Ativo</option><option>Inativo</option></select></Field></>}
      {type === "assinaturas" && <><Field label="Valor Mensal"><input name="price" type="number" step=".01" /></Field><Field label="Ciclo"><select name="billingCycle"><option>Mensal</option><option>Trimestral</option><option>Anual</option></select></Field></>}
      {type === "noticias" && <><Field label="Público Alvo"><select name="target"><option>Todos</option><option>Apenas Clientes</option></select></Field><Field label="Conteúdo"><textarea name="content" /></Field></>}
      {type === "mensagens" && <><Field label="Tipo"><select name="type"><option>Lembrete</option><option>Aniversário</option></select></Field><Field label="Conteúdo da Mensagem"><textarea name="content" required /></Field></>}
      {error && <div className="form-error full-span">{error}</div>}
      <footer className="modal-actions"><button type="button" className="button ghost" onClick={() => setModal(false)}>Cancelar</button><button className="button primary">Salvar</button></footer>
    </form></Modal>}
  </>;
}
