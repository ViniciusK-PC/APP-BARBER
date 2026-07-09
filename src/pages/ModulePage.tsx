import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api, money } from "../lib/api";
import { Badge, Empty, Field, Modal, PageHeader, Spinner } from "../components/ui";

type FieldConfig = { key: string; label: string; type?: "text" | "number" | "date" | "time" | "textarea" | "select" | "money"; options?: string[] };
type ModuleConfig = { title: string; description: string; singular: string; fields: FieldConfig[]; columns?: string[] };

const commonStatus = ["Ativo", "Inativo"];
const configs: Record<string, ModuleConfig> = {
  pacotes: { title: "Meus Pacotes", description: "Crie pacotes com serviços, validade, comissão e disponibilidade no aplicativo.", singular: "Pacote", fields: [
    { key: "nome", label: "Nome do pacote" }, { key: "valor", label: "Valor", type: "money" }, { key: "validade", label: "Validade em dias", type: "number" },
    { key: "comissao", label: "Comissão (%)", type: "number" }, { key: "disponivelApp", label: "Disponível no aplicativo", type: "select", options: commonStatus }, { key: "observacao", label: "Observação", type: "textarea" }
  ]},
  "venda-pacotes": { title: "Venda de Pacotes", description: "Venda e acompanhe pacotes adquiridos pelos clientes.", singular: "Venda", fields: [
    { key: "cliente", label: "Cliente" }, { key: "pacote", label: "Pacote" }, { key: "valor", label: "Valor", type: "money" }, { key: "data", label: "Data da venda", type: "date" }, { key: "validade", label: "Validade", type: "date" }
  ]},
  categorias: simple("Categorias", "Organize serviços e produtos por categoria.", "Categoria", "Tipo", ["Serviço", "Produto", "Financeiro"]),
  "tipos-pagamento": simple("Tipos de Pagamento", "Cadastre dinheiro, PIX, cartões e outras formas de recebimento.", "Pagamento", "Taxa (%)"),
  "tipos-despesas": simple("Tipos de Despesas", "Classifique despesas operacionais e administrativas.", "Despesa", "Descrição"),
  "tipos-receitas": simple("Tipos de Receitas", "Classifique as fontes de receita.", "Receita", "Descrição"),
  "tipos-contas": simple("Contas", "Cadastre caixas, bancos e contas financeiras.", "Conta", "Saldo inicial"),
  equipamentos: simple("Equipamentos", "Controle equipamentos, patrimônio e manutenção.", "Equipamento", "Número de patrimônio"),
  fornecedores: { title:"Fornecedores",description:"Cadastre fornecedores e seus dados de contato.",singular:"Fornecedor",fields:[
    {key:"nome",label:"Razão social / Nome"},{key:"documento",label:"CNPJ / CPF"},{key:"telefone",label:"Telefone"},{key:"email",label:"E-mail"},{key:"cidade",label:"Cidade"}
  ]},
  "tipos-anamnese": simple("Tipos de Anamnese", "Defina modelos de avaliação e atendimento.", "Tipo de anamnese", "Descrição"),
  bandeiras: simple("Bandeiras", "Cadastre bandeiras e taxas de cartão.", "Bandeira", "Taxa (%)"),
  remuneracoes: simple("Remunerações", "Defina tipos de remuneração dos profissionais.", "Remuneração", "Descrição"),
  deducoes: simple("Deduções", "Cadastre descontos aplicáveis às contas profissionais.", "Dedução", "Percentual / Valor"),
  "mensagens-padrao": { title:"Mensagens Padrão",description:"Modelos reutilizáveis para confirmações, retornos e lembretes.",singular:"Mensagem",fields:[
    {key:"tipo",label:"Tipo",type:"select",options:["Confirmação","Lembrete","Retorno","Aniversário","Cancelamento"]},{key:"mensagem",label:"Mensagem",type:"textarea"}
  ]},
  transportadoras: { title:"Transportadoras",description:"Dados cadastrais para expedição de produtos.",singular:"Transportadora",fields:[
    {key:"descricao",label:"Descrição"},{key:"cnpj",label:"CNPJ"},{key:"inscricaoEstadual",label:"Inscrição estadual"},{key:"cidade",label:"Cidade"},{key:"estado",label:"Estado"}
  ]},
  "mensagens-usuarios": { title:"Mensagens para Usuários",description:"Envie comunicações internas para clientes e profissionais.",singular:"Mensagem",fields:[
    {key:"destinatarios",label:"Destinatários",type:"select",options:["Todos os clientes","Grupo de clientes","Profissionais","Cliente específico"]},{key:"assunto",label:"Assunto"},{key:"mensagem",label:"Mensagem",type:"textarea"}
  ]},
  noticias: { title:"Notícias e Promoções",description:"Publique novidades e ofertas no aplicativo dos clientes.",singular:"Publicação",fields:[
    {key:"titulo",label:"Título"},{key:"inicio",label:"Início",type:"date"},{key:"fim",label:"Fim",type:"date"},{key:"publico",label:"Público",type:"select",options:["Todos","Grupo","Clientes selecionados"]},{key:"conteudo",label:"Conteúdo",type:"textarea"}
  ]},
  "grupos-clientes": simple("Grupos de Clientes", "Segmente clientes para promoções e relacionamento.", "Grupo", "Descrição"),
  "pesquisa-satisfacao": { title:"Pesquisa de Satisfação",description:"Solicite uma avaliação após o serviço e acompanhe a experiência dos clientes.",singular:"Pesquisa",fields:[
    {key:"pergunta",label:"Pergunta",type:"textarea"},{key:"inicio",label:"Data inicial",type:"date"},{key:"fim",label:"Data final",type:"date"},{key:"envio",label:"Canal de envio",type:"select",options:["Aplicativo","WhatsApp","E-mail"]},{key:"habilitada",label:"Habilitada",type:"select",options:["Sim","Não"]}
  ]},
  lembretes: { title:"Lembretes",description:"Configure lembretes automáticos de horários e retornos.",singular:"Lembrete",fields:[
    {key:"tipo",label:"Tipo",type:"select",options:["Agendamento","Retorno","Aniversário","Pagamento"]},{key:"antecedencia",label:"Antecedência (horas)",type:"number"},{key:"canal",label:"Canal",type:"select",options:["Aplicativo","WhatsApp","E-mail","SMS"]},{key:"mensagem",label:"Mensagem",type:"textarea"}
  ]},
  "clube-clientes": { title:"Clube de Clientes",description:"Ofereça valores especiais em serviços e produtos para membros.",singular:"Clube",fields:[
    {key:"nome",label:"Nome do clube"},{key:"tipoItem",label:"Tipo do item",type:"select",options:["Serviço","Produto"]},{key:"item",label:"Serviço / Produto"},{key:"valorMembro",label:"Valor para membros",type:"money"},{key:"desconto",label:"Desconto (%)",type:"number"}
  ]},
  cupons: { title:"Cupons de Desconto",description:"Crie cupons com regras, período e limite de uso.",singular:"Cupom",fields:[
    {key:"codigo",label:"Código do cupom"},{key:"descricao",label:"Descrição"},{key:"desconto",label:"Desconto (%)",type:"number"},{key:"quantidade",label:"Quantidade por cliente",type:"number"},{key:"inicio",label:"Data inicial",type:"date"},{key:"fim",label:"Vencimento",type:"date"}
  ]},
  assinaturas: { title:"Planos de Assinatura",description:"Planos recorrentes com serviços, produtos e periodicidade.",singular:"Plano",fields:[
    {key:"descricao",label:"Descrição"},{key:"valor",label:"Valor total",type:"money"},{key:"periodicidade",label:"Periodicidade",type:"select",options:["Mensal","Trimestral","Semestral","Anual"]},{key:"vencimento",label:"Dia de vencimento",type:"number"},{key:"disponivel",label:"Disponível para venda",type:"select",options:commonStatus}
  ]},
  assinantes: { title:"Assinantes",description:"Gerencie clientes, planos, vencimentos e faturas.",singular:"Assinante",fields:[
    {key:"cliente",label:"Cliente"},{key:"plano",label:"Plano"},{key:"valor",label:"Valor",type:"money"},{key:"vencimento",label:"Vencimento",type:"date"},{key:"pagamento",label:"Pagamento",type:"select",options:["Pendente","Pago","Cancelado"]}
  ]},
  "historico-comandas": simple("Histórico de Comandas", "Consulte comandas finalizadas e canceladas.", "Comanda", "Cliente"),
  caixa: simple("Caixa", "Abertura, saldo, movimentações e fechamento de caixa.", "Caixa", "Valor inicial"),
  "entradas-saidas": simple("Entradas e Saídas", "Gerencie contas a pagar, receber e transferências.", "Movimentação", "Valor"),
  comissoes: simple("Comissões", "Calcule, confira e pague comissões profissionais.", "Comissão", "Profissional"),
  "contas-clientes": simple("Conta do Cliente", "Controle créditos, débitos e saldos de clientes.", "Lançamento", "Cliente"),
  "contas-profissionais": simple("Conta do Profissional", "Controle vales, créditos, débitos e saldos.", "Lançamento", "Profissional"),
  parametros: simple("Parâmetros", "Configure regras gerais da operação.", "Parâmetro", "Valor"),
  funcionamento: { title:"Funcionamento",description:"Horários da empresa e períodos de fechamento da agenda.",singular:"Período",fields:[
    {key:"descricao",label:"Descrição"},{key:"inicio",label:"Início",type:"date"},{key:"fim",label:"Fim",type:"date"},{key:"horarioInicio",label:"Horário inicial",type:"time"},{key:"horarioFim",label:"Horário final",type:"time"}
  ]},
  filas: simple("Fila e Lista de Espera", "Ordem de chegada, lista de espera e histórico.", "Entrada na fila", "Cliente"),
  documentos: simple("Anamnese e Documentos", "Formulários, termos e documentos de clientes e profissionais.", "Documento", "Tipo"),
  avaliacoes: simple("Avaliações e Restrições", "Comentários de clientes e restrições de agendamento.", "Registro", "Cliente"),
  acessos: simple("Acessos e Permissões", "Perfis para o painel e aplicativo profissional.", "Perfil", "Descrição"),
  alertas: { title:"Alertas",description:"Avisos administrativos com período de visibilidade.",singular:"Alerta",fields:[
    {key:"titulo",label:"Título"},{key:"descricao",label:"Descrição",type:"textarea"},{key:"visivelAte",label:"Visível até",type:"date"}
  ]},
  "rel-agendamentos": report("Relatório de Agendamentos", "Serviço, cliente, profissional, período, status e forma de pagamento."),
  "rel-clientes": report("Relatório de Clientes", "Retorno, inatividade, acesso e perfil dos clientes."),
  "rel-profissionais": report("Relatório de Profissionais", "Atendimentos, serviços, valores e desempenho profissional."),
  "rel-financeiro": report("Relatório Financeiro", "Recebimentos, despesas, taxas, bandeiras e demonstrativo mensal."),
  "rel-estoque": report("Relatório de Estoque", "Posição, movimentações, vendas, custos e lucro de produtos."),
  rankings: report("Rankings", "Serviços, produtos, clientes e profissionais mais relevantes.")
};

