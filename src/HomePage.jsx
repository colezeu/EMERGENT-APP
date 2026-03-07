import { Link } from "react-router-dom";
import { ArrowRight, Ruler, Sparkles, Shield, Check } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4">
            Soluții din sticlă structurală
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transformăm<br />
            <span className="text-blue-400">transparența</span> în siguranță
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mb-8">
            Configurați produse din sticlă structurală de înaltă precizie pentru proiecte de arhitectură premium.
          </p>
          <Link 
            to="/configurator/balustrade" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Configurați Acum <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">De ce să alegeți Glass Associates</h2>
            <p className="text-slate-500">Configurator inteligent</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Ruler className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Dimensiuni Personalizate</h3>
              <p className="text-slate-600 text-sm">Configurați dimensiunile exacte pentru proiectul dumneavoastră</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Vizualizare Instant</h3>
              <p className="text-slate-600 text-sm">Vedeți cum va arăta produsul final în timp real</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Calitate Certificată</h3>
              <p className="text-slate-600 text-sm">Sticlă securizată și laminată conform standardelor europene</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Catalog Produse</p>
              <h2 className="text-3xl font-bold text-slate-900">Gama noastră de produse</h2>
            </div>
            <Link to="/configurator" className="text-blue-600 hover:underline font-medium">
              Vezi Toate →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Balustrade */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="h-64 bg-slate-200 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" 
                  alt="Balustrade sticlă" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-slate-700">
                  Balustrade
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">Balustrade Sticlă</h3>
                <p className="text-slate-600 mb-4 text-sm">Balustrade din sticlă pentru scări, balcoane și terase. Design modern și siguranță maximă.</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">de la <span className="text-slate-900 font-bold">150€/m²</span></span>
                  <Link to="/configurator/balustrade" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    Configurează <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Cabine Duș */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="h-64 bg-slate-200 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800" 
                  alt="Cabine duș" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-slate-700">
                  Cabine Duș
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">Cabine Duș</h3>
                <p className="text-slate-600 mb-4 text-sm">Cabine și paravane pentru duș din sticlă securizată. Uși batante sau culisante.</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">de la <span className="text-slate-900 font-bold">120€/m²</span></span>
                  <Link to="/configurator" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    Configurează <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pregătit să configurați?</h2>
          <p className="text-slate-400 mb-8 text-lg">Obțineți o ofertă personalizată în doar câteva minute.</p>
          <Link 
            to="/configurator/balustrade"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold transition-colors"
          >
            Începe Configurarea
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          © 2024 Glass Associates. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}
