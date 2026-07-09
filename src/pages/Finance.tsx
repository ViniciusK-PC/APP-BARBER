import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { api, money } from "../lib/api";
import { Badge, Field, Modal, PageHeader, Spinner } from "../components/ui";

export function Finance() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [modal, setModal] = useState(false);
  const load = () => api<any[]>("/finance").then(setRows);
  useEffect(() => { void load(); }, []);
  const summary = useMemo(() => (rows || []).reduce((acc, row) => {
    acc[row.type] += row.amount; return acc;
  }, { income: 0, expense: 0 } as Record<string, number>), [rows]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    await api("/finance", { method: "POST", body: JSON.stringify(body) }); setModal(false); load();
  }
  return <>
    <PageHeader title="Financeiro" description="Fluxo de caixa, contas a pagar e receber." action={<button className="button primary" onClick={() => setModal(true)}><Plus size={18}/> Movimentação</button>} />
    <section className="finance-summary">
      <article><span>Entradas</span><strong className="positive">{money(summary.income)}</strong><ArrowUpRight /></article>
      <article><span>Saídas</span><strong className="negative">{money(summary.expense)}</strong><ArrowDownRight /></article>
      <article><span>Saldo</span><strong>{money(summary.income - summary.expense)}</strong></article>
    </section>
    <article className="panel"><header><div><h2>Movimentações</h2><p>Histórico financeiro completo</p></div></header>
      {!rows ? <Spinner /> : <div className="table-wrap"><table><thead><tr><th>Tipo</th><th>Descrição</th><th>Categoria</th><th>Status</th><th>Valor</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><Badge tone={row.type === "income" ? "green" : "red"}>{row.type === "income" ? "Entrada" : "Saída"}</Badge></td><td><strong>{row.description}</strong></td><td>{row.category}</td><td>{row.status === "paid" ? "Pago" : "Pendente"}</td><td className={row.type === "income" ? "positive" : "negative"}>{money(row.amount)}</td></tr>)}</tbody></table></div>}
    </article>
    {modal && <Modal title="Nova movimentação" onClose={() => setModal(false)}><form className="form-grid" onSubmit={create}>
      <Field label="Tipo"><select name="type"><option value="income">Entrada</option><option value="expense">Saída</option></select></Field>
      <Field label="Categoria"><input name="category" required /></Field><Field label="Descrição"><input name="description" required /></Field>
      <Field label="Valor"><input name="amount" type="number" step=".01" required /></Field><Field label="Vencimento"><input name="dueDate" type="date" /></Field>
      <Field label="Status"><select name="status"><option value="paid">Pago</option><option value="pending">Pendente</option></select></Field>
      <footer className="modal-actions"><button type="button" className="button ghost" onClick={() => setModal(false)}>Cancelar</button><button className="button primary">Salvar</button></footer>
    </form></Modal>}
  </>;
}
