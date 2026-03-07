import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Check, RotateCcw } from "lucide-react";
import QuoteModal from "./QuoteModal.jsx";

const FALLBACK_PRODUCT = {
  name: "Pereți Cortină", basePrice: 200,
  glassTypes: {
    "double": { name: "Geam Termoizolant (DGU)", pricePerSqm: 320, desc: "2x6mm + spațiu 16mm argon" },
    "triple": { name: "Geam Tripan (TGU)",        pricePerSqm: 480, desc: "3x6mm + 2 spații argon, Ug=0.6" },
    "solar":  { name: "Geam Control Solar",        pricePerSqm: 550, desc: "Coeficient solar g=0.35, Low-E" }
  },
  frameTypes: {
    "aluminum":   { name: "Profil Aluminiu Standard", pricePerMeter: 180, desc: "Anodizat natural sau vopsit RAL" },
    "slimline":   { name: "Profil Slim 50mm",          pricePerMeter: 250, desc: "Vizibilitate maximă, aspect modern" },
    "structural": { name: "Fațadă Structurală",        pricePerMeter: 380, desc: "Geam la exterior, fără profile vizibile" }
  },
  options: {
    "blinds": { name: "Jaluzele Integrate",     pricePerSqm: 95,  desc: "Jaluzele în DGU, fără praf" },
    "smart":  { name: "Geam Electrocromatik",   pricePerSqm: 450, desc: "Opacitate reglabilă electric" }
  }
};

export default function WallConfiguratorPage() {
  const [product, setProduct] = useState(null);
  const [dims, setDims] = useState({ width: "", height: "" });
  const [glassType, setGlassType] = useState("double");
  const [frameType, setFrameType] = useState("aluminum");
  const [includeBlinds, setIncludeBlinds] = useState(false);
  const [includeSmart, setIncludeSmart] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vatRate, setVatRate] = useState(0.19);

  useEffect(() => {
    fetch("/catalog.json").then(r => r.json())
      .then(d => { setProduct(d.products["pereti-cortina"]); setVatRate(d.vatRate); })
      .catch(() => setProduct(FALLBACK_PRODUCT));
  }, []);

  const p = product;
  const isFormValid = dims.width && dims.height && parseFloat(dims.width) > 0;

  const calculate = async () => {
    if (!p) return;
    setCalculating(true);
    await new Promise(r => setTimeout(r, 600));
    const w = parseFloat(dims.width) || 0, h = parseFloat(dims.height) || 0;
    const area = w * h;
    const perimeter = 2 * (w + h);
    const glassPrice  = area * p.glassTypes[glassType].pricePerSqm;
    const framePrice  = perimeter * p.frameTypes[frameType].pricePerMeter;
    const blindsPrice = includeBlinds ? area * p.options.blinds.pricePerSqm : 0;
    const smartPrice  = includeSmart  ? area * p.options.smart.pricePerSqm  : 0;
    const subtotal = p.basePrice + glassPrice + framePrice + blindsPrice + smartPrice;
    const vat = subtotal * vatRate;
    setQuote({
      area: area.toFixed(2), perimeter: perimeter.toFixed(1),
      glassPrice: Math.round(glassPrice), framePrice: Math.round(framePrice),
      blindsPrice: Math.round(blindsPrice), smartPrice: Math.round(smartPrice),
      subtotal: Math.round(subtotal), vat: Math.round(vat), total: Math.round(subtotal + vat)
    });
    setCalculating(false);
  };

  if (!product) return <Loader style={{ background: "#0f1117" }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#f0ede8" }}>
      <QuoteModal isOpen={showModal} onClose={() => setShowModal(false)} quote={quote} productName="Perete Cortină" />
      <Header title="Configurator Pereți Cortină" quote={quote} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Section num="01" label="Dimensiuni Fațadă">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Lățime (m)" value={dims.width} onChange={v => setDims(d => ({ ...d, width: v }))} />
              <Field label="Înălțime (m)" value={dims.height} onChange={v => setDims(d => ({ ...d, height: v }))} />
            </div>
          </Section>

          <Section num="02" label="Tip Geam">
            {Object.entries(p.glassTypes).map(([k, d]) => (
              <Opt key={k} selected={glassType === k} onClick={() => setGlassType(k)}
                label={d.name} desc={d.desc} price={`${d.pricePerSqm}€/m²`} />
            ))}
          </Section>

          <Section num="03" label="Sistem de Profile">
            {Object.entries(p.frameTypes).map(([k, d]) => (
              <Opt key={k} selected={frameType === k} onClick={() => setFrameType(k)}
                label={d.name} desc={d.desc} price={`${d.pricePerMeter}€/m`} />
            ))}
          </Section>

          <Section num="04" label="Opțiuni Suplimentare">
            <Toggle checked={includeBlinds} onChange={setIncludeBlinds}
              label={p.options.blinds.name} desc={p.options.blinds.desc} price={`${p.options.blinds.pricePerSqm}€/m²`} />
            <Toggle checked={includeSmart} onChange={setIncludeSmart}
              label={p.options.smart.name} desc={p.options.smart.desc} price={`${p.options.smart.pricePerSqm}€/m²`} />
          </Section>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Wall SVG Preview */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "20px 16px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", marginBottom: 14 }}>Previzualizare 2D</div>
            <WallPreview dims={dims} glassType={glassType} frameType={frameType} />
          </div>
          <Sidebar quote={quote} isFormValid={isFormValid} calculating={calculating}
            onCalculate={calculate} onReset={() => setQuote(null)} onSolicita={() => setShowModal(true)}
            extraLines={quote ? [
              { label: "Perimetru profile", value: `${quote.perimeter} m` },
              { label: "Geam", value: `${quote.glassPrice}€` },
              { label: "Profile", value: `${quote.framePrice}€` },
              quote.blindsPrice > 0 && { label: "Jaluzele", value: `+${quote.blindsPrice}€`, accent: true },
              quote.smartPrice  > 0 && { label: "Smart glass", value: `+${quote.smartPrice}€`, accent: true },
            ].filter(Boolean) : []}
          />
        </div>
      </main>
    </div>
  );
}