function simple(title: string, description: string, singular: string, secondary: string, options?: string[]): ModuleConfig {
  return { title, description, singular, fields: [
    { key:"descricao", label:singular }, { key:"detalhe", label:secondary, type:options ? "select" : "text", options }, { key:"observacao", label:"Observação", type:"textarea" }
  ]};
}
function report(title:string, description:string):ModuleConfig {
  return {title,description,singular:"Filtro salvo",fields:[
    {key:"nome",label:"Nome do filtro"},{key:"dataInicial",label:"Data inicial",type:"date"},{key:"dataFinal",label:"Data final",type:"date"},{key:"agrupamento",label:"Agrupamento",type:"select",options:["Dia","Semana","Mês","Profissional","Cliente"]}
  ]};
}

export function ModulePage() {
  const { slug = "" } = useParams();
  const config = configs[slug];
  const [rows,setRows]=useState<any[]|null>(null);
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState<any|null>(null);
  const [error,setError]=useState("");
  const load=()=>api<any[]>(`/modules/${slug}`).then(setRows);
  useEffect(()=>{void load();},[slug]);
  const filtered=useMemo(()=>(rows||[]).filter(row=>JSON.stringify(row).toLowerCase().includes(search.toLowerCase())),[rows,search]);
  if(!config)return <PageHeader title="Módulo não encontrado" description="Esta rota não possui configuração."/>;

  async function save(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setError("");
    const values=Object.fromEntries(new FormData(event.currentTarget));
    const title=String(values[config.fields[0].key]||config.singular);
    const body={title,data:values,status:String(values.status||"active")};
    try{
      await api(`/modules/${slug}${editing?`/${editing.id}`:""}`,{method:editing?"PUT":"POST",body:JSON.stringify(body)});
      setModal(false);setEditing(null);load();
    }catch(err){setError(err instanceof Error?err.message:"Erro ao salvar.");}
  }
  async function remove(id:number){
    await api(`/modules/${slug}/${id}`,{method:"DELETE"});load();
  }
  const display=(field:FieldConfig,value:any)=>{
    if(field.type==="money")return money(Number(value||0));
    return value||"—";
  };
  return <>
    <PageHeader title={config.title} description={config.description} action={<button className="button primary" onClick={()=>{setEditing(null);setModal(true)}}><Plus size={18}/> Adicionar {config.singular}</button>}/>
    <article className="panel">
      <div className="panel-tools"><label className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Procurar..."/></label><Badge>{filtered.length} registros</Badge></div>
      {!rows?<Spinner/>:filtered.length?<div className="table-wrap"><table><thead><tr>{config.fields.slice(0,4).map(f=><th key={f.key}>{f.label}</th>)}<th>Status</th><th>Ações</th></tr></thead><tbody>{filtered.map(row=><tr key={row.id}>{config.fields.slice(0,4).map(f=><td key={f.key}>{display(f,row.data[f.key])}</td>)}<td><Badge tone={row.status==="active"?"green":"neutral"}>{row.status==="active"?"Ativo":"Inativo"}</Badge></td><td className="row-actions"><button className="icon-button" onClick={()=>{setEditing(row);setModal(true)}}><Edit3 size={15}/></button><button className="icon-button danger" onClick={()=>remove(row.id)}><Trash2 size={15}/></button></td></tr>)}</tbody></table></div>:<Empty title={`Nenhum ${config.singular.toLowerCase()} cadastrado`} text={`Use “Adicionar ${config.singular}” para criar o primeiro registro.`}/>}
    </article>
    {modal&&<Modal title={`${editing?"Editar":"Novo"} ${config.singular}`} onClose={()=>{setModal(false);setEditing(null)}}><form className="form-grid" onSubmit={save}>
      {config.fields.map(field=><Field key={field.key} label={field.label}>{field.type==="textarea"?<textarea name={field.key} rows={4} defaultValue={editing?.data[field.key]||""}/>:field.type==="select"?<select name={field.key} defaultValue={editing?.data[field.key]||field.options?.[0]}>{field.options?.map(o=><option key={o}>{o}</option>)}</select>:<input name={field.key} type={field.type==="money"?"number":field.type||"text"} step={field.type==="money"?".01":undefined} defaultValue={editing?.data[field.key]||""} required={field===config.fields[0]}/>}</Field>)}
      <Field label="Status"><select name="status" defaultValue={editing?.status||"active"}><option value="active">Ativo</option><option value="inactive">Inativo</option><option value="pending">Pendente</option><option value="completed">Concluído</option></select></Field>
      {error&&<div className="form-error full-span">{error}</div>}
      <footer className="modal-actions"><button type="button" className="button ghost" onClick={()=>setModal(false)}>Cancelar</button><button className="button primary">Salvar</button></footer>
    </form></Modal>}
  </>;
}

