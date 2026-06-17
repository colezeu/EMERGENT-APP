import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Check, RotateCcw } from "lucide-react";
import QuoteModal from "./QuoteModal.jsx";

const FALLBACK_PRODUCT = {
  name: "Uși din Sticlă", basePrice: 120,
  glassTypes: {
    "10mm":   { name: "Securit 10mm Clar",   pricePerSqm: 220, desc: "Ușă pivotantă sau batantă" },
    "12mm":   { name: "Securit 12mm",         pricePerSqm: 280, desc: "Rezistență sporită, uși grele" },
    "frosted":{ name: "Securit Sablat",       pricePerSqm: 310, desc: "Confidențialitate, design sofisticat" }
  },
  frameTypes: {
    "frameless":{ name: "Fără Ramă (Frameless)", pricePerUnit: 350, desc: "Balamale pivotante ascunse" },
    "slim":     { name: "Ramă Slim Inox",         pricePerUnit: 200, desc: "Profil 20mm, aspect minimalist" },
    "full":     { name: "Ramă Completă Aluminiu", pricePerUnit: 150, desc: "Clasic, durabil, izolație fonică" }
  },
  options: {
    "lock":   { name: "Broască Magnetică Premium", price: 180, desc: "Inox, push-pull, cod sau cheie" },
    "closer": { name: "Închizător Hidraulic",       price: 95,  desc: "Soft-close reglabil" },
    "film":   { name: "Folie Decorativă",           pricePerSqm: 45, desc: "Sablat parțial, model personalizat" }
  }
};

