import { AlertTriangle, CalendarCheck, CircleDollarSign, Scissors, Users, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, dateTime, money } from "../lib/api";
import { Badge, PageHeader, Spinner } from "../components/ui";

type DashboardData = {
  stats: { appointmentsToday: number; clients: number; revenueMonth: number; openCommands: number; lowStock: number };
  nextAppointments: any[];
  cashFlow: { day: string; income: number; expense: number }[];
  popularServices: { name: string; total: number }[];
};

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => { api<DashboardData>("/dashboard").then(setData); }, []);
  if (!data) return <Spinner />;
  const cards = [
    ["Agendamentos hoje", data.stats.appointmentsToday, CalendarCheck, "gold"],
    ["Clientes cadastrados", data.stats.clients, Users, "blue"],
    ["Receita no mês", money(data.stats.revenueMonth), CircleDollarSign, "green"],
    ["Comandas abertas", data.stats.openCommands, WalletCards, "purple"]
  ] as const;
  return <>
    <PageHeader title="Visão geral" description={`Bom trabalho. Aqui está o pulso da sua barbearia hoje.`} />
    <section className="stat-grid">
      {cards.map(([label, value, Icon, tone]) => <article className="stat-card" key={label}><div className={`stat-icon ${tone}`}><Icon /></div><div><span>{label}</span><strong>{value}</strong></div></article>)}
    </section>
    {data.stats.lowStock > 0 && <div className="alert-strip"><AlertTriangle size={19} /><strong>{data.stats.lowStock} produto(s) com estoque baixo.</strong><span>Revise a reposição para não interromper as vendas.</span></div>}
    <section className="dashboard-grid">
      <article className="panel chart-panel">
        <header><div><h2>Fluxo financeiro</h2><p>Entradas e saídas recentes</p></div></header>
        <ResponsiveContainer width="100%" height={270}>
          <AreaChart data={data.cashFlow}><defs><linearGradient id="income" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c9a96e" stopOpacity={.35}/><stop offset="95%" stopColor="#c9a96e" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e6e1" /><XAxis dataKey="day" tickFormatter={(v) => v.slice(5)} /><YAxis /><Tooltip formatter={(v) => money(Number(v))} /><Area type="monotone" dataKey="income" stroke="#b28a46" fill="url(#income)" strokeWidth={2.5} /><Area type="monotone" dataKey="expense" stroke="#a15c5c" fill="transparent" strokeWidth={2} /></AreaChart>
        </ResponsiveContainer>
      </article>
      <article className="panel">
        <header><div><h2>Serviços mais procurados</h2><p>Ranking de agendamentos</p></div></header>
        <div className="ranking">{data.popularServices.map((item, index) => <div key={item.name}><span className="rank">{index + 1}</span><Scissors size={17} /><strong>{item.name}</strong><Badge tone="gold">{item.total}</Badge></div>)}</div>
      </article>
    </section>
    <article className="panel">
      <header><div><h2>Próximos atendimentos</h2><p>Agenda futura confirmada e pendente</p></div></header>
      <div className="table-wrap"><table><thead><tr><th>Horário</th><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Status</th><th>Valor</th></tr></thead><tbody>
        {data.nextAppointments.map((item) => <tr key={item.id}><td><strong>{dateTime(item.starts_at)}</strong></td><td>{item.client_name}</td><td>{item.service_name}</td><td>{item.professional_name}</td><td><Badge tone={item.status === "confirmed" ? "green" : "gold"}>{item.status === "confirmed" ? "Confirmado" : "Agendado"}</Badge></td><td>{money(item.price)}</td></tr>)}
      </tbody></table></div>
    </article>
  </>;
}
