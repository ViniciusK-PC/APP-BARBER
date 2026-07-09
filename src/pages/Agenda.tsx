import { ChevronLeft, ChevronRight, Package, Plus, Printer, RefreshCw, X } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { api, money } from "../lib/api";
import { Field, Modal, Spinner } from "../components/ui";

type ViewMode = "dia" | "semana" | "mes";
type SidePanel = "disponiveis" | "agendamentos" | "espera" | null;
type CalendarItem = { id: string; rawId?: number; date: string; start: number; end: number; client: string; service: string; professional: string; price?: number; status: string };

const slotMinutes = 15;
const dayStart = 7 * 60;
const dayEnd = 21 * 60;
const slotHeight = 22;
const months = ["Janeiro", "Fevereiro", "MarÃ§o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const weekShort = ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"];
const weekLong = ["Domingo", "Segunda-feira", "TerÃ§a-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "SÃ¡bado"];

const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDaysLocal = (d: Date, days: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
const labelTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const longDate = (d: Date) => `${weekLong[d.getDay()]}, ${d.getDate()}/${months[d.getMonth()].slice(0, 3)}/${d.getFullYear()}`;
const sameDay = (a: Date, b: Date) => dateKey(a) === dateKey(b);
const slots = Array.from({ length: (dayEnd - dayStart) / slotMinutes }, (_, i) => dayStart + i * slotMinutes);

export function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("dia");
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [appointments, setAppointments] = useState<any[] | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [blockMode, setBlockMode] = useState(false);
  const [panel, setPanel] = useState<SidePanel>(null);
  const [modal, setModal] = useState<"appointment" | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    const from = dateKey(addDaysLocal(currentDate, -15));
    const to = dateKey(addDaysLocal(currentDate, 45));
    setAppointments(null);
    Promise.all([
      api<any[]>(`/appointments?from=${from}&to=${to}`),
      api<any[]>("/clients"),
      api<any[]>("/services"),
      api<any[]>("/professionals")
    ]).then(([a, c, s, p]) => {
      setAppointments(a);
      setClients(c);
      setServices(s);
      setProfessionals(p);
      setSelectedProfessional((old) => old || String(p[0]?.id || "1"));
    });
  }, [dateKey(currentDate)]);

  useEffect(load, [load]);

  const calendarItems = useMemo<CalendarItem[]>(() => {
    const loaded: CalendarItem[] = (appointments || []).map((item) => {
      const start = new Date(item.starts_at);
      const minutes = start.getHours() * 60 + start.getMinutes();
      return {
        id: String(item.id),
        rawId: item.id,
        date: item.starts_at.slice(0, 10),
        start: minutes,
        end: minutes + 45,
        client: item.client_name,
        service: item.service_name,
        professional: item.professional_name,
        price: item.price,
        status: item.status
      };
    });
    if (dateKey(currentDate) === dateKey(new Date())) {
      loaded.unshift({ id: "block-demo", date: dateKey(currentDate), start: 7 * 60, end: 9 * 60, client: "", service: "", professional: "", status: "bloqueio" });
    }
    return loaded;
  }, [appointments, dateKey(currentDate)]);

  const dayItems = calendarItems.filter((a) => a.date === dateKey(currentDate));
  const occupied = new Set<number>();
  dayItems.forEach((a) => { for (let m = a.start; m < a.end; m += slotMinutes) occupied.add(m); });
  const available = slots.filter((m) => !occupied.has(m));

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await api("/appointments", { method: "POST", body: JSON.stringify({
        clientId: values.clientId,
        professionalId: values.professionalId,
        serviceId: values.serviceId,
        startsAt: new Date(String(values.startsAt)).toISOString(),
        notes: values.notes
      }) });
      setModal(null);
      load();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao inserir encaixe."); }
  }

  async function advanceStatus(item: CalendarItem) {
    if (!item.rawId) return;
    const next = item.status === "scheduled" ? "confirmed" : item.status === "confirmed" ? "completed" : item.status;
    await api(`/appointments/${item.rawId}/status`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    load();
  }

  function navigate(dir: number) {
    if (view === "mes") setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1));
    else setCurrentDate(addDaysLocal(currentDate, view === "semana" ? 7 * dir : dir));
  }

  return <>
    <section className="pro-agenda"><div className="pro-toolbar">
        <button onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
        <button onClick={() => navigate(1)}><ChevronRight size={18} /></button>
        <button onClick={() => setCurrentDate(new Date())}>Hoje</button>
        <button className="encaixe" onClick={() => setModal("appointment")}><Plus size={15} /> Encaixe</button>
        <h1>{longDate(currentDate)}</h1>
        <div className="pro-view">{(["dia", "semana", "mes"] as ViewMode[]).map((item) => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item === "mes" ? "MÃªs" : item[0].toUpperCase() + item.slice(1)}</button>)}</div>
        <button onClick={() => window.print()}><Printer size={16} /></button>
        <button onClick={load}><RefreshCw size={16} /></button>
      </div>

      <div className="pro-body">
        <main className="pro-calendar">
          {!appointments ? <Spinner /> : <>
            {view === "dia" && <DayGrid items={dayItems} onSlot={() => setModal("appointment")} onItem={advanceStatus} />}
            {view === "semana" && <WeekGrid currentDate={currentDate} items={calendarItems} onSlot={() => setModal("appointment")} />}
            {view === "mes" && <MonthGrid currentDate={currentDate} items={calendarItems} onSelect={(d) => { setCurrentDate(d); setView("dia"); }} />}
            {panel && <ListPanel panel={panel} date={currentDate} items={dayItems} available={available} onClose={() => setPanel(null)} onItem={advanceStatus} />}
          </>}
        </main>

        <RightSide currentDate={currentDate} setDate={setCurrentDate} blockMode={blockMode} setBlockMode={setBlockMode} panel={panel} setPanel={setPanel} />
      </div>
      </section>

    {modal === "appointment" && <Modal title="Inserir Encaixe" onClose={() => setModal(null)}><form className="form-grid" onSubmit={create}>
      <Field label="Cliente"><select name="clientId" required><option value="">Selecione</option>{clients.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
      <Field label="ServiÃ§o"><select name="serviceId" required><option value="">Selecione</option>{services.map((x) => <option key={x.id} value={x.id}>{x.name} - {money(x.price)}</option>)}</select></Field>
      <Field label="Profissional"><select name="professionalId" required><option value="">Selecione</option>{professionals.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
      <Field label="Data e Hora"><input name="startsAt" type="datetime-local" required /></Field>
      <Field label="ObservaÃ§Ãµes"><textarea name="notes" rows={3} /></Field>
      {error && <div className="form-error full-span">{error}</div>}
      <footer className="modal-actions"><button type="button" className="button ghost" onClick={() => setModal(null)}>Cancelar</button><button className="button primary">Salvar Encaixe</button></footer>
    </form></Modal>}
  </>;
}

function DayGrid({ items, onSlot, onItem }: { items: CalendarItem[]; onSlot: () => void; onItem: (item: CalendarItem) => void }) {
  return <div className="day-grid">
    <div className="day-professional">1</div>
    <div className="day-track">
      <div className="time-col">{slots.map((m) => <div key={m} style={{ height: slotHeight }}>{labelTime(m)}</div>)}</div>
      <div className="slot-col">{slots.map((m, i) => <button key={m} onClick={onSlot} className={i % 4 === 0 ? "hour" : ""} style={{ height: slotHeight }} />)}
        {items.map((item) => <button key={item.id} className={`pro-event ${item.status}`} onClick={() => onItem(item)} style={{ top: ((item.start - dayStart) / slotMinutes) * slotHeight, height: Math.max(((item.end - item.start) / slotMinutes) * slotHeight, slotHeight) }}>
          <strong>{labelTime(item.start)} - {labelTime(item.end)}</strong>{item.status !== "bloqueio" && <span>{item.client} Â· {item.service}</span>}
        </button>)}
      </div>
    </div>
  </div>;
}

function WeekGrid({ currentDate, items, onSlot }: { currentDate: Date; items: CalendarItem[]; onSlot: () => void }) {
  const start = addDaysLocal(currentDate, -currentDate.getDay());
  const days = Array.from({ length: 7 }, (_, i) => addDaysLocal(start, i));
  return <div className="week-grid"><div className="week-head"><span />{days.map((d) => <b key={dateKey(d)}>{weekShort[d.getDay()]} {pad(d.getDate())}</b>)}</div>{slots.map((m) => <div className="week-row" key={m}><time>{labelTime(m)}</time>{days.map((d) => <button key={dateKey(d)} onClick={onSlot}>{items.filter((a) => a.date === dateKey(d) && a.start === m).map((a) => <span key={a.id}>{a.client || "Bloqueio"}</span>)}</button>)}</div>)}</div>;
}

function MonthGrid({ currentDate, items, onSelect }: { currentDate: Date; items: CalendarItem[]; onSelect: (d: Date) => void }) {
  const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const start = addDaysLocal(first, -first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => addDaysLocal(start, i));
  return <div className="month-grid">{weekShort.map((d) => <b key={d}>{d}</b>)}{days.map((d) => <button key={dateKey(d)} onClick={() => onSelect(d)} className={d.getMonth() === currentDate.getMonth() ? "" : "muted"}><strong>{d.getDate()}</strong><span>{items.filter((a) => a.date === dateKey(d)).length} ag.</span></button>)}</div>;
}

function RightSide({ currentDate, setDate, blockMode, setBlockMode, panel, setPanel }: { currentDate: Date; setDate: (d: Date) => void; blockMode: boolean; setBlockMode: (v: boolean) => void; panel: SidePanel; setPanel: (p: SidePanel) => void }) {
  const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const cells = Array.from({ length: 42 }, (_, i) => addDaysLocal(first, i - first.getDay()));
  const btn = (p: SidePanel, text: string, wait = false) => <button className={wait ? "wait" : ""} onClick={() => setPanel(panel === p ? null : p)}>{text}</button>;
  return <aside className="pro-right">
    <label><input type="checkbox" checked={blockMode} onChange={(e) => setBlockMode(e.target.checked)} /> <b>Bloquear HorÃ¡rio</b></label>
    <section className="mini-pro"><header><button onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>Â«</button><b>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</b><button onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>Â»</button></header><div>{weekShort.map((d) => <strong key={d}>{d}</strong>)}{cells.map((d, i) => <button key={i} className={`${sameDay(d, currentDate) ? "sel" : ""} ${d.getMonth() !== currentDate.getMonth() ? "muted" : ""}`} onClick={() => setDate(d)}>{d.getDate()}</button>)}</div><footer>Hoje</footer></section>
    <div className="right-buttons">{btn("disponiveis", "HorÃ¡rios disponÃ­veis")}{btn("agendamentos", "Lista de Agendamentos")}{btn("espera", "Lista de Espera", true)}</div>
    <button className="products"><Package size={16} /> Produtos / ServiÃ§os</button>
    <section className="legend-pro"><h3>Legenda</h3>{["Agendado", "Confirmado", "Atendido", "Faltou", "HorÃ¡rio bloqueado"].map((s) => <span key={s}><i />{s}</span>)}</section>
  </aside>;
}

function ListPanel({ panel, date, items, available, onClose, onItem }: { panel: Exclude<SidePanel, null>; date: Date; items: CalendarItem[]; available: number[]; onClose: () => void; onItem: (item: CalendarItem) => void }) {
  const title = panel === "disponiveis" ? "HorÃ¡rios disponÃ­veis" : panel === "agendamentos" ? "Lista de Agendamentos" : "Lista de Espera";
  return <section className="floating-list"><header><b>{title} - {longDate(date)}</b><button onClick={onClose}><X size={18} /></button></header>
    {panel === "disponiveis" && <div className="available-list">{available.map((m) => <span key={m}>{labelTime(m)}</span>)}</div>}
    {panel === "agendamentos" && <div className="appt-list">{items.map((a) => <button key={a.id} onClick={() => onItem(a)}><b>{labelTime(a.start)}-{labelTime(a.end)}</b><span>{a.client || "HorÃ¡rio bloqueado"} {a.service}</span></button>)}</div>}
    {panel === "espera" && <div className="appt-list"><p>Lista de espera vazia.</p></div>}
  </section>;
}

