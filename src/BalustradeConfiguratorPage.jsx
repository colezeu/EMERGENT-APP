import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BalustradeConfiguratorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Configurare Balustradă</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Dimensiuni și Opțiuni</h2>
          
          {/* Formular simplu */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Lungime (metri)</label>
              <input 
                type="number" 
                placeholder="Ex: 3.5"
                className="w-full border border-slate-300 p-3 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Înălțime (metri)</label>
              <input 
                type="number" 
                placeholder="Ex: 1.2"
                className="w-full border border-slate-300 p-3 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tip Sticlă</label>
              <select className="w-full border border-slate-300 p-3 rounded">
                <option>Sticlă laminată 8mm</option>
                <option>Sticlă securizată 10mm</option>
                <option>Sticlă extra clară</option>
              </select>
            </div>

            <div className="pt-4">
              <button className="bg-blue-600 text-white px-8 py-3 font-medium hover:bg-blue-700">
                Calculează Preț
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


