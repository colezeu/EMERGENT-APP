cat << 'EOF'
export default function BalustradePreview2D({ dimensions, glassType, mountingType, includeHandrail, includeLed }) {
  const length = parseFloat(dimensions.length) || 3;
  const height = parseFloat(dimensions.height) || 0.9;
  const SKIRT = mountingType === "clips" ? 0.35 : 0; // 350mm fusta doar la butoni

  const W = 340, H = 220;
  const MARGIN_X = 30, MARGIN_Y = 20;
  const totalH = height + SKIRT;
  const scale = Math.min((W - MARGIN_X * 2) / length, (H - MARGIN_Y * 2) / totalH);
  const gW = length * scale;
  const gH = height * scale;
  const sH = SKIRT * scale; // fusta pixels
  const x0 = (W - gW) / 2;
  const y0 = MARGIN_Y + (H - MARGIN_Y * 2 - gH - sH) / 2; // panou sticla top
  const skirtY = y0 + gH; // fusta incepe aici
  const floorY = skirtY + sH; // pardoseala

  const glassOpacity = glassType === "extraclar" ? 0.16 : glassType === "10mm" ? 0.2 : 0.25;
  const glassColor = `rgba(180,220,255,${glassOpacity})`;

  // Butoni: 2 randuri, distribuiti pe lungime
  const buttonCols = Math.max(2, Math.round(length * 1.2));
  const buttonRows = height > 0.6 ? 2 : 1;
  const buttonY = buttonRows === 2
    ? [y0 + gH * 0.28, y0 + gH * 0.72]
    : [y0 + gH * 0.5];

  return (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "16px 12px", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.35)", marginBottom: 10, textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Previzualizare 2D · Vedere Frontală
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>

        {/* Pardoseala */}
        <line x1={x0 - 16} y1={floorY} x2={x0 + gW + 16} y2={floorY}
          stroke="rgba(200,169,110,0.45)" strokeWidth="2.5" />

        {/* FUSTA (doar la butoni) */}
        {SKIRT > 0 && (
          <>
            {/* fusta - portiunea ingropata/laterala, aspect diferit */}
            <rect x={x0} y={skirtY} width={gW} height={sH}
              fill="rgba(180,220,255,0.06)"
              stroke="rgba(180,220,255,0.2)" strokeWidth="1"
              strokeDasharray="4,3" />
            {/* linie separare fusta-panou */}
            <line x1={x0} y1={skirtY} x2={x0 + gW} y2={skirtY}
              stroke="rgba(180,220,255,0.35)" strokeWidth="1" strokeDasharray="3,3" />
            {/* eticheta fusta */}
            <text x={x0 + gW + 6} y={skirtY + sH / 2 + 3}
              fill="rgba(200,169,110,0.5)" fontSize="7" fontFamily="DM Sans">350</text>
            <line x1={x0 + gW + 4} y1={skirtY} x2={x0 + gW + 4} y2={floorY}
              stroke="rgba(200,169,110,0.3)" strokeWidth="0.8" />
          </>
        )}

        {/* Panou sticla */}
        <rect x={x0} y={y0} width={gW} height={gH}
          fill={glassColor}
          stroke="rgba(180,220,255,0.55)" strokeWidth="1.5"
          rx="1" />
        {/* Reflectie sticla */}
        <rect x={x0 + 6} y={y0 + 6} width={9} height={gH * 0.38}
          fill="rgba(255,255,255,0.055)" rx="4" />

        {/* ── FERONERIE ── */}

        {/* BUTONI INOX */}
        {mountingType === "clips" && buttonY.map((by, ri) =>
          Array.from({ length: buttonCols }, (_, ci) => {
            const bx = x0 + (ci / (buttonCols - 1)) * gW;
            return (
              <g key={`b-${ri}-${ci}`}>
                {/* disc exterior */}
                <circle cx={bx} cy={by} r={5.5}
                  fill="rgba(200,169,110,0.15)"
                  stroke="rgba(200,169,110,0.75)" strokeWidth="1.2" />
                {/* disc interior */}
                <circle cx={bx} cy={by} r={2.5}
                  fill="rgba(200,169,110,0.6)" />
                {/* stift spre fusta */}
                {ri === buttonRows - 1 && SKIRT > 0 && (
                  <line x1={bx} y1={by + 5.5} x2={bx} y2={skirtY}
                    stroke="rgba(200,169,110,0.25)" strokeWidth="0.8" strokeDasharray="2,2" />
                )}
              </g>
            );
          })
        )}

        {/* PROFILE (U/V/L) */}
        {mountingType === "profile" && (
          <>
            <rect x={x0 - 5} y={y0} width={7} height={gH} fill="rgba(200,169,110,0.5)" rx="2" />
            <rect x={x0 + gW - 2} y={y0} width={7} height={gH} fill="rgba(200,169,110,0.5)" rx="2" />
            <rect x={x0 - 5} y={y0 + gH - 4} width={gW + 10} height={8} fill="rgba(200,169,110,0.4)" rx="2" />
          </>
        )}

        {/* MINI-MONTANTI */}
        {mountingType === "clips" === false && mountingType === "profile" === false && (
          // embedded / canal
          <rect x={x0 - 3} y={floorY - 12} width={gW + 6} height={12}
            fill="rgba(200,169,110,0.4)" rx="2" />
        )}

        {/* CANAL INTEGRAT */}
        {mountingType === "embedded" && (
          <>
            <rect x={x0 - 3} y={floorY - 14} width={gW + 6} height={14}
              fill="rgba(200,169,110,0.35)" rx="2" />
            <rect x={x0 - 1} y={floorY - 12} width={gW + 2} height={10}
              fill="rgba(200,169,110,0.15)" rx="1" />
          </>
        )}

        {/* MANA CURENTA */}
        {includeHandrail && (
          <rect x={x0 - 8} y={y0 - 9} width={gW + 16} height={8}
            fill="rgba(200,169,110,0.65)" rx="4" />
        )}

        {/* LED */}
        {includeLed && (
          <rect x={x0} y={y0 + gH - 5} width={gW} height={4}
            fill="rgba(255,220,120,0.55)" rx="2" />
        )}

        {/* Dimensiune lungime */}
        {dimensions.length && (
          <>
            <line x1={x0} y1={H - 10} x2={x0 + gW} y2={H - 10}
              stroke="rgba(200,169,110,0.45)" strokeWidth="1" />
            <line x1={x0} y1={H - 14} x2={x0} y2={H - 6} stroke="rgba(200,169,110,0.45)" strokeWidth="1" />
            <line x1={x0 + gW} y1={H - 14} x2={x0 + gW} y2={H - 6} stroke="rgba(200,169,110,0.45)" strokeWidth="1" />
            <text x={x0 + gW / 2} y={H - 2} textAnchor="middle"
              fill="rgba(200,169,110,0.8)" fontSize="9" fontFamily="DM Sans">
              {dimensions.length}m
            </text>
          </>
        )}

        {/* Dimensiune inaltime panou */}
        {dimensions.height && (
          <>
            <line x1={10} y1={y0} x2={10} y2={y0 + gH}
              stroke="rgba(200,169,110,0.45)" strokeWidth="1" />
            <line x1={6} y1={y0} x2={14} y2={y0} stroke="rgba(200,169,110,0.45)" strokeWidth="1" />
            <line x1={6} y1={y0 + gH} x2={14} y2={y0 + gH} stroke="rgba(200,169,110,0.45)" strokeWidth="1" />
            <text x={18} y={y0 + gH / 2 + 3} textAnchor="middle"
              fill="rgba(200,169,110,0.8)" fontSize="9" fontFamily="DM Sans"
              transform={`rotate(-90, 18, ${y0 + gH / 2})`}>
              {dimensions.height}m
            </text>
          </>
        )}

      </svg>

      {/* Legenda */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
        {[
          { color: "rgba(180,220,255,0.6)", label: "Sticlă" },
          mountingType === "clips"    && { color: "rgba(200,169,110,0.75)", label: "Butoni Inox" },
          mountingType === "profile"  && { color: "rgba(200,169,110,0.7)",  label: "Profil" },
          mountingType === "embedded" && { color: "rgba(200,169,110,0.6)",  label: "Canal Integrat" },
          SKIRT > 0 && { color: "rgba(180,220,255,0.25)", label: "Fustă 350mm" },
          includeHandrail && { color: "rgba(200,169,110,0.9)", label: "Mână curentă" },
          includeLed      && { color: "rgba(255,220,120,0.8)", label: "LED" },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
            <span style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.45)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF
Output
}
