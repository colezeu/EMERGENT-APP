import { useEffect, useRef, useState } from "react";

export default function BalustradePreview3D({ 
  dimensions, 
  glassType, 
  mountingType, 
  profileShape, 
  skirtOverride, 
  glassShape, 
  includeHandrail, 
  includeLed 
}) {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0.2, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const length = parseFloat(dimensions.length) || 3;
  const height = parseFloat(dimensions.height) || 0.9;
  
  // Calcul fustă
  const skirt = skirtOverride !== undefined ? skirtOverride
    : mountingType === "clips" ? 0.35
    : (mountingType === "profile" && profileShape === "V") ? 0.10
    : 0;
  
  const hasSkirt = skirt > 0;
  const panelCount = Math.ceil(length / 1.1);
  const panelWidth = length / panelCount;

  // Materiale și culori
  const materials = {
    inox: { 
      main: "rgba(200,169,110,0.95)", 
      top: "rgba(220,190,130,0.95)", 
      side: "rgba(160,130,80,0.95)",
      stroke: "rgba(230,200,140,0.8)",
      highlight: "rgba(255,220,180,0.6)"
    },
    glass: {
      extraclar: { alpha: 0.15, strokeAlpha: 0.5 },
      standard: { alpha: 0.35, strokeAlpha: 0.6 },
      opaque: { alpha: 0.7, strokeAlpha: 0.8 }
    }
  };

  const glassAlpha = glassType === "extraclar" ? materials.glass.extraclar.alpha 
    : glassType === "10mm" ? materials.glass.standard.alpha 
    : materials.glass.opaque.alpha;

  // Proiecție 3D îmbunătățită
  const project = (x, y, z, canvasWidth, canvasHeight) => {
    const totalH = height + skirt;
    const cx = x - length / 2;
    const cy = y - totalH / 2;
    const cz = z;
    
    // Rotație Y (orizontală)
    const rx = cx * Math.cos(rotation.y) + cz * Math.sin(rotation.y);
    const rz = -cx * Math.sin(rotation.y) + cz * Math.cos(rotation.y);
    
    // Rotație X (verticală)
    const ry = cy * Math.cos(rotation.x) - rz * Math.sin(rotation.x);
    const rz2 = cy * Math.sin(rotation.x) + rz * Math.cos(rotation.x);
    
    // Perspectivă
    const dist = 6 + rz2 * 0.1;
    const sc = 5 / (dist + rz2);
    return [
      canvasWidth / 2 + rx * sc * 100,
      canvasHeight / 2 - ry * sc * 100,
      sc // scale pentru depth sorting
    ];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    
    // Clear
    ctx.fillStyle = "#0a0c12";
    ctx.fillRect(0, 0, W, H);
    
    // Gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#0f1117");
    bgGrad.addColorStop(1, "#1a1d26");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Funcții helper
    const face = (points, fill, stroke, lineWidth = 1, dash = []) => {
      if (points.length < 3) return;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      points.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(dash);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    const drawBox = (x, y, z, w, h, d, colors, stroke) => {
      const p1 = project(x, y, z, W, H);
      const p2 = project(x+w, y, z, W, H);
      const p3 = project(x+w, y+h, z, W, H);
      const p4 = project(x, y+h, z, W, H);
      const p5 = project(x, y, z+d, W, H);
      const p6 = project(x+w, y, z+d, W, H);
      const p7 = project(x+w, y+h, z+d, W, H);
      const p8 = project(x, y+h, z+d, W, H);
      
      // Fețe cu depth sorting simplu
      // Față
      face([p1, p2, p3, p4], colors.front, stroke, 0.8);
      // Top
      face([p4, p3, p7, p8], colors.top, stroke, 0.8);
      // Dreapta
      face([p2, p6, p7, p3], colors.side, stroke, 0.8);
      // Stânga
      face([p1, p4, p8, p5], colors.side, stroke, 0.8);
    };

    // Grilaj podea (grid)
    ctx.strokeStyle = "rgba(200,169,110,0.05)";
    ctx.lineWidth = 1;
    for (let i = -2; i <= length + 2; i += 0.5) {
      const p1 = project(i, 0, -0.5, W, H);
      const p2 = project(i, 0, 0.5, W, H);
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
    }
    for (let i = -0.5; i <= 0.5; i += 0.25) {
      const p1 = project(-2, 0, i, W, H);
      const p2 = project(length + 2, 0, i, W, H);
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
    }

    // Podea principală (plane)
    const floorPoints = [
      project(-0.3, 0, -0.2, W, H),
      project(length + 0.3, 0, -0.2, W, H),
      project(length + 0.3, 0, 0.3, W, H),
      project(-0.3, 0, 0.3, W, H)
    ];
    face(floorPoints, "#1a1d26", "rgba(200,169,110,0.15)", 2);

    // Umbra balustradei (sub sticlă)
    if (mountingType !== "embedded") {
      const shadowPoints = [
        project(0.02, 0.01, 0.02, W, H),
        project(length - 0.02, 0.01, 0.02, W, H),
        project(length - 0.02, 0.01, 0.08, W, H),
        project(0.02, 0.01, 0.08, W, H)
      ];
      face(shadowPoints, "rgba(0,0,0,0.3)", null);
    }

    // Panouri sticlă
    const isRampa = glassShape === "forma";
    const totalH = height + skirt;
    
    for (let i = 0; i < panelCount; i++) {
      const x = i * panelWidth;
      
      if (isRampa) {
        // Formă rampă (paralelogram)
        const rampOffset = totalH * 0.35;
        const p1 = project(x + 0.01, 0, -0.005, W, H);
        const p2 = project(x + panelWidth - 0.01, 0, -0.005, W, H);
        const p3 = project(x + panelWidth - 0.01, totalH, -0.005, W, H);
        const p4 = project(x + 0.01, totalH - rampOffset, -0.005, W, H);
        
        // Gradient pentru sticlă
        const grad = ctx.createLinearGradient(p1[0], p1[1], p3[0], p3[1]);
        grad.addColorStop(0, `rgba(180,220,255,${glassAlpha})`);
        grad.addColorStop(0.5, `rgba(200,230,255,${glassAlpha * 1.2})`);
        grad.addColorStop(1, `rgba(180,220,255,${glassAlpha * 0.8})`);
        
        face([p1, p2, p3, p4], grad, `rgba(180,220,255,0.7)`, 1.5);
        
        // Top rampă
        const p5 = project(x + 0.01, totalH - rampOffset, -0.005 + 0.01, W, H);
        const p6 = project(x + panelWidth - 0.01, totalH, -0.005 + 0.01, W, H);
        face([p4, p3, p6, p5], `rgba(220,240,255,${glassAlpha * 0.5})`, `
