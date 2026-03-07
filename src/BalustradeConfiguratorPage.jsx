import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Ruler, Check } from "lucide-react";

export default function BalustradeConfiguratorPage() {
  const [catalog, setCatalog] = useState(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  
  const [dimensions, setDimensions] = useState({ length: "", height: "" });
  const [glassType, setGlassType] = useState("8mm");
  const [mountingType, setMountingType] = useState("clips");
  const [includeHandrail, setIncludeHandrail] = useState(false);
  const [includeLed, setIncludeLed] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quote, setQuote] = useState(null);

  // Încarcă catalogul la montare
  useEffect(() => {
    fetch("/catalog.json")
      .then(res => res.json())
      .then(data => {
        setCatalog(data);
        setLoadingCatalog(false);
      })
      .catch(err => {
        console.error("Eroare încărcare catalog:", err);
        // Fallback la date hardcodate dacă nu găsește fișierul
        setCatalog({
          products: {
            balustrade: {
              name: "Balustradă Sticlă",
              basePrice: 50,
              glassTypes: {
                "8mm": { name: "Sticlă Laminată 8mm", pricePerSqm: 150 },
                "10mm": { name: "Sticlă Securizată 10mm", pricePerSqm: 200 },
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
