export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Transformăm transparența în siguranță
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Configurați produse din sticlă structurală
        </p>
        <a 
          href="/configurator" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded font-medium"
        >
          Configurați Acum
        </a>
      </div>
    </div>
  );
}
