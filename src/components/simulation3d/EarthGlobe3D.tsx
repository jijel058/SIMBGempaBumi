import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Earthquake } from '../../types/earthquake';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Eye,
  Sparkles,
  Info,
  Map as MapIcon,
  Cloud,
  Sun,
  Loader2,
  Check
} from 'lucide-react';
import { MagnitudeBadge } from '../common/MagnitudeBadge';
import { audio } from '../../services/audioService';

interface Props {
  earthquakes: Earthquake[];
  interactive?: boolean;
  height?: string;
  onSelectQuake?: (quake: Earthquake) => void;
  initialMode?: 'surface' | 'layers' | 'plates';
  focusCoords?: { lat: number; lng: number } | null;
  showControlDeck?: boolean;
}

export const EarthGlobe3D: React.FC<Props> = ({
  earthquakes,
  interactive = true,
  height = '640px',
  onSelectQuake,
  initialMode = 'surface',
  focusCoords,
  showControlDeck = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'surface' | 'layers' | 'plates'>(initialMode);
  const [hoveredQuake, setHoveredQuake] = useState<Earthquake | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [showClouds, setShowClouds] = useState<boolean>(true);
  const [isLoadingTextures, setIsLoadingTextures] = useState<boolean>(true);
  const [textureStatus, setTextureStatus] = useState<string>('Memuat Tekstur Satelit Asli NASA...');

  const {
    setSelectedQuake,
    selectedQuake,
    viewOnMap,
    globeTargetCoords,
    setGlobeTargetCoords
  } = useApp();

  // Three.js internal instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosMeshRef = useRef<THREE.Mesh | null>(null);
  const layersGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const wavesGroupRef = useRef<THREE.Group | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);

  // Convert lat/lng to 3D Cartesian Vector3 on sphere of radius R
  const latLngToVector3 = useCallback((lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }, []);

  // Smooth spherical fly-to coordinates
  const rotateToCoordinates = useCallback((lat: number, lon: number) => {
    if (!globeGroupRef.current) return;
    setIsRotating(false);

    const targetY = -((lon + 90) * (Math.PI / 180));
    const targetX = lat * (Math.PI / 180);

    targetRotationRef.current = { x: targetX, y: targetY };

    if (cameraRef.current) {
      cameraRef.current.position.z = 195;
    }
  }, []);

  // Handle focusCoords
  useEffect(() => {
    const coords = focusCoords || globeTargetCoords;
    if (coords && coords.lat !== undefined && coords.lng !== undefined) {
      rotateToCoordinates(coords.lat, coords.lng);
      setGlobeTargetCoords(null);
    }
  }, [focusCoords, globeTargetCoords, rotateToCoordinates, setGlobeTargetCoords]);

  // Main Scene Setup with Photorealistic NASA Satellite Textures
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setIsLoadingTextures(true);
    setTextureStatus('Memuat Citra Satelit Bumi Asli (NASA Blue Marble)...');

    const width = container.clientWidth;
    const heightPx = container.clientHeight || 640;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1400);
    camera.position.z = 240;
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and high-precision color management
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Realistic Space Sunlight Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Warm main sun light
    const sunLight = new THREE.DirectionalLight(0xfffaea, 2.8);
    sunLight.position.set(280, 160, 220);
    scene.add(sunLight);

    // Subtle blue rim backlight for the dark horizon
    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    rimLight.position.set(-250, -80, -180);
    scene.add(rimLight);

    // 5. Starfield & Cosmic Dust in Space Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 950;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 1000;
      starPositions[i + 1] = (Math.random() - 0.5) * 1000;
      starPositions[i + 2] = (Math.random() - 0.5) * 1000;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 1.6,
      opacity: 0.65,
      transparent: true
    });
    const stars = new THREE.Points(starsGeo, starMat);
    scene.add(stars);

    // 6. Globe Master Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Initial orientation: Indonesia & Southeast Asia facing front
    globeGroup.rotation.y = -Math.PI / 1.7;
    globeGroup.rotation.x = 0.15;

    const earthRadius = 75;
    const sphereGeo = new THREE.SphereGeometry(earthRadius, 64, 64);

    // 7. Load Genuine NASA High-Resolution Satellite Textures
    const textureLoader = new THREE.TextureLoader();

    // Day Texture: NASA Blue Marble actual satellite imagery
    const dayTexture = textureLoader.load(
      '/textures/earth/earth_day.jpg',
      () => {
        setIsLoadingTextures(false);
      },
      undefined,
      err => {
        console.warn('Local texture load, falling back to CDN mirror:', err);
        // Fallback to high-speed CDN mirror
        textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', tex => {
          if (earthMeshRef.current) {
            (earthMeshRef.current.material as THREE.MeshPhongMaterial).map = tex;
            (earthMeshRef.current.material as THREE.MeshPhongMaterial).needsUpdate = true;
          }
          setIsLoadingTextures(false);
        });
      }
    );

    const normalTexture = textureLoader.load('/textures/earth/earth_normal.jpg');
    const specularTexture = textureLoader.load('/textures/earth/earth_specular.jpg');
    const cloudsTexture = textureLoader.load('/textures/earth/earth_clouds.png');

    // Configure texture filtering
    [dayTexture, normalTexture, specularTexture, cloudsTexture].forEach(tex => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
    });

    // Realistic Earth Physical Material (Oceans glint with sunlight, land topography has normal elevation relief)
    const earthMat = new THREE.MeshPhongMaterial({
      map: dayTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.85, 0.85),
      specularMap: specularTexture,
      specular: new THREE.Color(0x2d6898), // realistic blue ocean specular reflection
      shininess: 26,
    });
    const earthSphere = new THREE.Mesh(sphereGeo, earthMat);
    earthMeshRef.current = earthSphere;
    globeGroup.add(earthSphere);

    // 8. Atmospheric Clouds Layer Sphere (Real satellite clouds rotating independently)
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.014, 48, 48);
    const cloudsMat = new THREE.MeshLambertMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.42,
      blending: THREE.NormalBlending
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    cloudsMeshRef.current = cloudsMesh;
    globeGroup.add(cloudsMesh);

    // 9. Atmospheric Rayleigh Corona (Glowing outer horizon halo)
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.055, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    atmosMeshRef.current = atmosMesh;
    globeGroup.add(atmosMesh);

    // 10. Markers and Seismic Wave Rings Group
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    globeGroup.add(markersGroup);

    const wavesGroup = new THREE.Group();
    wavesGroupRef.current = wavesGroup;
    globeGroup.add(wavesGroup);

    // Populate earthquake pins from real API coordinates
    earthquakes.forEach((quake, index) => {
      const pos = latLngToVector3(quake.latitude, quake.longitude, earthRadius + 0.95);
      const mag = quake.magnitude || 4.5;
      const isSelected = selectedQuake?.id === quake.id;

      let colorHex = 0x10b981; // emerald
      if (mag >= 7.0) colorHex = 0xef4444; // red
      else if (mag >= 6.0) colorHex = 0xf97316; // orange
      else if (mag >= 5.0) colorHex = 0xeab308; // yellow

      // Epicenter pin sphere
      const pinSize = Math.max(1.6, (mag - 2.8) * 0.98);
      const pinGeo = new THREE.SphereGeometry(isSelected ? pinSize * 1.6 : pinSize, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: isSelected ? 0xffffff : colorHex });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { quakeIndex: index, quake };
      markersGroup.add(pinMesh);

      // Expanding pulsating seismic ripple waves around the epicenter
      const ringGeo = new THREE.RingGeometry(pinSize * 1.2, pinSize * 2.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      ringMesh.userData = {
        speed: 0.018 + (mag / 10) * 0.01,
        maxScale: Math.max(2.6, mag * 0.85)
      };
      wavesGroup.add(ringMesh);
    });

    // 11. Earth Internal Layers (Cutaway Model)
    const layersGroup = new THREE.Group();
    layersGroupRef.current = layersGroup;
    globeGroup.add(layersGroup);
    layersGroup.visible = false;

    // Inner Core (Solid Iron)
    const innerCoreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(22, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0xfef08a, emissive: 0xca8a04, emissiveIntensity: 0.5 })
    );
    layersGroup.add(innerCoreMesh);

    // Outer Core (Liquid Iron)
    const outerCoreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(44, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0xf97316, transparent: true, opacity: 0.75 })
    );
    layersGroup.add(outerCoreMesh);

    // Mantle (Silicate Rock)
    const mantleMesh = new THREE.Mesh(
      new THREE.SphereGeometry(66, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0x9a3412, transparent: true, opacity: 0.65 })
    );
    layersGroup.add(mantleMesh);

    // Mouse and Touch Interaction Handlers
    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      targetRotationRef.current = null;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !globeGroupRef.current) return;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        globeGroupRef.current.rotation.y += deltaX * 0.006;
        globeGroupRef.current.rotation.x += deltaY * 0.006;

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }

      // Raycasting for quake pin hover
      if (rendererRef.current && cameraRef.current && markersGroupRef.current) {
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
        const intersects = raycaster.intersectObjects(markersGroupRef.current.children);

        if (intersects.length > 0 && intersects[0].object.userData.quake) {
          setHoveredQuake(intersects[0].object.userData.quake);
          container.style.cursor = 'pointer';
        } else {
          setHoveredQuake(null);
          container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      if (container) container.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      if (!interactive || !rendererRef.current || !cameraRef.current || !markersGroupRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
      const intersects = raycaster.intersectObjects(markersGroupRef.current.children);

      if (intersects.length > 0 && intersects[0].object.userData.quake) {
        const quake = intersects[0].object.userData.quake;
        audio.playClick();
        if (onSelectQuake) onSelectQuake(quake);
        else setSelectedQuake(quake);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!interactive || !cameraRef.current) return;
      e.preventDefault();
      cameraRef.current.position.z = Math.min(
        Math.max(cameraRef.current.position.z + e.deltaY * 0.15, 115),
        360
      );
    };

    // Smartphone Touch Interactions
    const handleTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDraggingRef.current = true;
      targetRotationRef.current = null;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !globeGroupRef.current || !isDraggingRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
      globeGroupRef.current.rotation.y += deltaX * 0.008;
      globeGroupRef.current.rotation.x += deltaY * 0.008;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleMouseUp);

    // Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth camera fly-to target coordinates
      if (targetRotationRef.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += (targetRotationRef.current.y - globeGroupRef.current.rotation.y) * 0.06;
        globeGroupRef.current.rotation.x += (targetRotationRef.current.x - globeGroupRef.current.rotation.x) * 0.06;

        if (
          Math.abs(targetRotationRef.current.y - globeGroupRef.current.rotation.y) < 0.008 &&
          Math.abs(targetRotationRef.current.x - globeGroupRef.current.rotation.x) < 0.008
        ) {
          targetRotationRef.current = null;
        }
      } else if (globeGroupRef.current && isRotating && !isDraggingRef.current) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      // Slightly faster independent cloud rotation
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0006;
      }

      // Pulsing seismic waves
      if (wavesGroupRef.current) {
        wavesGroupRef.current.children.forEach((child: any) => {
          if (child.userData) {
            child.scale.x += child.userData.speed;
            child.scale.y += child.userData.speed;
            if (child.scale.x > child.userData.maxScale) {
              child.scale.set(1.0, 1.0, 1.0);
            }
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 640;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleMouseUp);
      renderer.dispose();
    };
  }, [earthquakes, interactive, isRotating, latLngToVector3, selectedQuake]);

  // Handle Layer toggles
  useEffect(() => {
    if (layersGroupRef.current && globeGroupRef.current) {
      if (viewMode === 'layers') {
        layersGroupRef.current.visible = true;
        if (markersGroupRef.current) markersGroupRef.current.visible = false;
        if (wavesGroupRef.current) wavesGroupRef.current.visible = false;
        if (cloudsMeshRef.current) cloudsMeshRef.current.visible = false;
      } else {
        layersGroupRef.current.visible = false;
        if (markersGroupRef.current) markersGroupRef.current.visible = true;
        if (wavesGroupRef.current) wavesGroupRef.current.visible = true;
        if (cloudsMeshRef.current) cloudsMeshRef.current.visible = showClouds;
      }
    }
  }, [viewMode, showClouds]);

  const handleZoom = (inOut: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const currentZ = cameraRef.current.position.z;
    cameraRef.current.position.z = inOut === 'in' ? Math.max(currentZ - 30, 115) : Math.min(currentZ + 30, 360);
  };

  const resetCamera = () => {
    if (!cameraRef.current || !globeGroupRef.current) return;
    cameraRef.current.position.set(0, 0, 240);
    globeGroupRef.current.rotation.set(0.15, -Math.PI / 1.7, 0);
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden bg-[#030712] border border-emerald-950/70 shadow-2xl select-none group"
      style={{ height }}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Indicator Overlay */}
      {isLoadingTextures && (
        <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-white tracking-wider uppercase block">
              {textureStatus}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              Resolusi Tinggi • Foto Satelit Asli Bumi
            </span>
          </div>
        </div>
      )}

      {/* Floating Mode Switcher (Top Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-900/50 shadow-lg">
        <button
          onClick={() => {
            audio.playClick();
            setViewMode('surface');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            viewMode === 'surface'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Foto Satelit Asli (Real-Time)</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            setViewMode('layers');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            viewMode === 'layers'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Struktur Lapisan Bumi</span>
        </button>
      </div>

      {/* Floating Controls Dock (Bottom Right) */}
      {showControlDeck && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-900/50 shadow-lg">
          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetCamera}
            title="Reset Posisi Globe"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              audio.playClick();
              setIsRotating(!isRotating);
            }}
            title={isRotating ? 'Hentikan Rotasi Otomatis' : 'Mulai Rotasi Otomatis'}
            className={`p-2 rounded-xl transition ${
              isRotating ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowClouds(!showClouds)}
            title="Toggle Lapisan Awan"
            className={`p-2 rounded-xl transition ${
              showClouds ? 'text-emerald-400' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Cloud className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Layer Explanation Overlay when in 'layers' mode */}
      {viewMode === 'layers' && (
        <div className="absolute bottom-4 left-4 z-10 max-w-sm bg-black/85 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/50 text-xs text-slate-300 space-y-2.5 animate-in fade-in duration-150">
          <h5 className="font-extrabold text-emerald-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <span>Struktur Lapisan Dalam Bumi:</span>
          </h5>
          <div className="space-y-1.5 text-[11px] leading-relaxed">
            <p><strong className="text-emerald-300">• Kerak Bumi (Crust):</strong> 0 - 70 km, tempat patahan sesar & gempa dangkal mematikan.</p>
            <p><strong className="text-orange-400">• Mantel Bumi (Mantle):</strong> ~2.900 km, batuan plastis panas pendorong arus konveksi tektonik.</p>
            <p><strong className="text-amber-500">• Inti Luar (Outer Core):</strong> ~2.200 km besi cair berputar menghasilkan medan magnet pelindung bumi.</p>
            <p><strong className="text-yellow-300">• Inti Dalam (Inner Core):</strong> ~1.220 km bola padat besi-nikel bersuhu ekstrim ~5.400°C.</p>
          </div>
        </div>
      )}

      {/* Hovered / Clicked Quake Tooltip with "VIEW ON 2D MAP" Two-Way Button */}
      {hoveredQuake && viewMode === 'surface' && (
        <div className="absolute top-4 right-4 z-20 max-w-xs bg-earth-surface/95 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/50 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MagnitudeBadge magnitude={hoveredQuake.magnitude} size="sm" />
              <span className="text-[11px] font-bold text-emerald-400">{hoveredQuake.source}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {new Date(hoveredQuake.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-xs text-white line-clamp-2 leading-snug">
              {hoveredQuake.location}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
              <span>Kedalaman: <strong className="text-slate-200">{hoveredQuake.depth} km</strong></span>
              <span>•</span>
              <span>{hoveredQuake.latitude.toFixed(2)}°, {hoveredQuake.longitude.toFixed(2)}°</span>
            </div>
          </div>

          {/* TWO-WAY BUTTON: VIEW ON MAP */}
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                audio.playClick();
                viewOnMap(hoveredQuake);
              }}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>VIEW ON 2D MAP</span>
            </button>

            <button
              onClick={e => {
                e.stopPropagation();
                audio.playClick();
                setSelectedQuake(hoveredQuake);
              }}
              className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold transition"
            >
              Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
