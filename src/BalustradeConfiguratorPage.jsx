import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Ruler, GlassWater, Wrench, Check } from "lucide-react";

export default function BalustradeConfiguratorPage() {
  const [dimensions, setDimensions] = useState({ length: "", height: "" });
  const [glassType, setGlassType] = useState("8mm");
  const [mountingType, setMountingType] = useState("clips");
  const [includeHandrail, setIncludeHandrail] = useState(false);
  const [includeLed, setIncludeLed] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quote, setQuote] = useState(null);

  const glassTypes = {
    "8mm": { name: "Sticlă Laminată 8mm", pricePerSqm: 150 },
    "10mm": { name: "Sticlă Securizată 10mm", pricePerSqm: 200 },
    "extraclar": { name: "Sticlă Extra Clară", pricePerSqm: 280 }
  };

  const mountingTypes = {
    "clips": { name: "Cleme Inox", pricePerMeter: 50 },
    "profile": { name: "Profile Aluminiu", pricePerMeter: 80 },
    "embedded": { name: "Canal Integrat", pricePerMeter: 120 }
  };

  const calculatePrice = async () => {
    setCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const length = parseFloat(dimensions.length) || 0;
    const height = parseFloat(dimensions.height) || 0;
    const area = length * height;
    
    const glassPrice = area * glassTypes[glassType].pricePerSqm;
    const mountingPrice = length * mountingTypes[mountingType].pricePerMeter;
    const handrailPrice = includeHandrail ? length * 45 : 0;
    const ledPrice = includeLed ? 150 : 0;
    
    const subtotal = 50 + glassPrice + mountingPrice + handrailPrice + ledPrice;
    const vat = subtotal * 0.19;
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

  const isFormValid = dimensions.length && dimensions.height;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Balustradă Sticlă</h1>
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
                {Object.entries(glassTypes).map(([key, data]) => (
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
                {Object.entries(mountingTypes).map(([key, data]) => (
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

          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h3 className="text-lg font-bold mb-6">Rezumat</h3>
              
              {!showResult ? (
                <button
                  onClick={calculatePrice}
                  disabled={!isFormValid || calculating}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-slate-300"
                >
                  {calculating ? "Se calculează..." : "Calculează Preț"}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-blue-600 text-center">{quote.total}€</div>
                  <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold">
                    <Check className="w-5 h-5 inline mr-2" /> Solicită Ofertă
                  </button>
                  <button onClick={() => setShowResult(false)} className="w-full text-slate-500 py-2">
                    Modifică
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
