import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Check, RotateCcw } from "lucide-react";
import ShowerPreview2D from "./ShowerPreview2D.jsx";
import QuoteModal from "./QuoteModal.jsx";

const FALLBACK = {
  products: {
    "cabine-dus": {
      name: "Cabină de Duș", basePrice: 80,
      glassTypes: {
        "8mm":  { name: "Sticlă Securizată 8mm",  pricePerSqm: 130, desc: "Rezistentă la șocuri termice" },
        "10mm": { name: "Sticlă Securizată 10mm",  pricePerSqm: 170, desc: "Robustețe sporită, greutate premium" }
      },
      doorTypes: {
        "swing":   { name: "Ușă Batantă",  price: 200, desc: "Deschidere 180°, balamale ascunse" },
        "sliding": { name: "Ușă Culisantă",price: 350, desc: "Sistem soft-close, silențios" },
        "fixed":   { name: "Paravan Fix",  price: 0,   desc: "Fără ușă, acces liber" }
      },
      treatments: {
        "clear":  { name: "Transparentă",       pricePerSqm: 0,  desc: "Sticlă clară standard" },
        "frosted":{ name: "Sablată (Opacă)",     pricePerSqm: 25, desc: "Intimitate totală, aspect mat" },
        "nano":   { name: "Nano Anti-Calcar",    pricePerSqm: 35, desc: "Respinge apa și calcarul" }
      },
      options: {
        "towelBar": { name: "Port Prosop Integrat", price: 45,  desc: "Inox satinat, capacitate 5kg" },
        "seat":     { name: "Scaun Rabatabil",       price: 85,  desc: "Teak tratat, 120kg capacitate" },
        "led":      { name: "Iluminare LED",         price: 120, desc: "Profil luminos impermeabil IP67" }
      }
    }
  },
  vatRate: 0.19
};

