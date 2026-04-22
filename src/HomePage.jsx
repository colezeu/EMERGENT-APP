import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";

const PRODUCTS = [
  { id: "balustrade",        name: "Balustrade",                    tagline: "Scări, balcoane, terase",          price: "de la 150€/m²", path: "/configurator/balustrade",        desc: "Sticlă dreaptă sau pe rampă, cu butoni, profil U/V/L, mini-montanți sau canal în pardoseală." },
  { id: "cabine-dus",        name: "Cabine Duș",                    tagline: "Paravan fix, mobil, uși batante/culisante", price: "de la 120€/m²", path: "/configurator/cabine-dus",        desc: "Paravan fix sau mobil (evantai), ușă batantă sau culisantă cu glisori la vedere sau în șină." },
  { id: "inchidere-terasa",  name: "Închidere Mobilă Terase",       tagline: "Multitrack · Frameless · Ghilotină", price: "de la 380€/m²", path: "/configurator/inchidere-terasa",  desc: "Sisteme de închidere terase și balcoane: multitrack, frameless full-glass sau ghilotină verticală." },
  { id: "pergola",           name: "Pergole",                       tagline: "Bioclimatică · Sticlă · Sandwich",  price: "de la 420€/m²", path: "/configurator/pergola-copertina", desc: "Pergole bioclimatice cu lamele orientabile, acoperiș din sticlă culisant sau panou sandwich termoizolant." },
  { id: "copertina",         name: "Copertine",                     tagline: "Tiranți · Consolă · Spider",        price: "de la 350€/m²", path: "/configurator/copertina",         desc: "Copertine din sticlă cu tiranți din inox, în consolă fără suport vizibil sau pe prinderi spider." },
  { id: "usi-batante",       name: "Uși Batante",                   tagline: "Simple · Pe toc · Fonoizolante",   price: "de la 220€/m²", path: "/configurator/usi-batante",       desc: "Uși batante din securit 10–12mm, cu balamale standard sau amortizor hidraulic soft-close." },
  { id: "usi-culisante",     name: "Uși Culisante",                 tagline: "Full glass · Buzunar · Sincron",   price: "de la 220€/m²", path: "/configurator/usi-culisante",     desc: "Prindere pe perete, tavan sau sincron fără șină jos. Cu sau fără panou fix, varianta buzunar." },
  { id: "partitionari",      name: "Partiționări",                  tagline: "Simple · Caroiaj · Fonoizolante",  price: "de la 280€/m²", path: "/configurator/partitionari",      desc: "Partiții din sticlă securizată sau laminat acustic. Cu sau fără profile caroiaj, ușă inclusă." },
];

const STATS = [
  { value: "2400+", label: "Proiecte finalizate" },
  { value: "18 ani", label: "Experiență" },
  { value: "CE", label: "Certificare europeană" },
  { value: "48h", label: "Ofertă personalizată" },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", color: "#f0ede8", position: "relative" }}>

      {/* Fixed background image — stays visible on scroll */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "url('/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />
      {/* Fixed dark overlay on the image */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "linear-gradient(to right, rgba(15,17,23,0.92) 0%, rgba(15,17,23,0.78) 50%, rgba(15,17,23,0.45) 100%)",
      }} />

      {/* All scrollable content sits above the fixed bg */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Nav */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          padding: "0 32px",
          background: "rgba(15,17,23,0.85)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 64
        }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/logo.png"
              alt="Glass Associates"
              style={{ height: 28, filter: "invert(1)", opacity: 0.95 }}
            />
          </Link>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {PRODUCTS.map(p => (
              <Link key={p.id} to={p.path} className="nav-link" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>{p.name}</Link>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <section style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          padding: "0", position: "relative",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", padding: "140px 32px 100px" }}>
            <div className="anim-fade-up" style={{ marginBottom: 24 }}>
              <span style={{
                fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#c8a96e",
                border: "1px solid rgba(200,169,110,0.3)", borderRadius: 20,
                padding: "6px 16px", display: "inline-block"
              }}>
                Soluții din sticlă structurală
              </span>
            </div>

            <h1 className="serif anim-fade-up-2" style={{
              fontSize: "clamp(2.8rem, 7vw, 5.2rem)", lineHeight: 1.08,
              marginBottom: 24, fontWeight: 400, maxWidth: 600
            }}>
              Transparența<br /><span className="shimmer-text">devenită artă.</span>
            </h1>

            <p className="anim-fade-up-3" style={{
              maxWidth: 480, fontSize: "1.05rem", lineHeight: 1.75,
              color: "rgba(240,237,232,0.6)", marginBottom: 40
            }}>
              Configurați produse din sticlă de înaltă precizie — balustrade, cabine duș, terase, pergole, uși și partiționări. Ofertă în 48h.
            </p>

            <div className="anim-fade-up-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/configurator/balustrade">
                <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  Configurează Acum <ArrowRight size={16} />
                </button>
              </Link>
              <a href="mailto:contact@glassassociates.ro">
                <button className="btn-ghost">Contact Direct</button>
              </a>
            </div>

            {/* Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)",
              marginTop: 80, border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, overflow: "hidden",
              background: "rgba(15,17,23,0.6)", backdropFilter: "blur(12px)"
            }} className="anim-fade-up-4">
              {STATS.map((s, i) => (
                <div key={i} style={{
                  padding: "24px 20px",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#c8a96e", fontFamily: "'DM Serif Display', serif" }}>{s.value}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.45)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products grid — semi-transparent bg so hero bleeds through subtly */}
        <section style={{
          padding: "80px 32px",
          background: "rgba(15,17,23,0.88)",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 12 }}>Catalog Produse</p>
              <h2 className="serif" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 400 }}>Gama noastră completă</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 20 }}>
              {PRODUCTS.map((p, i) => (
                <Link key={p.id} to={p.path} style={{ textDecoration: "none" }}>
                  <div className="glass-card glass-card-hover" style={{ borderRadius: 20, padding: "32px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 14 }}>{p.tagline}</div>
                      <h3 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: 10, fontFamily: "'DM Serif Display', serif" }}>{p.name}</h3>
                      <p style={{ fontSize: "0.83rem", color: "rgba(240,237,232,0.43)", lineHeight: 1.65, marginBottom: 24 }}>{p.desc}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.3)" }}>{p.price}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#c8a96e", fontSize: "0.8rem", fontWeight: 600 }}>
                        Configurează <ChevronRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: "80px 32px",
          background: "rgba(15,17,23,0.88)",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{
            maxWidth: 900, margin: "0 auto",
            background: "linear-gradient(135deg, rgba(200,169,110,0.1), rgba(200,169,110,0.03))",
            border: "1px solid rgba(200,169,110,0.2)", borderRadius: 24,
            padding: "60px 48px", textAlign: "center"
          }}>
            <h2 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", marginBottom: 16, fontWeight: 400 }}>Pregătit să configurați?</h2>
            <p style={{ color: "rgba(240,237,232,0.45)", marginBottom: 32, fontSize: "1rem" }}>Ofertă personalizată în câteva minute.</p>
            <Link to="/configurator/balustrade">
              <button className="btn-primary" style={{ fontSize: "1rem", padding: "16px 40px" }}>Începe Configurarea</button>
            </Link>
          </div>
        </section>

        <footer style={{
          padding: "32px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          textAlign: "center",
          color: "rgba(240,237,232,0.25)",
          fontSize: "0.82rem",
          background: "rgba(15,17,23,0.92)",
        }}>
          © 2026 Glass Associates · Soluții din sticlă structurală
        </footer>
      </div>
    </div>
  );
}
