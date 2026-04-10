import { useState, useEffect } from "react";
import { ConfigHeader, SectionCard, OptionBtn, ToggleOption, NumberInput, QuoteSidebar, PreviewBox, PageLoader, calcQuote } from "./ConfiguratorShared.jsx";
import QuoteModal from "./QuoteModal.jsx";
import BalustradePreview3D from "./BalustradePreview2D.jsx";

const FALLBACK = { name:"Balustrade", basePrice:50, glassShapes:{ dreapta:{name:"Sticlă Dreaptă",desc:"Panou drept standard"}, forma:{name:"Sticlă Formă (rampă)",desc:"Tăiat pe unghi / curbă"} }, hardwareTypes:{ butoni:{name:"Cu Butoni Inox",pricePerMeter:55,desc:"Puncte de fixare, design minimalist"}, profil:{name:"Cu Profil",pricePerMeter:80,desc:"Profil U/V/L la bază"}, "mini-montanti":{name:"Cu Mini-Montanți",pricePerMeter:95,desc:"Montanți intermediari inox"}, "profil-pardoseala":{name:"Profil Pardoseală",pricePerMeter:120,desc:"Canal integrat în pardoseală"} }, profileShapes:{ U:{name:"Formă U",pricePerMeter:0}, V:{name:"Formă V",pricePerMeter:10}, L:{name:"Formă L",pricePerMeter:10} }, glassTypes:{ "8mm":{name:"Sticlă Laminată 8mm",pricePerSqm:150,desc:"Laminat 44.2, ideal interior"}, "10mm":{name:"Sticlă Securizată 10mm",pricePerSqm:200,desc:"Standard exterior"}, extraclar:{name:"Sticlă Extra Clară",pricePerSqm:280,desc:"Transparență maximă"} }, options:{ handrail:{name:"Mână Curentă Inox",pricePerMeter:45,desc:"Rotundă Ø42mm, satinat"}, "handrail-slim":{name:"Mână Curentă Slim",pricePerMeter:85,desc:"Profil plat 40x10mm"}, led:{name:"Iluminare LED",price:150,desc:"Bandă LED 3000K"} } };

