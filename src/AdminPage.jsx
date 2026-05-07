import { useState } from "react";
import { Download, Lock, LogOut, ChevronDown, ChevronUp } from "lucide-react";

const PASSWORD = "glass2026";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [loaded, setLoaded] = useState(false);

 const login = () => {
  if (pass !== PASSWORD) {
    setError(true);
    setTimeout(() => setError(false), 2000);
    return;
  }
  fetch("/catalog.json", { cache: "no-store" })
    .then(r => r.json())
    .then(d => {
      setCatalog(d);
      setLoaded(true);
      setAuth(true);
    })
    .catch(() => {
      // Foloseste fallback direct
      setCatalog({
        vatRate: 0.21,
        products: {}
      });
      setLoaded(true);
      setAuth(true);
    });
};

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "catalog.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const updatePrice = (productKey, path, value) => {
    setCatalog(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let obj = next.products[productKey];
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = parseFloat(value) || 0;
      return next;
    });
  };

  const updateVat = (value) => {
    setCatalog(prev => ({ ...prev, vatRate: parseFloat(value) / 100 || 0 }));
  };

  const PRICE_KEYS = ["pricePerSqm", "pricePerMeter", "price", "pricePerUnit", "basePrice"];
  const LABELS = {
    pricePerSqm: "Preț/m²",
    pricePerMeter: "Preț/m",
    price: "Preț fix",
    pricePerUnit: "Preț/buc",
    basePrice: "Preț de bază"
  };
  const PRODUCT_NAMES = {
    "balustrade": "Balustrade",
    "cabine-dus": "Cabine Duș",
    "inchidere-terasa": "Închidere Mobilă Terase",
    "pergola-copertina": "Pergolă & Copertină",
    "usi-batante": "Uși Batante",
    "usi-culisante": "Uși Culisante",
    "partitionari": "Partiționări"
    "oglinzi": "Oglinzi"
  };

  const renderFields = (productKey, obj, prefix) => {
    if (!prefix) prefix = "";
    return Object.entries(obj).flatMap(([key, val]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof val === "object" && val !== null) {
        return renderFields(productKey, val, path);
      }
      if (PRICE_KEYS.includes(key)) {
        const parts = prefix.split(".");
        let parentObj = catalog.products[productKey];
        for (const p of parts) { if (parentObj && parentObj[p]) parentObj = parentObj[p]; }
        const parentName = parentObj?.name || parts[parts.length - 1];
        return [(
          <div key={path} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ fontSize:"0.85rem", color:"#f0ede8", fontWeight:500 }}>{parentName}</div>
              <div style={{ fontSize:"0.75rem", color:"rgba(240,237,232,0.35)" }}>{LABELS[key]}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <input
                type="number" step="1" value={val}
                onChange={e => updatePrice(productKey, path, e.target.value)}
                style={{ width:90, background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(200,169,110,0.3)", borderRadius:8, padding:"6px 10px", color:"#c8a96e", fontWeight:700, fontSize:"0.95rem", textAlign:"right", outline:"none", fontFamily:"'DM Sans', sans-serif" }}
              />
              <span style={{ color:"rgba(240,237,232,0.4)", fontSize:"0.8rem" }}>€</span>
            </div>
          </div>
        )];
      }
      return [];
    });
  };

  if (!auth) {
    return (
      <div style={{ minHeight:"100vh", background:"#0f1117", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(200,169,110,0.2)", borderRadius:20, padding:"48px 40px", width:360, textAlign:"center" }}>
          <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(200,169,110,0.1)", border:"1px solid rgba(200,169,110,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
            <Lock size={20} color="#c8a96e" />
          </div>
          <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:"1.6rem", marginBottom:8, color:"#f0ede8" }}>Admin</h2>
          <p style={{ color:"rgba(240,237,232,0.35)", fontSize:"0.85rem", marginBottom:28 }}>Glass Associates · Catalog Prețuri</p>
          <input
            className="input-field"
            type="password"
            placeholder="Parolă"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ marginBottom:12, textAlign:"center", border: error ? "1.5px solid rgba(255,80,80,0.6)" : undefined }}
          />
          {error && <p style={{ color:"rgba(255,80,80,0.8)", fontSize:"0.8rem", marginBottom:8 }}>Parolă incorectă</p>}
          <button className="btn-primary" style={{ width:"100%" }} onClick={login}>Intră</button>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ minHeight:"100vh", background:"#0f1117", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:"#c8a96e" }}>Se încarcă catalogul...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0f1117", color:"#f0ede8" }}>
      <header style={{ background:"rgba(15,17,23,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:40 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:"0.95rem" }}>Admin · Catalog Prețuri</div>
          <div style={{ fontSize:"0.73rem", color:"rgba(240,237,232,0.35)" }}>Glass Associates</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-primary" style={{ display:"flex", alignItems:"center", gap:8 }} onClick={exportJson}>
            <Download size={15} /> Export catalog.json
          </button>
          <button className="btn-ghost" style={{ display:"flex", alignItems:"center", gap:8 }} onClick={() => { setAuth(false); setLoaded(false); setCatalog(null); }}>
            <LogOut size={15} /> Ieși
          </button>
        </div>
      </header>

      <main style={{ maxWidth:800, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ background:"rgba(200,169,110,0.08)", border:"1px solid rgba(200,169,110,0.2)", borderRadius:16, padding:"20px 24px", marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:700 }}>Cotă TVA</div>
            <div style={{ fontSize:"0.78rem", color:"rgba(240,237,232,0.4)" }}>Aplicată la toate produsele</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <input
              type="number" step="1"
              value={Math.round(catalog.vatRate * 100)}
              onChange={e => updateVat(e.target.value)}
              style={{ width:70, background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(200,169,110,0.3)", borderRadius:8, padding:"6px 10px", color:"#c8a96e", fontWeight:700, fontSize:"0.95rem", textAlign:"right", outline:"none", fontFamily:"'DM Sans', sans-serif" }}
            />
            <span style={{ color:"rgba(240,237,232,0.4)", fontSize:"0.8rem" }}>%</span>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {Object.entries(catalog.products).map(([key, product]) => (
            <div key={key} className="glass-card" style={{ borderRadius:16, overflow:"hidden" }}>
              <button
                onClick={() => setOpenSection(openSection === key ? null : key)}
                style={{ width:"100%", background:"none", border:"none", padding:"18px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", color:"#f0ede8" }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#c8a96e" }} />
                  <span style={{ fontWeight:700, fontSize:"1rem" }}>{PRODUCT_NAMES[key] || product.name}</span>
                </div>
                {openSection === key ? <ChevronUp size={18} color="#c8a96e" /> : <ChevronDown size={18} color="rgba(240,237,232,0.4)" />}
              </button>
              {openSection === key && (
                <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                  {renderFields(key, product)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop:32, padding:"20px 24px", background:"rgba(255,255,255,0.02)", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize:"0.82rem", color:"rgba(240,237,232,0.35)", lineHeight:1.7, margin:0 }}>
            <strong style={{ color:"rgba(240,237,232,0.6)" }}>Cum funcționează:</strong> Modifică prețurile → apasă <strong style={{ color:"#c8a96e" }}>Export catalog.json</strong> → înlocuiește fișierul <code style={{ color:"#c8a96e" }}>public/catalog.json</code> pe GitHub → Vercel face deploy automat.
          </p>
        </div>
      </main>
    </div>
  );
}
