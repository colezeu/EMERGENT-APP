import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Ruler, GlassWater, Wrench, Check } from "lucide-react";
import catalog from "../data/catalog.json";  // ← ADAUGĂ ASTA

export default function BalustradeConfiguratorPage() {
  const productData = catalog.products.balustrade;  // ← Extrage datele
  
  const [dimensions, setDimensions] = useState({ length: "", height: "" });
  const [glassType, setGlassType] = useState("8mm");
  const [mountingType, setMountingType] = useState("clips");
  const [includeHandrail, setIncludeHandrail] = useState(false);
  const [includeLed, setIncludeLed] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quote, setQuote] = useState(null);

  // ȘTERGE aceste două linii (hardcodate):
  // const glassTypes = {...}
  // const mountingTypes = {...}

  const calculatePrice = async () => {
    setCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const length = parseFloat(dimensions.length) || 0;
    const height = parseFloat(dimensions.height) || 0;
    const area = length * height;
    
    // Folosește datele din catalog:
    const glassPrice = area * productData.glassTypes[glassType].pricePerSqm;
    const mountingPrice = length * productData.mountingTypes[mountingType].pricePerMeter;
    const handrailPrice = includeHandrail ? length * productData.options.handrail.pricePerMeter : 0;
    const ledPrice = includeLed ? productData.options.led.price : 0;
    
    const subtotal = productData.basePrice + glassPrice + mountingPrice + handrailPrice + ledPrice;
    const vat = subtotal * catalog.vatRate;  // ← Folosește catalog.vatRate
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

  // Restul rămâne la fel, doar că înlocuiești:
  // glassTypes → productData.glassTypes
  // mountingTypes → productData.mountingTypes