function WallPreview({ dims, glassType, frameType }) {
  const w = parseFloat(dims.width) || 4, h = parseFloat(dims.height) || 3;
  const W = 308, H = 180, M = 20;
  const scale = Math.min((W - M * 2) / w, (H - M * 2) / h);
  const gW = w * scale, gH = h * scale;
  const x0 = (W - gW) / 2, y0 = (H - gH) / 2;
  const cols = Math.max(2, Math.round(w / 1.2)), rows = Math.max(1, Math.round(h / 1.5));
  const frameColor = frameType === "structural" ? "rgba(180,220,255,0.3)" : "rgba(200,169,110,0.5)";
  const frameW = frameType === "slimline" ? 2 : frameType === "structural" ? 1 : 4;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {/* outer frame */}
      <rect x={x0} y={y0} width={gW} height={gH} fill="none" stroke={frameColor} strokeWidth={frameW + 1} rx="2" />
      {/* grid */}
      {Array.from({ length: cols - 1 }, (_, i) => (
        <line key={`c${i}`} x1={x0 + ((i + 1) / cols) * gW} y1={y0}
          x2={x0 + ((i + 1) / cols) * gW} y2={y0 + gH}
          stroke={frameColor} strokeWidth={frameW} />
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (
        <line key={`r${i}`} x1={x0} y1={y0 + ((i + 1) / rows) * gH}
          x2={x0 + gW} y2={y0 + ((i + 1) / rows) * gH}
          stroke={frameColor} strokeWidth={frameW} />
      ))}
      {/* glass panes */}
      {Array.from({ length: cols }, (_, ci) => Array.from({ length: rows }, (_, ri) => {
        const px = x0 + (ci / cols) * gW + frameW / 2 + 1;
        const py = y0 + (ri / rows) * gH + frameW / 2 + 1;
        const pw = gW / cols - frameW - 1;
        const ph = gH / rows - frameW - 1;
        const fill = glassType === "solar" ? "rgba(80,160,100,0.12)" : glassType === "triple" ? "rgba(160,210,255,0.1)" : "rgba(180,220,255,0.07)";
        return <rect key={`${ci}-${ri}`} x={px} y={py} width={pw} height={ph} fill={fill} rx="1" />;
      }))}
      <text x={x0 + gW / 2} y={H - 6} textAnchor="middle" fill="rgba(200,169,110,0.6)" fontSize="8" fontFamily="DM Sans">
        {dims.width || "—"}m × {dims.height || "—"}m
      </text>
    </svg>
  );
}

