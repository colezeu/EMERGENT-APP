export default function BalustradePreview3D({ dimensions, glassType, mountingType, includeHandrail, includeLed }) {
  const length = parseFloat(dimensions.length) || 3;
  const height = parseFloat(dimensions.height) || 0.9;
  const hasSkirt = mountingType === "clips";
  const skirt = hasSkirt ? 0.35 : 0;
  const panelCount = Math.ceil(length / 1.1);

  // Izometric projection
  const W = 340, H = 240;
  const scale = Math.min(120 / length, 80 / (height + skirt + 0.3));
  const isoX = (x, z) => W * 0.18 + (x + z) * scale * 0.7;
  const isoY = (x, y, z) => H * 0.75 - y * scale - (x - z) * scale * 0.35;

  const glassOpacity = glassType === "extraclar" ? 0.18 : glassType === "10mm" ? 0.24 : 0.3;
  const glassStroke = "rgba(180,220,255,0.6)";
  const glassFill = `rgba(180,220,255,${glassOpacity})`;
  const inox = "rgba(200,169,110,0.85)";
  const inoxDark = "rgba(160,130,80,0.9)";

  const totalH = height + skirt;

  // Helper: draw iso face (parallelogram)
  const isoFace = (x0, y0, z0, dx, dy, dz, fill, stroke = "none", sw = 0) => {
    const pts = [
      [isoX(x0, z0),          isoY(x0, y0, z0)],
      [isoX(x0+dx, z0+dz),    isoY(x0+dx, y0, z0+dz)],
      [isoX(x0+dx, z0+dz),    isoY(x0+dx, y0+dy, z0+dz)],
      [isoX(x0, z0),          isoY(x0, y0+dy, z0)],
    ];
    return `M${pts[0]} L${pts[1]} L${pts[2]} L${pts[3]} Z`;
  };

  const panels = Array.from({ length: panelCount }, (_, i) => i);
  const pW = length / panelCount;

  return (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "12px", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.35)", marginBottom: 6, textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Previzualizare 3D · {panelCount} {panelCount === 1 ? "panou" : "panouri"}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>

        {/* Pardoseala */}
        <path d={isoFace(0, -0.04, -0.15, length, 0.04, 0, "rgba(30,33,44,0.9)", "rgba(200,169,110,0.2)", 1)}
          fill="rgba(30,33,44,0.9)" stroke="rgba(200,169,110,0.2)" strokeWidth="1" />
        <path d={isoFace(0, -0.04, -0.15, length, 0.04, 0.15, "rgba(25,28,38,0.9)")}
          fill="rgba(25,28,38,0.9)" stroke="rgba(200,169,110,0.15)" strokeWidth="0.5" />

        {/* Panouri sticla */}
        {panels.map(i => (
          <g key={i}>
            {/* Fata frontala */}
            <path
              d={isoFace(i * pW, 0, 0, pW - 0.02, totalH, 0, glassFill, glassStroke, 1)}
              fill={glassFill} stroke={glassStroke} strokeWidth="1"
            />
            {/* Fata laterala (grosime) */}
            <path
              d={isoFace(i * pW + pW - 0.02, 0, 0, 0.01, totalH, 0, "rgba(140,190,220,0.15)")}
              fill="rgba(140,190,220,0.15)" stroke="rgba(180,220,255,0.3)" strokeWidth="0.5"
            />
            {/* Sus */}
            <path
              d={isoFace(i * pW, totalH, 0, pW - 0.02, 0, 0.01, "rgba(200,230,255,0.12)")}
              fill="rgba(200,230,255,0.12)" stroke="rgba(180,220,255,0.4)" strokeWidth="0.5"
            />
            {/* Rama sus */}
            <path
              d={isoFace(i * pW, totalH - 0.01, 0, pW - 0.02, 0.01, 0, "rgba(150,190,210,0.5)")}
              fill="rgba(150,190,210,0.5)" stroke="rgba(180,220,255,0.5)" strokeWidth="0.5"
            />
            {/* Separator panouri */}
            {i > 0 && (
              <line
                x1={isoX(i * pW, 0)} y1={isoY(i * pW, 0, 0)}
                x2={isoX(i * pW, 0)} y2={isoY(i * pW, totalH, 0)}
                stroke="rgba(180,220,255,0.2)" strokeWidth="1" strokeDasharray="3,2"
              />
            )}
          </g>
        ))}

        {/* BUTONI INOX */}
        {mountingType === "clips" && panels.map(i => {
          const positions = [
            { x: i * pW + pW * 0.18, y: skirt * 0.28 },
            { x: i * pW + pW * 0.18, y: skirt * 0.72 },
            { x: i * pW + pW * 0.82, y: skirt * 0.28 },
            { x: i * pW + pW * 0.82, y: skirt * 0.72 },
          ];
          return positions.map((pos, j) => (
            <g key={`b-${i}-${j}`}>
              <circle
                cx={isoX(pos.x, 0.015)} cy={isoY(pos.x, pos.y, 0.015)} r={4}
                fill="rgba(200,169,110,0.2)" stroke={inox} strokeWidth="1.2"
              />
              <circle
                cx={isoX(pos.x, 0.015)} cy={isoY(pos.x, pos.y, 0.015)} r={1.8}
                fill={inox}
              />
            </g>
          ));
        })}

        {/* MINI-MONTANTI */}
        {mountingType === "mini-montanti" && [0.08, length - 0.08].map((x, i) => (
          <g key={i}>
            <path
              d={isoFace(x - 0.013, skirt + height * 0.23, 0, 0.025, height * 0.55, 0, inox)}
              fill={inox} stroke={inoxDark} strokeWidth="0.5"
            />
            <path
              d={isoFace(x + 0.012, skirt + height * 0.23, 0, 0.01, height * 0.55, 0, inoxDark)}
              fill={inoxDark}
            />
          </g>
        ))}

        {/* PROFILE */}
        {mountingType === "profile" && (
          <>
            {[0, length - 0.03].map((x, i) => (
              <g key={i}>
                <path d={isoFace(x, 0, 0, 0.03, totalH, 0, inox)} fill={inox} stroke={inoxDark} strokeWidth="0.5" />
                <path d={isoFace(x + 0.03, 0, 0, 0, totalH, 0.03, inoxDark)} fill={inoxDark} />
              </g>
            ))}
            <path d={isoFace(0, 0, 0, length, 0.03, 0, inox)} fill={inox} stroke={inoxDark} strokeWidth="0.5" />
          </>
        )}

        {/* CANAL INTEGRAT */}
        {mountingType === "embedded" && (
          <>
            <path d={isoFace(-0.03, 0, 0, length + 0.06, 0.06, 0, inox)} fill={inox} stroke={inoxDark} strokeWidth="0.5" />
            <path d={isoFace(length + 0.03, 0, 0, 0, 0.06, 0.04, inoxDark)} fill={inoxDark} />
          </>
        )}

        {/* MANA CURENTA */}
        {includeHandrail && (
          <>
            <path
              d={isoFace(-0.08, totalH, 0, length + 0.16, 0.04, 0, inox)}
              fill={inox} stroke={inoxDark} strokeWidth="0.5"
            />
            <path
              d={isoFace(length + 0.08, totalH, 0, 0, 0.04, 0.04, inoxDark)}
              fill={inoxDark}
            />
          </>
        )}

        {/* LED */}
        {includeLed && (
          <path
            d={isoFace(0, skirt + 0.01, 0.005, length, 0.01, 0, "rgba(255,220,80,0.7)")}
            fill="rgba(255,220,80,0.7)" stroke="rgba(255,200,50,0.9)" strokeWidth="0.5"
          />
        )}

        {/* Dimensiuni */}
        <text x={isoX(length / 2, 0) - 5} y={isoY(length / 2, -0.12, 0)}
          fill="rgba(200,169,110,0.7)" fontSize="8" fontFamily="DM Sans" textAnchor="middle">
          {dimensions.length || "—"}m
        </text>
        <text x={isoX(0, 0) - 22} y={isoY(0, totalH / 2, 0)}
          fill="rgba(200,169,110,0.7)" fontSize="8" fontFamily="DM Sans" textAnchor="middle">
          {dimensions.height || "—"}m
        </text>

      </svg>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4, flexWrap: "wrap" }}>
        {[
          { color: glassFill, label: "Sticlă" },
          mountingType === "clips"         && { color: inox, label: `Butoni (${panelCount * 4} buc)` },
          mountingType === "mini-montanti" && { color: inox, label: "Mini-Montanți" },
          mountingType === "profile"       && { color: inox, label: "Profil" },
          mountingType === "embedded"      && { color: inox, label: "Canal Integrat" },
          hasSkirt        && { color: "rgba(180,220,255,0.25)", label: "Fustă 350mm" },
          includeHandrail && { color: inox, label: "Mână curentă" },
          includeLed      && { color: "rgba(255,220,80,0.8)", label: "LED" },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, border: "1px solid rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: "0.7rem", color: "rgba(240,237,232,0.4)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
