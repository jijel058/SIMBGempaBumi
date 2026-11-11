import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { audio } from '../../services/audioService';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Play,
  Flame,
  Radio,
  Layers,
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';

export type SimulationStage = 'overview' | 'chasm' | 'evacuation';

interface Props {
  magnitude?: number;
  onMagnitudeChange?: (mag: number) => void;
  activeStage?: SimulationStage;
  onStageChange?: (stage: SimulationStage) => void;
  height?: string;
  autoShakeOnMount?: boolean;
}

export const DaylightCityRupture3D: React.FC<Props> = ({
  magnitude = 6.4,
  onMagnitudeChange,
  activeStage = 'overview',
  onStageChange,
  height = '620px',
  autoShakeOnMount = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalMagnitude, setInternalMagnitude] = useState<number>(magnitude);
  const [currentStage, setCurrentStage] = useState<SimulationStage>(activeStage);
  const [isShakingActive, setIsShakingActive] = useState<boolean>(false);
  const [shakeCountdown, setShakeCountdown] = useState<number>(0);
  const [activePin, setActivePin] = useState<string | null>('pin-chasm');
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Sync external props
  useEffect(() => {
    setInternalMagnitude(magnitude);
  }, [magnitude]);

  useEffect(() => {
    setCurrentStage(activeStage);
  }, [activeStage]);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Dynamic meshes references
  const leftRoadGroupRef = useRef<THREE.Group | null>(null);
  const rightRoadGroupRef = useRef<THREE.Group | null>(null);
  const chasmCavityRef = useRef<THREE.Mesh | null>(null);
  const towerLeftRef = useRef<THREE.Group | null>(null);
  const towerRightRef = useRef<THREE.Group | null>(null);
  const waterFlowRef = useRef<THREE.Mesh | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const sirenLightRed1Ref = useRef<THREE.PointLight | null>(null);
  const sirenLightRed2Ref = useRef<THREE.PointLight | null>(null);
  const sirenLightBlueRef = useRef<THREE.PointLight | null>(null);
  const beaconMeshRed1Ref = useRef<THREE.Mesh | null>(null);
  const beaconMeshRed2Ref = useRef<THREE.Mesh | null>(null);
  const beaconMeshBlueRef = useRef<THREE.Mesh | null>(null);
  const evaquePathMeshRef = useRef<THREE.Line | null>(null);

  // Camera targets for Lerp
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(26, 22, 38));
  const cameraTargetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));
  const currentCameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));

  // Mouse parallax interaction
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });

  // Shake clock & intensity
  const shakeIntensityRef = useRef<number>(0);

  // Helper to generate procedural canvas texture for asphalt
  const createAsphaltTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark grey asphalt base
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 0, 512, 512);

    // Grain noise
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(Math.random() * 40 + 45);
      ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Yellow double lane marking in center
    ctx.fillStyle = '#F59E0B';
    for (let y = 0; y < 512; y += 48) {
      ctx.fillRect(250, y, 6, 32);
      ctx.fillRect(260, y, 6, 32);
    }

    // White side shoulder lines
    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(40, 0, 8, 512);
    ctx.fillRect(464, 0, 8, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 4);
    return texture;
  };

  // Helper to generate procedural building facade texture with windows
  const createBuildingTexture = (baseColor: string, windowColor: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Concrete facade background
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 256, 512);

    // Rows and columns of windows
    const cols = 6;
    const rows = 14;
    const winWidth = 24;
    const winHeight = 22;
    const paddingX = (256 - cols * winWidth) / (cols + 1);
    const paddingY = (512 - rows * winHeight) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = paddingX + c * (winWidth + paddingX);
        const y = paddingY + r * (winHeight + paddingY);

        // Window gradient for sky reflection
        const grad = ctx.createLinearGradient(x, y, x, y + winHeight);
        grad.addColorStop(0, windowColor);
        grad.addColorStop(1, '#94A3B8');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, winWidth, winHeight);

        // Window frame
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, winWidth, winHeight);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Switch camera angle according to stage
  useEffect(() => {
    if (currentStage === 'overview') {
      cameraTargetPos.current.set(24, 20, 36);
      cameraTargetLookAt.current.set(0, 5, 0);
    } else if (currentStage === 'chasm') {
      cameraTargetPos.current.set(9, 9, 21);
      cameraTargetLookAt.current.set(-1, 2, -2);
    } else if (currentStage === 'evacuation') {
      cameraTargetPos.current.set(32, 28, 22);
      cameraTargetLookAt.current.set(8, 6, -6);
    }
  }, [currentStage]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const heightPx = container.clientHeight;

    // 1. Scene with Daylight Atmospheric Mist
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const daylightSkyColor = new THREE.Color(0xdbeafe); // Soft daytime sky blue/amber mist
    scene.background = daylightSkyColor;
    scene.fog = new THREE.FogExp2(0xdfe7ec, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / heightPx, 0.5, 400);
    camera.position.set(26, 22, 38);
    cameraRef.current = camera;

    // 3. Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Daylight Illumination (Sun + Sky Hemisphere + Ambient)
    const ambientLight = new THREE.AmbientLight(0xfffdf5, 1.25);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xd6c2a8, 1.1);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(40, 55, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 160;
    const d = 45;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Subtle warm ground fill light from chasm depth
    const chasmFaultGlow = new THREE.PointLight(0xea580c, 3.5, 30);
    chasmFaultGlow.position.set(0, -2, 0);
    scene.add(chasmFaultGlow);

    // 5. Materials
    const asphaltTexture = createAsphaltTexture();
    const asphaltMaterial = new THREE.MeshStandardMaterial({
      map: asphaltTexture,
      roughness: 0.85,
      metalness: 0.1
    });

    const sidewalkMaterial = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.8
    });

    const soilStrataMaterial = new THREE.MeshStandardMaterial({
      color: 0x5d4037,
      roughness: 0.95
    });

    const deepFaultMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c120c,
      roughness: 0.9,
      emissive: 0xd97706,
      emissiveIntensity: 0.25
    });

    // 6. LEFT ROAD & SIDEWALK SLAB (Will vibrate & offset on fault slip)
    const leftGroup = new THREE.Group();
    leftRoadGroupRef.current = leftGroup;
    scene.add(leftGroup);

    // Left Road Asphalt Mesh (Jagged diagonal chasm cut)
    const roadWidth = 14;
    const roadLength = 65;
    const roadThickness = 2.5;

    const leftRoadGeo = new THREE.BoxGeometry(roadWidth, roadThickness, roadLength);
    const leftRoadMesh = new THREE.Mesh(leftRoadGeo, asphaltMaterial);
    leftRoadMesh.position.set(-8.5, 0, 0);
    leftRoadMesh.receiveShadow = true;
    leftRoadMesh.castShadow = true;
    leftGroup.add(leftRoadMesh);

    // Left Sidewalk
    const leftWalkGeo = new THREE.BoxGeometry(5, roadThickness + 0.3, roadLength);
    const leftWalkMesh = new THREE.Mesh(leftWalkGeo, sidewalkMaterial);
    leftWalkMesh.position.set(-18, 0.15, 0);
    leftWalkMesh.receiveShadow = true;
    leftGroup.add(leftWalkMesh);

    // Left Strata Base below road
    const leftBaseGeo = new THREE.BoxGeometry(roadWidth + 5, 8, roadLength);
    const leftBaseMesh = new THREE.Mesh(leftBaseGeo, soilStrataMaterial);
    leftBaseMesh.position.set(-11, -4.8, 0);
    leftGroup.add(leftBaseMesh);

    // 7. RIGHT ROAD & SIDEWALK SLAB (Displaces opposite direction)
    const rightGroup = new THREE.Group();
    rightRoadGroupRef.current = rightGroup;
    scene.add(rightGroup);

    const rightRoadMesh = new THREE.Mesh(leftRoadGeo, asphaltMaterial);
    rightRoadMesh.position.set(8.5, 0, 0);
    rightRoadMesh.receiveShadow = true;
    rightRoadMesh.castShadow = true;
    rightGroup.add(rightRoadMesh);

    // Right Sidewalk
    const rightWalkMesh = new THREE.Mesh(leftWalkGeo, sidewalkMaterial);
    rightWalkMesh.position.set(18, 0.15, 0);
    rightWalkMesh.receiveShadow = true;
    rightGroup.add(rightWalkMesh);

    // Right Strata Base
    const rightBaseGeo = new THREE.BoxGeometry(roadWidth + 5, 8, roadLength);
    const rightBaseMesh = new THREE.Mesh(rightBaseGeo, soilStrataMaterial);
    rightBaseMesh.position.set(11, -4.8, 0);
    rightGroup.add(rightBaseMesh);

    // 8. CHASM CAVITY (Deep rocky fault abyss in center)
    const chasmGeo = new THREE.BoxGeometry(4.5, 12, roadLength + 10);
    const chasmMesh = new THREE.Mesh(chasmGeo, deepFaultMaterial);
    chasmMesh.position.set(0, -6.5, 0);
    scene.add(chasmMesh);
    chasmCavityRef.current = chasmMesh;

    // Broken Concrete Slabs tumbled inside the chasm
    const brokenSlabGeo1 = new THREE.BoxGeometry(3.8, 0.8, 6.5);
    const brokenSlab1 = new THREE.Mesh(brokenSlabGeo1, sidewalkMaterial);
    brokenSlab1.position.set(-0.6, -1.8, 4);
    brokenSlab1.rotation.set(0.2, 0.3, 0.45);
    brokenSlab1.castShadow = true;
    brokenSlab1.receiveShadow = true;
    scene.add(brokenSlab1);

    const brokenSlabGeo2 = new THREE.BoxGeometry(3.2, 0.7, 5.8);
    const brokenSlab2 = new THREE.Mesh(brokenSlabGeo2, asphaltMaterial);
    brokenSlab2.position.set(0.7, -2.5, -7);
    brokenSlab2.rotation.set(-0.35, -0.2, -0.5);
    brokenSlab2.castShadow = true;
    brokenSlab2.receiveShadow = true;
    scene.add(brokenSlab2);

    // Broken Water Main with Leaking Water Pool in Chasm
    const waterGeo = new THREE.PlaneGeometry(3.6, 28);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0891b2,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, -4.2, 2);
    scene.add(waterMesh);
    waterFlowRef.current = waterMesh;

    // Broken Steel Rebar wires poking out of the concrete
    const rebarMat = new THREE.MeshStandardMaterial({ color: 0x78716c, metalness: 0.9, roughness: 0.3 });
    for (let i = 0; i < 6; i++) {
      const rebarGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5);
      const rebar = new THREE.Mesh(rebarGeo, rebarMat);
      rebar.position.set(-1.8 + Math.random() * 0.4, 0.2, -12 + i * 5);
      rebar.rotation.set(Math.random() * 0.4, 0, 0.8 + Math.random() * 0.4);
      scene.add(rebar);
    }

    // 9. HIGH-RISE BUILDINGS (TOWERS SPLITTING / LEANING LIKE SVG REFERENCE)
    // Tower 1 (Left - Leaning at ~ -11 deg)
    const tower1Group = new THREE.Group();
    towerLeftRef.current = tower1Group;
    tower1Group.position.set(-14, 0, -4);
    scene.add(tower1Group);

    const bldgTexture1 = createBuildingTexture('#CBD5E1', '#E0F2FE');
    const towerMat1 = new THREE.MeshStandardMaterial({
      map: bldgTexture1,
      roughness: 0.65,
      metalness: 0.2
    });

    const tower1Geo = new THREE.BoxGeometry(9.5, 36, 12);
    const tower1Mesh = new THREE.Mesh(tower1Geo, towerMat1);
    tower1Mesh.position.set(0, 18, 0);
    tower1Mesh.castShadow = true;
    tower1Mesh.receiveShadow = true;
    tower1Group.add(tower1Mesh);

    // Initial tilt of Tower 1 (-11 deg = -0.19 rad)
    tower1Group.rotation.z = -0.16;

    // Roof equipment on Tower 1
    const acUnitGeo = new THREE.BoxGeometry(2.5, 1.8, 3);
    const acMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const acMesh1 = new THREE.Mesh(acUnitGeo, acMat);
    acMesh1.position.set(1.5, 36.9, 2);
    tower1Group.add(acMesh1);

    // Tower 2 (Right - Leaning at ~ +13 deg with split gap)
    const tower2Group = new THREE.Group();
    towerRightRef.current = tower2Group;
    tower2Group.position.set(15, 0, -5);
    scene.add(tower2Group);

    const bldgTexture2 = createBuildingTexture('#B0BEC5', '#BAE6FD');
    const towerMat2 = new THREE.MeshStandardMaterial({
      map: bldgTexture2,
      roughness: 0.65,
      metalness: 0.2
    });

    const tower2Geo = new THREE.BoxGeometry(9.5, 33, 11);
    const tower2Mesh = new THREE.Mesh(tower2Geo, towerMat2);
    tower2Mesh.position.set(0, 16.5, 0);
    tower2Mesh.castShadow = true;
    tower2Mesh.receiveShadow = true;
    tower2Group.add(tower2Mesh);

    // Initial tilt of Tower 2 (+13 deg = +0.22 rad)
    tower2Group.rotation.z = 0.18;

    // Mid-rise residential buildings on sides
    const midBldgGeo1 = new THREE.BoxGeometry(8, 16, 10);
    const midMat1 = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.7 });
    const midBldg1 = new THREE.Mesh(midBldgGeo1, midMat1);
    midBldg1.position.set(-17, 8, 15);
    midBldg1.castShadow = true;
    midBldg1.receiveShadow = true;
    scene.add(midBldg1);

    const midBldgGeo2 = new THREE.BoxGeometry(8, 18, 12);
    const midBldg2 = new THREE.Mesh(midBldgGeo2, midMat1);
    midBldg2.position.set(18, 9, 14);
    midBldg2.castShadow = true;
    midBldg2.receiveShadow = true;
    scene.add(midBldg2);

    // Distant city silhouette in daylight fog
    const distantBldgMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    for (let i = 0; i < 9; i++) {
      const h = 22 + Math.random() * 26;
      const w = 6 + Math.random() * 4;
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(w, h, 6), distantBldgMat);
      bldg.position.set(-35 + i * 9, h / 2, -32 - Math.random() * 8);
      scene.add(bldg);
    }

    // 10. GREEN TREES & CITY PARK (SAFE ASSEMBLY ZONE ON RIGHT)
    const treeTrunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.2);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const treeFoliageMat1 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
    const treeFoliageMat2 = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.65 });

    const createTree = (x: number, z: number, scale = 1) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 1.25, z);
      treeGroup.scale.set(scale, scale, scale);

      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 1.1;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // 3 Layers of pine / cone foliage
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.4, 7), treeFoliageMat1);
      c1.position.y = 2.4;
      c1.castShadow = true;
      treeGroup.add(c1);

      const c2 = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.0, 7), treeFoliageMat2);
      c2.position.y = 3.5;
      c2.castShadow = true;
      treeGroup.add(c2);

      const c3 = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 7), treeFoliageMat1);
      c3.position.y = 4.4;
      c3.castShadow = true;
      treeGroup.add(c3);

      scene.add(treeGroup);
    };

    // Sidewalk Trees
    createTree(-17.5, 4, 1.1);
    createTree(-17.5, -8, 1.0);
    createTree(-17.5, 12, 0.9);

    // Park / Safe Assembly Zone Trees on Far Right
    const parkGroundGeo = new THREE.BoxGeometry(16, 2.4, 30);
    const parkGroundMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.85 });
    const parkGroundMesh = new THREE.Mesh(parkGroundGeo, parkGroundMat);
    parkGroundMesh.position.set(27, 0.1, -8);
    parkGroundMesh.receiveShadow = true;
    scene.add(parkGroundMesh);

    createTree(22, -4, 1.25);
    createTree(25, -10, 1.1);
    createTree(28, -6, 1.3);
    createTree(24, -14, 1.2);
    createTree(29, -15, 1.15);
    createTree(31, -2, 1.35);

    // 11. EMERGENCY VEHICLES (FIRE TRUCKS & AMBULANCE WITH FLASHING BEACONS)
    // Vehicle 1: Fire Truck (Damkar Merah)
    const fireTruckGroup = new THREE.Group();
    fireTruckGroup.position.set(8.5, 1.5, 7.5);
    fireTruckGroup.rotation.y = -Math.PI / 8;
    scene.add(fireTruckGroup);

    const ftBodyGeo = new THREE.BoxGeometry(3.0, 2.2, 7.5);
    const ftBodyMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.35, metalness: 0.2 });
    const ftBody = new THREE.Mesh(ftBodyGeo, ftBodyMat);
    ftBody.castShadow = true;
    ftBody.receiveShadow = true;
    fireTruckGroup.add(ftBody);

    // White stripe & equipment box
    const ftStripeGeo = new THREE.BoxGeometry(3.05, 0.45, 7.55);
    const ftStripeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const ftStripe = new THREE.Mesh(ftStripeGeo, ftStripeMat);
    ftStripe.position.y = -0.15;
    fireTruckGroup.add(ftStripe);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    wheelGeo.rotateZ(Math.PI / 2);
    for (const [wx, wz] of [
      [-1.5, 2.3],
      [1.5, 2.3],
      [-1.5, -2.1],
      [1.5, -2.1]
    ]) {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, -0.65, wz);
      fireTruckGroup.add(w);
    }

    // Fire Emergency Siren Beacon (Red PointLight casting light on road)
    const beaconGeo = new THREE.SphereGeometry(0.22, 8, 8);
    const beaconRedMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
    const beacon1 = new THREE.Mesh(beaconGeo, beaconRedMat);
    beacon1.position.set(-0.7, 1.25, 2.4);
    fireTruckGroup.add(beacon1);
    beaconMeshRed1Ref.current = beacon1;

    const sirenRed1 = new THREE.PointLight(0xff1744, 3.2, 14);
    sirenRed1.position.set(-0.7, 1.6, 2.4);
    fireTruckGroup.add(sirenRed1);
    sirenLightRed1Ref.current = sirenRed1;

    // Vehicle 2: Ambulance (Putih dengan Palang Medis)
    const ambulanceGroup = new THREE.Group();
    ambulanceGroup.position.set(-8.5, 1.4, 18);
    ambulanceGroup.rotation.y = Math.PI * 0.9;
    scene.add(ambulanceGroup);

    const ambBodyGeo = new THREE.BoxGeometry(2.6, 2.1, 5.8);
    const ambBodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const ambBody = new THREE.Mesh(ambBodyGeo, ambBodyMat);
    ambBody.castShadow = true;
    ambBody.receiveShadow = true;
    ambulanceGroup.add(ambBody);

    // Red medical stripe
    const ambStripeGeo = new THREE.BoxGeometry(2.65, 0.4, 5.85);
    const ambStripeMat = new THREE.MeshStandardMaterial({ color: 0xe53935 });
    const ambStripe = new THREE.Mesh(ambStripeGeo, ambStripeMat);
    ambulanceGroup.add(ambStripe);

    // Ambulance Wheels
    for (const [wx, wz] of [
      [-1.3, 1.8],
      [1.3, 1.8],
      [-1.3, -1.8],
      [1.3, -1.8]
    ]) {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, -0.65, wz);
      ambulanceGroup.add(w);
    }

    // Ambulance Siren Beacon (Blue & Red)
    const beaconBlueMat = new THREE.MeshBasicMaterial({ color: 0x29b6f6 });
    const beaconBlue = new THREE.Mesh(beaconGeo, beaconBlueMat);
    beaconBlue.position.set(0.6, 1.2, 1.7);
    ambulanceGroup.add(beaconBlue);
    beaconMeshBlueRef.current = beaconBlue;

    const sirenBlue = new THREE.PointLight(0x0284c7, 3.5, 14);
    sirenBlue.position.set(0.6, 1.5, 1.7);
    ambulanceGroup.add(sirenBlue);
    sirenLightBlueRef.current = sirenBlue;

    const beaconRed2 = new THREE.Mesh(beaconGeo, beaconRedMat);
    beaconRed2.position.set(-0.6, 1.2, 1.7);
    ambulanceGroup.add(beaconRed2);
    beaconMeshRed2Ref.current = beaconRed2;

    const sirenRed2 = new THREE.PointLight(0xef4444, 3.2, 14);
    sirenRed2.position.set(-0.6, 1.5, 1.7);
    ambulanceGroup.add(sirenRed2);
    sirenLightRed2Ref.current = sirenRed2;

    // 12. GLOWING EVACUATION PATH (Green Dashed Corridor from Ruptured Road to Safe Park - SVG 2)
    const curvePoints = [
      new THREE.Vector3(-4, 1.45, 12),
      new THREE.Vector3(2, 1.5, 5),
      new THREE.Vector3(12, 1.5, -1),
      new THREE.Vector3(22, 1.5, -6)
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const pathPoints = curve.getPoints(50);
    const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathMat = new THREE.LineDashedMaterial({
      color: 0x4ade80,
      linewidth: 3,
      scale: 1,
      dashSize: 1.2,
      gapSize: 0.6
    });
    const evacLine = new THREE.Line(pathGeo, pathMat);
    evacLine.computeLineDistances();
    scene.add(evacLine);
    evaquePathMeshRef.current = evacLine;

    // 13. DUST & DEBRIS PARTICLE CLOUD (Puffing from chasm and cracks)
    const particleCount = 140;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(particleCount * 3);
    const dustSpeeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 14;
      dustPositions[i * 3 + 1] = Math.random() * 9 - 1;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 35;

      dustSpeeds[i * 3] = (Math.random() - 0.5) * 0.03;
      dustSpeeds[i * 3 + 1] = Math.random() * 0.05 + 0.02;
      dustSpeeds[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0xd6d3d1,
      size: 0.9,
      transparent: true,
      opacity: 0.55,
      blending: THREE.NormalBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // 14. Mouse / Touch Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = x * 2.5;
      mousePos.current.targetY = y * 2.0;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 15. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 16. ANIMATION RENDER LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Smooth camera interpolation towards target stage position
      camera.position.x += (cameraTargetPos.current.x + mousePos.current.x - camera.position.x) * 0.04;
      camera.position.y += (cameraTargetPos.current.y + mousePos.current.y - camera.position.y) * 0.04;
      camera.position.z += (cameraTargetPos.current.z - camera.position.z) * 0.04;

      currentCameraLookAt.current.lerp(cameraTargetLookAt.current, 0.04);
      camera.lookAt(currentCameraLookAt.current);

      // SHAKE PHYSICS & FAULT SLIP DYNAMICS
      const currentMag = internalMagnitude;
      const isTremorActive = isShakingActive || shakeIntensityRef.current > 0.01;

      // Decay manual shake impulse
      if (shakeIntensityRef.current > 0.005) {
        shakeIntensityRef.current *= 0.982;
      } else {
        shakeIntensityRef.current = 0;
      }

      // Base vibration amplitude scaled by Richter magnitude
      // M 4.0: subtle (0.01), M 6.4: noticeable (0.06), M 8.5: intense (0.18)
      const magIntensity = Math.pow((currentMag - 3.0) / 5.5, 2.2) * 0.08;
      const totalShake = (isTremorActive ? magIntensity + shakeIntensityRef.current : magIntensity * 0.25);

      if (totalShake > 0.001) {
        const shakeX = Math.sin(elapsedTime * 42) * totalShake;
        const shakeY = Math.cos(elapsedTime * 36) * totalShake * 0.6;
        const shakeZ = Math.sin(elapsedTime * 28 + 1) * totalShake;

        // Vibrate camera jitter
        camera.position.x += shakeX * 0.4;
        camera.position.y += shakeY * 0.3;

        // Vibrate Road slabs with fault offset
        if (leftRoadGroupRef.current) {
          leftRoadGroupRef.current.position.y = shakeY * 0.7;
          leftRoadGroupRef.current.position.x = -shakeX * 0.5 - (currentMag - 5.0) * 0.15;
        }
        if (rightRoadGroupRef.current) {
          rightRoadGroupRef.current.position.y = -shakeY * 0.7;
          rightRoadGroupRef.current.position.x = shakeX * 0.5 + (currentMag - 5.0) * 0.15;
        }

        // Sway Towers oscillation
        if (towerLeftRef.current) {
          towerLeftRef.current.rotation.z = -0.16 + Math.sin(elapsedTime * 12) * totalShake * 1.5;
        }
        if (towerRightRef.current) {
          towerRightRef.current.rotation.z = 0.18 + Math.cos(elapsedTime * 14) * totalShake * 1.5;
        }
      }

      // Water Ripple Animation inside Chasm
      if (waterFlowRef.current) {
        waterFlowRef.current.position.y = -4.2 + Math.sin(elapsedTime * 3) * 0.08;
      }

      // Dust particles upward drift
      if (dustParticlesRef.current) {
        const posAttr = dustParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += dustSpeeds[i * 3 + 1] * (1 + totalShake * 10);
          positions[i * 3] += dustSpeeds[i * 3];

          // Recycle particle once it floats high
          if (positions[i * 3 + 1] > 18) {
            positions[i * 3 + 1] = -2;
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
          }
        }
        posAttr.needsUpdate = true;
      }

      // Flashing Emergency Siren Lights
      const sirenCycle = elapsedTime * 8;
      const sirenFlashRed = Math.sin(sirenCycle) > 0;
      const sirenFlashBlue = Math.cos(sirenCycle) > 0;

      if (sirenLightRed1Ref.current) sirenLightRed1Ref.current.intensity = sirenFlashRed ? 3.5 : 0.2;
      if (sirenLightRed2Ref.current) sirenLightRed2Ref.current.intensity = sirenFlashRed ? 3.5 : 0.2;
      if (sirenLightBlueRef.current) sirenLightBlueRef.current.intensity = sirenFlashBlue ? 4.0 : 0.2;

      renderer.render(scene, camera);
    };

    animate();

    if (autoShakeOnMount) {
      triggerEarthquakeTremor(6.8);
    }

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Trigger manual earthquake pulse
  const triggerEarthquakeTremor = (customMag?: number) => {
    const targetMag = customMag || internalMagnitude;
    shakeIntensityRef.current = Math.pow((targetMag - 3.0) / 4.5, 1.8) * 0.14;
    setIsShakingActive(true);
    setShakeCountdown(6);

    if (!isSoundMuted) {
      audio.playEarthquakeRumble(targetMag, 1.5);
    }

    const timer = setInterval(() => {
      setShakeCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsShakingActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInternalMagnitude(val);
    if (onMagnitudeChange) {
      onMagnitudeChange(val);
    }
  };

  const handleStageSelect = (stage: SimulationStage) => {
    audio.playClick();
    setCurrentStage(stage);
    if (onStageChange) {
      onStageChange(stage);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl bg-gradient-to-b from-[#E2E8F0] via-[#D6E4E8] to-[#8FA6B2] select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} style={{ height }} className="w-full cursor-grab active:cursor-grabbing" />

      {/* TOP HUD: Daylight Editorial Status & Active Scene Info */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-sm pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black tracking-wide text-slate-800 uppercase">
            3D Daylight City Rupture & Evacuation Simulation
          </span>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            M {internalMagnitude.toFixed(1)} Richter
          </span>
        </div>

        {/* Stage Selector Pills (Overview -> Chasm -> Evacuation) */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm pointer-events-auto">
          <button
            onClick={() => handleStageSelect('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentStage === 'overview'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. Patahan Kota
          </button>
          <button
            onClick={() => handleStageSelect('chasm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentStage === 'chasm'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            2. Rekahan & Damkar
          </button>
          <button
            onClick={() => handleStageSelect('evacuation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentStage === 'evacuation'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            3. Rute Evakuasi
          </button>
        </div>
      </div>

      {/* FLOATING 3D CALLOUT PINS (Like user's SVG mockups) */}
      {currentStage === 'overview' && (
        <div className="absolute top-[38%] left-[52%] -translate-x-1/2 pointer-events-auto">
          <div
            onClick={() => setActivePin(activePin === 'pin-chasm' ? null : 'pin-chasm')}
            className="group relative cursor-pointer flex flex-col items-center"
          >
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-amber-500 text-white shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <div>
                <p className="text-[10px] font-black tracking-wider text-amber-300 uppercase">RETAKAN SESAR DARAT #01</p>
                <p className="text-xs font-extrabold text-white">MAGNITUDO {internalMagnitude.toFixed(1)} • AKTIF</p>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500 to-transparent" />
          </div>
        </div>
      )}

      {currentStage === 'overview' && (
        <div className="absolute top-[22%] left-[32%] pointer-events-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-rose-500 text-white shadow-lg">
            <p className="text-[9px] font-bold text-rose-300 uppercase">GEDUNG CONDONG -11°</p>
            <p className="text-[11px] font-extrabold text-white">RESIKO RUNTUH TINGGI</p>
          </div>
        </div>
      )}

      {currentStage === 'chasm' && (
        <div className="absolute bottom-[36%] right-[28%] pointer-events-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-red-500 text-white shadow-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <p className="text-[9px] font-bold text-red-300 uppercase">UNIT TANGGAP DARURAT</p>
              <p className="text-xs font-black text-white">DAMKAR S-01 & AMBULANS SIAGA</p>
            </div>
          </div>
        </div>
      )}

      {currentStage === 'evacuation' && (
        <div className="absolute top-[32%] right-[22%] pointer-events-auto">
          <div className="px-4 py-2 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-400 text-white shadow-xl flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-[10px] font-black text-emerald-300 uppercase">ZONA EVAKUASI AMAN</p>
              <p className="text-xs font-black text-white">LAPANGAN TERBUKA SEKTOR B (3.500 JIWA)</p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLLER & MAGNITUDE SCRUBBER (SVG Ref: Skala Guncangan) */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/92 backdrop-blur-xl p-3.5 sm:px-5 sm:py-3.5 rounded-2xl border border-slate-200/90 shadow-xl">
        {/* Left: Magnitude Scrubber */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Skala Guncangan
            </span>
            <span className="text-base font-black text-slate-900">
              M {internalMagnitude.toFixed(1)} <span className="text-xs font-bold text-slate-500">SR</span>
            </span>
          </div>

          <div className="flex-1 sm:w-56 flex items-center gap-2">
            <input
              type="range"
              min="3.0"
              max="8.8"
              step="0.1"
              value={internalMagnitude}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => triggerEarthquakeTremor()}
            disabled={isShakingActive}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition shadow-sm ${
              isShakingActive
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isShakingActive ? 'animate-spin' : ''}`} />
            <span>{isShakingActive ? `Guncangan Aktif (${shakeCountdown}s)` : 'Simulasikan Gempa'}</span>
          </button>

          <button
            onClick={() => {
              setIsSoundMuted(!isSoundMuted);
              audio.playClick();
            }}
            title={isSoundMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