// ── shared mini-components ──
function Loader() { return <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={32} color="#c8a96e" className="animate-spin" /></div>; }
function Header({ title, quote }) {
  return (
    <header style={{ background: "rgba(15,17,23,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0ede8", textDecoration: "none" }}><ArrowLeft size={16} /></Link>
        <div><div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{title}</div><div style={{ fontSize: "0.73rem", color: "rgba(240,237,232,0.35)" }}>Glass Associates</div></div>
      </div>
      {quote && <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.4)" }}>Total:</span><span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#c8a96e" }}>{quote.total}€</span></div>}
    </header>
  );
}
function Section({ num, label, children }) {
  return (
    <div className="glass-card" style={{ borderRadius: 20, padding: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#c8a96e", opacity: 0.7 }}>{num}</span>
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>{label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}
function Field({ label, value, onChange }) {
  return <div><label style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.45)", display: "block", marginBottom: 8 }}>{label}</label><input className="input-field" type="number" step="0.1" value={value} onChange={e => onChange(e.target.value)} placeholder="Ex: 4.0" /></div>;
}
function Opt({ selected, onClick, label, desc, price }) {
  return (
    <button className={`option-btn ${selected ? "selected" : ""}`} onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{label}</div><div style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.4)", marginTop: 2 }}>{desc}</div></div>
        <span className="price-tag">{price}</span>
      </div>
    </button>
  );
}
function Toggle({ checked, onChange, label, desc, price }) {
  return (
    <button className={`option-btn ${checked ? "selected" : ""}`} onClick={() => onChange(!checked)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${checked ? "#c8a96e" : "rgba(255,255,255,0.2)"}`, background: checked ? "#c8a96e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
            {checked && <Check size={12} color="#0f1117" strokeWidth={3} />}
          </div>
          <div><div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{label}</div><div style={{ fontSize: "0.76rem", color: "rgba(240,237,232,0.38)", marginTop: 1 }}>{desc}</div></div>
        </div>
        <span className="price-tag">{price}</span>
      </div>
    </button>
  );
}
function Sidebar({ quote, isFormValid, calculating, onCalculate, onReset, onSolicita, extraLines = [] }) {
  return (
    <div className="glass-card" style={{ borderRadius: 20, padding: "24px", position: "sticky", top: 80 }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", marginBottom: 20 }}>Rezumat Ofertă</div>
      {!quote ? (
        <>
          <div style={{ color: "rgba(240,237,232,0.3)", fontSize: "0.85rem", textAlign: "center", padding: "16px 0 24px" }}>Completează dimensiunile pentru a calcula prețul</div>
          <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} disabled={!isFormValid || calculating} onClick={onCalculate}>
            {calculating ? <><Loader2 size={16} className="animate-spin" />Se calculează...</> : "Calculează Preț"}
          </button>
        </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {extraLines.map((l, i) => <QL key={i} {...l} />)}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: 4 }}>
              <QL label="Subtotal" value={`${quote.subtotal}€`} />
              <QL label="TVA 19%" value={`${quote.vat}€`} muted />
            </div>
          </div>
          <div style={{ background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "#c8a96e" }}>{quote.total}€</span>
          </div>
          <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }} onClick={onSolicita}>
            <Check size={16} /> Solicită Ofertă
          </button>
          <button className="btn-ghost" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={onReset}>
            <RotateCcw size={13} /> Recalculează
          </button>
        </>
      )}
    </div>
  );
}
function QL({ label, value, accent, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem" }}>
      <span style={{ color: muted ? "rgba(240,237,232,0.3)" : "rgba(240,237,232,0.5)" }}>{label}</span>
      <span style={{ color: accent ? "#c8a96e" : muted ? "rgba(240,237,232,0.3)" : "rgba(240,237,232,0.8)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