export default function DoorConfiguratorPage() {
  const [product, setProduct] = useState(null);
  const [dims, setDims] = useState({ width: "1.0", height: "2.1" });
  const [glassType, setGlassType] = useState("10mm");
  const [frameType, setFrameType] = useState("frameless");
  const [includeLock, setIncludeLock] = useState(false);
  const [includeCloser, setIncludeCloser] = useState(false);
  const [includeFilm, setIncludeFilm] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vatRate, setVatRate] = useState(0.19);

  useEffect(() => {
    fetch("/catalog.json").then(r => r.json())
      .then(d => { setProduct(d.products["usi-sticla"]); setVatRate(d.vatRate); })
      .catch(() => setProduct(FALLBACK_PRODUCT));
  }, []);

  const p = product;
  const isFormValid = dims.width && dims.height;

  const calculate = async () => {
    if (!p) return;
    setCalculating(true);
    await new Promise(r => setTimeout(r, 600));
    const w = parseFloat(dims.width) || 0, h = parseFloat(dims.height) || 0;
    const area = w * h;
    const glassPrice  = area * p.glassTypes[glassType].pricePerSqm;
    const framePrice  = p.frameTypes[frameType].pricePerUnit;
    const lockPrice   = includeLock   ? p.options.lock.price             : 0;
    const closerPrice = includeCloser ? p.options.closer.price           : 0;
    const filmPrice   = includeFilm   ? area * p.options.film.pricePerSqm : 0;
    const subtotal = p.basePrice + glassPrice + framePrice + lockPrice + closerPrice + filmPrice;
    const vat = subtotal * vatRate;
    setQuote({
      area: area.toFixed(2), glassPrice: Math.round(glassPrice), framePrice,
      lockPrice, closerPrice, filmPrice: Math.round(filmPrice),
      subtotal: Math.round(subtotal), vat: Math.round(vat), total: Math.round(subtotal + vat)
    });
    setCalculating(false);
  };

  if (!product) return <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={32} color="#c8a96e" className="animate-spin" /></div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#f0ede8" }}>
      <QuoteModal isOpen={showModal} onClose={() => setShowModal(false)} quote={quote} productName="Ușă din Sticlă" />

      <header style={{ background: "rgba(15,17,23,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0ede8", textDecoration: "none" }}><ArrowLeft size={16} /></Link>
          <div><div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Configurator Uși Sticlă</div><div style={{ fontSize: "0.73rem", color: "rgba(240,237,232,0.35)" }}>Glass Associates</div></div>
        </div>
        {quote && <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.4)" }}>Total:</span><span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#c8a96e" }}>{quote.total}€</span></div>}
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <Sec num="01" label="Dimensiuni Ușă">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <F label="Lățime (m)" value={dims.width} onChange={v => setDims(d => ({ ...d, width: v }))} />
              <F label="Înălțime (m)" value={dims.height} onChange={v => setDims(d => ({ ...d, height: v }))} />
            </div>
          </Sec>

          <Sec num="02" label="Tip Sticlă">
            {Object.entries(p.glassTypes).map(([k, d]) => (
              <Opt key={k} selected={glassType === k} onClick={() => setGlassType(k)} label={d.name} desc={d.desc} price={`${d.pricePerSqm}€/m²`} />
            ))}
          </Sec>

          <Sec num="03" label="Tip Ramă">
            {Object.entries(p.frameTypes).map(([k, d]) => (
              <Opt key={k} selected={frameType === k} onClick={() => setFrameType(k)} label={d.name} desc={d.desc} price={`${d.pricePerUnit}€`} />
            ))}
          </Sec>

          <Sec num="04" label="Accesorii">
            <Tog checked={includeLock}   onChange={setIncludeLock}   label={p.options.lock.name}   desc={p.options.lock.desc}   price={`${p.options.lock.price}€`} />
            <Tog checked={includeCloser} onChange={setIncludeCloser} label={p.options.closer.name} desc={p.options.closer.desc} price={`${p.options.closer.price}€`} />
            <Tog checked={includeFilm}   onChange={setIncludeFilm}   label={p.options.film.name}   desc={p.options.film.desc}   price={`${p.options.film.pricePerSqm}€/m²`} />
          </Sec>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Door 2D preview */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "20px 16px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", marginBottom: 14 }}>Previzualizare 2D</div>
            <DoorPreview dims={dims} glassType={glassType} frameType={frameType} includeFilm={includeFilm} />
          </div>

          <div className="glass-card" style={{ borderRadius: 20, padding: "24px", position: "sticky", top: 80 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", marginBottom: 20 }}>Rezumat Ofertă</div>
            {!quote ? (
              <>
                <div style={{ color: "rgba(240,237,232,0.3)", fontSize: "0.85rem", textAlign: "center", padding: "16px 0 24px" }}>Completează dimensiunile pentru a calcula prețul</div>
                <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} disabled={!isFormValid || calculating} onClick={calculate}>
                  {calculating ? <><Loader2 size={16} className="animate-spin" />Se calculează...</> : "Calculează Preț"}
                </button>
              </>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  <QL label="Suprafață" value={`${quote.area} m²`} />
                  <QL label="Sticlă" value={`${quote.glassPrice}€`} />
                  <QL label="Ramă" value={`${quote.framePrice}€`} />
                  {quote.lockPrice > 0   && <QL label="Broască" value={`+${quote.lockPrice}€`} accent />}
                  {quote.closerPrice > 0 && <QL label="Închizător" value={`+${quote.closerPrice}€`} accent />}
                  {quote.filmPrice > 0   && <QL label="Folie" value={`+${quote.filmPrice}€`} accent />}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: 4 }}>
                    <QL label="Subtotal" value={`${quote.subtotal}€`} />
                    <QL label="TVA 19%" value={`${quote.vat}€`} muted />
                  </div>
                </div>
                <div style={{ background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Total</span>
                  <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "#c8a96e" }}>{quote.total}€</span>
                </div>
                <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }} onClick={() => setShowModal(true)}>
                  <Check size={16} /> Solicită Ofertă
                </button>
                <button className="btn-ghost" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => setQuote(null)}>
                  <RotateCcw size={13} /> Recalculează
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function DoorPreview({ dims, glassType, frameType, includeFilm }) {
  const w = parseFloat(dims.width) || 1, h = parseFloat(dims.height) || 2.1;
  const W = 308, H = 190, M = 20;
  const scale = Math.min((W * 0.5) / w, (H - M * 2) / h);
  const dW = w * scale, dH = h * scale;
  const x0 = (W - dW) / 2, y0 = (H - dH) / 2;
  const fw = frameType === "frameless" ? 0 : frameType === "slim" ? 3 : 7;
  const fc = frameType === "frameless" ? "transparent" : frameType === "slim" ? "rgba(200,169,110,0.7)" : "rgba(160,160,180,0.6)";
  const glFill = glassType === "frosted" ? "rgba(200,200,220,0.35)" : includeFilm ? "rgba(200,169,110,0.12)" : "rgba(180,220,255,0.13)";
  const glStroke = glassType === "frosted" ? "rgba(200,200,220,0.5)" : "rgba(180,220,255,0.45)";
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {/* floor */}
      <line x1={x0 - 20} y1={y0 + dH} x2={x0 + dW + 20} y2={y0 + dH} stroke="rgba(200,169,110,0.35)" strokeWidth="2" />
      {/* frame */}
      {fw > 0 && <rect x={x0} y={y0} width={dW} height={dH} fill="none" stroke={fc} strokeWidth={fw} />}
      {/* glass */}
      <rect x={x0 + fw / 2} y={y0 + fw / 2} width={dW - fw} height={dH - fw} fill={glFill} stroke={glStroke} strokeWidth="1.5" />
      {/* handle */}
      <rect x={x0 + dW * 0.78} y={y0 + dH / 2 - 18} width={5} height={36} rx="2.5"
        fill={frameType === "frameless" ? "rgba(200,169,110,0.8)" : "rgba(160,160,180,0.7)"} />
      {/* swing arc */}
      <path d={`M ${x0} ${y0 + dH} A ${dW * 0.8} ${dW * 0.8} 0 0 1 ${x0 - dW * 0.8} ${y0 + dH - dW * 0.8}`}
        fill="none" stroke="rgba(200,169,110,0.25)" strokeWidth="1" strokeDasharray="4,3" />
      {/* film lines */}
      {includeFilm && Array.from({ length: 4 }, (_, i) => (
        <line key={i} x1={x0 + fw} y1={y0 + fw + (i + 1) * (dH / 5)} x2={x0 + dW - fw} y2={y0 + fw + (i + 1) * (dH / 5)}
          stroke="rgba(200,169,110,0.2)" strokeWidth="1" />
      ))}
      <text x={x0 + dW / 2} y={H - 6} textAnchor="middle" fill="rgba(200,169,110,0.6)" fontSize="8" fontFamily="DM Sans">
        {dims.width}m × {dims.height}m
      </text>
    </svg>
  );
}

