export default function BalustradePreview2D({ dimensions, glassType, mountingType, includeHandrail, includeLed }) {
  const length = parseFloat(dimensions.length) || 3;
  const height = parseFloat(dimensions.height) || 1.1;

  const W = 340, H = 200;
  const MARGIN = 30;
  const scale = Math.min((W - MARGIN * 2) / length, (H - MARGIN * 2) / height);
  const gW = Math.min(length * scale, W - MARGIN * 2);
  const gH = Math.min(height * scale, H - MARGIN * 2);
  const x0 = (W - gW) / 2;
  const y0 = (H - gH) / 2;

  const glassOpacity = glassType === "extraclar" ? 0.18 : glassType === "10mm" ? 0.22 : 0.27;
  const glassColor = glassType === "extraclar" ? "rgba(200,235,255," : "rgba(180,220,255,";

  // Mounting
  const clipCount = Math.max(2, Math.round(length * 1.5));
  const clips = Array.from({ length: clipCount }, (_, i) => x0 + (i / (clipCount - 1)) * gW);

  return (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "16px 12px", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.35)", marginBottom: 10, textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Previzualizare 2D · Vedere Frontală
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {/* Floor line */}
        <line x1={x0 - 16} y1={y0 + gH} x2={x0 + gW + 16} y2={y0 + gH}
          stroke="rgba(200,169,110,0.4)" strokeWidth="2" />

        {/* Glass panel */}
        <rect x={x0} y={y0} width={gW} height={gH}
          fill={glassColor + glassOpacity + ")"}
          stroke="rgba(180,220,255,0.5)" strokeWidth="1.5"
          rx="1"
        />
        {/* Glass reflection */}
        <rect x={x0 + 6} y={y0 + 6} width={10} height={gH * 0.4}
          fill="rgba(255,255,255,0.06)" rx="5" />

        {/* Mounting system */}
        {mountingType === "clips" && clips.map((cx, i) => (
          <g key={i}>
            <rect x={cx - 5} y={y0 + gH - 2} width={10} height={14}
              fill="rgba(200,169,110,0.7)" rx="2" />
            <rect x={cx - 7} y={y0 + gH + 10} width={14} height={5}
              fill="rgba(200,169,110,0.5)" rx="2" />
          </g>
        ))}
        {mountingType === "profile" && (
          <>
            <rect x={x0 - 6} y={y0} width={8} height={gH}
              fill="rgba(200,169,110,0.5)" rx="2" />
            <rect x={x0 + gW - 2} y={y0} width={8} height={gH}
              fill="rgba(200,169,110,0.5)" rx="2" />
            <rect x={x0 - 6} y={y0 + gH - 4} width={gW + 12} height={8}
              fill="rgba(200,169,110,0.4)" rx="2" />
          </>
        )}
        {mountingType === "embedded" && (
          <rect x={x0 - 4} y={y0 + gH} width={gW + 8} height={12}
            fill="rgba(200,169,110,0.35)" rx="2" />
        )}

        {/* Handrail */}
        {includeHandrail && (
          <g>
            <rect x={x0 - 8} y={y0 - 8} width={gW + 16} height={8}
              fill="rgba(200,169,110,0.6)" rx="4" />
          </g>
        )}

        {/* LED strip */}
        {includeLed && (
          <>
            <rect x={x0} y={y0 + gH - 6} width={gW} height={4}
              fill="rgba(255,220,120,0.5)" rx="2" />
            <rect x={x0} y={y0 + gH - 6} width={gW} height={4}
              fill="rgba(255,220,120,0.2)" rx="2"
              filter="url(#glow)" />
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </>
        )}

        {/* Dimensions */}
        {dimensions.length && (
          <>
            <line x1={x0} y1={H - 8} x2={x0 + gW} y2={H - 8}
              stroke="rgba(200,169,110,0.5)" strokeWidth="1" markerEnd="url(#arr)" markerStart="url(#arr)" />
            <text x={x0 + gW / 2} y={H - 10} textAnchor="middle"
              fill="rgba(200,169,110,0.8)" fontSize="9" fontFamily="DM Sans">
              {dimensions.length}m
            </text>
          </>
        )}
        {dimensions.height && (
          <>
            <line x1={8} y1={y0} x2={8} y2={y0 + gH}
              stroke="rgba(200,169,110,0.5)" strokeWidth="1" />
            <text x={18} y={y0 + gH / 2} textAnchor="middle"
              fill="rgba(200,169,110,0.8)" fontSize="9" fontFamily="DM Sans"
              transform={`rotate(-90, 18, ${y0 + gH / 2})`}>
              {dimensions.height}m
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
        {[
          { color: "rgba(180,220,255,0.6)", label: "Sticlă" },
          mountingType && { color: "rgba(200,169,110,0.7)", label: mountingType === "embedded" ? "Canal" : mountingType === "profile" ? "Profil" : "Cleme" },
          includeHandrail && { color: "rgba(200,169,110,0.9)", label: "Mână curentă" },
          includeLed && { color: "rgba(255,220,120,0.8)", label: "LED" }
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
