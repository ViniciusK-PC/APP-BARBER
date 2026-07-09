import { X } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="page-header">
    <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {action}
  </div>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Empty({ title, text }: { title: string; text: string }) {
  return <div className="empty"><div className="empty-mark">B</div><h3>{title}</h3><p>{text}</p></div>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose(): void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
      <header><h2>{title}</h2><button className="icon-button" onClick={onClose}><X size={20} /></button></header>
      {children}
    </section>
  </div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export function Spinner() {
  return <div className="spinner" aria-label="Carregando" />;
}
