import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EarthGlobe3D } from '../simulation3d/EarthGlobe3D';
import { EarthquakeMap } from '../map/EarthquakeMap';
import { QuakeDetailModal } from '../monitoring/QuakeDetailModal';
import { MagnitudeBadge } from '../common/MagnitudeBadge';
import { Earthquake } from '../../types/earthquake';
import { audio } from '../../services/audioService';
import {
  Activity,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Radio,
  BookOpen,
  Box,
  Gamepad2,
  TrendingUp,
  BarChart3,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Map as MapIcon,
  Globe2,
  Crosshair,
  Volume2,
  VolumeX,
  Target,
  Satellite
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    earthquakes,
    stats,
    setActiveTab,
    selectedQuake,
    setSelectedQuake,
    viewOnMap,
    viewOn3DGlobe,
    language,
    userLocation,
    requestUserLocation
  } = useApp();

  // Mode toggle on Home: "3D GLOBE" or "2D SATELLITE MAP"
  const [homeDisplayMode, setHomeDisplayMode] = useState<'3d' | '2d'>('3d');
  const [globeFocusCoords, setGlobeFocusCoords] = useState<{ lat: number; lng: number } | null>(null);

  const latestQuake = stats?.latestQuake || earthquakes[0];
  const recentSignificant = earthquakes.filter(q => q.magnitude >= 4.5).slice(0, 5);

  const handleFocusQuake = (q: Earthquake) => {
    audio.playClick();
    setSelectedQuake(q);
    if (homeDisplayMode === '3d') {
      setGlobeFocusCoords({ lat: q.latitude, lng: q.longitude });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* 1. IMMERSIVE 3D PLANETARY COMMAND DECK (HERO) */}
      <section className="relative pt-4 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header Title & Mission */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Realistic Planetary Earthquake Monitoring</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Understand Earthquakes. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-mint-400 bg-clip-text text-transparent">
                  Stay Prepared. Save Lives.
                </span>
              </h1>
            </div>

            {/* DUAL MODE TOGGLE BUTTONS: "3D GLOBE" and "2D MAP" */}
            <div className="flex items-center p-1.5 rounded-2xl bg-white/90 dark:bg-earth-surface/90 backdrop-blur-xl border border-slate-200 dark:border-emerald-900/50 shadow-xl">
              <button
                onClick={() => {
                  audio.playClick();
                  setHomeDisplayMode('3d');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                  homeDisplayMode === '3d'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe2 className="w-4 h-4" />
                <span>3D GLOBE</span>
              </button>

              <button
                onClick={() => {
                  audio.playClick();
                  setHomeDisplayMode('2d');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                  homeDisplayMode === '2d'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Satellite className="w-4 h-4" />
                <span>2D SATELLITE MAP</span>
              </button>
            </div>
          </div>

          {/* Main Visual Arena with Side Telemetry Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Center/Left: 3D Globe or 2D Realistic Map */}
            <div className="lg:col-span-8 relative">
              {homeDisplayMode === '3d' ? (
                <EarthGlobe3D
                  earthquakes={earthquakes}
                  height="580px"
                  focusCoords={globeFocusCoords}
                  onSelectQuake={q => setSelectedQuake(q)}
                />
              ) : (
                <EarthquakeMap
                  earthquakes={earthquakes}
                  height="580px"
                  onSelectQuake={q => setSelectedQuake(q)}
                />
              )}

              {/* Top Floating Status */}
              <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-900/50 text-[11px] text-emerald-300 font-bold pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>USGS & BMKG REAL-TIME FEED ACTIVE</span>
              </div>
            </div>

            {/* Right: Live Telemetry Feed & One-Click "Focus" Panel */}
            <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-3xl bg-white/95 dark:bg-earth-surface/95 backdrop-blur-xl border border-slate-200 dark:border-emerald-950/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-950/60 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Aktivitas Seismik Terkini
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Klik untuk Fokus
                </span>
              </div>

              {/* Scrollable list of recent quakes with camera focus */}
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {recentSignificant.map(quake => (
                  <div
                    key={quake.id}
                    onClick={() => handleFocusQuake(quake)}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-emerald-950/60 bg-slate-50 dark:bg-earth-card hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <MagnitudeBadge magnitude={quake.magnitude} size="sm" />
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-400 transition line-clamp-1">
                          {quake.location}
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {quake.source} • Kedalaman {quake.depth} km • {new Date(quake.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition flex-shrink-0">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Quick-Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-emerald-950/60 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('map')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <MapIcon className="w-4 h-4" />
                  <span>Buka Halaman Peta Lengkap</span>
                </button>

                <button
                  onClick={() => {
                    audio.playClick();
                    requestUserLocation();
                  }}
                  title="Deteksi Lokasi GPS Saya"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME STATS TELEMETRY */}
      {stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-earth-surface/90 backdrop-blur-xl border border-slate-200 dark:border-emerald-950/60 shadow-lg">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Total Gempa Global (24 Jam)</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white block">
                {stats.totalToday}
              </span>
              <span className="text-[11px] text-emerald-500 font-bold mt-1 block">
                ✓ Sensor USGS & BMKG Terhubung
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white/90 dark:bg-earth-surface/90 backdrop-blur-xl border border-slate-200 dark:border-emerald-950/60 shadow-lg">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Magnitudo Tertinggi Hari Ini</span>
              <span className="text-3xl font-black text-red-500 block">
                M {stats.maxMagnitudeToday.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                Zona Subduksi Aktif
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white/90 dark:bg-earth-surface/90 backdrop-blur-xl border border-slate-200 dark:border-emerald-950/60 shadow-lg">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Rata-Rata Kedalaman</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white block">
                {stats.avgDepth} km
              </span>
              <span className="text-[11px] text-amber-500 font-bold mt-1 block">
                Dominasi Kerak Dangkal
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white/90 dark:bg-earth-surface/90 backdrop-blur-xl border border-slate-200 dark:border-emerald-950/60 shadow-lg">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Wilayah Indonesia (BMKG)</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block">
                {stats.regionalCounts['Indonesia (BMKG)'] || 14}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                InaTEWS Real-time Feeds
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 3. LATEST SIGNIFICANT EARTHQUAKE HIGHLIGHT */}
      {latestQuake && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white dark:via-earth-card to-emerald-500/5 border border-emerald-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-emerald-950/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Laporan Gempa Bumi Terbaru Terverifikasi
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Sumber Resmi: <strong>{latestQuake.source} InaTEWS / USGS</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex items-center gap-4">
                <MagnitudeBadge magnitude={latestQuake.magnitude} size="xl" />
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Tingkat Energi:</span>
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {latestQuake.magnitude >= 6.0 ? 'Gempa Signifikan / Kuat' : 'Gempa Sedang Terdeteksi'}
                  </span>
                </div>
              </div>

              <div className="md:col-span-5 space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">Lokasi Episentrum:</span>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {latestQuake.location}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Kedalaman: <strong>{latestQuake.depth} km</strong></span>
                  <span>•</span>
                  <span>{latestQuake.latitude.toFixed(2)}°, {latestQuake.longitude.toFixed(2)}°</span>
                  <span>•</span>
                  <span>{new Date(latestQuake.time).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => viewOnMap(latestQuake)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>VIEW ON MAP</span>
                </button>

                <button
                  onClick={() => setSelectedQuake(latestQuake)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-earth-surface hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. DISASTER ADVENTURE GAMES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-earth-surface to-earth-dark text-white border border-emerald-900/50 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Earthquake Adventure Experience
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Permainan Petualangan Mitigasi Interaktif
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Uji keterampilan penyelamatan diri Anda dalam 5 petualangan edukatif interaktif dengan sistem level, XP, dan lencana pencapaian.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('games')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Mainkan Semua Games</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {[
              { title: 'Earthquake Survival Mission', desc: 'Keputusan penyelamatan darurat dengan konsekuensi langsung.', icon: ShieldAlert },
              { title: 'Find the Safe Zone', desc: 'Eksplorasi visual ruangan mencari titik aman dari runtuhan.', icon: Target },
              { title: 'Emergency Bag Challenge', desc: 'Penyusunan perbekalan bertahan hidup 72 jam pertama.', icon: Box },
              { title: 'Earthquake Quiz', desc: 'Asah wawasan geologi dan fenomena seismik global.', icon: Sparkles },
              { title: 'Plate Tectonic Puzzle', desc: 'Susun lempeng tektonik dan zona subduksi megathrust.', icon: Compass }
            ].map((gm, idx) => (
              <div
                key={idx}
                onClick={() => {
                  audio.playClick();
                  setActiveTab('games');
                }}
                className="p-4 rounded-2xl bg-black/40 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 cursor-pointer transition space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                  <gm.icon className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-emerald-400 transition">
                  {gm.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {gm.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-seismo-900 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 px-3 py-1 rounded-full bg-white/10">
              Disaster Resilience Call
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Preparedness Starts with Knowledge.
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Jadilah warga yang tanggap dan berdaya. Ikuti simulasi kebencanaan 3D, lengkapi checklist persiapan keluarga, dan latih refleks perlindungan diri Anda sekarang.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab('simulation');
              }}
              className="px-6 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs shadow-lg transition hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Box className="w-4 h-4" />
              <span>Coba Simulasi Bencana 3D</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                setActiveTab('mitigation');
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-700/60 hover:bg-emerald-700 text-white border border-white/20 font-bold text-xs transition flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Panduan Mitigasi Lengkap</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quake Detail Modal */}
      <QuakeDetailModal quake={selectedQuake} onClose={() => setSelectedQuake(null)} />
    </div>
  );
};
