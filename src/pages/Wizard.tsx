import { ArrowLeft, ArrowRight, Check, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { City, Country, State } from "country-state-city";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Service = { id: number; name: string; price: string; duration: string };
type Professional = { id: number; name: string; phone: string };
type CountryOption = { name: string; flag: string; code: string };
type Option = { label: string; value: string; flag?: string };

const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const steps = ["Localização", "Segmentação", "Serviços", "Profissionais"];
const leads = ["Instagram", "Google", "Indicação"];
const flagFromCode = (code: string) => /^[A-Z]{2}$/.test(code.toUpperCase()) ? code.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0))) : "";
const countries: CountryOption[] = Country.getAllCountries().map(item => ({ name: item.name, flag: flagFromCode(item.isoCode), code: item.isoCode }));

let mapsPromise: Promise<void> | null = null;
const onlyNumbers = (value: string) => value.replace(/\D/g, "");
const cepMask = (value: string) => {
  const raw = onlyNumbers(value).slice(0, 8);
  return raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
};
const phoneMask = (value: string) => {
  const raw = onlyNumbers(value).slice(0, 11);
  if (raw.length <= 2) return raw;
  if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
  return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
};
const moneyMask = (value: string) => (Number(onlyNumbers(value) || 0) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function loadGoogleMaps() {
  if (!googleKey) return Promise.reject(new Error("Google Maps API key ausente."));
  if ((window as any).google?.maps?.places) return Promise.resolve();
  if (!mapsPromise) mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=places&language=pt-BR`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Não foi possível carregar Google Maps."));
    document.head.appendChild(script);
  });
  return mapsPromise;
}

function pickAddress(result: any) {
  const get = (type: string) => result.address_components?.find((item: any) => item.types.includes(type))?.long_name || "";
  const street = get("route");
  return {
    address: street || result.formatted_address || "",
    state: get("administrative_area_level_1"),
    city: get("administrative_area_level_2") || get("locality") || get("postal_town"),
    district: get("sublocality_level_1") || get("sublocality") || get("neighborhood")
  };
}

export function Wizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState("");
  const [finishing, setFinishing] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [openMenu, setOpenMenu] = useState<"country" | "state" | "city" | null>(null);
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [location, setLocation] = useState({ country: "Brazil", cep: "", address: "", state: "", city: "", district: "", number: "" });
  const [segment, setSegment] = useState({ cutPrice: "", lead: "", teamSize: "" });
  const [serviceForm, setServiceForm] = useState({ name: "", price: "", duration: "" });
  const [professionalForm, setProfessionalForm] = useState({ name: "", phone: "" });
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const completed = useMemo(() => steps.map((_, index) => index < step), [step]);
  const country = countries.find(item => item.name === location.country) || countries[0];

  useEffect(() => { loadGoogleMaps().then(() => setMapsReady(true)).catch(() => setMapsReady(false)); }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;
    localStorage.setItem("barbe_token", token);
    window.history.replaceState(null, "", "/wizard");
  }, []);
  useEffect(() => {
    setStateOptions(State.getStatesOfCountry(country.code).map(item => item.name));
  }, [country.code]);
  useEffect(() => {
    const state = State.getStatesOfCountry(country.code).find(item => item.name === location.state);
    setCityOptions(state ? City.getCitiesOfState(country.code, state.isoCode).map(item => item.name) : []);
  }, [country.code, location.state]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function searchPlaces(input: string, target: "state" | "city") {
    const google = (window as any).google;
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({
      input,
      componentRestrictions: { country: country.code.toLowerCase() },
      types: target === "state" ? ["administrative_area_level_1"] : ["(cities)"]
    }, (predictions: any[] | null) => {
      const values = [...new Set((predictions || []).map(item => item.structured_formatting?.main_text || item.description).filter(Boolean))].slice(0, 12);
      if (target === "state") setStateOptions(values);
      else setCityOptions(values);
    });
  }

  function updateCountry(name: string) {
    setLocation(current => ({ ...current, country: name, cep: "", address: "", state: "", city: "", district: "" }));
    setStateOptions([]);
    setCityOptions([]);
  }

  async function updateCep(value: string) {
    const cep = cepMask(value);
    setLocation(current => ({ ...current, cep }));
    if (onlyNumbers(cep).length < 8 || !mapsReady) return;
    const google = (window as any).google;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: `${cep}, ${location.country}`, componentRestrictions: { country: country.code.toLowerCase() } }, (results: any[] | null, status: string) => {
      if (status !== "OK" || !results?.[0]) return;
      setLocation(current => ({ ...current, ...pickAddress(results[0]) }));
    });
  }

  function next() {
    if (step === 0 && (!location.cep || !location.address || !location.state || !location.city || !location.district || !location.number)) return;
    if (step === 1 && (!segment.cutPrice || !segment.lead || !segment.teamSize)) return;
    if (step === 2 && services.length === 0) return;
    if (step < 3) setStep(step + 1);
  }

  function addService(event: FormEvent) {
    event.preventDefault();
    if (!serviceForm.name || !serviceForm.price || !serviceForm.duration) return;
    setServices(items => [...items, { id: Date.now(), ...serviceForm }]);
    setServiceForm({ name: "", price: "", duration: "" });
    showToast("Serviço cadastrado com sucesso");
  }

  function addProfessional(event: FormEvent) {
    event.preventDefault();
    if (!professionalForm.name || !professionalForm.phone) return;
    setProfessionals(items => [...items, { id: Date.now(), ...professionalForm }]);
    setProfessionalForm({ name: "", phone: "" });
    showToast("Dados cadastrados com sucesso");
  }

  function finishWizard() {
    setFinishing(true);
    window.setTimeout(() => navigate("/agenda", { replace: true }), 1200);
  }

  return <main className="wizard-page">
    <header className="wizard-head"><div><h1>Bem vindo ao DevBarber</h1><p>Complete o passo a passo inicial para acessar o sistema.</p></div></header>
    <section className="wizard-shell">
      <aside className="wizard-steps">{steps.map((label, index) => <button key={label} className={index === step ? "active" : completed[index] ? "done" : ""} onClick={() => index <= step && setStep(index)}><span>{completed[index] ? <Check size={18} /> : index + 1}</span>{label}</button>)}</aside>
      <article className="wizard-card">
        {step === 0 && <div className="wizard-content">
          <h2>Localização do Estabelecimento</h2>
          <FieldSelect label="País *" open={openMenu === "country"} onOpen={() => setOpenMenu(openMenu === "country" ? null : "country")} value={location.country} flag={country.flag} options={countries.map(item => ({ label: item.name, value: item.name, flag: item.flag }))} onPick={value => { updateCountry(value); setOpenMenu(null); }} full />
          <label>CEP/Código Postal *<input value={location.cep} onChange={e => updateCep(e.target.value)} placeholder="00000-000" autoComplete="postal-code" /></label>
          <label>Endereço *<input value={location.address} onChange={e => setLocation({ ...location, address: e.target.value })} autoComplete="address-line1" /></label>
          <FieldSelect label="Estado *" open={openMenu === "state"} onOpen={() => setOpenMenu(openMenu === "state" ? null : "state")} value={location.state} placeholder="Informe o Estado." options={stateOptions.map(item => ({ label: item, value: item }))} onPick={value => { setLocation({ ...location, state: value, city: "" }); setOpenMenu(null); }} />
          <FieldSelect label="Cidade *" open={openMenu === "city"} onOpen={() => setOpenMenu(openMenu === "city" ? null : "city")} value={location.city} placeholder="Informe a Cidade." options={cityOptions.map(item => ({ label: item, value: item }))} onPick={value => { setLocation({ ...location, city: value }); setOpenMenu(null); }} />
          <label>Bairro *<input value={location.district} onChange={e => setLocation({ ...location, district: e.target.value })} /></label>
          <label>Número do Endereço *<input value={location.number} onChange={e => setLocation({ ...location, number: onlyNumbers(e.target.value) })} inputMode="numeric" autoComplete="off" /></label>
        </div>}
        {step === 1 && <div className="wizard-content one-col">
          <h2>Segmentação do Estabelecimento</h2>
          <label>Valor do Corte<input value={segment.cutPrice} onChange={e => setSegment({ ...segment, cutPrice: moneyMask(e.target.value) })} placeholder="R$ 0,00" inputMode="decimal" /></label>
          <label>Como conheceu o DevBarber?<select value={segment.lead} onChange={e => setSegment({ ...segment, lead: e.target.value })}><option value="">Selecione uma origem</option>{leads.map(item => <option key={item}>{item}</option>)}</select></label>
          <div className="choice-group"><span>Número de Profissionais</span>{["1", "2 a 5", "6 a 15", "Mais de 15"].map(item => <button key={item} className={segment.teamSize === item ? "selected" : ""} onClick={() => setSegment({ ...segment, teamSize: item })}>{item}</button>)}<small>Incluindo gestores e recepcionistas, se houver.</small></div>
        </div>}
        {step === 2 && <div className="wizard-content one-col">
          <h2>Serviços</h2><form className="wizard-inline" onSubmit={addService}>
            <label>Nome do serviço *<input value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} placeholder="Corte masculino" autoComplete="off" /></label>
            <label>Valor<input value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: moneyMask(e.target.value) })} placeholder="R$ 0,00" inputMode="decimal" /></label>
            <label>Duração<select value={serviceForm.duration} onChange={e => setServiceForm({ ...serviceForm, duration: e.target.value })}><option value="">Selecione</option><option>15 Minutos</option><option>30 Minutos</option><option>45 Minutos</option><option>60 Minutos</option></select></label>
            <button className="button add"><Plus size={17} />Adicionar</button></form>
          <WizardTable headers={["Descrição", "Valor", "Duração", "Excluir"]} empty="Adicione pelo menos um serviço para continuar.">{services.map(item => <tr key={item.id}><td>{item.name}</td><td>R$ {item.price}</td><td>{item.duration}</td><td><button className="icon-button danger" onClick={() => setServices(services.filter(service => service.id !== item.id))}><Trash2 size={16} /></button></td></tr>)}</WizardTable>
        </div>}
        {step === 3 && <div className="wizard-content one-col">
          <h2>Profissionais</h2><form className="wizard-inline professionals" onSubmit={addProfessional}>
            <label>Nome *<input value={professionalForm.name} onChange={e => setProfessionalForm({ ...professionalForm, name: e.target.value })} autoComplete="off" /></label>
            <label>Celular *<input value={professionalForm.phone} onChange={e => setProfessionalForm({ ...professionalForm, phone: phoneMask(e.target.value) })} placeholder="(00) 00000-0000" inputMode="tel" autoComplete="off" /></label>
            <button className="button add"><Plus size={17} />Adicionar</button></form>
          <WizardTable headers={["Nome", "Celular"]} empty="Adicione ao menos um profissional.">{professionals.map(item => <tr key={item.id}><td>{item.name}</td><td>{item.phone}</td></tr>)}</WizardTable>
        </div>}
        <footer className="wizard-actions"><button className="button ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={17} />Voltar</button><button className="button primary" onClick={step === 3 ? finishWizard : next}>{step === 3 ? "Finalizar" : "Continuar"}<ArrowRight size={17} /></button></footer>
      </article>
    </section>
    {toast && <div className="wizard-toast"><CheckCircle2 size={22} />{toast}</div>}
    {finishing && <div className="wizard-loading"><div>Carregando...</div><p>Por favor, aguarde.</p></div>}
  </main>;
}

function FieldSelect({ label, value, placeholder, flag, options, open, full, onOpen, onPick, onSearch }: { label: string; value: string; placeholder?: string; flag?: string; options: Option[]; open: boolean; full?: boolean; onOpen(): void; onPick(value: string): void; onSearch?(query: string): void }) {
  const [query, setQuery] = useState("");
  function updateQuery(value: string) {
    setQuery(value);
    onSearch?.(value);
  }
  const filtered = options.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
  return <label className={full ? "full wizard-select-field" : "wizard-select-field"}>{label}
    <button type="button" className="wizard-select-trigger" onClick={onOpen}>{flag && <span>{flag}</span>}<strong>{value || placeholder}</strong><i>⌄</i></button>
    {open && <div className="wizard-select-menu">
      <input value={query} onChange={event => updateQuery(event.target.value)} autoFocus />
      <div>{filtered.map(item => <button type="button" key={item.value} className={item.value === value ? "selected" : ""} onClick={() => onPick(item.value)}>{item.flag && <span>{item.flag}</span>}{item.label}{item.value === value && <b>✓</b>}</button>)}</div>
    </div>}
  </label>;
}

function WizardTable({ headers, empty, children }: { headers: string[]; empty: string; children: React.ReactNode }) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return <div className="wizard-table"><h3>{headers[0] === "Descrição" ? "Serviços Cadastrados" : "Profissionais Cadastrados"}</h3><table><thead><tr>{headers.map(item => <th key={item}>{item}</th>)}</tr></thead><tbody>{hasRows ? children : <tr><td colSpan={headers.length}>{empty}</td></tr>}</tbody></table></div>;
}
