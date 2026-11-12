import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { useDiorama } from '../../context/DioramaContext';

/**
 * EarthquakeDioramaBackground
 * Floating-island 3D diorama (inspired by the "camping" diorama concept) re-themed for earthquakes:
 * ground fissure with glowing magma seam, shaking pines, tent camp + campfire smoke, seismograph hut,
 * evacuation flag, pond ripples, swaying instanced grass, drifting clouds, dust bursts and seismic rings.
 * Everything is procedural (no external assets). Falls back to a pure CSS sky when WebGL is unavailable.
 */

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

const makeSoftTexture = (inner: string, outer: string) => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.55, outer);
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  return tex;
};

// ---- World constants -------------------------------------------------------
const ISLAND_R = 12;
const CRACK_ANGLE = 0.38; // radians in the XZ plane
const CRACK_CENTER_Z = 0.5;
const POND = { x: -5.2, z: -5.4, r: 3.1 };
const CAMP = { x: -4.2, z: 4.2 };
const HUT = { x: 5.4, z: -4.4 };
const FLAG = { x: 6.8, z: 7.0 };

const crackDistance = (x: number, z: number) =>
  Math.abs(-Math.sin(CRACK_ANGLE) * x + Math.cos(CRACK_ANGLE) * (z - CRACK_CENTER_Z));

const heightFn = (x: number, z: number) => {
  let h =
    0.32 * Math.sin(x * 0.42) * Math.cos(z * 0.36) +
    0.22 * Math.sin(x * 0.9 + z * 0.7) +
    0.12 * Math.cos(z * 1.3 + x * 0.2);
  const d = crackDistance(x, z);
  const f = smoothstep(0.6, 3.4, d);
  h = h * f - 0.18 * (1 - f);
  const pd = Math.hypot(x - POND.x, z - POND.z);
  if (pd < POND.r + 0.8) {
    h -= Math.pow(1 - Math.min(pd / (POND.r + 0.8), 1), 0.75) * 0.95;
  }
  return h;
};

const rimRadius = (th: number) =>
  ISLAND_R * (1 + 0.055 * Math.sin(3 * th + 0.7) + 0.04 * Math.sin(7 * th + 1.9) + 0.025 * Math.sin(13 * th));

// ---- Geometry builders -----------------------------------------------------
const buildTopTerrain = (segs: number, rings: number) => {
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const grassA = new THREE.Color(0x72b84c);
  const grassB = new THREE.Color(0x4f9a3d);
  const dry = new THREE.Color(0xb3b866);
  const c = new THREE.Color();

  const pushVertex = (x: number, z: number) => {
    const y = heightFn(x, z);
    pos.push(x, y, z);
    const n = 0.5 + 0.5 * Math.sin(x * 0.6) * Math.cos(z * 0.5);
    c.copy(grassA).lerp(grassB, n);
    c.lerp(dry, Math.max(0, Math.sin(x * 0.35 + z * 0.25 + 1) * 0.35));
    // soil colour around the fissure & pond
    const cd = crackDistance(x, z);
    if (cd < 1.6) c.lerp(new THREE.Color(0x8a6a44), 1 - cd / 1.6);
    const pd = Math.hypot(x - POND.x, z - POND.z);
    if (pd < POND.r + 0.5) c.lerp(new THREE.Color(0xc2ad7a), 0.7 * (1 - pd / (POND.r + 0.5)));
    col.push(c.r, c.g, c.b);
  };

  pushVertex(0, 0);
  for (let r = 1; r <= rings; r++) {
    for (let s = 0; s < segs; s++) {
      const th = (s / segs) * Math.PI * 2;
      const rad = (rimRadius(th) * r) / rings;
      pushVertex(Math.cos(th) * rad, Math.sin(th) * rad);
    }
  }
  const vi = (r: number, s: number) => 1 + (r - 1) * segs + (s % segs);
  for (let s = 0; s < segs; s++) idx.push(0, vi(1, s + 1), vi(1, s));
  for (let r = 2; r <= rings; r++) {
    for (let s = 0; s < segs; s++) {
      const a = vi(r - 1, s);
      const b = vi(r - 1, s + 1);
      const cc = vi(r, s);
      const d = vi(r, s + 1);
      idx.push(a, b, cc, b, d, cc);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
};

const buildIslandBody = (segs: number, rnd: () => number) => {
  const profile = [
    { s: 1.0, y: null as number | null, color: 0x5a9a3c, jr: 0, jy: 0 },
    { s: 1.015, y: -1.3, color: 0x8d5c37, jr: 0.03, jy: 0.15 },
    { s: 0.93, y: -3.4, color: 0x7a4e30, jr: 0.07, jy: 0.3 },
    { s: 0.76, y: -6.4, color: 0x6e5a4e, jr: 0.1, jy: 0.5 },
    { s: 0.52, y: -10.2, color: 0x5f5650, jr: 0.14, jy: 0.7 },
    { s: 0.27, y: -14.2, color: 0x504a48, jr: 0.18, jy: 0.9 },
    { s: 0.03, y: -17.8, color: 0x433f3f, jr: 0, jy: 0 }
  ];
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const c = new THREE.Color();
  profile.forEach((p, k) => {
    for (let s = 0; s < segs; s++) {
      const th = (s / segs) * Math.PI * 2;
      const baseR = rimRadius(th) * p.s * (1 + (rnd() - 0.5) * 2 * p.jr);
      const x = Math.cos(th) * baseR;
      const z = Math.sin(th) * baseR;
      const rx = Math.cos(th) * rimRadius(th);
      const rz = Math.sin(th) * rimRadius(th);
      const y = p.y === null ? heightFn(rx, rz) : p.y + (rnd() - 0.5) * 2 * p.jy;
      pos.push(k === 0 ? rx : x, y, k === 0 ? rz : z);
      c.setHex(p.color);
      const l = 0.9 + rnd() * 0.2;
      c.multiplyScalar(l);
      col.push(c.r, c.g, c.b);
    }
  });
  for (let k = 0; k < profile.length - 1; k++) {
    for (let s = 0; s < segs; s++) {
      const a = k * segs + s;
      const b = k * segs + ((s + 1) % segs);
      const cc = (k + 1) * segs + s;
      const d = (k + 1) * segs + ((s + 1) % segs);
      idx.push(a, b, cc, b, d, cc);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
};

const buildCrackStrip = (halfLen: number, baseHalfWidth: number, points: number, seed: number, y: number) => {
  const rnd = mulberry32(seed);
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const x = -halfLen + t * halfLen * 2;
    const taper = Math.pow(Math.sin(Math.PI * t), 0.55);
    const jitter = Math.sin(t * 17) * 0.35 + Math.sin(t * 6 + 1) * 0.6 + (rnd() - 0.5) * 0.35;
    const w = baseHalfWidth * taper * (0.65 + rnd() * 0.7);
    pos.push(x, y, jitter - w, x, y, jitter + w);
  }
  for (let i = 0; i < points; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
};

const buildPine = (
  trunkMat: THREE.Material,
  leafMatA: THREE.Material,
  leafMatB: THREE.Material
) => {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.3, 6), trunkMat);
  trunk.position.y = 0.65;
  trunk.castShadow = true;
  g.add(trunk);
  const tiers = [
    { r: 1.25, h: 1.9, y: 1.7, m: leafMatA },
    { r: 1.0, h: 1.7, y: 2.7, m: leafMatB },
    { r: 0.72, h: 1.5, y: 3.6, m: leafMatA }
  ];
  tiers.forEach(t => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(t.r, t.h, 7), t.m);
    cone.position.y = t.y;
    cone.castShadow = true;
    g.add(cone);
  });
  return g;
};

