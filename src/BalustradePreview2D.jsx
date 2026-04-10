import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BalustradePreview3D({ dimensions, glassType, mountingType, includeHandrail, includeLed }) {
  const mountRef = useRef(null);

  const length = parseFloat(dimensions.length) || 3;
  const height = parseFloat(dimensions.height) || 0.9;
  const hasSkirt = mountingType === "clips";
  const skirt = hasSkirt ? 0.35 : 0;

  const panelWidth = 1.1;
  const panelCount = Math.ceil(length / panelWidth);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = 260;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1117);

    // Camera - anghi izometric fix
    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
    camera.position.set(length * 0.9, (height + skirt) * 1.8, length * 1.4);
    camera.lookAt(length / 2, (height + skirt) / 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xc8a96e, 0.3);
    fillLight.position.set(-5, 2, -3);
    scene.add(fillLight);

    // Pardoseala
    const floorGeo = new THREE.BoxGeometry(length + 0.4, 0.04, 0.6);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1d26, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(length / 2, -0.02, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Culoare sticla
    const glassColor = glassType === "extraclar" ? 0xddf0ff : glassType === "10mm" ? 0xc8e8ff : 0xb8deff;
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: glassColor,
      transparent: true,
      opacity: 0.25,
      roughness: 0,
      metalness: 0,
      transmission: 0.9,
      thickness: 0.01,
      side: THREE.DoubleSide,
    });

    // Panouri sticla
    for (let i = 0; i < panelCount; i++) {
      const pW = length / panelCount;
      const totalH = height + skirt;

      const glassGeo = new THREE.BoxGeometry(pW - 0.02, totalH, 0.01);
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.set(i * pW + pW / 2, totalH / 2, 0);
      glass.castShadow = true;
      scene.add(glass);

      // Rama sticla
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x9ab8cc, roughness: 0.3, metalness: 0.5 });
      const edges = [
        { w: pW - 0.02, h: 0.012, d: 0.015, x: i * pW + pW / 2, y: totalH,       z: 0 },
        { w: pW - 0.02, h: 0.012, d: 0.015, x: i * pW + pW / 2, y: skirt,         z: 0 },
        { w: 0.012,     h: totalH, d: 0.015, x: i * pW,          y: totalH / 2,    z: 0 },
        { w: 0.012,     h: totalH, d: 0.015, x: i * pW + pW,     y: totalH / 2,    z: 0 },
      ];
      edges.forEach(e => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(e.w, e.h, e.d), edgeMat);
        m.position.set(e.x, e.y, e.z);
        scene.add(m);
      });

      // Linie separare panouri (profil vertical subtire)
      if (i > 0) {
        const sepMat = new THREE.MeshStandardMaterial({ color: 0x778899, roughness: 0.4, metalness: 0.6 });
        const sep = new THREE.Mesh(new THREE.BoxGeometry(0.015, totalH, 0.02), sepMat);
        sep.position.set(i * pW, totalH / 2, 0);
        scene.add(sep);
      }
    }

    // Feronerie
    const inoxMat = new THREE.MeshStandardMaterial({ color: 0xc8a96e, roughness: 0.2, metalness: 0.9 });

    if (mountingType === "clips") {
      // Butoni - 4 per panou, in fusta
      for (let i = 0; i < panelCount; i++) {
        const pW = length / panelCount;
        const positions = [
          { x: i * pW + pW * 0.18, y: skirt * 0.28 },
          { x: i * pW + pW * 0.18, y: skirt * 0.72 },
          { x: i * pW + pW * 0.82, y: skirt * 0.28 },
          { x: i * pW + pW * 0.82, y: skirt * 0.72 },
        ];
        positions.forEach(pos => {
          const btnGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16);
          const btn = new THREE.Mesh(btnGeo, inoxMat);
          btn.position.set(pos.x, pos.y, 0.012);
          btn.rotation.x = Math.PI / 2;
          scene.add(btn);
          // disc interior
          const innerGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.022, 16);
          const inner = new THREE.Mesh(innerGeo, new THREE.MeshStandardMaterial({ color: 0xffd080, metalness: 1, roughness: 0.1 }));
          inner.position.set(pos.x, pos.y, 0.013);
          inner.rotation.x = Math.PI / 2;
          scene.add(inner);
        });
      }
    }

    if (mountingType === "mini-montanti") {
      // 2 montanti la capete
      [0.08, length - 0.08].forEach(x => {
        const mGeo = new THREE.BoxGeometry(0.025, height * 0.55, 0.018);
        const m = new THREE.Mesh(mGeo, inoxMat);
        m.position.set(x, skirt + height * 0.55 / 2 + height * 0.23, 0);
        scene.add(m);
      });
    }

    if (mountingType === "profile") {
      // Profile laterale si baza
      [0, length].forEach(x => {
        const pGeo = new THREE.BoxGeometry(0.03, height + skirt, 0.03);
        const p = new THREE.Mesh(pGeo, inoxMat);
        p.position.set(x, (height + skirt) / 2, 0);
        scene.add(p);
      });
      const baseGeo = new THREE.BoxGeometry(length, 0.03, 0.03);
      const base = new THREE.Mesh(baseGeo, inoxMat);
      base.position.set(length / 2, skirt, 0);
      scene.add(base);
    }

    if (mountingType === "embedded") {
      const canalGeo = new THREE.BoxGeometry(length + 0.06, 0.06, 0.04);
      const canal = new THREE.Mesh(canalGeo, inoxMat);
      canal.position.set(length / 2, 0.03, 0);
      scene.add(canal);
    }

    // Mana curenta
    if (includeHandrail) {
      const hrGeo = new THREE.CylinderGeometry(0.022, 0.022, length + 0.16, 16);
      const hr = new THREE.Mesh(hrGeo, inoxMat);
      hr.rotation.z = Math.PI / 2;
      hr.position.set(length / 2, height + skirt + 0.022, 0);
      scene.add(hr);
      // suporti
      [0.08, length - 0.08].forEach(x => {
        const sGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8);
        const s = new THREE.Mesh(sGeo, inoxMat);
        s.position.set(x, height + skirt - 0.028, 0);
        scene.add(s);
      });
    }

    // LED strip
    if (includeLed) {
      const ledMat = new THREE.MeshStandardMaterial({ color: 0xffdd88, emissive: 0xffaa00, emissiveIntensity: 1.5 });
      const ledGeo = new THREE.BoxGeometry(length, 0.008, 0.008);
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(length / 2, skirt + 0.02, 0.006);
      scene.add(led);
    }

    // Render static
    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
    };
  }, [length, height, glassType, mountingType, includeHandrail, includeLed]);

  return (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.02)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.35)", padding: "12px 16px 0", textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Previzualizare 3D · {Math.ceil((parseFloat(dimensions.length) || 3) / 1.1)} {Math.ceil((parseFloat(dimensions.length) || 3) / 1.1) === 1 ? "panou" : "panouri"}
      </div>
      <div ref={mountRef} style={{ width: "100%", height: 260 }} />
      <div style={{ display: "flex", gap: 12, justifyContent: "center", padding: "8px 16px 12px", flexWrap: "wrap" }}>
        {[
          { color: "rgba(180,220,255,0.6)", label: "Sticlă" },
          mountingType === "clips"         && { color: "rgba(200,169,110,0.8)", label: `Butoni (${Math.ceil((parseFloat(dimensions.length)||3)/1.1)*4} buc)` },
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
