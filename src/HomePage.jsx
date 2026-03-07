import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shield, Ruler, Fence, ShowerHead } from "lucide-react";

const features = [
    {
        icon: Ruler,
        title: "Dimensiuni Personalizate",
        description: "Configurați dimensiunile exacte pentru proiectul dumneavoastră"
    },
    {
        icon: Sparkles,
        title: "Vizualizare Instant",
        description: "Vedeți cum va arăta produsul final în timp real"
    },
    {
        icon: Shield,
        title: "Calitate Certificată",
        description: "Sticlă securizată și laminată conform standardelor europene"
    }
];

const productCategories = [
    {
        id: "balustrade",
        name: "Balustrade",
        description: "Balustrade din sticlă pentru scări, balcoane și terase. Sticlă dreaptă sau pentru rampă.",
        icon: Fence,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        link: "/configurator/balustrade",
        features: ["Sticlă laminată", "Butoni sau profile", "Mână curentă opțională"]
    },
    {
        id: "cabine-dus",
        name: "Cabine Duș",
        description: "Cabine și paravane pentru duș din sticlă securizată. Uși batante, culisante sau fixe.",
        icon: ShowerHead,
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
        link: "/configurator/cabine-dus",
        features: ["Sticlă securizată", "Uși batante/culisante", "Port prosop opțional"]
    }
];

export default function HomePage() {
    return (
        <div className="pt-16 md:pt-20">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center hero-gradient">
                <div className="absolute inset-0 grid-pattern opacity-50" />

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
                    <div className="max-w-3xl">
                        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-6 animate-fade-in">
                            Soluții din sticlă structurală
                        </p>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6 animate-fade-in delay-100">
                            Transformăm
                            <br />
                            <span className="text-accent">transparența</span>
                            <br />
                            în siguranță
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl animate-fade-in delay-200">
                            Configurați produsele din sticlă structurală de înaltă precizie
                            pentru proiecte de arhitectură premium. Obțineți o ofertă personalizată în câteva minute.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
                            <Link to="/configurator">
                                <Button
                                    size="lg"
                                    className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 font-medium tracking-wide uppercase text-sm group"
                                    data-testid="hero-cta"
                                >
                                    Configurați Acum
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-none border-input bg-background hover:bg-accent hover:text-accent-foreground h-14 px-10 font-medium tracking-wide uppercase text-sm"
                                data-testid="hero-secondary-cta"
                                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Vezi Produsele
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[70%] hidden xl:block">
                    <div className="w-full h-full bg-secondary/50 relative overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                            alt="Architectural glass"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32 bg-card">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
                            De ce să alegeți Glass Associates
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Configurator inteligent
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="p-8 bg-card border-border/50 hover:border-accent/50 transition-colors duration-300"
                                data-testid={`feature-card-${index}`}
                            >
                                <feature.icon className="h-10 w-10 text-accent mb-6" />
                                <h3 className="text-xl font-semibold tracking-tight mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div>
                            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
                                Catalog Produse
                            </p>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                Gama noastră de produse
                            </h2>
                        </div>
                        <Link to="/configurator">
                            <Button
                                variant="outline"
                                className="rounded-none border-input h-10 px-6 font-medium tracking-wide uppercase text-xs"
                                data-testid="view-all-products"
                            >
                                Vezi Toate
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-[400px] loading-shimmer rounded-none" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.slice(0, 6).map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/configurator/${product.id}`}
                                    data-testid={`product-card-${product.id}`}
                                >
                                    <Card className="group h-[400px] overflow-hidden bg-card border-border/50 hover:border-accent/50 transition-all duration-300 hover-lift product-card">
                                        <div className="relative h-[200px] overflow-hidden">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 product-image-overlay" />
                                            <div className="absolute top-4 left-4">
                                                <span className="text-[10px] font-mono tracking-widest uppercase bg-background/90 px-3 py-1">
                                                    {product.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold tracking-tight mb-2 group-hover:text-accent transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-mono text-muted-foreground">
                                                    de la €{product.base_price_per_sqm}/m²
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 bg-primary text-primary-foreground">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Pregătit să configurați?
                    </h2>
                    <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10">
                        Obțineți o ofertă personalizată pentru proiectul dumneavoastră în doar câteva minute.
                    </p>
                    <Link to="/configurator">
                        <Button
                            size="lg"
                            className="rounded-none bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-10 font-medium tracking-wide uppercase text-sm"
                            data-testid="final-cta"
                        >
                            Începe Configurarea
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}


