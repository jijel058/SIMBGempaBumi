import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDiorama } from '../../context/DioramaContext';
import { EarthquakeMap } from './EarthquakeMap';
import { EarthGlobe3D } from '../simulation3d/EarthGlobe3D';
import { QuakeDetailModal } from '../monitoring/QuakeDetailModal';
import { MagnitudeBadge } from '../common/MagnitudeBadge';
import {
  Map as MapIcon,
  Globe2,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  AlertOctagon,
  PhoneCall,
  Clock,
  ChevronDown
} from 'lucide-react';
import { audio } from '../../services/audioService';

export const MapView: React.FC = () => {
  const {
    earthquakes,
    selectedQuake,
    setSelectedQuake,
    globeTargetCoords,
    mapTargetCoords,
    setIsEmergencyModalOpen
  } = useApp();

  const { intent } = useDiorama();
  // Mode switcher: "2D MAP" and "3D GLOBE" (can be pre-selected from the navbar sub-menu)
  const [viewMode, setViewMode] = useState<'2d' | '3d'>(intent.mapMode ?? '2d');
  React.useEffect(() => {
    if (intent.mapMode) setViewMode(intent.mapMode);
  }, [intent.nonce]);

  React.useEffect(() => {
    if (globeTargetCoords) setViewMode('3d');
  }, [globeTargetCoords]);

  React.useEffect(() => {
    if (mapTargetCoords) setViewMode('2d');
  }, [mapTargetCoords]);

  const handleSelectQuake = (quake: any) => {
    setSelectedQuake(quake);
  };

  const activeQuake = selectedQuake || earthquakes[0];

  const getStatusCategory = (mag: number) => {
    if (mag < 4.0) return { label: 'Ringan', textClass: 'text-emerald-700', bgClass: 'bg-emerald-50 border-emerald-300' };
    if (mag < 5.0) return { label: 'Sedang / Waspada', textClass: 'text-blue-700', bgClass: 'bg-blue-50 border-blue-300' };
    if (mag < 6.0) return { label: 'Tidak Sehat / Siaga', textClass: 'text-amber-700', bgClass: 'bg-amber-50 border-amber-300' };
    if (mag < 7.0) return { label: 'Sangat Tidak Sehat / Bahaya', textClass: 'text-red-700', bgClass: 'bg-red-50 border-red-300' };
    return { label: 'Berbahaya / Katastropik', textClass: 'text-slate-800', bgClass: 'bg-slate-100 border-slate-400' };
  };

  const currentCategory = activeQuake ? getStatusCategory(activeQuake.magnitude) : getStatusCategory(5.2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Dual-Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Integrated Geospatial Seismology
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Peta Geografis &amp; Globe Gempa Bumi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Eksplorasi persebaran gempa bumi real-time pada basemap satelit fotorealistis dan bola bumi 3D.
          </p>
        </div>

        {/* PROMINENT DUAL MODE SWITCHER: "2D MAP" vs "3D GLOBE" */}
        <div className="flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <button
            onClick={() => {
              audio.playClick();
              setViewMode('2d');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition ${viewMode === '2d'
              ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
              : 'text-slate-600 hover:text-slate-900'
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition ${viewMode === '3d'
              ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>3D REALISTIC GLOBE</span>
          </button>
        </div>
      </div>

      {/* 5 STATUS CARDS AT TOP (Exact match to Image 1: media_1794380676198_7f490687.jpg) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Ringan */}
        <div className="pill-status-baik rounded-2xl p-3.5 flex items-center gap-3 shadow-xs transition hover:-translate-y-0.5">
          <div className="w-9 h-9 rounded-full bg-white/80 border border-emerald-200 flex items-center justify-center shrink-0">
            <Smile className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-800/80 block">&lt; 4.0 M</span>
            <span className="text-xs font-extrabold text-emerald-900">Ringan</span>
          </div>
        </div>

        {/* Card 2: Sedang */}
        <div className="pill-status-sedang rounded-2xl p-3.5 flex items-center gap-3 shadow-xs transition hover:-translate-y-0.5">
          <div className="w-9 h-9 rounded-full bg-white/80 border border-blue-200 flex items-center justify-center shrink-0">
            <Meh className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-800/80 block">4.0 - 4.9 M</span>
            <span className="text-xs font-extrabold text-blue-900">Sedang</span>
          </div>
        </div>

        {/* Card 3: Tidak Sehat / Siaga */}
        <div className="pill-status-siaga rounded-2xl p-3.5 flex items-center gap-3 shadow-xs transition hover:-translate-y-0.5">
          <div className="w-9 h-9 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center shrink-0">
            <Frown className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-800/80 block">5.0 - 5.9 M</span>
            <span className="text-xs font-extrabold text-amber-900">Tidak Sehat / Siaga</span>
          </div>
        </div>

        {/* Card 4: Sangat Tidak Sehat / Bahaya */}
        <div className="pill-status-bahaya rounded-2xl p-3.5 flex items-center gap-3 shadow-xs transition hover:-translate-y-0.5">
          <div className="w-9 h-9 rounded-full bg-white/80 border border-red-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-red-800/80 block">6.0 - 6.9 M</span>
            <span className="text-xs font-extrabold text-red-900">Sangat Tidak Sehat</span>
          </div>
        </div>

        {/* Card 5: Berbahaya */}
        <div className="pill-status-katastropik rounded-2xl p-3.5 flex items-center gap-3 shadow-xs transition hover:-translate-y-0.5 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-full bg-white/80 border border-slate-300 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-600 block">&ge; 7.0 M</span>
            <span className="text-xs font-extrabold text-slate-900">Berbahaya</span>
          </div>
        </div>
      </div>

      {/* Main Exploration Canvas Area with Floating Telemetry Card (Image 1 Style) */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md">
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
            focusCoords={globeTargetCoords || (selectedQuake ? { lat: selectedQuake.latitude, lng: selectedQuake.longitude } : null)}
          />
        )}

        {/* FLOATING CARD ON TOP RIGHT OVER MAP (Exact match to Image 1: media_1794380676198_7f490687.jpg) */}
        {activeQuake && (
          <div className="absolute top-5 right-5 z-20 w-72 bg-white/95 backdrop-blur-xl rounded-3xl p-5 border border-slate-200/90 shadow-2xl space-y-3 pointer-events-auto">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(activeQuake.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            <div className="text-center space-y-1 pt-1">
              <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">
                {activeQuake.location.replace(/^.+of\s+/i, '')}
              </h3>

              {/* Avatar Indicator Circle */}
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center my-2 shadow-inner">
                {activeQuake.magnitude >= 7.0 ? (
                  <AlertOctagon className="w-8 h-8 text-slate-800" />
                ) : activeQuake.magnitude >= 6.0 ? (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                ) : activeQuake.magnitude >= 5.0 ? (
                  <Frown className="w-8 h-8 text-amber-600" />
                ) : (
                  <Smile className="w-8 h-8 text-emerald-600" />
                )}
              </div>

              {/* Score Number */}
              <span className="text-4xl font-black text-amber-900 block tracking-tight">
                {activeQuake.magnitude.toFixed(1)}
              </span>

              {/* Status Label */}
              <span className="text-xs font-bold text-slate-600 block">
                {currentCategory.label}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Kedalaman: {activeQuake.depth} km</span>
              <span className="font-bold text-emerald-700">{activeQuake.source}</span>
            </div>
          </div>
        )}

        {/* BOTTOM RIGHT HOTLINE PILL (Image 1 Ref: Hubungi via WA) */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <button
            onClick={() => {
              audio.playEmergencyAlert();
              setIsEmergencyModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 font-bold text-xs border border-slate-200 shadow-lg transition transform hover:-translate-y-0.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hubungi Hotline Darurat</span>
          </button>
        </div>
      </div>

      {/* Selected Earthquake Quick Telemetry Card if available */}
      {selectedQuake && (
        <div className="p-5 rounded-3xl bg-white border border-emerald-500/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MagnitudeBadge magnitude={selectedQuake.magnitude} size="lg" showLabel />
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Episentrum Terpilih: {selectedQuake.source} Verified
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                {selectedQuake.location}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kedalaman: {selectedQuake.depth} km • {selectedQuake.latitude.toFixed(2)}°, {selectedQuake.longitude.toFixed(2)}° • {new Date(selectedQuake.time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === '2d' ? (
              <button
                onClick={() => setViewMode('3d')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs transition shadow-sm hover:bg-slate-800"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Lihat di Globe 3D</span>
              </button>
            ) : (
              <button
                onClick={() => setViewMode('2d')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs transition shadow-sm hover:bg-slate-800"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Lihat di Peta 2D</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quake Detail Modal */}
      <QuakeDetailModal quake={selectedQuake} onClose={() => setSelectedQuake(null)} />
    </div>
  );
};
