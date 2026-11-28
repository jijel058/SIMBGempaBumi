/**
 * FILE: src/components/map/MapView.tsx
 * FUNGSI: Halaman utama menu "Peta Dunia" yang menggabungkan Peta Satelit 2D dan Bola Bumi 3D.
 * ISI:
 * - Tombol pengalih dua mode: "2D REALISTIC MAP" (<EarthquakeMap />) dan "3D REALISTIC GLOBE" (<EarthGlobe3D />).
 * - 5 kartu indikator kategori magnitudo di bagian atas peta (Ringan, Sedang, Siaga, Sangat Tidak Sehat, Berbahaya).
 * - Tombol panggilan cepat Hotline Darurat dan kartu ringkasan episentrum terpilih.
 */
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
  PhoneCall
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
