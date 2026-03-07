import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BalustradeConfiguratorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Configurare Balustradă</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Formular Configurare</h2>
          <p className="text-slate-600">Aici va fi formularul real...</p>
          <Link to="/" className="inline-block mt-6 text-blue-600 hover:underline">
            ← Înapoi la pagina principală
          </Link>
        </div>
      </main>
    </div>
  );
}
