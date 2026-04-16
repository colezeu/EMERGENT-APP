import { useState, useEffect } from "react";
import { ConfigHeader, SectionCard, OptionBtn, ToggleOption, NumberInput, SelectInput, QuoteSidebar, PreviewBox, PageLoader, calcQuote } from "./ConfiguratorShared.jsx";
import QuoteModal from "./QuoteModal.jsx";
import ShowerPreview2D from "./ShowerPreview2D.jsx";
import AIConsultant from "./AIConsultant.jsx";

const FALLBACK = { name:"Cabine Duș", basePrice:80, enclosureTypes:{ "paravan-fix-profil":{name:"Paravan Fix cu Profil",price:0,desc:"Fix, cu profil perimetral"}, "paravan-fix-punctual":{name:"Paravan Fix cu Prinderi Fine",price:50,desc:"Prinderi punctuale inox"}, "paravan-mobil":{name:"Paravan Mobil (evantai)",price:180,desc:"Se pliază în evantai"}, "usa-batanta":{name:"Ușă Batantă",price:200,desc:"Deschidere 180°, balamale ascunse"}, "usa-culisanta-vedere":{name:"Ușă Culisantă la Vedere",price:300,desc:"Glisori vizibili"}, "usa-culisanta-sina":{name:"Ușă Culisantă în Șină",price:380,desc:"Sistem ascuns soft-close"} }, glassTypes:{ "8mm":{name:"Securit 8mm",pricePerSqm:130,desc:"Standard"}, "10mm":{name:"Securit 10mm",pricePerSqm:170,desc:"Robustețe sporită"} }, treatments:{ clear:{name:"Transparentă",pricePerSqm:0,desc:""}, frosted:{name:"Sablată",pricePerSqm:25,desc:"Opacă"}, nano:{name:"Nano Anti-Calcar",pricePerSqm:35,desc:""} }, options:{ towelBar:{name:"Port Prosop",price:45,desc:""}, seat:{name:"Scaun Rabatabil",price:85,desc:""}, led:{name:"Iluminare LED",price:120,desc:""} } };

export default function ShowerConfiguratorPage() {
  const [product, setProduct] = useState(null);
  const [vatRate, setVatRate] = useState(0.19);
  const [dims, setDims] = useState({ width:"", depth:"", height:"2.0" });
  const [enclosure, setEnclosure] = useState("usa-batanta");
  const [glassType, setGlassType] = useState("8mm");
  const [treatment, setTreatment] = useState("clear");
  const [inclTowel, setInclTowel] = useState(false);
  const [inclSeat, setInclSeat] = useState(false);
  const [inclLed, setInclLed] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/catalog.json").then(r=>r.json())
      .then(d => { setProduct(d.products["cabine-dus"]); setVatRate(d.vatRate); })
      .catch(() => setProduct(FALLBACK));
  }, []);

  const p = product;
  const isValid = dims.width && dims.depth && parseFloat(dims.width) > 0;

  function applyAIPrefill(prefill) {
    if (!prefill) return;

    if (prefill.width != null || prefill.depth != null || prefill.height != null) {
      setDims((prev) => ({
        ...prev,
        width:
          prefill.width != null && prefill.width !== ""
            ? String(prefill.width)
            : prev.width,
        depth:
          prefill.depth != null && prefill.depth !== ""
            ? String(prefill.depth)
            : prev.depth,
        height:
          prefill.height != null && prefill.height !== ""
            ? String(prefill.height)
            : prev.height,
      }));
    }

    if (prefill.enclosure && p?.enclosureTypes?.[prefill.enclosure]) {
      setEnclosure(prefill.enclosure);
    }

    if (prefill.glassType && p?.glassTypes?.[prefill.glassType]) {
      setGlassType(prefill.glassType);
    }

    if (prefill.treatment && p?.treatments?.[prefill.treatment]) {
      setTreatment(prefill.treatment);
    }

    if (prefill.options) {
      if (typeof prefill.options.towelBar === "boolean") {
        setInclTowel(prefill.options.towelBar);
      }
      if (typeof prefill.options.seat === "boolean") {
        setInclSeat(prefill.options.seat);
      }
}
