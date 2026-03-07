import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Check, RotateCcw } from "lucide-react";
import BalustradePreview2D from "./BalustradePreview2D.jsx";
import QuoteModal from "./QuoteModal.jsx";

const FALLBACK = {
  products: {
    balustrade: {
      name: "Balustradă Sticlă",
      basePrice: 50,
      glassTypes: {
        "8mm":      { name: "Sticlă Laminată 8mm",      pricePerSqm: 150, desc: "Ideal pentru interior, laminat 44.2" },
        "10mm":     { name: "Sticlă Securizată 10mm",    pricePerSqm: 200, desc: "Standard exterior, rezistență ridicată" },
        "extraclar":{ name: "Sticlă Extra Clară 10mm",   pricePerSqm: 280, desc: "Transparență maximă, fără nuanță verzuie" }
      },
      mountingTypes: {
        "clips":    { name: "Cleme Inox",       pricePerMeter: 50,  desc: "Design minimalist, vizibilitate maximă" },
        "profile":  { name: "Profile Aluminiu", pricePerMeter: 80,  desc: "Structură solidă, finisaj premium" },
        "embedded": { name: "Canal Integrat",   pricePerMeter: 120, desc: "Fixare în pardoseală, aspect ultra-curat" }
      },
      options: {
        "handrail": { name: "Mână Curentă Inox",      pricePerMeter: 45, desc: "Rotundă Ø42mm, șlefuită satinat" },
        "led":      { name: "Iluminare LED Integrată", price: 150,        desc: "Bandă LED 3000K în profilul de bază" }
      }
    }
  },
  vatRate: 0.19
};

