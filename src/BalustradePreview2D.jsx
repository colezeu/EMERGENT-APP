import { useEffect, useRef } from "react";

export default function BalustradePreview3D({ dimensions, glassType, mountingType, includeHandrail, includeLed }) {
  const mountRef = useRef(null);

  const length = parseFloat(dimensions.length) || 3;
  const height = parseFloat(dimensions.height) || 0.9;
  const hasSkirt = mountingType === "clips";
  const skirt = hasSkirt ? 0.35 : 0;
  const panelCount = Math.ceil(length / 1.1);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let THREE;
    let renderer;

    import("three").then(module => {
      THREE = module;
      const W = el.clientWidth, H = 260;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f1117);

      const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
      camera.position.set(length * 0.9, (height + skirt) * 1.8, length * 1.4);
      camera.lookAt(length / 2, (height + skirt) / 2, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(window.devicePixelRatio);
      el.innerHTML = "";
      el.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 8, 5);
      scene.add(dirLight);
      const fillLight = new THREE.DirectionalLight(0xc8a96e, 0.3);
      fillLight.position.set(-5, 2, -3);
      scene.add(fillLight);

      // Pardoseala
      const floor = new THREE.Mesh(
        new THREE.BoxGeometry(length + 0.4, 0.04, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x1a1d26, roughness: 0.8 })
      );
      floor.position.set(length / 2, -0.02, 0);
      scene.add(floor);

      const glassColor = glassType === "extraclar" ? 0xddf0ff : glassType === "10mm" ? 0xc8e8ff : 0xb8deff;
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: glassColor, transparent: true, opacity: 0.25,
        roughness: 0, metalness: 0, side: THREE.DoubleSide,
      });
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x9ab8cc, roughness: 0.3, metalness: 0.5 });
      const inoxMat = new THREE.MeshStandardMaterial({ color: 0xc8a96e, roughness: 0.2, metalness: 0.9 });

      // Panouri sticla
      for (let i = 0; i < panelCount; i++) {
        const pW = length / panelCount;
        const totalH = height + skirt;
        const glass = new THREE.Mesh(new THREE.BoxGeometry(pW - 0.02, totalH, 0.01), glassMat);
        glass.position.set(i * pW + pW / 2, totalH / 2, 0);
        scene.add(glass);

        // Rama
        [
          { w: pW, h: 0.012, d: 0.015, x: i * pW + pW / 2, y: totalH },
          { w: pW, h: 0.012, d: 0.015, x: i * pW + pW / 2, y: skirt },
          { w: 0.012, h: totalH, d: 0.015, x: i * pW,       y: totalH / 2 },
          { w: 0.012, h: totalH, d: 0.015, x: i * pW + pW,  y: totalH / 2 },
        ].forEach(e => {
          const m = new THREE.Mesh(new THREE.BoxGeometry(e.w, e.h, e.d), edgeMat);
          m.position.set(e.x, e.y, 0);
          scene.add(m);
        });

        // Separator panouri
        if (i > 0) {
          const sep = new THREE.Mesh(new THREE.BoxGeometry(0.015, totalH, 0.02),
            new THREE.MeshStandardMaterial({ color: 0x778899, roughness: 0.4, metalness: 0.6 }));
          sep.position.set(i * pW, totalH / 2, 0);
          scene.add(sep);
        }
      }

      // Butoni inox
      if (mountingType === "clips") {
        for (let i = 0; i < panelCount; i++) {
          const pW = length / panelCount;
          [
            { x: i * pW + pW * 0.18, y: skirt * 0.28 },
            { x: i * pW + pW * 0.18, y: skirt * 0.72 },
            { x: i * pW + pW * 0.82, y: skirt * 0.28 },
            { x: i * pW + pW * 0.82, y: skirt * 0.72 },
          ].forEach(pos => {
            const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16), inoxMat);
            btn.rotation.x = Math.PI / 2;
            btn.position.set(pos.x, pos.y, 0.012);
            scene.add(btn);
          });
        }
      }

      // Mini-montanti
      if (mountingType === "mini-montanti") {
        [0.08, length - 0.08].forEach(x => {
          const m = new THREE.Mesh(new THREE.BoxGeometry(0.025, height * 0.55, 0.018), inoxMat);
          m.position.set(x, skirt + height * 0.23 + height * 0.55 / 2, 0);
          scene.add(m);
        });
      }

      // Profile
      if (mountingType === "profile") {
        [0, length].forEach(x => {
          const p = new THREE.Mesh(new THREE.BoxGeometry(0.03, height + skirt, 0.03), inoxMat);
          p.position.set(x, (height + skirt) / 2, 0);
          scene.add(p);
        });
        const base = new THREE.Mesh(new THREE.BoxGeometry(length, 0.03, 0.03), inoxMat);
        base.position.set(length / 2, skirt, 0);
        scene.add(base);
      }

      // Canal integrat
      if (mountingType === "embedded") {
        const canal = new THREE.Mesh(new THREE.BoxGeometry(length + 0.06, 0.06, 0.04), inoxMat);
        canal.position.set(length / 2, 0.03, 0);
        scene.add(canal);
      }

      // Mana curenta
      if (includeHandrail) {
        const hr = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, length + 0.16, 16), inoxMat);
        hr.rotation.z = Math.PI / 2;
        hr.position.set(length / 2, height + skirt + 0.022, 0);
        scene.add(hr);
      }

      // LED
      if (includeLed) {
        const ledMat = new THREE.MeshStandardMaterial({ color: 0xffdd88, emissive: 0xffaa00, emissiveIntensity: 1.5 });
        const led = new THREE.Mesh(new THREE.BoxGeometry(length, 0.008, 0.008), ledMat);
        led.position.set(length / 2, skirt + 0.02, 0.006);
        scene.add(led);
      }

      renderer.render(scene, camera);
    }).catch(err => {
      console.error("Three.js load error:", err);
    });

    return () => {
      if (renderer) renderer.dispose();
    };
  }, [length, height, glassType, mountingType, includeHandrail, includeLed]);

  return (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.02)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.35)", padding: "12px 16px 4px", textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Previzualizare 3D · {panelCount} {panelCount === 1 ? "panou" : "panouri"}
      </div>
      <div ref={mountRef} style={{ width: "100%", height: 260 }} />
      <div style={{ display: "flex", gap: 12, justifyContent: "center", padding: "8px 16px 12px", flexWrap: "wrap" }}>
        {[
          { color: "rgba(180,220,255,0.6)", label: "Sticlă" },
          mountingType === "clips"         && { color: "rgba(200,169,110,0.8)", label: `Butoni (${panelCount * 4} buc)` },
          mountingType === "mini-montanti" && { color: "rgba(200,169,110,0.8)", label: "Mini-Montanți" },
          mountingType === "profile"       && { color: "rgba(200,169,110,0.8)", label: "Profil" },
          mountingType === "embedded"      && { color: "rgba(200,169,110,0.8)", label: "Canal Integrat" },
          hasSkirt        && { color: "rgba(180,220,255,0.25)", label: "Fustă 350mm" },
          includeHandrail && { color: "rgba(200,169,110,0.9)", label: "Mână curentă" },
          includeLed      && { color: "rgba(255,220,120,0.8)", label: "LED" },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
            <span style={{ fontSize: "0.7rem", color: "rgba(240,237,232,0.4)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
