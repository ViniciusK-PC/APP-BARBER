import { Check, Palette } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Field, PageHeader, Spinner } from "../components/ui";

export function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { api("/settings/business").then(setSettings); }, []);
  if (!settings) return <Spinner />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const result = await api("/settings/business", { method: "PUT", body: JSON.stringify(values) });
    setSettings(result); setSaved(true); setTimeout(() => setSaved(false), 2500);
  }
  return <>
    <PageHeader title="Aparência e empresa" description="Personalize a identidade que seus clientes verão." />
    <section className="settings-layout">
      <form className="panel form-grid" onSubmit={submit}>
        <header className="full-span"><div><h2>Identidade da barbearia</h2><p>Nome, contato e cor principal.</p></div></header>
        <Field label="Nome da barbearia"><input name="name" defaultValue={settings.name} required /></Field>
        <Field label="Slogan"><input name="slogan" defaultValue={settings.slogan} /></Field>
        <Field label="Telefone"><input name="phone" defaultValue={settings.phone} /></Field>
        <Field label="Endereço"><input name="address" defaultValue={settings.address} /></Field>
        <Field label="Cor principal"><input name="primaryColor" type="color" defaultValue={settings.primaryColor} /></Field>
        <div className="full-span"><button className="button primary">{saved ? <><Check size={18}/> Salvo</> : "Salvar alterações"}</button></div>
      </form>
      <article className="preview-card" style={{ "--brand-color": settings.primaryColor } as React.CSSProperties}>
        <span className="eyebrow"><Palette size={14}/> Prévia do cliente</span>
        <div className="preview-hero"><small>BEM-VINDO À</small><h2>{settings.name}</h2><p>{settings.slogan}</p><button>Agendar horário</button></div>
        <div className="preview-info"><span>{settings.address}</span><strong>{settings.phone}</strong></div>
      </article>
    </section>
  </>;
}
