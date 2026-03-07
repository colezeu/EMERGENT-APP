import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShowerHead, Maximize, Droplets, Check } from "lucide-react";

export default function ShowerConfiguratorPage() {
  const [catalog, setCatalog] = useState(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  
  const [dimensions, setDimensions] = useState({ width: "", depth: "", height: "2.0" });
  const [glassType, setGlassType] = useState("8mm");
  const [doorType, setDoorType] = useState("swing");
  const [treatment, setTreatment] = useState("clear");
  const [includeTowelBar, setIncludeTowelBar] = useState(false);
  const [includeSeat, setIncludeSeat] = useState(false);
  const [includeLed, setIncludeLed] = useState(false);
  
  const [calculating, setCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    fetch("/catalog.json")
      .then(res => res.json())
      .then(data => {
        setCatalog(data);
        setLoadingCatalog(false);
      })
      .catch(err => {
        console.error("Eroare încărcare catalog:", err);
        setLoadingCatalog(false);
      });
  }, []);

  const calculatePrice = async () => {
    if (!catalog) return;
    
    setCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const productData = catalog.products["cabine-dus"];
    const width = parseFloat(dimensions.width) || 0;
    const depth = parseFloat(dimensions.depth) || 0;
    const height = parseFloat(dimensions.height) || 0;
    
    // Calculăm suprafața totală de sticlă (2 pereți laterali + ușă)
    const area = (width * height) + (depth * height) + (width * height); // 3 pereți tipic
    const floorArea = width * depth;
    
    const glassPrice = area * productData.glassTypes[glassType].pricePerSqm;
    const doorPrice = productData.doorTypes[doorType].price;
    const treatmentPrice = area * productData.treatments[treatment].pricePerSqm;
    
    const towelPrice = includeTowelBar ? productData.options.towelBar.price : 0;
    const seatPrice = includeSeat ? productData.options.seat.price : 0;
    const ledPrice = includeLed ? productData.options.led.price : 0;
    
    const subtotal = productData.basePrice + glassPrice + doorPrice + treatmentPrice + towelPrice + seatPrice + ledPrice;
    const vat = subtotal * catalog.vatRate;
    const total = subtotal + vat;
    
    setQuote({
      area: area.toFixed(2),
      width: width.toFixed(2),
      depth: depth.toFixed(2),
      glassPrice: Math.round(glassPrice),
      doorPrice: doorPrice,
      treatmentPrice: Math.round(treatmentPrice),
      towelPrice: towelPrice,
      seatPrice: seatPrice,
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const productData = catalog.products["cabine-dus"];
  const isFormValid = dimensions.width && dimensions.depth;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <header className="bg-slate-900 text-white py-6 px-8 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-white/10 transition-all hover:scale-110">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{productData.name}</h1>
            <p className="text-slate-400 text-sm">Preț actualizat: {new Date().toLocaleDateString('ro-RO')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dimensiuni */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Maximize className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-bold">Dimensiuni Cabină</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Lățime (m)</label>
                  <input 
                    type="number" 
                    step="0.05"
                    min="0.7"
                    max="2.0"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                    className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-cyan-500 outline-none"
                    placeholder="Ex: 0.9"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Adâncime (m)</label>
                  <input 
                    type="number" 
                    step="0.05"
                    min="0.7"
                    max="2.0"
                    value={dimensions.depth}
                    onChange={(e) => setDimensions({...dimensions, depth: e.target.value})}
                    className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-cyan-500 outline-none"
                    placeholder="Ex: 0.9"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Înălțime (m)</label>
                  <select
                    value={dimensions.height}
                    onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                    className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-cyan-500 outline-none"
                  >
                    <option value="1.9">1.9m</option>
                    <option value="2.0">2.0m (standard)</option>
                    <option value="2.1">2.1m</option>
                    <option value="2.2">2.2m</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tip Sticlă */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Droplets className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold">Tip Sticlă</h2>
              </div>

              <div className="space-y-3">
                {Object.entries(productData.glassTypes).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setGlassType(key)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      glassType === key ? "border-blue-500 bg-blue-50 shadow-md" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">{data.name}</div>
                      <div className="text-sm text-slate-500">Rezistență sporită la șocuri termice</div>
                    </div>
                    <div className="text-blue-600 font-bold">{data.pricePerSqm}€/m²</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tip Ușă */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShowerHead className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-bold">Tip Deschidere</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(productData.doorTypes).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setDoorType(key)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      doorType === key ? "border-cyan-500 bg-cyan-50 shadow-md" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-semibold text-slate-800 mb-1">{data.name}</div>
                    {data.price > 0 && (
                      <div className="text-cyan-600 font-bold text-sm">+{data.price}€</div>
                    )}
                    {data.price === 0 && (
                      <div className="text-slate-400 text-sm">Inclus</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tratamente */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Tratament Suprafață</h2>
              <div className="space-y-3">
                {Object.entries(productData.treatments).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setTreatment(key)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      treatment === key ? "border-purple-500 bg-purple-50 shadow-md" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">{data.name}</div>
                    </div>
                    {data.pricePerSqm > 0 ? (
                      <div className="text-purple-600 font-bold">+{data.pricePerSqm}€/m²</div>
                    ) : (
                      <div className="text-slate-400 text-sm">Standard</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Opțiuni */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Accesorii</h2>
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  includeTowelBar ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-slate-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={includeTowelBar} onChange={(e) => setIncludeTowelBar(e.target.checked)} className="w-5 h-5" />
                    <span className="font-medium">{productData.options.towelBar.name}</span>
                  </div>
                  <span className="text-slate-600">{productData.options.towelBar.price}€</span>
                </label>

                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  includeSeat ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-slate-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={includeSeat} onChange={(e) => setIncludeSeat(e.target.checked)} className="w-5 h-5" />
                    <span className="font-medium">{productData.options.seat.name}</span>
                  </div>
                  <span className="text-slate-600">{productData.options.seat.price}€</span>
                </label>

                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  includeLed ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-slate-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={includeLed} onChange={(e) => setIncludeLed(e.target.checked)} className="w-5 h-5" />
                    <span className="font-medium">{productData.options.led.name}</span>
                  </div>
                  <span className="text-slate-600">{productData.options.led.price}€</span>
                </label>
              </div>
            </div>

          </div>

          {/* Sidebar Rezumat */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8 border-t-4 border-cyan-500">
              <h3 className="text-lg font-bold mb-6 text-slate-800">Rezumat Ofertă</h3>
              
              {!showResult ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-6">Introduceți dimensiunile cabinei</p>
                  <button
                    onClick={calculatePrice}
                    disabled={!isFormValid || calculating}
                    className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
                      <span className="text-slate-600">Suprafață sticlă:</span>
                      <span className="font-medium">{quote.area} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sticlă:</span>
                      <span className="font-medium">{quote.glassPrice}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tip ușă:</span>
                      <span className="font-medium">{quote.doorPrice}€</span>
                    </div>
                    {quote.treatmentPrice > 0 && (
                      <div className="flex justify-between text-purple-700">
                        <span>Tratament:</span>
                        <span className="font-medium">+{quote.treatmentPrice}€</span>
                      </div>
                    )}
                    {quote.towelPrice > 0 && (
                      <div className="flex justify-between text-cyan-700">
                        <span>Port prosop:</span>
                        <span className="font-medium">+{quote.towelPrice}€</span>
                      </div>
                    )}
                    {quote.seatPrice > 0 && (
                      <div className="flex justify-between text-cyan-700">
                        <span>Scaun:</span>
                        <span className="font-medium">+{quote.seatPrice}€</span>
                      </div>
                    )}
                    {quote.ledPrice > 0 && (
                      <div className="flex justify-between text-cyan-700">
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
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-3xl font-bold text-cyan-600">{quote.total}€</span>
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