// ---- Component -------------------------------------------------------------
export const EarthquakeDioramaBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const { activeTab } = useApp();
  const { magnitude, timeOfDay, quakeNonce } = useDiorama();

  const live = useRef({ magnitude, timeOfDay, quakeNonce, compact: activeTab !== 'home' });
  live.current.magnitude = magnitude;
  live.current.timeOfDay = timeOfDay;
  live.current.quakeNonce = quakeNonce;
  live.current.compact = activeTab !== 'home';

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      setWebglFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xdce9ef, 45, 150);
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.5, 400);
    camera.position.set(0, 7, 28);

    // -------- Lights -------------------------------------------------------
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    const hemi = new THREE.HemisphereLight(0xcfe6ff, 0xd8c9a4, 0.9);
    const sun = new THREE.DirectionalLight(0xfff2d2, 2.3);
    sun.castShadow = !isMobile;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 16;
    sun.shadow.camera.bottom = -16;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.0006;
    scene.add(ambient, hemi, sun, sun.target);
    const fireLight = new THREE.PointLight(0xff8a2a, 0.0, 12, 1.6);

    // -------- Island -------------------------------------------------------
    const rnd = mulberry32(20261111);
    const island = new THREE.Group();
    scene.add(island);

    const topMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, side: THREE.DoubleSide });
    const top = new THREE.Mesh(buildTopTerrain(isMobile ? 48 : 72, isMobile ? 16 : 24), topMat);
    top.receiveShadow = true;
    island.add(top);

    const bodyMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      flatShading: true,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(buildIslandBody(isMobile ? 36 : 56, rnd), bodyMat);
    body.castShadow = true;
    island.add(body);

    // -------- Fissure (the earthquake focal point) -------------------------
    const crackGroup = new THREE.Group();
    crackGroup.position.set(0, 0.02, CRACK_CENTER_Z);
    crackGroup.rotation.y = -CRACK_ANGLE;
    island.add(crackGroup);

    const crackDarkMat = new THREE.MeshBasicMaterial({
      color: 0x24130a,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    });
    const crackRimMat = new THREE.MeshBasicMaterial({
      color: 0x6b4423,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2
    });
    const crackGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff6a1a,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4
    });
    const crackRim = new THREE.Mesh(buildCrackStrip(11.2, 1.0, 46, 7, 0.05), crackRimMat);
    const crackDark = new THREE.Mesh(buildCrackStrip(11.2, 0.62, 46, 7, 0.07), crackDarkMat);
    const crackGlow = new THREE.Mesh(buildCrackStrip(11.0, 0.24, 46, 7, 0.09), crackGlowMat);
    crackGroup.add(crackRim, crackDark, crackGlow);

    // rocks & debris along the fissure edges
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x8b8d90, roughness: 0.9, flatShading: true });
    const rockMatDark = new THREE.MeshStandardMaterial({ color: 0x6d6f73, roughness: 0.9, flatShading: true });
    const debris: { mesh: THREE.Mesh; baseY: number; phase: number; speed: number }[] = [];
    const rockGeo = new THREE.DodecahedronGeometry(0.4, 0);
    for (let i = 0; i < (isMobile ? 9 : 16); i++) {
      const m = new THREE.Mesh(rockGeo, i % 2 ? rockMat : rockMatDark);
      const lx = -9 + rnd() * 18;
      const side = rnd() > 0.5 ? 1 : -1;
      const lz = Math.sin((lx + 11) / 22 * 17) * 0.3 + side * (0.9 + rnd() * 0.9);
      m.position.set(lx, 0.12, lz);
      const sc = 0.35 + rnd() * 0.8;
      m.scale.set(sc, sc * (0.6 + rnd() * 0.6), sc);
      m.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      m.castShadow = true;
      crackGroup.add(m);
      debris.push({ mesh: m, baseY: 0.1 + sc * 0.15, phase: rnd() * 6.28, speed: 0.6 + rnd() * 0.8 });
    }

    // -------- Pond ---------------------------------------------------------
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x45b8cc,
      roughness: 0.12,
      metalness: 0.25,
      transparent: true,
      opacity: 0.82
    });
    const water = new THREE.Mesh(new THREE.CircleGeometry(POND.r - 0.35, 48), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(POND.x, -0.4, POND.z);
    island.add(water);
    const ripples: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const rm = new THREE.Mesh(
        new THREE.RingGeometry(0.92, 1, 48),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false })
      );
      rm.rotation.x = -Math.PI / 2;
      rm.position.set(POND.x, -0.38, POND.z);
      island.add(rm);
      ripples.push(rm);
    }
    for (let i = 0; i < 12; i++) {
      const th = (i / 12) * Math.PI * 2 + rnd() * 0.3;
      const rr = POND.r - 0.15 + rnd() * 0.3;
      const stone = new THREE.Mesh(rockGeo, rnd() > 0.5 ? rockMat : rockMatDark);
      const sx = POND.x + Math.cos(th) * rr;
      const sz = POND.z + Math.sin(th) * rr;
      stone.position.set(sx, heightFn(sx, sz) + 0.05, sz);
      const sc = 0.4 + rnd() * 0.5;
      stone.scale.set(sc, sc * 0.7, sc);
      stone.rotation.set(rnd() * 3, rnd() * 3, 0);
      stone.castShadow = true;
      island.add(stone);
    }

    // -------- Trees --------------------------------------------------------
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.95 });
    const leafA = new THREE.MeshStandardMaterial({ color: 0x2f8f4e, roughness: 0.8, flatShading: true });
    const leafB = new THREE.MeshStandardMaterial({ color: 0x3aa35b, roughness: 0.8, flatShading: true });
    const trees: { g: THREE.Group; phase: number; amp: number }[] = [];
    const treeCount = isMobile ? 16 : 30;
    let guard = 0;
    while (trees.length < treeCount && guard < 800) {
      guard++;
      const th = rnd() * Math.PI * 2;
      const rr = 3 + rnd() * 8.4;
      const x = Math.cos(th) * rr;
      const z = Math.sin(th) * rr;
      if (rr > rimRadius(th) - 1.2) continue;
      if (crackDistance(x, z) < 2.4) continue;
      if (Math.hypot(x - POND.x, z - POND.z) < POND.r + 0.6) continue;
      if (Math.hypot(x - CAMP.x, z - CAMP.z) < 3.4) continue;
      if (Math.hypot(x - HUT.x, z - HUT.z) < 3.0) continue;
      if (Math.hypot(x - FLAG.x, z - FLAG.z) < 2.2) continue;
      if (trees.some(t => Math.hypot(t.g.position.x - x, t.g.position.z - z) < 1.7)) continue;
      const tree = buildPine(trunkMat, leafA, leafB);
      const sc = 0.65 + rnd() * 0.75;
      tree.scale.setScalar(sc);
      tree.position.set(x, heightFn(x, z) - 0.05, z);
      tree.rotation.y = rnd() * 6.28;
      island.add(tree);
      trees.push({ g: tree, phase: rnd() * 6.28, amp: 0.6 + rnd() * 0.8 });
    }

    // -------- Camp (tents + campfire) -------------------------------------
    const camp = new THREE.Group();
    camp.position.set(CAMP.x, heightFn(CAMP.x, CAMP.z), CAMP.z);
    island.add(camp);
    const tentMat = new THREE.MeshStandardMaterial({ color: 0xee7a3e, roughness: 0.7, flatShading: true });
    const tentMat2 = new THREE.MeshStandardMaterial({ color: 0x2fb5a4, roughness: 0.7, flatShading: true });
    const tentDoorMat = new THREE.MeshStandardMaterial({ color: 0x3a2a20, roughness: 1, side: THREE.DoubleSide });
    const makeTent = (mat: THREE.Material, scale: number) => {
      const t = new THREE.Group();
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.7, 2.1, 4), mat);
      cone.position.y = 1.05;
      cone.rotation.y = Math.PI / 4;
      cone.scale.set(1, 1, 1.25);
      cone.castShadow = true;
      t.add(cone);
      const door = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.3), tentDoorMat);
      door.position.set(0, 0.62, 1.52);
      t.add(door);
      t.scale.setScalar(scale);
      return t;
    };
    const tent1 = makeTent(tentMat, 1);
    tent1.position.set(-1.1, 0, 0.3);
    tent1.rotation.y = 0.5;
    const tent2 = makeTent(tentMat2, 0.72);
    tent2.position.set(1.6, 0, -1.9);
    tent2.rotation.y = -0.2;
    camp.add(tent1, tent2);

    const fireGroup = new THREE.Group();
    fireGroup.position.set(1.7, 0.02, 1.8);
    camp.add(fireGroup);
    const logMat = new THREE.MeshStandardMaterial({ color: 0x5a3a1e, roughness: 1 });
    for (let i = 0; i < 3; i++) {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 6), logMat);
      log.rotation.z = Math.PI / 2;
      log.rotation.y = (i / 3) * Math.PI;
      log.position.y = 0.1;
      fireGroup.add(log);
    }
    for (let i = 0; i < 7; i++) {
      const th = (i / 7) * Math.PI * 2;
      const st = new THREE.Mesh(rockGeo, rockMat);
      st.position.set(Math.cos(th) * 0.55, 0.08, Math.sin(th) * 0.55);
      st.scale.setScalar(0.38);
      st.castShadow = true;
      fireGroup.add(st);
    }
    const flames: { m: THREE.Mesh; phase: number }[] = [];
    [
      { c: 0xff7a1a, h: 0.95, r: 0.26 },
      { c: 0xffb02e, h: 0.75, r: 0.2 },
      { c: 0xffe27a, h: 0.5, r: 0.13 }
    ].forEach((f, i) => {
      const m = new THREE.Mesh(
        new THREE.ConeGeometry(f.r, f.h, 7),
        new THREE.MeshBasicMaterial({ color: f.c, transparent: true, opacity: 0.92 })
      );
      m.position.y = 0.2 + f.h / 2;
      fireGroup.add(m);
      flames.push({ m, phase: i * 1.7 });
    });
    fireLight.position.set(0, 0.8, 0);
    fireGroup.add(fireLight);

    // -------- Seismograph hut ---------------------------------------------
    const hut = new THREE.Group();
    hut.position.set(HUT.x, heightFn(HUT.x, HUT.z), HUT.z);
    hut.rotation.y = -0.6;
    island.add(hut);
    const hutWall = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 1.5, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xf3ead7, roughness: 0.85 })
    );
    hutWall.position.y = 0.75;
    hutWall.castShadow = true;
    hutWall.receiveShadow = true;
    const hutRoof = new THREE.Mesh(
      new THREE.ConeGeometry(1.95, 0.9, 4),
      new THREE.MeshStandardMaterial({ color: 0x1f7a5c, roughness: 0.7, flatShading: true })
    );
    hutRoof.position.y = 1.95;
    hutRoof.rotation.y = Math.PI / 4;
    hutRoof.scale.set(1, 1, 0.8);
    hutRoof.castShadow = true;
    const hutDoor = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x35574a })
    );
    hutDoor.position.set(0, 0.52, 0.91);
    const dishPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6),
      new THREE.MeshStandardMaterial({ color: 0x9aa5ab, metalness: 0.6, roughness: 0.4 })
    );
    dishPole.position.set(0.7, 2.7, 0);
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffa31a })
    );
    lamp.position.set(0.7, 3.45, 0);
    hut.add(hutWall, hutRoof, hutDoor, dishPole, lamp);

    // -------- Evacuation flag ---------------------------------------------
    const flag = new THREE.Group();
    flag.position.set(FLAG.x, heightFn(FLAG.x, FLAG.z), FLAG.z);
    island.add(flag);
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.06, 3.4, 6),
      new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.5 })
    );
    pole.position.y = 1.7;
    pole.castShadow = true;
    flag.add(pole);
    const flagGeo = new THREE.PlaneGeometry(1.6, 0.9, 12, 4);
    const flagBase = flagGeo.attributes.position.array.slice() as Float32Array;
    const flagMesh = new THREE.Mesh(
      flagGeo,
      new THREE.MeshStandardMaterial({ color: 0x10b981, side: THREE.DoubleSide, roughness: 0.6 })
    );
    flagMesh.position.set(0.85, 2.85, 0);
    flagMesh.castShadow = true;
    flag.add(flagMesh);

    // -------- Instanced grass ---------------------------------------------
    const grassUniforms = { uTime: { value: 0 }, uShake: { value: 0 } };
    const grassMat = new THREE.MeshStandardMaterial({ roughness: 0.9, side: THREE.DoubleSide });
    grassMat.onBeforeCompile = shader => {
      shader.uniforms.uTime = grassUniforms.uTime;
      shader.uniforms.uShake = grassUniforms.uShake;
      shader.vertexShader =
        'uniform float uTime;\nuniform float uShake;\n' +
        shader.vertexShader.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           #ifdef USE_INSTANCING
             float ph = instanceMatrix[3].x * 0.8 + instanceMatrix[3].z * 0.6;
             float k = position.y * 2.0;
             transformed.x += sin(uTime * 2.2 + ph) * 0.09 * k + sin(uTime * 41.0 + ph) * uShake * k;
             transformed.z += cos(uTime * 1.7 + ph) * 0.06 * k + cos(uTime * 37.0 + ph) * uShake * k;
           #endif`
        );
    };
    const grassGeo = new THREE.ConeGeometry(0.06, 0.55, 3);
    grassGeo.translate(0, 0.275, 0);
    const grassCount = isMobile ? 380 : 900;
    const grass = new THREE.InstancedMesh(grassGeo, grassMat, grassCount);
    const dummy = new THREE.Object3D();
    const gc = new THREE.Color();
    let gi = 0;
    guard = 0;
    while (gi < grassCount && guard < 6000) {
      guard++;
      const th = rnd() * Math.PI * 2;
      const rr = Math.sqrt(rnd()) * (ISLAND_R - 1);
      const x = Math.cos(th) * rr;
      const z = Math.sin(th) * rr;
      if (rr > rimRadius(th) - 0.7) continue;
      if (crackDistance(x, z) < 1.5) continue;
      if (Math.hypot(x - POND.x, z - POND.z) < POND.r - 0.1) continue;
      if (Math.hypot(x - CAMP.x - 1.7, z - CAMP.z - 1.8) < 1) continue;
      dummy.position.set(x, heightFn(x, z), z);
      dummy.rotation.set(0, rnd() * 6.28, (rnd() - 0.5) * 0.3);
      const s = 0.7 + rnd() * 1.0;
      dummy.scale.set(s, s * (0.8 + rnd() * 0.8), s);
      dummy.updateMatrix();
      grass.setMatrixAt(gi, dummy.matrix);
      gc.setHSL(0.25 + rnd() * 0.07, 0.55 + rnd() * 0.2, 0.34 + rnd() * 0.16);
      grass.setColorAt(gi, gc);
      gi++;
    }
    grass.count = gi;
    grass.instanceMatrix.needsUpdate = true;
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true;
    island.add(grass);

    // a few boulders
    for (let i = 0; i < 9; i++) {
      const th = rnd() * Math.PI * 2;
      const rr = 3 + rnd() * 8;
      const x = Math.cos(th) * rr;
      const z = Math.sin(th) * rr;
      if (rr > rimRadius(th) - 1) continue;
      if (crackDistance(x, z) < 2 || Math.hypot(x - POND.x, z - POND.z) < POND.r + 0.5) continue;
      const b = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 0), rnd() > 0.5 ? rockMat : rockMatDark);
      const sc = 0.5 + rnd() * 0.9;
      b.scale.set(sc * 1.2, sc * 0.8, sc);
      b.position.set(x, heightFn(x, z) + 0.15, z);
      b.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      b.castShadow = true;
      b.receiveShadow = true;
      island.add(b);
    }

    // -------- Smoke, dust & seismic rings ---------------------------------
    const smokeTex = makeSoftTexture('rgba(255,255,255,0.95)', 'rgba(255,255,255,0.35)');
    const dustTex = makeSoftTexture('rgba(255,244,220,0.95)', 'rgba(220,190,140,0.4)');
    const smoke: { s: THREE.Sprite; life: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.SpriteMaterial({ map: smokeTex, color: 0x9aa3a8, transparent: true, depthWrite: false, opacity: 0 });
      const s = new THREE.Sprite(mat);
      island.add(s);
      smoke.push({ s, life: i / 14 });
    }
    const dust: { s: THREE.Sprite; life: number; active: boolean; vx: number; vz: number }[] = [];
    for (let i = 0; i < (isMobile ? 14 : 30); i++) {
      const mat = new THREE.SpriteMaterial({ map: dustTex, color: 0xcdb48c, transparent: true, depthWrite: false, opacity: 0 });
      const s = new THREE.Sprite(mat);
      island.add(s);
      dust.push({ s, life: 1, active: false, vx: 0, vz: 0 });
    }
    const rings: { m: THREE.Mesh; life: number; active: boolean }[] = [];
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(0.93, 1, 64),
        new THREE.MeshBasicMaterial({
          color: 0xffa84a,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide
        })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.set(0, 0.15, CRACK_CENTER_Z);
      m.visible = false;
      island.add(m);
      rings.push({ m, life: 1, active: false });
    }

    // floating pebbles around the island
    const pebbleCount = isMobile ? 30 : 70;
    const pebblePos = new Float32Array(pebbleCount * 3);
    const pebbleBase = new Float32Array(pebbleCount * 3);
    for (let i = 0; i < pebbleCount; i++) {
      const th = rnd() * Math.PI * 2;
      const rr = 13 + rnd() * 9;
      pebbleBase[i * 3] = Math.cos(th) * rr;
      pebbleBase[i * 3 + 1] = -16 + rnd() * 20;
      pebbleBase[i * 3 + 2] = Math.sin(th) * rr;
    }
    const pebbleGeo = new THREE.BufferGeometry();
    pebbleGeo.setAttribute('position', new THREE.BufferAttribute(pebblePos, 3));
    const pebbles = new THREE.Points(
      pebbleGeo,
      new THREE.PointsMaterial({ color: 0x8a7a68, size: 0.28, transparent: true, opacity: 0.85 })
    );
    island.add(pebbles);

    // -------- Sky furniture: clouds & far mountains -----------------------
    const cloudTex = makeSoftTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0.65)');
    const clouds: { g: THREE.Group; speed: number }[] = [];
    const cloudMats: THREE.SpriteMaterial[] = [];
    for (let i = 0; i < (isMobile ? 5 : 9); i++) {
      const g = new THREE.Group();
      const puffs = 4 + Math.floor(rnd() * 3);
      for (let p = 0; p < puffs; p++) {
        const mat = new THREE.SpriteMaterial({ map: cloudTex, color: 0xffffff, transparent: true, opacity: 0.85, fog: false, depthWrite: false });
        cloudMats.push(mat);
        const s = new THREE.Sprite(mat);
        const sc = 9 + rnd() * 8;
        s.scale.set(sc * 1.6, sc, 1);
        s.position.set((p - puffs / 2) * 5.5 + rnd() * 2, rnd() * 2.4, rnd() * 3);
        g.add(s);
      }
      g.position.set(-70 + rnd() * 140, 8 + rnd() * 18, -22 - rnd() * 45);
      scene.add(g);
      clouds.push({ g, speed: 0.25 + rnd() * 0.5 });
    }
    const mountainMat = new THREE.MeshBasicMaterial({ color: 0xa9c0cf });
    const mountains = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const h = 18 + rnd() * 20;
      const m = new THREE.Mesh(new THREE.ConeGeometry(14 + rnd() * 10, h, 5), mountainMat);
      m.position.set(-90 + i * 30 + rnd() * 10, h / 2 - 14, -95 - rnd() * 25);
      m.rotation.y = rnd() * 3;
      mountains.add(m);
    }
    scene.add(mountains);

    // -------- Interaction state -------------------------------------------
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let scrollProgress = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // -------- Palette ------------------------------------------------------
    const P = {
      day: {
        sun: new THREE.Color(0xfff2d2),
        hemiSky: new THREE.Color(0xcfe6ff),
        hemiGround: new THREE.Color(0xd8c9a4),
        amb: new THREE.Color(0xffffff),
        fog: new THREE.Color(0xdce9ef),
        cloud: new THREE.Color(0xffffff),
        mountain: new THREE.Color(0xa9c0cf),
        sunDir: new THREE.Vector3(14, 24, 16),
        sunI: 2.3,
        hemiI: 0.9,
        ambI: 0.45
      },
      dusk: {
        sun: new THREE.Color(0xff9552),
        hemiSky: new THREE.Color(0xffc9a0),
        hemiGround: new THREE.Color(0x8f6f86),
        amb: new THREE.Color(0xffd9c0),
        fog: new THREE.Color(0xf2c7a8),
        cloud: new THREE.Color(0xffd0b0),
        mountain: new THREE.Color(0xb48aa4),
        sunDir: new THREE.Vector3(-20, 8, 12),
        sunI: 1.7,
        hemiI: 0.7,
        ambI: 0.38
      }
    };
    const tmpV = new THREE.Vector3();

    // -------- Animation loop ----------------------------------------------
    const clock = new THREE.Clock();
    let raf = 0;
    let todBlend = 0;
    let lastNonce = live.current.quakeNonce;
    let quakeStart = -100;
    let quakeAmp = 0;
    let crackScale = 1;
    let ringTimer = 0;
    let dustTimer = 0;
    let layoutX = 0;
    let layoutY = 0;
    let layoutZ = 0;
    let layoutS = 0.78;
    let firstFrame = true;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const st = live.current;

      // time of day blend
      const target = st.timeOfDay === 'dusk' ? 1 : 0;
      todBlend += (target - todBlend) * Math.min(1, dt * 1.8);
      sun.color.copy(P.day.sun).lerp(P.dusk.sun, todBlend);
      hemi.color.copy(P.day.hemiSky).lerp(P.dusk.hemiSky, todBlend);
      hemi.groundColor.copy(P.day.hemiGround).lerp(P.dusk.hemiGround, todBlend);
      ambient.color.copy(P.day.amb).lerp(P.dusk.amb, todBlend);
      sun.intensity = P.day.sunI + (P.dusk.sunI - P.day.sunI) * todBlend;
      hemi.intensity = P.day.hemiI + (P.dusk.hemiI - P.day.hemiI) * todBlend;
      ambient.intensity = P.day.ambI + (P.dusk.ambI - P.day.ambI) * todBlend;
      (scene.fog as THREE.Fog).color.copy(P.day.fog).lerp(P.dusk.fog, todBlend);
      mountainMat.color.copy(P.day.mountain).lerp(P.dusk.mountain, todBlend);
      cloudMats.forEach(m => m.color.copy(P.day.cloud).lerp(P.dusk.cloud, todBlend));
      tmpV.copy(P.day.sunDir).lerp(P.dusk.sunDir, todBlend);
      sun.position.copy(island.position).add(tmpV);
      sun.target.position.copy(island.position);
      fireLight.intensity = (0.9 + 0.5 * todBlend) * (0.85 + 0.15 * Math.sin(t * 17) + 0.1 * Math.sin(t * 31));

      // quake trigger + envelope
      if (st.quakeNonce !== lastNonce) {
        lastNonce = st.quakeNonce;
        quakeStart = t;
        quakeAmp = Math.min(Math.max(Math.pow(Math.max(st.magnitude - 3, 0) / 5.8, 1.5), 0.14), 1);
        ringTimer = 0;
      }
      const qt = t - quakeStart;
      const duration = 5.5;
      const env = qt >= 0 && qt < duration ? Math.min(qt / 0.25, 1) * Math.pow(1 - qt / duration, 0.9) : 0;
      const amp = quakeAmp * env;
      const ambientTremor = 0.012 + Math.pow(Math.max(st.magnitude - 3, 0) / 5.8, 2) * 0.05;
      const shake = amp + ambientTremor * 0.35;

      // layout (desktop: island on the right; mobile/other tabs: centred & further away)
      const aspect = window.innerWidth / window.innerHeight;
      let tx: number, ty: number, tz: number, ts: number;
      if (st.compact) {
        tx = 0;
        ty = -2;
        tz = -14;
        ts = 0.62;
      } else if (aspect > 1.25) {
        tx = Math.min(7.5, aspect * 4.2);
        ty = 0;
        tz = 0;
        ts = 0.78;
      } else {
        tx = 0;
        ty = 3.2;
        tz = -6;
        ts = 0.66;
      }
      const lerpK = Math.min(1, dt * 2.2);
      layoutX += (tx - layoutX) * lerpK;
      layoutY += (ty - layoutY) * lerpK;
      layoutZ += (tz - layoutZ) * lerpK;
      layoutS += (ts - layoutS) * lerpK;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      island.scale.setScalar(layoutS);
      island.position.set(
        layoutX + Math.sin(t * 47) * 0.22 * amp + Math.sin(t * 0.6) * 0.15,
        layoutY + Math.sin(t * 0.9) * 0.45 + Math.abs(Math.sin(t * 53)) * 0.14 * amp,
        layoutZ + Math.sin(t * 39 + 1) * 0.22 * amp
      );
      island.rotation.y = 0.35 + scrollProgress * 1.7 + pointer.x * 0.22;
      island.rotation.x = 0.04 + pointer.y * 0.03 + Math.sin(t * 61) * 0.006 * shake * 6;
      island.rotation.z = Math.sin(t * 0.7) * 0.012 + Math.sin(t * 33) * 0.01 * amp;

      camera.position.x += (pointer.x * 1.8 - camera.position.x) * 0.05;
      camera.position.y += (7.5 - scrollProgress * 2.5 - pointer.y * 0.9 - camera.position.y) * 0.05;
      camera.position.z = 28 - scrollProgress * 3;
      camera.position.x += Math.sin(t * 71) * 0.06 * amp;
      camera.position.y += Math.cos(t * 59) * 0.05 * amp;
      camera.lookAt(layoutX * 0.55, -2.2 + layoutY * 0.4, 0);

      // fissure
      const targetCrack = Math.min(Math.max(1 + (st.magnitude - 4) * 0.1, 0.8), 1.5) + amp * 0.9;
      crackScale += (targetCrack - crackScale) * Math.min(1, dt * 3);
      crackRim.scale.z = crackScale;
      crackDark.scale.z = crackScale;
      crackGlow.scale.z = crackScale * (1 + 0.2 * Math.sin(t * 2.3));
      crackGlowMat.opacity = 0.55 + 0.2 * Math.sin(t * 2) + amp * 0.35 + todBlend * 0.15;

      // debris hopping
      debris.forEach(d => {
        d.mesh.position.y = d.baseY + Math.abs(Math.sin(t * 22 * d.speed + d.phase)) * 0.55 * amp;
        d.mesh.rotation.x += amp * dt * 4 * d.speed;
      });

      // trees sway
      trees.forEach(tr => {
        const sway = Math.sin(t * 1.2 + tr.phase) * 0.018 * tr.amp;
        const quake = Math.sin(t * 34 + tr.phase) * 0.06 * amp * tr.amp;
        tr.g.rotation.z = sway + quake;
        tr.g.rotation.x = Math.cos(t * 0.9 + tr.phase) * 0.012 + Math.cos(t * 29 + tr.phase) * 0.04 * amp;
      });

      // tents wobble
      tent1.rotation.z = Math.sin(t * 36) * 0.03 * amp;
      tent2.rotation.z = Math.sin(t * 40 + 1) * 0.035 * amp;
      hut.rotation.z = Math.sin(t * 44) * 0.02 * amp;
      lamp.scale.setScalar(1 + 0.4 * Math.sin(t * (4 + amp * 14)) * (0.4 + amp));
      (lamp.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(t * (4 + amp * 14)) > 0 ? 0xffa31a : 0xff3b1a);

      // flame flicker
      flames.forEach(f => {
        const k = 0.85 + 0.25 * Math.sin(t * 14 + f.phase) + 0.1 * Math.sin(t * 23 + f.phase * 2);
        f.m.scale.set(1 + 0.1 * Math.sin(t * 19 + f.phase), k, 1 + 0.1 * Math.cos(t * 17 + f.phase));
        f.m.rotation.y = t * 2 + f.phase;
      });

      // flag wave
      const fp = flagGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < fp.count; i++) {
        const bx = flagBase[i * 3];
        const wave = Math.sin(bx * 3.2 - t * 5 + (amp > 0 ? Math.sin(t * 30) : 0)) * 0.12 * (bx + 0.8);
        fp.setZ(i, wave);
      }
      fp.needsUpdate = true;

      // grass
      grassUniforms.uTime.value = t;
      grassUniforms.uShake.value = amp * 0.05 + ambientTremor * 0.02;

      // pond ripples
      ripples.forEach((r, i) => {
        const p = ((t * 0.35 + i / 3) % 1);
        r.scale.setScalar(0.4 + p * (POND.r - 0.5));
        (r.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.45 * (1 + amp * 1.2);
      });

      // campfire smoke
      smoke.forEach(sm => {
        sm.life += dt * 0.26;
        if (sm.life > 1) sm.life -= 1;
        const l = sm.life;
        sm.s.position.set(
          CAMP.x + 1.7 + Math.sin(l * 6 + sm.s.id) * 0.25 + l * 1.2,
          heightFn(CAMP.x, CAMP.z) + 0.9 + l * 6,
          CAMP.z + 1.8 + Math.cos(l * 5 + sm.s.id) * 0.2
        );
        const sc = 0.7 + l * 2.8;
        sm.s.scale.set(sc, sc, 1);
        (sm.s.material as THREE.SpriteMaterial).opacity = (1 - l) * 0.45 * Math.min(l * 8, 1);
      });

      // dust bursts out of the fissure while shaking
      dustTimer -= dt;
      if (amp > 0.04 && dustTimer <= 0) {
        dustTimer = 0.06 + (1 - amp) * 0.12;
        const free = dust.find(d => !d.active);
        if (free) {
          free.active = true;
          free.life = 0;
          const lx = (Math.random() - 0.5) * 18;
          const cz = CRACK_CENTER_Z;
          free.s.position.set(
            Math.cos(CRACK_ANGLE) * lx,
            0.3,
            cz + Math.sin(CRACK_ANGLE) * lx + (Math.random() - 0.5) * 0.8
          );
          free.vx = (Math.random() - 0.5) * 0.8;
          free.vz = (Math.random() - 0.5) * 0.8;
        }
      }
      dust.forEach(d => {
        if (!d.active) return;
        d.life += dt * 0.42;
        if (d.life >= 1) {
          d.active = false;
          (d.s.material as THREE.SpriteMaterial).opacity = 0;
          return;
        }
        d.s.position.x += d.vx * dt;
        d.s.position.z += d.vz * dt;
        d.s.position.y += dt * (1.6 + d.life * 1.2);
        const sc = 1.2 + d.life * 4.2;
        d.s.scale.set(sc, sc, 1);
        (d.s.material as THREE.SpriteMaterial).opacity = (1 - d.life) * 0.6;
      });

      // seismic rings
      ringTimer -= dt;
      if (env > 0.12 && ringTimer <= 0) {
        ringTimer = 0.55;
        const free = rings.find(r => !r.active);
        if (free) {
          free.active = true;
          free.life = 0;
          free.m.visible = true;
        }
      }
      rings.forEach(r => {
        if (!r.active) return;
        r.life += dt * 0.5;
        if (r.life >= 1) {
          r.active = false;
          r.m.visible = false;
          return;
        }
        r.m.scale.setScalar(1 + r.life * 10.5);
        (r.m.material as THREE.MeshBasicMaterial).opacity = (1 - r.life) * 0.7;
      });

      // floating pebbles (shedding during a quake)
      for (let i = 0; i < pebbleCount; i++) {
        const bx = pebbleBase[i * 3];
        const by = pebbleBase[i * 3 + 1];
        const bz = pebbleBase[i * 3 + 2];
        pebblePos[i * 3] = bx + Math.sin(t * 0.4 + i) * 0.5;
        pebblePos[i * 3 + 1] = by + Math.sin(t * 0.6 + i * 1.7) * 0.6 - quakeAmp * env * ((i % 7) * 0.5);
        pebblePos[i * 3 + 2] = bz + Math.cos(t * 0.35 + i) * 0.5;
      }
      (pebbleGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // clouds drift
      clouds.forEach(c => {
        c.g.position.x += c.speed * dt;
        if (c.g.position.x > 90) c.g.position.x = -90;
      });

      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      scene.traverse(obj => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach(mm => mm.dispose());
        else if (m) m.dispose();
      });
      smokeTex.dispose();
      dustTex.dispose();
      cloudTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  const dusk = timeOfDay === 'dusk';

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* CSS sky (also the WebGL fallback) */}
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms]"
        style={{ background: 'linear-gradient(180deg,#8ec5f0 0%,#cfe6f5 52%,#fbefd5 100%)' }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms]"
        style={{
          opacity: dusk ? 1 : 0,
          background: 'linear-gradient(180deg,#6f7fc4 0%,#e9a08f 55%,#ffd9a0 100%)'
        }}
      />
      <div
        className="absolute -top-24 right-[12%] w-[34rem] h-[34rem] rounded-full transition-all duration-[1600ms]"
        style={{
          background: dusk
            ? 'radial-gradient(circle, rgba(255,160,90,0.55) 0%, rgba(255,160,90,0) 65%)'
            : 'radial-gradient(circle, rgba(255,244,200,0.8) 0%, rgba(255,244,200,0) 65%)'
        }}
      />

      {webglFailed && (
        <svg className="absolute bottom-0 left-0 w-full h-1/2" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <path d="M0 400V220C160 160 260 120 420 190S700 260 860 170 1200 90 1440 200V400Z" fill="#7fb069" opacity="0.8" />
          <path d="M0 400V300C200 250 320 230 520 290S900 320 1100 260 1340 250 1440 290V400Z" fill="#4f9a3d" />
        </svg>
      )}

      <div
        ref={mountRef}
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: ready ? 1 : 0 }}
      />
      {/* gentle vignette keeps foreground text legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/25" />
    </div>
  );
};