function Sec({ num, label, children }) {
  return <div className="glass-card" style={{ borderRadius: 20, padding: "28px" }}><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}><span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#c8a96e", opacity: 0.7 }}>{num}</span><span style={{ fontWeight: 700, fontSize: "1rem" }}>{label}</span></div><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div></div>;
}
function F({ label, value, onChange }) {
  return <div><label style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.45)", display: "block", marginBottom: 8 }}>{label}</label><input className="input-field" type="number" step="0.05" value={value} onChange={e => onChange(e.target.value)} /></div>;
}
function Opt({ selected, onClick, label, desc, price }) {
  return <button className={`option-btn ${selected ? "selected" : ""}`} onClick={onClick}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{label}</div><div style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.4)", marginTop: 2 }}>{desc}</div></div><span className="price-tag">{price}</span></div></button>;
}
function Tog({ checked, onChange, label, desc, price }) {
  return <button className={`option-btn ${checked ? "selected" : ""}`} onClick={() => onChange(!checked)}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${checked ? "#c8a96e" : "rgba(255,255,255,0.2)"}`, background: checked ? "#c8a96e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>{checked && <Check size={12} color="#0f1117" strokeWidth={3} />}</div><div><div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{label}</div><div style={{ fontSize: "0.76rem", color: "rgba(240,237,232,0.38)", marginTop: 1 }}>{desc}</div></div></div><span className="price-tag">{price}</span></div></button>;
}
function QL({ label, value, accent, muted }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem" }}><span style={{ color: muted ? "rgba(240,237,232,0.3)" : "rgba(240,237,232,0.5)" }}>{label}</span><span style={{ color: accent ? "#c8a96e" : muted ? "rgba(240,237,232,0.3)" : "rgba(240,237,232,0.8)", fontWeight: 500 }}>{value}</span></div>;
}
