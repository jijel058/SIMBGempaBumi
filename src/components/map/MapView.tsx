import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EarthquakeMap } from './EarthquakeMap';
import { EarthGlobe3D } from '../simulation3d/EarthGlobe3D';
import { QuakeDetailModal } from '../monitoring/QuakeDetailModal';
import { MAJOR_TECTONIC_ZONES } from '../../data/tectonicPlatesGeoJSON';
import { MagnitudeBadge } from '../common/MagnitudeBadge';
import {
  Map as MapIcon,
  Globe2,
  Layers,
  Crosshair,
  ShieldAlert,
  Info,
  Navigation,
  ExternalLink,
  Satellite,
  Compass,
  Activity,
  ArrowRight
} from 'lucide-react';
import { audio } from '../../services/audioService';

export const MapView: React.FC = () => {
  const {
    earthquakes,
    selectedQuake,
    setSelectedQuake,
    userLocation,
    requestUserLocation,
    viewOn3DGlobe,
    viewOnMap,
    language
  } = useApp();

  // Mode switcher: "2D MAP" and "3D GLOBE"
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const handleSelectQuake = (quake: any) => {
    setSelectedQuake(quake);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Dual-Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-emerald-950/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Integrated Geospatial Seismology
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Peta Geografis & Globe Gempa Dunia
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Eksplorasi persebaran gempa bumi real-time pada basemap satelit fotorealistis dan bola bumi 3D.
          </p>
        </div>

        {/* PROMINENT DUAL MODE SWITCHER: "2D MAP" vs "3D GLOBE" */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-earth-surface border border-slate-200 dark:border-emerald-900/50 shadow-lg">
          <button
            onClick={() => {
              audio.playClick();
              setViewMode('2d');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition ${
              viewMode === '2d'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>2D REALISTIC MAP</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              setViewMode('3d');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition ${
              viewMode === '3d'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>3D REALISTIC GLOBE</span>
          </button>
        </div>
      </div>

      {/* Main Exploration Canvas Area */}
      <div className="relative">
        {viewMode === '2d' ? (
          <EarthquakeMap
            earthquakes={earthquakes}
            height="700px"
            onSelectQuake={handleSelectQuake}
          />
        ) : (
          <EarthGlobe3D
            earthquakes={earthquakes}
            height="700px"
            onSelectQuake={handleSelectQuake}
            focusCoords={selectedQuake ? { lat: selectedQuake.latitude, lng: selectedQuake.longitude } : null}
          />
        )}
      </div>

      {/* Selected Earthquake Quick Telemetry Card if available */}
      {selectedQuake && (
        <div className="p-5 rounded-3xl bg-white/95 dark:bg-earth-surface/95 backdrop-blur-xl border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MagnitudeBadge magnitude={selectedQuake.magnitude} size="lg" showLabel />
            <div>
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block">
                Episentrum Terpilih: {selectedQuake.source} Verified
              </span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {selectedQuake.location}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kedalaman: {selectedQuake.depth} km • {selectedQuake.latitude.toFixed(2)}°, {selectedQuake.longitude.toFixed(2)}° • {new Date(selectedQuake.time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {viewMode === '2d' ? (
              <button
                onClick={() => {
                  audio.playClick();
                  setViewMode('3d');
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Globe2 className="w-4 h-4" />
                <span>LIHAT PADA 3D GLOBE</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  audio.playClick();
                  setViewMode('2d');
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <MapIcon className="w-4 h-4" />
                <span>LIHAT PADA 2D MAP</span>
              </button>
            )}

            <button
              onClick={() => setSelectedQuake(selectedQuake)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-earth-card hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
            >
              Rincian Penuh
            </button>
          </div>
        </div>
      )}

      {/* Major Tectonic Fault Zones Reference Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <span>Zona Patahan Sesar & Megathrust Berbahaya Dunia:</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Batas Lempeng Aktif</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MAJOR_TECTONIC_ZONES.map((zone, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  {zone.hazardLevel}
                </span>
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                {zone.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {zone.description}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block pt-1 border-t border-slate-100 dark:border-emerald-950/60">
                Wilayah: {zone.region}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quake Detail Modal */}
      <QuakeDetailModal quake={selectedQuake} onClose={() => setSelectedQuake(null)} />
    </div>
  );
};