export default function BalustradeConfiguratorPage() {
  const [product, setProduct] = useState(null);
  const [vatRate, setVatRate] = useState(0.19);
  const [dims, setDims] = useState({ length:"", height:"0.9" });
  const [glassShape, setGlassShape] = useState("dreapta");
  const [hardware, setHardware] = useState("butoni");
  const [profileShape, setProfileShape] = useState("U");
  const [glassType, setGlassType] = useState("8mm");
  const [handrail, setHandrail] = useState("none");
  const [includeLed, setIncludeLed] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/catalog.json").then(r=>r.json())
      .then(d => { setProduct(d.products.balustrade); setVatRate(d.vatRate); })
      .catch(() => setProduct(FALLBACK));
  }, []);

  const p = product;
  const showProfileShape = hardware === "profil" || hardware === "profil-pardoseala";
  const isValid = dims.length && parseFloat(dims.length) > 0;

  const calculate = async () => {
    if (!p) return;
    setCalculating(true);
    await new Promise(r => setTimeout(r, 600));
    const len = parseFloat(dims.length) || 0;
    const h   = parseFloat(dims.height)  || 0;
    const skirt = hardware === "butoni" ? 0.35 : 0;
    const area = len * (h + skirt);
    const hwPrice      = len  * p.hardwareTypes[hardware].pricePerMeter;
    const profExtra    = showProfileShape ? len * (p.profileShapes[profileShape]?.pricePerMeter || 0) : 0;
    const glassPrice   = area * p.glassTypes[glassType].pricePerSqm;
    const handrailP    = handrail !== "none" ? len * p.options[handrail].pricePerMeter : 0;
    const ledP         = includeLed ? p.options.led.price : 0;
    const raw = p.basePrice + hwPrice + profExtra + glassPrice + handrailP + ledP;
    const { subtotal, vat, total } = calcQuote(raw, vatRate);
    setQuote({ area:area.toFixed(2), hwPrice:Math.round(hwPrice+profExtra), glassPrice:Math.round(glassPrice), handrailP:Math.round(handrailP), ledP, subtotal, vat, total });
    setCalculating(false);
  };

  if (!p) return <PageLoader />;

  return (
    <div style={{ minHeight:"100vh", background:"#0f1117", color:"#f0ede8" }}>
      <QuoteModal isOpen={showModal} onClose={() => setShowModal(false)} quote={quote} productName="Balustradă Sticlă" />
      <ConfigHeader title="Configurator Balustrade" quote={quote} />

      <main style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px", display:"grid", gridTemplateColumns:"1fr 340px", gap:24 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          <SectionCard num="01" label="Dimensiuni">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <NumberInput label="Lungime (m)" value={dims.length} onChange={v=>setDims(d=>({...d,length:v}))} placeholder="Ex: 5.0" />
              <NumberInput label="Înălțime (m)" value={dims.height} onChange={v=>setDims(d=>({...d,height:v}))} placeholder="Ex: 1.1" step="0.05" />
            </div>
          </SectionCard>

          <SectionCard num="02" label="Tip Sticlă">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {Object.entries(p.glassShapes).map(([k,d]) => (
                <OptionBtn key={k} selected={glassShape===k} onClick={() => setGlassShape(k)} label={d.name} desc={d.desc} />
              ))}
            </div>
          </SectionCard>

          <SectionCard num="03" label="Feronerie / Sistem Prindere">
            {Object.entries(p.hardwareTypes).map(([k,d]) => (
              <OptionBtn key={k} selected={hardware===k} onClick={() => setHardware(k)} label={d.name} desc={d.desc} price={`${d.pricePerMeter}€/m`} />
            ))}
            {showProfileShape && (
              <div style={{ marginTop:8 }}>
                <div style={{ fontSize:"0.78rem", color:"rgba(240,237,232,0.4)", marginBottom:8 }}>Formă profil:</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {Object.entries(p.profileShapes).map(([k,d]) => (
                    <OptionBtn key={k} selected={profileShape===k} onClick={() => setProfileShape(k)}
                      label={d.name} price={d.pricePerMeter > 0 ? `+${d.pricePerMeter}€/m` : "Inclus"} center />
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard num="04" label="Calitate Sticlă">
            {Object.entries(p.glassTypes).map(([k,d]) => (
              <OptionBtn key={k} selected={glassType===k} onClick={() => setGlassType(k)} label={d.name} desc={d.desc} price={`${d.pricePerSqm}€/m²`} />
            ))}
          </SectionCard>

          <SectionCard num="05" label="Accesorii (opționale)">
            {[
              { key:"none",         label:"Fără mână curentă", desc:"", price:"—" },
              { key:"handrail",     label:p.options.handrail.name,       desc:p.options.handrail.desc,       price:`${p.options.handrail.pricePerMeter}€/m` },
              { key:"handrail-slim",label:p.options["handrail-slim"].name, desc:p.options["handrail-slim"].desc, price:`${p.options["handrail-slim"].pricePerMeter}€/m` },
            ].map(o => (
              <OptionBtn key={o.key} selected={handrail===o.key} onClick={() => setHandrail(o.key)} label={o.label} desc={o.desc} price={o.price} />
            ))}
            <ToggleOption checked={includeLed} onChange={setIncludeLed}
              label={p.options.led.name} desc={p.options.led.desc} price={`${p.options.led.price}€`} />
          </SectionCard>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <PreviewBox>
            <BalustradePreview2D dimensions={dims} glassType={glassType} mountingType={
              hardware==="butoni" ? "clips" : hardware==="mini-montanti" ? "mini-montanti" : hardware==="profil-pardoseala" ? "embedded" : "profile"
            } includeHandrail={handrail !== "none"} includeLed={includeLed} />
          </PreviewBox>
          <QuoteSidebar quote={quote} isFormValid={isValid} calculating={calculating}
            onCalculate={calculate} onReset={() => setQuote(null)} onSolicita={() => setShowModal(true)}
            lines={quote ? [
              { label:"Suprafață", value:`${quote.area} m²` },
              { label:"Feronerie", value:`${quote.hwPrice}€` },
              { label:"Sticlă", value:`${quote.glassPrice}€` },
              quote.handrailP > 0 && { label:"Mână curentă", value:`+${quote.handrailP}€`, accent:true },
              quote.ledP > 0 && { label:"LED", value:`+${quote.ledP}€`, accent:true },
            ] : []}
          />
        </div>
      </main>
    </div>
  );
}
