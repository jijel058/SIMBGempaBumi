import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Earthquake } from '../../types/earthquake';
import { TECTONIC_PLATES } from '../../data/tectonicPlatesGeoJSON';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Crosshair,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  ShieldAlert,
  Info,
  Radio,
  Search,
  Globe2,
  Map as MapIcon,
  Satellite,
  Mountain,
  Sparkles
} from 'lucide-react';
import { audio } from '../../services/audioService';

export type BasemapType = 'standard' | 'satellite' | 'terrain' | 'heatmap';

interface Props {
  earthquakes: Earthquake[];
  height?: string;
  onSelectQuake?: (q: Earthquake) => void;
  showBasemapControls?: boolean;
}

export const EarthquakeMap: React.FC<Props> = ({
  earthquakes,
  height = '680px',
  onSelectQuake,
  showBasemapControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);
  const platesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const {
    userLocation,
    requestUserLocation,
    setSelectedQuake,
    selectedQuake,
    viewOn3DGlobe,
    mapTargetCoords,
    setMapTargetCoords,
    language
  } = useApp();

  // Basemap Selector: Standard, Satellite, Terrain, Heatmap
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('satellite');
  const [minMag, setMinMag] = useState<number>(3.0);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'BMKG' | 'USGS'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTectonicPlates, setShowTectonicPlates] = useState<boolean>(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered over Indonesia & Southeast Asia by default
    const map = L.map(mapContainerRef.current, {
      center: [-2.5, 118.0],
      zoom: 5,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    heatLayerRef.current = L.layerGroup().addTo(map);
    platesLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Tiles (Standard, Satellite, Terrain, Heatmap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile and label layers
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    if (activeBasemap === 'satellite') {
      // 1. Realistic Satellite Imagery (Esri World Imagery)
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18
        }
      ).addTo(map);

      // Boundaries and place names overlay
      labelLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          opacity: 0.85
        }
      ).addTo(map);
    } else if (activeBasemap === 'terrain') {
      // 2. Realistic Physical Terrain & Elevation Topography
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey',
          maxZoom: 18
        }
      ).addTo(map);
    } else {
      // 3. Standard Map (CartoDB Voyager / OpenStreetMap with clean roads, coastlines, and borders)
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }
      ).addTo(map);
    }
  }, [activeBasemap]);

  // Handle incoming camera target coordinates from 3D Globe
  useEffect(() => {
    if (mapTargetCoords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([mapTargetCoords.lat, mapTargetCoords.lng], 8, { duration: 1.5 });
      setMapTargetCoords(null);
    }
  }, [mapTargetCoords, setMapTargetCoords]);

  // Update Tectonic Plates Layer
  useEffect(() => {
    const platesLayer = platesLayerRef.current;
    if (!platesLayer) return;

    platesLayer.clearLayers();

    if (showTectonicPlates) {
      TECTONIC_PLATES.forEach(plate => {
        const polyline = L.polyline(plate.coordinates, {
          color: plate.color,
          weight: 2.8,
          opacity: 0.9,
          dashArray: plate.type.includes('Fault') ? '5, 6' : undefined
        });

        polyline.bindTooltip(
          `<strong>${plate.name}</strong><br/><span style="font-size:10px; color:#64748b">${plate.type}</span>`,
          { sticky: true }
        );

        platesLayer.addLayer(polyline);
      });
    }
  }, [showTectonicPlates]);

  // Update Earthquake Markers & Heatmap Layer
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    const heatLayer = heatLayerRef.current;
    const map = mapInstanceRef.current;
    if (!markersLayer || !heatLayer || !map) return;

    markersLayer.clearLayers();
    heatLayer.clearLayers();

    // Filter earthquakes
    const filtered = earthquakes.filter(q => {
      if (q.magnitude < minMag) return false;
      if (sourceFilter !== 'all' && q.source !== sourceFilter) return false;
      if (searchQuery.trim()) {
        const qLower = searchQuery.toLowerCase();
        if (!q.location.toLowerCase().includes(qLower) && !q.source.toLowerCase().includes(qLower)) {
          return false;
        }
      }
      return true;
    });

    // 1. Draw Heatmap Layer (if Heatmap mode active or significant quakes)
    filtered.forEach(quake => {
      const mag = quake.magnitude;
      if (activeBasemap === 'heatmap' || mag >= 5.0) {
        const heatRadius = activeBasemap === 'heatmap' ? mag * 35000 : mag * 22000;
        let heatColor = '#10b981';
        if (mag >= 7.0) heatColor = '#ef4444';
        else if (mag >= 6.0) heatColor = '#f97316';
        else if (mag >= 5.0) heatColor = '#eab308';

        const heatCircle = L.circle([quake.latitude, quake.longitude], {
          radius: heatRadius,
          color: heatColor,
          fillColor: heatColor,
          fillOpacity: activeBasemap === 'heatmap' ? 0.28 : 0.12,
          weight: 1,
          opacity: 0.35
        });
        heatLayer.addLayer(heatCircle);
      }
    });

    // 2. Draw Real Geographic Epicenter Markers
    filtered.forEach(quake => {
      const mag = quake.magnitude;
      const radius = Math.max(7, (mag - 2.5) * 5.4);
      const isSelected = selectedQuake?.id === quake.id;

      let markerColor = '#10b981'; // emerald
      if (mag >= 7.0) markerColor = '#ef4444'; // red
      else if (mag >= 6.0) markerColor = '#f97316'; // orange
      else if (mag >= 5.0) markerColor = '#eab308'; // yellow

      // Outer glowing ring for selected earthquake
      if (isSelected) {
        const haloMarker = L.circleMarker([quake.latitude, quake.longitude], {
          radius: radius + 8,
          color: '#ffffff',
          fillColor: markerColor,
          fillOpacity: 0.35,
          weight: 2,
          dashArray: '3, 4'
        });
        markersLayer.addLayer(haloMarker);
      }

      // Main epicenter circle marker
      const marker = L.circleMarker([quake.latitude, quake.longitude], {
        radius: isSelected ? radius + 2 : radius,
        fillColor: markerColor,
        color: isSelected ? '#ffffff' : '#ffffff',
        weight: isSelected ? 3 : 1.8,
        opacity: 1.0,
        fillOpacity: 0.92
      });

      // Interactive popup with TWO-WAY BUTTON: "VIEW ON 3D GLOBE"
      const popupDiv = document.createElement('div');
      popupDiv.style.fontFamily = 'inherit';
      popupDiv.style.fontSize = '12px';
      popupDiv.style.lineHeight = '1.4';
      popupDiv.style.color = '#0f172a';
      popupDiv.style.minWidth = '230px';

      popupDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="background: ${markerColor}20; color: ${markerColor}; border: 1px solid ${markerColor}60; font-weight: 800; padding: 2px 8px; border-radius: 6px; font-size: 13px;">
            M ${mag.toFixed(1)}
          </span>
          <span style="font-weight: 800; color: #047857; font-size: 11px; letter-spacing: 0.5px;">
            ${quake.source} VERIFIED
          </span>
        </div>
        <div style="font-weight: 800; margin-bottom: 4px; font-size: 13px; color: #0f172a; line-height: 1.3;">
          ${quake.location}
        </div>
        <div style="font-size: 11px; color: #475569; margin-bottom: 2px;">
          Kedalaman: <strong>${quake.depth} km</strong> • ${quake.latitude.toFixed(2)}°, ${quake.longitude.toFixed(2)}°
        </div>
        <div style="font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px; margin-top: 4px;">
          ${new Date(quake.time).toLocaleString()}
        </div>
        ${
          quake.distanceFromUser
            ? `<div style="font-size: 11px; color: #059669; font-weight: 800; margin-top: 4px;">
                📍 ~${quake.distanceFromUser.toLocaleString()} km dari lokasi Anda
              </div>`
            : ''
        }
        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
          <button id="view-3d-btn-${quake.id}" style="width: 100%; padding: 7px 10px; background: linear-gradient(135deg, #059669, #047857); color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
            🌍 VIEW ON 3D GLOBE
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-3d-btn-${quake.id}`);
        if (btn) {
          btn.onclick = () => {
            viewOn3DGlobe(quake);
          };
        }
      });

      marker.on('click', () => {
        audio.playClick();
        if (onSelectQuake) onSelectQuake(quake);
        else setSelectedQuake(quake);
      });

      markersLayer.addLayer(marker);
    });
  }, [earthquakes, minMag, sourceFilter, searchQuery, activeBasemap, selectedQuake, viewOn3DGlobe, onSelectQuake, setSelectedQuake]);

  const handlePanToUser = () => {
    audio.playClick();
    if (!userLocation) {
      requestUserLocation();
      return;
    }
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([userLocation.latitude, userLocation.longitude], 7, { duration: 1.5 });

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    const userIcon = L.divIcon({
      className: 'user-pin-icon',
      html: `
        <div style="position: relative; width: 26px; height: 26px;">
          <div style="position: absolute; inset: 0; background: #059669; opacity: 0.45; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; inset: 4px; background: #059669; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.4);"></div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
    userMarkerRef.current = L.marker([userLocation.latitude, userLocation.longitude], {
      icon: userIcon
    }).addTo(map);

    userMarkerRef.current.bindPopup('<strong>📍 Lokasi Anda Saat Ini</strong>').openPopup();
  };

  const handleResetMap = () => {
    audio.playClick();
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([-2.5, 118.0], 5, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-emerald-950/70 shadow-2xl" style={{ height }}>
      {/* Map Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Control Bar: Basemaps & Filters */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Basemap Mode Selector: Standard, Satellite, Terrain, Heatmap */}
        {showBasemapControls && (
          <div className="flex items-center gap-1 bg-white/95 dark:bg-earth-surface/95 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200 dark:border-emerald-900/50 shadow-xl pointer-events-auto">
            <button
              onClick={() => {
                audio.playClick();
                setActiveBasemap('satellite');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeBasemap === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite View</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                setActiveBasemap('terrain');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeBasemap === 'terrain'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Terrain View</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                setActiveBasemap('standard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeBasemap === 'standard'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Standard Map</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                setActiveBasemap('heatmap');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeBasemap === 'heatmap'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Heatmap</span>
            </button>
          </div>
        )}

        {/* Right Search & Controls */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Quick Search */}
          <div className="relative bg-white/95 dark:bg-earth-surface/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200 dark:border-emerald-900/50">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari lokasi/negara..."
              className="pl-7 pr-3 py-1.5 bg-transparent text-xs text-slate-900 dark:text-white rounded-xl focus:outline-none w-36 sm:w-48 font-medium"
            />
          </div>

          {/* Tectonic Plates Toggle */}
          <button
            onClick={() => {
              audio.playClick();
              setShowTectonicPlates(!showTectonicPlates);
            }}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border transition flex items-center gap-1.5 shadow-lg ${
              showTectonicPlates
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-white/90 dark:bg-earth-surface/90 backdrop-blur-xl'
                : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-emerald-900/40 bg-white/90 dark:bg-earth-surface/90 backdrop-blur-xl'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lempeng Tektonik</span>
          </button>

          {/* GPS Button */}
          <button
            onClick={handlePanToUser}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl transition"
          >
            <Crosshair className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden sm:inline">Di Sekitar Saya</span>
          </button>

          {/* Reset Map */}
          <button
            onClick={handleResetMap}
            title="Reset Peta ke Indonesia"
            className="p-1.5 rounded-xl bg-white/95 dark:bg-earth-surface/95 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-900/50 shadow-xl hover:bg-slate-100 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Magnitude Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 dark:bg-earth-surface/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-200 dark:border-emerald-900/50 shadow-xl text-xs space-y-1.5">
        <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
          Legenda Magnitudo Seismik Real-Time:
        </span>
        <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
            <span className="text-slate-600 dark:text-slate-400">M &lt; 5.0 (Ringan)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white" />
            <span className="text-slate-600 dark:text-slate-400">M 5.0 - 5.9</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 border border-white" />
            <span className="text-slate-600 dark:text-slate-400">M 6.0 - 6.9</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-white animate-pulse" />
            <span className="text-red-500 font-extrabold">M 7.0+ (Besar / Destruktif)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