export function Commands(){
  const [rows,setRows]=useState<any[]|null>(null);
  const [clients,setClients]=useState<any[]>([]);
  const [professionals,setProfessionals]=useState<any[]>([]);
  const [services,setServices]=useState<any[]>([]);
  const [products,setProducts]=useState<any[]>([]);
  const [modal,setModal]=useState<"command"|"item"|null>(null);
  const [selected,setSelected]=useState<any|null>(null);
  const load=()=>Promise.all([api<any[]>("/commands"),api<any[]>("/clients"),api<any[]>("/professionals"),api<any[]>("/services"),api<any[]>("/products")]).then(([r,c,p,s,pr])=>{setRows(r);setClients(c);setProfessionals(p);setServices(s);setProducts(pr)});
  useEffect(()=>{void load()},[]);
  async function create(e:FormEvent<HTMLFormElement>){e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget));await api("/commands",{method:"POST",body:JSON.stringify(v)});setModal(null);load()}
  async function addItem(e:FormEvent<HTMLFormElement>){e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget));await api(`/commands/${selected.id}/items`,{method:"POST",body:JSON.stringify(v)});setModal(null);load()}
  async function close(id:number){await api(`/commands/${id}/close`,{method:"PATCH",body:JSON.stringify({method:"PIX"})});load()}
  return <><PageHeader title="Comandas abertas" description="Consumo, serviços, produtos e fechamento de atendimento." action={<button className="button primary" onClick={()=>setModal("command")}><Plus size={18}/> Nova comanda</button>}/>
    <article className="panel">{!rows?<Spinner/>:rows.length?<div className="table-wrap"><table><thead><tr><th>Comanda</th><th>Cliente</th><th>Profissional</th><th>Abertura</th><th>Status</th><th>Total</th><th>Ações</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td>#{row.id}</td><td>{row.client_name}</td><td>{row.professional_name}</td><td>{new Date(row.opened_at+"Z").toLocaleString("pt-BR")}</td><td><Badge tone={row.status==="open"?"gold":"green"}>{row.status==="open"?"Aberta":"Paga"}</Badge></td><td>{money(row.calculated_total)}</td><td className="command-actions">{row.status==="open"&&<><button className="button small" onClick={()=>{setSelected(row);setModal("item")}}>Adicionar item</button><button className="button small primary" onClick={()=>close(row.id)}>Fechar no PIX</button></>}</td></tr>)}</tbody></table></div>:<Empty title="Nenhuma comanda" text="Abra uma comanda para iniciar um atendimento."/ >}</article>
    {modal==="command"&&<Modal title="Nova comanda" onClose={()=>setModal(null)}><form className="form-grid" onSubmit={create}><Field label="Cliente"><select name="clientId" required><option value="">Selecione</option>{clients.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></Field><Field label="Profissional"><select name="professionalId" required><option value="">Selecione</option>{professionals.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></Field><Field label="Observações"><textarea name="notes"/></Field><footer className="modal-actions"><button className="button primary">Abrir comanda</button></footer></form></Modal>}
    {modal==="item"&&<Modal title={`Adicionar item à comanda #${selected?.id}`} onClose={()=>setModal(null)}><form className="form-grid" onSubmit={addItem}><Field label="Tipo"><select name="itemType" defaultValue="service"><option value="service">Serviço</option><option value="product">Produto</option></select></Field><Field label="Serviço / Produto"><select name="itemId" required><optgroup label="Serviços">{services.map(x=><option key={`s${x.id}`} value={x.id}>{x.name} — {money(x.price)}</option>)}</optgroup><optgroup label="Produtos">{products.map(x=><option key={`p${x.id}`} value={x.id}>{x.name} — {money(x.price)}</option>)}</optgroup></select></Field><Field label="Quantidade"><input name="quantity" type="number" min="1" defaultValue="1"/></Field><Field label="Profissional"><select name="professionalId"><option value="">Sem comissão</option>{professionals.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></Field><footer className="modal-actions"><button className="button primary">Adicionar</button></footer></form></Modal>}
  </>;
}
export function Reports(){return <><PageHeader title="Relatórios" description="Indicadores para decisões rápidas e seguras."/><section className="report-grid">{["Faturamento","Agendamentos","Clientes ativos","Ticket médio","Serviços","Estoque"].map((x,i)=><article className="panel" key={x}><span>INDICADOR {String(i+1).padStart(2,"0")}</span><h2>{x}</h2><p>Filtros por período, profissional e status.</p></article>)}</section></>}
