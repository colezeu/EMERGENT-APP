import { useEffect, useRef } from "react";

export default function BalustradePreview3D({ dimensions, glassType, mountingType, includeHandrail, includeLed }) {
  const canvasRef = useRef(null);

  const length = parseFloat(dimensions.length) || 3;
  const height = parseFloat(dimensions.height) || 0.9;
  const hasSkirt = mountingType === "clips";
  const skirt = hasSkirt ? 0.35 : 0;
  const panelCount = Math.ceil(length / 1.1);
  const pW = length / panelCount;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, W, H);

    const totalH = height + skirt;

    // Rotatie fixa
    const angleY = 0.5;  // rotatie orizontala
    const angleX = 0.2;  // inclinare verticala

    const project = (x, y, z) => {
      // Centram obiectul
      const cx = x - length / 2;
      const cy = y - totalH / 2;
      const cz = z;

      // Rotatie Y
      const rx = cx * Math.cos(angleY) + cz * Math.sin(angleY);
      const rz = -cx * Math.sin(angleY) + cz * Math.cos(angleY);

      // Rotatie X
      const ry = cy * Math.cos(angleX) - rz * Math.sin(angleX);
      const rz2 = cy * Math.sin(angleX) + rz * Math.cos(angleX);

      // Proiectie perspectiva
      const dist = 6;
      const scale = dist / (dist + rz2);
      const px = W / 2 + rx * scale * 90;
      const py = H / 2 - ry * scale * 90;
      return [px, py];
    };

    const face = (pts, fill, stroke, sw = 1) => {
      ctx.beginPath();
      ctx.moveTo(...pts[0]);
      pts.slice(1).forEach(p => ctx.lineTo(...p));
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.stroke(); }
    };

    const box = (x, y, z, w, h, d, cTop, cFront, cSide, stroke) => {
      face([project(x,y,z), project(x+w,y,z), project(x+w,y+h,z), project(x,y+h,z)], cFront, stroke, 0.8);
      face([project(x,y+h,z), project(x+w,y+h,z), project(x+w,y+h,z+d), project(x,y+h,z+d)], cTop, stroke, 0.8);
      face([project(x+w,y,z), project(x+w,y,z+d), project(x+w,y+h,z+d), project(x+w,y+h,z)], cSide, stroke, 0.8);
    };

    // Pardoseala
    face([
      project(-0.2, 0, -0.1), project(length+0.2, 0, -0.1),
      project(length+0.2, 0, 0.15), project(-0.2, 0, 0.15)
    ], "#1a1d26", "rgba(200,169,110,0.2)", 0.5);

    const glassAlpha = glassType === "extraclar" ? 0.22 : glassType === "10mm" ? 0.28 : 0.35;
    const glassFront = `rgba(180,220,255,${glassAlpha})`;
    const glassTop   = `rgba(180,220,255,${glassAlpha * 0.6})`;
    const glassSide  = `rgba(180,220,255,${glassAlpha * 0.4})`;
    const glassStroke = "rgba(180,220,255,0.6)";
    const inox = "rgba(200,169,110,0.9)";
    const inoxTop = "rgba(220,190,130,0.9)";
    const inoxSide = "rgba(160,130,80,0.9)";
    const inoxStroke = "rgba(230,200,140,0.6)";

    // Panouri sticla
    for (let i = 0; i < panelCount; i++) {
      box(i*pW+0.01, 0, -0.005, pW-0.02, totalH, 0.01, glassTop, glassFront, glassSide, glassStroke);
    }

    // Separatori
    for (let i = 1; i < panelCount; i++) {
      box(i*pW-0.008, 0, -0.01, 0.016, totalH, 0.02,
        "rgba(150,190,210,0.5)", "rgba(150,190,210,0.4)", "rgba(120,160,180,0.4)", "rgba(180,220,255,0.3)");
    }

    // BUTONI
    if (mountingType === "clips") {
      for (let i = 0; i < panelCount; i++) {
        [
          { x: i*pW + pW*0.18, y: skirt*0.28 },
          { x: i*pW + pW*0.18, y: skirt*0.72 },
          { x: i*pW + pW*0.82, y: skirt*0.28 },
          { x: i*pW + pW*0.82, y: skirt*0.72 },
        ].forEach(pos => {
          const [cx, cy] = project(pos.x, pos.y, 0.012);
          ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2);
          ctx.fillStyle = "rgba(200,169,110,0.2)"; ctx.fill();
          ctx.strokeStyle = inox; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy, 2.2, 0, Math.PI*2);
          ctx.fillStyle = inox; ctx.fill();
        });
      }
    }

    // MINI-MONTANTI
    if (mountingType === "mini-montanti") {
      [0.08, length-0.1].forEach(x => {
        box(x-0.013, skirt+height*0.23, -0.01, 0.025, height*0.44, 0.02, inoxTop, inox, inoxSide, inoxStroke);
      });
    }

    // PROFILE
    if (mountingType === "profile") {
      box(-0.015, 0, -0.015, 0.03, totalH, 0.03, inoxTop, inox, inoxSide, inoxStroke);
      box(length-0.015, 0, -0.015, 0.03, totalH, 0.03, inoxTop, inox, inoxSide, inoxStroke);
      box(-0.015, -0.015, -0.015, length+0.03, 0.03, 0.03, inoxTop, inox, inoxSide, inoxStroke);
    }

    // CANAL
    if (mountingType === "embedded") {
      box(-0.03, -0.06, -0.02, length+0.06, 0.06, 0.04, inoxTop, inox, inoxSide, inoxStroke);
    }

    // MANA CURENTA
    if (includeHandrail) {
      box(-0.08, totalH, -0.022, length+0.16, 0.04, 0.044, inoxTop, inox, inoxSide, inoxStroke);
    }

    // LED
    if (includeLed) {
      box(0, skirt+0.01, 0.006, length, 0.012, 0.008,
        "rgba(255,220,80,0.9)", "rgba(255,220,80,0.8)", "rgba(255,200,50,0.7)", "rgba(255,240,100,0.9)");
    }

  }, [length, height, glassType, mountingType, includeHandrail, includeLed]);

  return (
    <div style={{ width:"100%", background:"rgba(255,255,255,0.02)", borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize:"0.72rem", color:"rgba(240,237,232,0.35)", padding:"10px 0 4px", textAlign:"center", letterSpacing:"0.08em", textTransform:"uppercase" }}>
        Previzualizare 3D · {panelCount} {panelCount === 1 ? "panou" : "panouri"}
      </div>
      <canvas ref={canvasRef} width={340} height={260} style={{ width:"100%", display:"block" }} />
      <div style={{ display:"flex", gap:12, justifyContent:"center", padding:"8px 12px 12px", flexWrap:"wrap" }}>
        {[
          { color:"rgba(180,220,255,0.6)", label:"Sticlă" },
          mountingType==="clips"         && { color:"rgba(200,169,110,0.8)", label:`Butoni (${panelCount*4} buc)` },
          mountingType==="mini-montanti" && { color:"rgba(200,169,110,0.8)", label:"Mini-Montanți" },
          mountingType==="profile"       && { color:"rgba(200,169,110,0.8)", label:"Profil" },
          mountingType==="embedded"      && { color:"rgba(200,169,110,0.8)", label:"Canal Integrat" },
          hasSkirt        && { color:"rgba(180,220,255,0.25)", label:"Fustă 350mm" },
          includeHandrail && { color:"rgba(200,169,110,0.9)", label:"Mână curentă" },
          includeLed      && { color:"rgba(255,220,80,0.8)",  label:"LED" },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:item.color, border:"1px solid rgba(255,255,255,0.1)" }}/>
            <span style={{ fontSize:"0.7rem", color:"rgba(240,237,232,0.4)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
