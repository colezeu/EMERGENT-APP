export default function BalustradePreview3D({ dimensions, glassType, mountingType, includeHandrail, includeLed }) {
  const length = parseFloat(dimensions.length) || 3;
  const height = parseFloat(dimensions.height) || 0.9;
  const hasSkirt = mountingType === "clips";
  const skirt = hasSkirt ? 0.35 : 0;
  const panelCount = Math.ceil(length / 1.1);

  const W = 340, H = 220;
  const MARGIN_X = 30, MARGIN_Y = 20;
  const totalH = height + skirt;
  const scale = Math.min((W - MARGIN_X * 2) / length, (H - MARGIN_Y * 2) / totalH);
  const gW = length * scale;
  const gH = height * scale;
  const sH = skirt * scale;
  const x0 = (W - gW) / 2;
  const y0 = MARGIN_Y + (H - MARGIN_Y * 2 - gH - sH) / 2;
  const skirtY = y0 + gH;
  const floorY = skirtY + sH;
  const glassOpacity = glassType === "extraclar" ? 0.16 : glassType === "10mm" ? 0.2 : 0.25;
  const glassColor = `rgba(180,220,255,${glassOpacity})`;
  const panels = Array.from({ length: panelCount }, (_, i) => ({
    x1: x0 + (i / panelCount) * gW,
    x2: x0 + ((i + 1) / panelCount) * gW,
  }));

  return (
    <div style={{ width:"100%", background:"rgba(255,255,255,0.02)", borderRadius:16, padding:"16px 12px", border:"1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize:"0.72rem", color:"rgba(240,237,232,0.35)", marginBottom:10, textAlign:"center", letterSpacing:"0.08em", textTransform:"uppercase" }}>
        Previzualizare 2D · {panelCount} {panelCount === 1 ? "panou" : "panouri"}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
        <line x1={x0-16} y1={floorY} x2={x0+gW+16} y2={floorY} stroke="rgba(200,169,110,0.45)" strokeWidth="2.5"/>
        {hasSkirt && (
          <>
            <rect x={x0} y={skirtY} width={gW} height={sH} fill="rgba(180,220,255,0.06)" stroke="rgba(180,220,255,0.2)" strokeWidth="1" strokeDasharray="4,3"/>
            <text x={x0+gW+6} y={skirtY+sH/2+3} fill="rgba(200,169,110,0.5)" fontSize="7" fontFamily="DM Sans">350</text>
          </>
        )}
        <rect x={x0} y={y0} width={gW} height={gH} fill={glassColor} stroke="rgba(180,220,255,0.55)" strokeWidth="1.5" rx="1"/>
        {panels.map((p, i) => i > 0 && (
          <line key={i} x1={p.x1} y1={y0} x2={p.x1} y2={floorY} stroke="rgba(180,220,255,0.15)" strokeWidth="1" strokeDasharray="3,3"/>
        ))}
        {mountingType === "clips" && panels.map((p, i) => {
          const left  = p.x1 + (p.x2 - p.x1) * 0.18;
          const right = p.x1 + (p.x2 - p.x1) * 0.82;
          const top   = skirtY + sH * 0.28;
          const bot   = skirtY + sH * 0.72;
          return [{cx:left,cy:top},{cx:left,cy:bot},{cx:right,cy:top},{cx:right,cy:bot}].map((b,j) => (
            <g key={`${i}-${j}`}>
              <circle cx={b.cx} cy={b.cy} r={5} fill="rgba(200,169,110,0.15)" stroke="rgba(200,169,110,0.75)" strokeWidth="1.2"/>
              <circle cx={b.cx} cy={b.cy} r={2.2} fill="rgba(200,169,110,0.6)"/>
            </g>
          ));
        })}
        {mountingType === "mini-montanti" && (
          <>
            <rect x={x0+10} y={y0+gH*0.76} width={6} height={gH*0.24*0.8+11} fill="rgba(200,169,110,0.5)" stroke="rgba(200,169,110,0.8)" strokeWidth="1" rx="1.5"/>
            <rect x={x0+gW-16} y={y0+gH*0.76} width={6} height={gH*0.24*0.8+11} fill="rgba(200,169,110,0.5)" stroke="rgba(200,169,110,0.8)" strokeWidth="1" rx="1.5"/>
          </>
        )}
        {mountingType === "profile" && (
          <>
            <rect x={x0-5} y={y0} width={7} height={gH} fill="rgba(200,169,110,0.5)" rx="2"/>
            <rect x={x0+gW-2} y={y0} width={7} height={gH} fill="rgba(200,169,110,0.5)" rx="2"/>
            <rect x={x0-5} y={y0+gH-4} width={gW+10} height={8} fill="rgba(200,169,110,0.4)" rx="2"/>
          </>
        )}
        {mountingType === "embedded" && (
          <>
            <rect x={x0-3} y={floorY-14} width={gW+6} height={14} fill="rgba(200,169,110,0.35)" rx="2"/>
            <rect x={x0-1} y={floorY-12} width={gW+2} height={10} fill="rgba(200,169,110,0.15)" rx="1"/>
          </>
        )}
        {includeHandrail && (
          <rect x={x0-8} y={y0-9} width={gW+16} height={8} fill="rgba(200,169,110,0.65)" rx="4"/>
        )}
        {includeLed && (
          <rect x={x0} y={y0+gH-5} width={gW} height={4} fill="rgba(255,220,120,0.55)" rx="2"/>
        )}
        {dimensions.length && (
          <text x={x0+gW/2} y={H-2} textAnchor="middle" fill="rgba(200,169,110,0.8)" fontSize="9" fontFamily="DM Sans">
            {dimensions.length}m · {panelCount} {panelCount===1?"panou":"panouri"}
          </text>
        )}
        {dimensions.height && (
          <text x={18} y={y0+gH/2+3} textAnchor="middle" fill="rgba(200,169,110,0.8)" fontSize="9" fontFamily="DM Sans"
            transform={`rotate(-90, 18, ${y0+gH/2})`}>
            {dimensions.height}m
          </text>
        )}
      </svg>
    </div>
  );
}