export default function ShowerConfiguratorPage() {
  const [catalog, setCatalog] = useState(null);
  const [dimensions, setDimensions] = useState({ width: "", depth: "", height: "2.0" });
  const [glassType, setGlassType] = useState("8mm");
  const [doorType, setDoorType] = useState("swing");
  const [treatment, setTreatment] = useState("clear");
  const [includeTowelBar, setIncludeTowelBar] = useState(false);
  const [includeSeat, setIncludeSeat] = useState(false);
  const [includeLed, setIncludeLed] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/catalog.json")
      .then(r => r.json())
      .then(d => setCatalog(d))
      .catch(() => setCatalog(FALLBACK));
  }, []);

  const productData = catalog?.products?.["cabine-dus"];

  const calculatePrice = async () => {
    if (!productData) return;
    setCalculating(true);
    await new Promise(r => setTimeout(r, 600));
    const width  = parseFloat(dimensions.width)  || 0;
    const depth  = parseFloat(dimensions.depth)  || 0;
    const height = parseFloat(dimensions.height) || 0;
    const area = (width * height) + (depth * height) + (width * height);
    const glassPrice     = area * productData.glassTypes[glassType].pricePerSqm;
    const doorPrice      = productData.doorTypes[doorType].price;
    const treatmentPrice = area * productData.treatments[treatment].pricePerSqm;
    const towelPrice = includeTowelBar ? productData.options.towelBar.price : 0;
    const seatPrice  = includeSeat     ? productData.options.seat.price     : 0;
    const ledPrice   = includeLed      ? productData.options.led.price      : 0;
    const subtotal = productData.basePrice + glassPrice + doorPrice + treatmentPrice + towelPrice + seatPrice + ledPrice;
    const vat   = subtotal * (catalog?.vatRate ?? 0.19);
    const total = subtotal + vat;
    setQuote({
      area: area.toFixed(2),
      glassPrice: Math.round(glassPrice), doorPrice,
      treatmentPrice: Math.round(treatmentPrice),
      towelPrice, seatPrice, ledPrice,
      subtotal: Math.round(subtotal), vat: Math.round(vat), total: Math.round(total)
    });
    setCalculating(false);
  };

  if (!catalog) return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={32} color="#c8a96e" className="animate-spin" />
    </div>
  );

  const isFormValid = dimensions.width && dimensions.depth && parseFloat(dimensions.width) > 0 && parseFloat(dimensions.depth) > 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#f0ede8" }}>
      <QuoteModal isOpen={showModal} onClose={() => setShowModal(false)} quote={quote} productName="Cabină de Duș" />

      <header style={{
        background: "rgba(15,17,23,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#f0ede8", textDecoration: "none"
          }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Configurator Cabine Duș</div>
            <div style={{ fontSize: "0.73rem", color: "rgba(240,237,232,0.35)" }}>Glass Associates</div>
          </div>
        </div>
        {quote && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.4)" }}>Total estimat:</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#c8a96e" }}>{quote.total}€</span>
          </div>
        )}
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Dimensions */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px" }}>
            <SectionTitle num="01" label="Dimensiuni Cabină" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 20 }}>
              <InputField label="Lățime (m)" placeholder="Ex: 0.9" value={dimensions.width} step="0.05"
                onChange={v => setDimensions(d => ({ ...d, width: v }))} />
              <InputField label="Adâncime (m)" placeholder="Ex: 0.9" value={dimensions.depth} step="0.05"
                onChange={v => setDimensions(d => ({ ...d, depth: v }))} />
              <div>
                <label style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.45)", display: "block", marginBottom: 8 }}>Înălțime</label>
                <select className="input-field" value={dimensions.height}
                  onChange={e => setDimensions(d => ({ ...d, height: e.target.value }))}>
                  <option value="1.9">1.9m</option>
                  <option value="2.0">2.0m (standard)</option>
                  <option value="2.1">2.1m</option>
                  <option value="2.2">2.2m</option>
                </select>
              </div>
            </div>
          </div>

          {/* Glass */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px" }}>
            <SectionTitle num="02" label="Tip Sticlă" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              {Object.entries(productData.glassTypes).map(([key, data]) => (
                <button key={key} className={`option-btn ${glassType === key ? "selected" : ""}`}
                  onClick={() => setGlassType(key)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{data.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.4)", marginTop: 2 }}>{data.desc}</div>
                    </div>
                    <span className="price-tag">{data.pricePerSqm}€/m²</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Door type */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px" }}>
            <SectionTitle num="03" label="Tip Deschidere" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 }}>
              {Object.entries(productData.doorTypes).map(([key, data]) => (
                <button key={key} className={`option-btn ${doorType === key ? "selected" : ""}`}
                  onClick={() => setDoorType(key)}
                  style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>{data.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(240,237,232,0.38)", marginBottom: 8 }}>{data.desc}</div>
                  <span className="price-tag">{data.price > 0 ? `+${data.price}€` : "Inclus"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Treatment */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px" }}>
            <SectionTitle num="04" label="Tratament Suprafață" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              {Object.entries(productData.treatments).map(([key, data]) => (
                <button key={key} className={`option-btn ${treatment === key ? "selected" : ""}`}
                  onClick={() => setTreatment(key)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{data.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.4)", marginTop: 2 }}>{data.desc}</div>
                    </div>
                    <span className="price-tag">{data.pricePerSqm > 0 ? `+${data.pricePerSqm}€/m²` : "Standard"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px" }}>
            <SectionTitle num="05" label="Accesorii" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <ToggleOption checked={includeTowelBar} onChange={setIncludeTowelBar}
                label={productData.options.towelBar.name} desc={productData.options.towelBar.desc}
                price={`${productData.options.towelBar.price}€`} />
              <ToggleOption checked={includeSeat} onChange={setIncludeSeat}
                label={productData.options.seat.name} desc={productData.options.seat.desc}
                price={`${productData.options.seat.price}€`} />
              <ToggleOption checked={includeLed} onChange={setIncludeLed}
                label={productData.options.led.name} desc={productData.options.led.desc}
                price={`${productData.options.led.price}€`} />
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass-card" style={{ borderRadius: 20, padding: "20px 16px" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", marginBottom: 14 }}>
              Previzualizare
            </div>
            <ShowerPreview2D dimensions={dimensions} glassType={glassType}
              doorType={doorType} treatment={treatment} includeLed={includeLed} />
          </div>

          <div className="glass-card" style={{ borderRadius: 20, padding: "24px", position: "sticky", top: 80 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", marginBottom: 20 }}>
              Rezumat Ofertă
            </div>

            {!quote ? (
              <>
                <div style={{ color: "rgba(240,237,232,0.3)", fontSize: "0.85rem", textAlign: "center", padding: "16px 0 24px" }}>
                  Completează dimensiunile pentru a calcula prețul
                </div>
                <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  disabled={!isFormValid || calculating} onClick={calculatePrice}>
                  {calculating ? <><Loader2 size={16} className="animate-spin" />Se calculează...</> : "Calculează Preț"}
                </button>
              </>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  <QuoteLine label="Suprafață sticlă" value={`${quote.area} m²`} />
                  <QuoteLine label="Sticlă" value={`${quote.glassPrice}€`} />
                  <QuoteLine label="Tip ușă" value={`${quote.doorPrice}€`} />
                  {quote.treatmentPrice > 0 && <QuoteLine label="Tratament" value={`+${quote.treatmentPrice}€`} accent />}
                  {quote.towelPrice > 0 && <QuoteLine label="Port prosop" value={`+${quote.towelPrice}€`} accent />}
                  {quote.seatPrice > 0 && <QuoteLine label="Scaun" value={`+${quote.seatPrice}€`} accent />}
                  {quote.ledPrice > 0 && <QuoteLine label="LED" value={`+${quote.ledPrice}€`} accent />}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: 4 }}>
                    <QuoteLine label="Subtotal" value={`${quote.subtotal}€`} />
                    <QuoteLine label="TVA 19%" value={`${quote.vat}€`} muted />
                  </div>
                </div>
                <div style={{
                  background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)",
                  borderRadius: 14, padding: "16px 20px", marginBottom: 16,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Total</span>
                  <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "#c8a96e" }}>{quote.total}€</span>
                </div>
                <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}
                  onClick={() => setShowModal(true)}>
                  <Check size={16} /> Solicită Ofertă
                </button>
                <button className="btn-ghost" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  onClick={() => setQuote(null)}>
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

function SectionTitle({ num, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#c8a96e", opacity: 0.7, minWidth: 24 }}>{num}</span>
      <span style={{ fontWeight: 700, fontSize: "1rem" }}>{label}</span>
    </div>
  );
}
function InputField({ label, value, onChange, placeholder, step }) {
  return (
    <div>
      <label style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.45)", display: "block", marginBottom: 8 }}>{label}</label>
      <input className="input-field" type="number" step={step} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} />
    </div>
  );
}
function ToggleOption({ checked, onChange, label, desc, price }) {
  return (
    <button className={`option-btn ${checked ? "selected" : ""}`} onClick={() => onChange(!checked)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            border: `1.5px solid ${checked ? "#c8a96e" : "rgba(255,255,255,0.2)"}`,
            background: checked ? "#c8a96e" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s"
          }}>
            {checked && <Check size={12} color="#0f1117" strokeWidth={3} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{label}</div>
            <div style={{ fontSize: "0.76rem", color: "rgba(240,237,232,0.38)", marginTop: 1 }}>{desc}</div>
          </div>
        </div>
        <span className="price-tag">{price}</span>
      </div>
    </button>
  );
}
function QuoteLine({ label, value, accent, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem" }}>
      <span style={{ color: muted ? "rgba(240,237,232,0.3)" : "rgba(240,237,232,0.5)" }}>{label}</span>
      <span style={{ color: accent ? "#c8a96e" : muted ? "rgba(240,237,232,0.3)" : "rgba(240,237,232,0.8)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