export default function BalustradeConfiguratorPage() {
  const [catalog, setCatalog]         = useState(null);
  const [dimensions, setDimensions]   = useState({ length: "", height: "1.1" });
  const [glassType, setGlassType]     = useState("8mm");
  const [mountingType, setMountingType] = useState("clips");
  const [includeHandrail, setIncludeHandrail] = useState(false);
  const [includeLed, setIncludeLed]   = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote]             = useState(null);
  const [showModal, setShowModal]     = useState(false);

  useEffect(() => {
    fetch("/catalog.json")
      .then(r => r.json())
      .then(d => setCatalog(d))
      .catch(() => setCatalog(FALLBACK));
  }, []);

  const productData = catalog?.products?.balustrade;

  const calculatePrice = async () => {
    if (!productData) return;
    setCalculating(true);
    await new Promise(r => setTimeout(r, 600));
    const length = parseFloat(dimensions.length) || 0;
    const height = parseFloat(dimensions.height) || 0;
    const area = length * height;
    const glassPrice    = area   * productData.glassTypes[glassType].pricePerSqm;
    const mountingPrice = length * productData.mountingTypes[mountingType].pricePerMeter;
    const handrailPrice = includeHandrail ? length * productData.options.handrail.pricePerMeter : 0;
    const ledPrice      = includeLed      ? productData.options.led.price : 0;
    const subtotal = productData.basePrice + glassPrice + mountingPrice + handrailPrice + ledPrice;
    const vat   = subtotal * (catalog?.vatRate ?? 0.19);
    const total = subtotal + vat;
    setQuote({
      area:          area.toFixed(2),
      glassPrice:    Math.round(glassPrice),
      mountingPrice: Math.round(mountingPrice),
      handrailPrice: Math.round(handrailPrice),
      ledPrice,
      subtotal:      Math.round(subtotal),
      vat:           Math.round(vat),
      total:         Math.round(total)
    });
    setCalculating(false);
  };

  if (!catalog) return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={32} color="#c8a96e" className="animate-spin" />
    </div>
  );

  const isFormValid = dimensions.length && parseFloat(dimensions.length) > 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#f0ede8" }}>
      <QuoteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        quote={quote}
        productName="Balustradă Sticlă"
      />

      {/* Header */}
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
            color: "#f0ede8", textDecoration: "none", transition: "all 0.2s"
          }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Configurator Balustrade</div>
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

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Dimensions */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px 28px" }}>
            <SectionTitle num="01" label="Dimensiuni" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
              <InputField label="Lungime (m)" placeholder="Ex: 5.0"
                value={dimensions.length} step="0.1"
                onChange={v => setDimensions(d => ({ ...d, length: v }))} />
              <InputField label="Înălțime (m)" placeholder="Ex: 1.1"
                value={dimensions.height} step="0.05"
                onChange={v => setDimensions(d => ({ ...d, height: v }))} />
            </div>
          </div>

          {/* Glass type */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px 28px" }}>
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

          {/* Mounting */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px 28px" }}>
            <SectionTitle num="03" label="Sistem de Prindere" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              {Object.entries(productData.mountingTypes).map(([key, data]) => (
                <button key={key} className={`option-btn ${mountingType === key ? "selected" : ""}`}
                  onClick={() => setMountingType(key)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{data.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.4)", marginTop: 2 }}>{data.desc}</div>
                    </div>
                    <span className="price-tag">{data.pricePerMeter}€/m</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "28px 28px" }}>
            <SectionTitle num="04" label="Opțiuni Adiționale" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <ToggleOption
                checked={includeHandrail} onChange={setIncludeHandrail}
                label={productData.options.handrail.name}
                desc={productData.options.handrail.desc}
                price={`${productData.options.handrail.pricePerMeter}€/m`}
              />
              <ToggleOption
                checked={includeLed} onChange={setIncludeLed}
                label={productData.options.led.name}
                desc={productData.options.led.desc}
                price={`${productData.options.led.price}€`}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* 2D Preview */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "20px 16px" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", marginBottom: 14 }}>
              Previzualizare
            </div>
            <BalustradePreview2D
              dimensions={dimensions}
              glassType={glassType}
              mountingType={mountingType}
              includeHandrail={includeHandrail}
              includeLed={includeLed}
            />
          </div>

          {/* Quote summary */}
          <div className="glass-card" style={{ borderRadius: 20, padding: "24px 24px", position: "sticky", top: 80 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", marginBottom: 20 }}>
              Rezumat Ofertă
            </div>

            {!quote ? (
              <>
                <div style={{ color: "rgba(240,237,232,0.3)", fontSize: "0.85rem", textAlign: "center", padding: "16px 0 24px" }}>
                  Completează dimensiunile pentru a calcula prețul
                </div>
                <button className="btn-primary w-full"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  disabled={!isFormValid || calculating}
                  onClick={calculatePrice}>
                  {calculating ? <><Loader2 size={16} className="animate-spin" />Se calculează...</> : "Calculează Preț"}
                </button>
              </>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  <QuoteLine label="Suprafață" value={`${quote.area} m²`} />
                  <QuoteLine label="Sticlă" value={`${quote.glassPrice}€`} />
                  <QuoteLine label="Prindere" value={`${quote.mountingPrice}€`} />
                  {quote.handrailPrice > 0 && <QuoteLine label="Mână curentă" value={`+${quote.handrailPrice}€`} accent />}
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
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s"
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
                "extraclar": { name: "Sticlă Extra Clară", pricePerSqm: 280 }
              },
              mountingTypes: {
                "clips": { name: "Cleme Inox", pricePerMeter: 50 },
                "profile": { name: "Profile Aluminiu", pricePerMeter: 80 },
                "embedded": { name: "Canal Integrat", pricePerMeter: 120 }
              },
              options: {
                "handrail": { name: "Mână Curentă", pricePerMeter: 45 },
                "led": { name: "Iluminare LED", price: 150 }
              }
            }
          },
          vatRate: 0.19
        });
        setLoadingCatalog(false);
      });
  }, []);

  const calculatePrice = async () => {
    if (!catalog) return;
    
    setCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const productData = catalog.products.balustrade;
    const length = parseFloat(dimensions.length) || 0;
    const height = parseFloat(dimensions.height) || 0;
    const area = length * height;
    
    const glassPrice = area * productData.glassTypes[glassType].pricePerSqm;
    const mountingPrice = length * productData.mountingTypes[mountingType].pricePerMeter;
    const handrailPrice = includeHandrail ? length * productData.options.handrail.pricePerMeter : 0;
    const ledPrice = includeLed ? productData.options.led.price : 0;
    
    const subtotal = productData.basePrice + glassPrice + mountingPrice + handrailPrice + ledPrice;
    const vat = subtotal * catalog.vatRate;
    const total = subtotal + vat;
    
    setQuote({
      area: area.toFixed(2),
      glassPrice: Math.round(glassPrice),
      mountingPrice: Math.round(mountingPrice),
      handrailPrice: Math.round(handrailPrice),
      ledPrice: ledPrice,
      subtotal: Math.round(subtotal),
      vat: Math.round(vat),
      total: Math.round(total)
    });
    
    setCalculating(false);
    setShowResult(true);
  };

  if (loadingCatalog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const productData = catalog.products.balustrade;
  const isFormValid = dimensions.length && dimensions.height;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">{productData.name}</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Ruler className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold">Dimensiuni</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Lungime (m)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                    className="w-full border-2 border-slate-200 p-4 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Înălțime (m)</label>
                  <input 
                    type="number" 
                    value={dimensions.height}
                    onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                    className="w-full border-2 border-slate-200 p-4 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold mb-6">Tip Sticlă</h2>
              <div className="space-y-3">
                {Object.entries(productData.glassTypes).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setGlassType(key)}
                    className={`w-full p-4 rounded-xl border-2 flex justify-between ${
                      glassType === key ? "border-blue-500 bg-blue-50" : "border-slate-200"
                    }`}
                  >
                    <span>{data.name}</span>
                    <span className="text-blue-600 font-bold">{data.pricePerSqm}€/m²</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold mb-6">Sistem Prindere</h2>
              <div className="space-y-3">
                {Object.entries(productData.mountingTypes).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setMountingType(key)}
                    className={`w-full p-4 rounded-xl border-2 flex justify-between ${
                      mountingType === key ? "border-purple-500 bg-purple-50" : "border-slate-200"
                    }`}
                  >
                    <span>{data.name}</span>
                    <span className="text-purple-600 font-bold">{data.pricePerMeter}€/m</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold mb-6">Opțiuni Adiționale</h2>
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer ${
                  includeHandrail ? "border-green-500 bg-green-50" : "border-slate-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={includeHandrail}
                      onChange={(e) => setIncludeHandrail(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">{productData.options.handrail.name}</span>
                  </div>
                  <span className="text-slate-600">{productData.options.handrail.pricePerMeter}€/m</span>
                </label>

                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer ${
                  includeLed ? "border-green-500 bg-green-50" : "border-slate-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={includeLed}
                      onChange={(e) => setIncludeLed(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">{productData.options.led.name}</span>
                  </div>
                  <span className="text-slate-600">{productData.options.led.price}€</span>
                </label>
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8 border-t-4 border-blue-500">
              <h3 className="text-lg font-bold mb-6">Rezumat</h3>
              
              {!showResult ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-6">Completează dimensiunile</p>
                  <button
                    onClick={calculatePrice}
                    disabled={!isFormValid || calculating}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-slate-300 transition-all"
                  >
                    {calculating ? "Se calculează..." : "Calculează Preț"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2 text-sm border-b border-slate-200 pb-4">
                    <div className="flex justify-between"><span>Suprafață:</span><span>{quote.area} m²</span></div>
                    <div className="flex justify-between"><span>Sticlă:</span><span>{quote.glassPrice}€</span></div>
                    <div className="flex justify-between"><span>Montare:</span><span>{quote.mountingPrice}€</span></div>
                    {quote.handrailPrice > 0 && (
                      <div className="flex justify-between text-green-700"><span>Mână curentă:</span><span>+{quote.handrailPrice}€</span></div>
                    )}
                    {quote.ledPrice > 0 && (
                      <div className="flex justify-between text-green-700"><span>LED:</span><span>+{quote.ledPrice}€</span></div>
                    )}
                    <div className="flex justify-between pt-2 border-t"><span>Subtotal:</span><span>{quote.subtotal}€</span></div>
                    <div className="flex justify-between text-slate-500"><span>TVA:</span><span>{quote.vat}€</span></div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-3xl font-bold text-blue-600">{quote.total}€</span>
                  </div>

                  <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Solicită Ofertă
                  </button>
                  
                  <button onClick={() => setShowResult(false)} className="w-full text-slate-500 py-2">
                    ← Modifică
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
