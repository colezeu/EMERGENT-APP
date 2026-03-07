export default function HomePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Glass Associates</h1>
      <p>Site-ul funcționează!</p>
      <a href="/configurator">Mergi la Configurator</a>
    </div>
  );
}
        category: "Cabine",
        description: "Cabine și paravane pentru duș din sticlă securizată. Uși batante, culisante sau fixe.",
        icon: ShowerHead,
        image_url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
        base_price_per_sqm: "120"
    }
];

export default function HomePage() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState(productCategories);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20 px-8">
                <div className="max-w-4xl mx-auto">
                    <p className="text-sm uppercase tracking-widest text-slate-400 mb-4">
                        Soluții din sticlă structurală
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Transformăm<br />
                        <span className="text-blue-400">transparența</span><br />
                        în siguranță
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl">
                        Configurați produsele din sticlă structurală de înaltă precizie
                        pentru proiecte de arhitectură premium.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/configurator">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-medium flex items-center gap-2 transition-colors">
                                Configurați Acum
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                        <button 
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            className="border border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 font-medium transition-colors"
                        >
                            Vezi Produsele
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm uppercase tracking-widest text-slate-500 mb-4">
                            De ce să alegeți Glass Associates
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Configurator inteligent
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-8 border border-slate-200 hover:border-blue-500 transition-colors">
                                <feature.icon className="h-10 w-10 text-blue-600 mb-6" />
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <p className="text-sm uppercase tracking-widest text-slate-500 mb-4">
                                Catalog Produse
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Gama noastră de produse
                            </h2>
                        </div>
                        <Link to="/configurator">
                            <button className="border border-slate-300 px-6 py-2 hover:bg-slate-100 transition-colors">
                                Vezi Toate
                            </button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {products.map((product) => (
                            <Link key={product.id} to={`/configurator/${product.id}`}>
                                <div className="group bg-white overflow-hidden border border-slate-200 hover:border-blue-500 transition-all hover:shadow-lg">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="text-xs font-mono uppercase bg-white/90 px-3 py-1">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-mono text-slate-500">
                                                de la €{product.base_price_per_sqm}/m²
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="max-w-3xl mx-auto px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Pregătit să configurați?
                    </h2>
                    <p className="text-lg text-slate-300 mb-8">
                        Obțineți o ofertă personalizată pentru proiectul dumneavoastră în doar câteva minute.
                    </p>
                    <Link to="/configurator">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 font-medium">
                            Începe Configurarea
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
