```jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Ruler, GlassWater, Wrench, Check } from "lucide-react";

// Datele direct în fișier (temporar, până rezolvăm JSON-ul)
const productData = {
  name: "Balustradă Sticlă",
  basePrice: 50,
  glassTypes: {
    "8mm": { name: "Sticlă Laminată 8mm", pricePerSqm: 150, description: "Standard, ideală pentru interior" },
    "10mm": { name: "Sticlă Securizată 10mm", pricePerSqm: 200, description: "Rezistență sporită, exterior" },
    "extraclar": { name: "Sticlă Extra Clară", pricePerSqm: 280, description: "Transparență maximă, premium" }
  },
  mountingTypes: {
    "clips": { name: "Cleme Inox", pricePerMeter: 50, description: "Montare discretă, modernă" },
    "profile": { name: "Profile Aluminiu", pricePerMeter: 80, description: "Finisaj anodizat, elegant" },
    "embedded": { name: "Canal Integrat", pricePerMeter: 120, description: "Montaj în podea, minimalist" }
  },
  options: {
    "handrail": { name: "Mână Curentă", pricePerMeter: 45, description: "Lemn sau inox" },
    "led": { name: "Iluminare LED", price: 150, description: "Benzi LED integrate" }
  }
};

const vatRate = 0.19;

export default function BalustradeConfiguratorPage() {
  const [dimensions, setDimensions] = useState({ length: "", height: "" });
  const [glassType, setGlassType] = useState("8mm");
  const [mountingType, setMountingType] = useState("clips");
  const [includeHandrail, setIncludeHandrail] = useState(false);
  const [includeLed, setIncludeLed] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quote, setQuote] = useState(null);

  const calculatePrice = async () => {
    setCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const length = parseFloat(dimensions.length) || 0;
    const height = parseFloat(dimensions.height) || 0;
    const area = length * height;
    
    const glassPrice = area * productData.glassTypes[glassType].pricePerSqm;
    const mountingPrice = length * productData.mountingTypes[mountingType].pricePerMeter;
    const handrailPrice = includeHandrail ? length * productData.options.handrail.pricePerMeter : 0;
    const ledPrice = includeLed ? productData.options.led.price : 0;
    
    const subtotal = productData.basePrice + glassPrice + mountingPrice + handrailPrice + ledPrice;
    const vat = subtotal * vatRate;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 px-8 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-white/10 transition-all hover:scale-110">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{productData.name}</h1>
            <p className="text-slate-400 text-sm">Configurator Preț • Actualizat: {new Date().toLocaleDateString('ro-RO')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Formular */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dimensiuni */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Ruler className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Dimensiuni</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Lungime (m)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0.5"
                    max="50"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                    className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-blue-500 outline-none transition-all"
                    placeholder="Ex: 3.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Înălțime (m)</label>
                  <select
                    value={dimensions.height}
                    onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                    className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Alege...</option>
                    <option value="0.9">0.9m (joasă)</option>
                    <option value="1.0">1.0m (standard)</option>
                    <option value="1.1">1.1m</option>
                    <option value="1.2">1.2m (exterior)</option>
                    <option value="1.5">1.5m (scări publice)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tip Sticlă */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-100 rounded-xl">
                  <GlassWater className="w-6 h-6 text-cyan-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Tip Sticlă</h2>
              </div>

              <div className="space-y-3">
                {Object.entries(productData.glassTypes).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setGlassType(key)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      glassType === key 
                        ? "border-blue-500 bg-blue-50 shadow-md" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">{data.name}</div>
                      <div className="text-sm text-slate-500">{data.description}</div>
                    </div>
                    <div className="text-blue-600 font-bold">{data.pricePerSqm}€/m²</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tip Montare */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Wrench className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Sistem Prindere</h2>
              </div>

              <div className="space-y-3">
                {Object.entries(productData.mountingTypes).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setMountingType(key)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      mountingType === key 
                        ? "border-purple-500 bg-purple-50 shadow-md" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-800">{data.name}</div>
                        <div className="text-sm text-slate-500">{data.description}</div>
                      </div>
                      <div className="text-purple-600 font-bold">{data.pricePerMeter}€/m</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Opțiuni */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Opțiuni Adiționale</h2>
              
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  includeHandrail ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-slate-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={includeHandrail}
                      onChange={(e) => setIncludeHandrail(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{productData.options.handrail.name}</div>
                      <div className="text-sm text-slate-500">{productData.options.handrail.description}</div>
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium">{productData.options.handrail.pricePerMeter}€/m</span>
                </label>

                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  includeLed ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-slate-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={includeLed}
                      onChange={(e) => setIncludeLed(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{productData.options.led.name}</div>
                      <div className="text-sm text-slate-500">{productData.options.led.description}</div>
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium">{productData.options.led.price}€</span>
                </label>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8 border-t-4 border-blue-500">
              <h3 className="text-lg font-bold mb-6 text-slate-800">Rezumat Ofertă</h3>
              
              {!showResult ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-6">Introduceți dimensiunile pentru a calcula prețul</p>
                  <button
                    onClick={calculatePrice}
                    disabled={!isFormValid || calculating}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {calculating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se calculează...
                      </>
                    ) : (
                      "Calculează Preț"
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2 text-sm border-b border-slate-200 pb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Suprafață:</span>
                      <span className="font-medium">{quote.area} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sticlă:</span>
                      <span className="font-medium">{quote.glassPrice}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Montare:</span>
                      <span className="font-medium">{quote.mountingPrice}€</span>
                    </div>
                    {quote.handrailPrice > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Mână curentă:</span>
                        <span className="font-medium">+{quote.handrailPrice}€</span>
                      </div>
                    )}
                    {quote.ledPrice > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>LED:</span>
                        <span className="font-medium">+{quote.ledPrice}€</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-medium">{quote.subtotal}€</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>TVA (19%):</span>
                      <span>{quote.vat}€</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-slate-800">Total:</span>
                    <span className="text-3xl font-bold text-blue-600">{quote.total}€</span>
                  </div>

                  <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Solicită Ofertă
                  </button>
                  
                  <button 
                    onClick={() => setShowResult(false)}
                    className="w-full text-slate-500 py-2 hover:text-slate-700 transition-all text-sm"
                  >
                    ← Modifică configurarea
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
```
