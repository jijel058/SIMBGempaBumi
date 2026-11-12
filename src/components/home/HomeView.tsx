import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDiorama } from '../../context/DioramaContext';
import { Waves } from 'lucide-react';
import { DaylightCityRupture3D, SimulationStage } from '../simulation3d/DaylightCityRupture3D';
import { QuakeDetailModal } from '../monitoring/QuakeDetailModal';
import { ArticleModal } from '../education/ArticleModal';
import { EDUCATIONAL_ARTICLES, EducationalArticle } from '../../data/articleData';
import { audio } from '../../services/audioService';
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Clock,
  BookOpen,
  Globe2,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  AlertOctagon,
  Navigation,
  ShieldCheck,
  Gamepad2,
  Download
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    selectedQuake,
    setSelectedQuake
  } = useApp();

  // 3D Rupture Simulation state
  const [simulationMagnitude, setSimulationMagnitude] = useState<number>(6.4);
  const {
    magnitude: dioramaMag,
    setMagnitude: setDioramaMag,
    timeOfDay,
    setTimeOfDay,
    triggerQuake
  } = useDiorama();
  const [activeStage, setActiveStage] = useState<SimulationStage>('overview');

  // Article Modal state
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>('Semua');

  // Filtered educational articles
  const categories = ['Semua', 'Geologi', 'Mitigasi', 'Teknologi', 'Evakuasi', 'Kesiapsiagaan'];
  const filteredArticles = articleCategoryFilter === 'Semua'
    ? EDUCATIONAL_ARTICLES
    : EDUCATIONAL_ARTICLES.filter(a => a.category === articleCategoryFilter);

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-300">
      {/* =========================================================================
          1. HERO SECTION: DAYLIGHT 3D CITY RUPTURE & EDITORIAL SCROLLYTELLING
          (Inspirasi: underwater.framer.website & SVG Ref 1)
         ========================================================================= */}
      <section id="section-hero" className="relative pt-4 pb-10 lg:min-h-[calc(100vh-7rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Tagline & Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Editorial Typography & Functions Explanation */}
            <div className="lg:col-span-5 space-y-6 glass-panel rounded-[2rem] p-6 sm:p-8">
              {/* Monospace Badge (SVG Ref: TERHUBUNG DENGAN BMKG & SENSOR SEISMIK) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 text-xs font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                <span>Terhubung dengan BMKG &amp; Sensor Seismik</span>
              </div>

              {/* Bold Editorial Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
                  Platform Edukasi Gempa <br />
                  <span className="text-slate-900">&amp; Informasi Gempa.</span>
                </h1>
              </div>

              {/* Description Paragraph */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Pusat edukasi kebumian dan informasi gempa bumi terkini dari BMKG &amp; USGS, dilengkapi simulasi visualisasi dampak 3D, panduan mitigasi bencana, serta rute evakuasi aman.
              </p>

              {/* 2 Clean Feature Highlights */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Informasi Gempa</h3>
                  <p className="text-xs text-slate-500 leading-snug">Data aktivitas gempa BMKG &amp; USGS</p>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Rute &amp; Edukasi</h3>
                  <p className="text-xs text-slate-500 leading-snug">Materi edukasi gempa &amp; titik kumpul</p>
                </div>
              </div>

              {/* White Pill CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    audio.playClick();
                    const el = document.getElementById('section-features');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 shadow-sm transition transform hover:-translate-y-0.5"
                >
                  <span>Jelajahi fitur</span>
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                </button>

                <button
                  onClick={() => {
                    audio.playClick();
                    setActiveTab('monitoring');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Pantau Gempa Live</span>
                </button>
              </div>
            </div>

            {/* Right Column: the 3D earthquake diorama is the page background; this card controls it */}
            <div className="lg:col-span-7 flex flex-col justify-end items-stretch lg:items-end min-h-[260px] lg:min-h-[560px]">
              <div className="glass-panel rounded-[1.75rem] p-4 sm:p-5 w-full sm:max-w-md space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 block">
                      Diorama Gempa Interaktif
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      Skala Guncangan M {dioramaMag.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center p-1 rounded-full bg-white/70 border border-white/80">
                    <button
                      onClick={() => {
                        audio.playClick();
                        setTimeOfDay('day');
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-black transition ${
                        timeOfDay === 'day' ? 'glass-btn-primary' : 'text-slate-600'
                      }`}
                    >
                      Siang
                    </button>
                    <button
                      onClick={() => {
                        audio.playClick();
                        setTimeOfDay('dusk');
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-black transition ${
                        timeOfDay === 'dusk' ? 'glass-btn-primary' : 'text-slate-600'
                      }`}
                    >
                      Sore
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="3.0"
                  max="8.8"
                  step="0.1"
                  value={dioramaMag}
                  onChange={e => setDioramaMag(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  aria-label="Magnitudo simulasi"
                />

                <button
                  onClick={() => {
                    audio.playEarthquakeRumble(dioramaMag, 1.5);
                    triggerQuake();
                  }}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-full glass-btn-primary font-black text-sm"
                >
                  <Waves className="w-4 h-4" />
                  Guncang Pulau Sekarang
                </button>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Geser slider untuk melebarkan retakan, tekan tombol untuk memicu gempa: tanah bergetar, debu naik,
                  pohon bergoyang, dan gelombang seismik menyebar. Gerakkan mouse &amp; scroll untuk memutar pulau.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frosted content layer keeps all text legible over the 3D background */}
      <div className="px-3 sm:px-5">
        <div className="max-w-[88rem] mx-auto rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.3)] py-12 space-y-16">

      {/* =========================================================================
          2. KATEGORI STATUS & SKALA INDIKATOR GEMPA (Persis Gambar 1: air quality pills)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Klasifikasi Skala Kerusakan Gempa Bumi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kategori Tingkat Bahaya &amp; Magnitudo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Panduan kesiapsiagaan masyarakat berdasarkan skala getaran dan potensi dampak struktur fisik.
          </p>
        </div>

        {/* 5 Status Cards in Clean Daylight Theme (Image 1 Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Baik / Ringan (< 4.0) */}
          <div className="pill-status-baik rounded-2xl p-4 flex flex-col justify-between transition-transform hover:-translate-y-1 shadow-sm">
            <div className="flex items-center justify-between">
              <Smile className="w-6 h-6 text-emerald-700" />
              <span className="text-[11px] font-bold text-emerald-800">&lt; 4.0 M</span>
            </div>
            <div className="mt-3">
              <span className="text-xs text-emerald-800/80 block font-medium">Getaran Halus</span>
              <span className="text-base font-extrabold text-emerald-900">Ringan</span>
            </div>
          </div>

          {/* 2. Sedang / Waspada (4.0 - 5.0) */}
          <div className="pill-status-sedang rounded-2xl p-4 flex flex-col justify-between transition-transform hover:-translate-y-1 shadow-sm">
            <div className="flex items-center justify-between">
              <Meh className="w-6 h-6 text-blue-700" />
              <span className="text-[11px] font-bold text-blue-800">4.0 - 4.9 M</span>
            </div>
            <div className="mt-3">
              <span className="text-xs text-blue-800/80 block font-medium">Lampu Bergoyang</span>
              <span className="text-base font-extrabold text-blue-900">Sedang</span>
            </div>
          </div>

          {/* 3. Siaga / Terasa (5.0 - 6.0) */}
          <div className="pill-status-siaga rounded-2xl p-4 flex flex-col justify-between transition-transform hover:-translate-y-1 shadow-sm">
            <div className="flex items-center justify-between">
              <Frown className="w-6 h-6 text-amber-700" />
              <span className="text-[11px] font-bold text-amber-800">5.0 - 5.9 M</span>
            </div>
            <div className="mt-3">
              <span className="text-xs text-amber-800/80 block font-medium">Dinding Retak Halus</span>
              <span className="text-base font-extrabold text-amber-900">Waspada</span>
            </div>
          </div>

          {/* 4. Bahaya / Merusak (6.0 - 7.0) */}
          <div className="pill-status-bahaya rounded-2xl p-4 flex flex-col justify-between transition-transform hover:-translate-y-1 shadow-sm">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-6 h-6 text-red-700" />
              <span className="text-[11px] font-bold text-red-800">6.0 - 6.9 M</span>
            </div>
            <div className="mt-3">
              <span className="text-xs text-red-800/80 block font-medium">Bangunan Rusak Sedang</span>
              <span className="text-base font-extrabold text-red-900">Bahaya</span>
            </div>
          </div>

          {/* 5. Sangat Bahaya / Katastropik (>= 7.0) */}
          <div className="pill-status-katastropik rounded-2xl p-4 flex flex-col justify-between transition-transform hover:-translate-y-1 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <AlertOctagon className="w-6 h-6 text-slate-800" />
              <span className="text-[11px] font-bold text-slate-800">&ge; 7.0 M</span>
            </div>
            <div className="mt-3">
              <span className="text-xs text-slate-600 block font-medium">Jalan Belah &amp; Roboh</span>
              <span className="text-base font-extrabold text-slate-900">Berbahaya</span>
            </div>
          </div>
        </div>

        {/* IMAGE 3 REFERENCE: 5 DISASTER HAZARD EXPLORATION TABS (Terremotos, Grietas, Tsunamis, Ceniza, Ciudades) */}
        <div className="mt-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 block">
                Eksplorasi Spektrum Bahaya Seismik (Image Ref #03)
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Katalog Dampak &amp; Fenomena Geologi Global
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              BMKG &amp; Global Seismic Hazards Network
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* 1. Gempa Tektonik */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer space-y-1.5">
              <span className="text-xs font-mono font-bold text-amber-700 block uppercase">1. Terremotos</span>
              <h4 className="text-xs font-extrabold text-slate-900">Gempa Tektonik</h4>
              <p className="text-[11px] text-slate-500 leading-tight">Pelepasan energi elastis patahan lempeng bumi.</p>
            </div>

            {/* 2. Patahan Kolosal */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer space-y-1.5">
              <span className="text-xs font-mono font-bold text-rose-700 block uppercase">2. Grietas Colosales</span>
              <h4 className="text-xs font-extrabold text-slate-900">Retakan Sesar Darat</h4>
              <p className="text-[11px] text-slate-500 leading-tight">Rekahan tanah dan pergeseran aspal jalan raya.</p>
            </div>

            {/* 3. Tsunamis */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer space-y-1.5">
              <span className="text-xs font-mono font-bold text-blue-700 block uppercase">3. Tsunamis</span>
              <h4 className="text-xs font-extrabold text-slate-900">Gelombang Tsunami</h4>
              <p className="text-[11px] text-slate-500 leading-tight">Dislokasi vertikal air laut akibat gempa dangkal.</p>
            </div>

            {/* 4. Abu Vulkanik */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer space-y-1.5">
              <span className="text-xs font-mono font-bold text-orange-700 block uppercase">4. Ceniza Volcánica</span>
              <h4 className="text-xs font-extrabold text-slate-900">Aktivitas Vulkanik</h4>
              <p className="text-[11px] text-slate-500 leading-tight">Gempa tremor magma &amp; abu letusan gunung api.</p>
            </div>

            {/* 5. Kerusakan Kota */}
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer space-y-1.5 col-span-2 sm:col-span-1">
              <span className="text-xs font-mono font-bold text-emerald-700 block uppercase">5. Ciudades</span>
              <h4 className="text-xs font-extrabold text-slate-900">Mitigasi Tata Kota</h4>
              <p className="text-[11px] text-slate-500 leading-tight">Standar bangunan tahan getar &amp; koridor evakuasi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FITUR UTAMA APLIKASI: SCROLLYTELLING MITIGASI GEMPA BUMI
         ========================================================================= */}
      <section id="section-features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-28">
        {/* Feature 2: Drop, Cover, Hold On (Penyelamatan 60 Detik Pertama) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="lg:col-span-6 order-2 lg:order-1 grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-sm">
                1
              </div>
              <h4 className="font-extrabold text-sm text-amber-900">DROP</h4>
              <p className="text-[11px] text-amber-800 leading-tight">Merunduk berlutut ke lantai agar tidak terjatuh</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                2
              </div>
              <h4 className="font-extrabold text-sm text-emerald-900">COVER</h4>
              <p className="text-[11px] text-emerald-800 leading-tight">Lindungi kepala dan leher di bawah meja kokoh</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                3
              </div>
              <h4 className="font-extrabold text-sm text-blue-900">HOLD ON</h4>
              <p className="text-[11px] text-blue-800 leading-tight">Pegang kaki meja erat hingga getaran mereda</p>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-mono font-bold border border-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>PROTOKOL STANDAR INTERNASIONAL</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Drop, Cover, Hold On: Penyelamatan 60 Detik Pertama
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Jangan terburu-buru berlari keluar pintu saat bangunan masih bergoyang hebat. Sebanyak 78% cedera gempa bumi diakibatkan oleh pecahan kaca jendela, runtuhnya plafon, dan benda terlempar saat orang panik bergerak.
            </p>
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab('simulation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2 group"
            >
              <span>Buka Simulasi Latihan Interaktif</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature 3: Rute Evakuasi & Titik Kumpul Aman (Persis SVG Mockup 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>RUTE EVAKUASI &amp; PANDUAN MITIGASI</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Jalur Menuju Tempat Aman
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Rute tercepat ke Lapangan Terbuka Sektor B, menghindari gedung bertingkat rawan runtuh dan zona patahan jalan.
            </p>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-3xl font-extrabold text-slate-900 block">450 m</span>
                <span className="text-xs text-slate-500">5 menit jalan cepat ke titik kumpul</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-3xl font-extrabold text-slate-900 block">3.500</span>
                <span className="text-xs text-slate-500">Kapasitas jiwa area terbuka hijau</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  audio.playClick();
                  setActiveTab('map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 shadow-sm transition transform hover:-translate-y-0.5"
              >
                <span>Buka peta &amp; artikel</span>
                <ArrowRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Isometric Cutaway Evacuation Graphic & Path */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#E8F5E9] via-[#CFD8DC] to-[#90A4AE] border border-slate-300/80 shadow-md space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-700" />
                Koridor Evakuasi Dinamis
              </span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px]">
                Jalur Bebas Reruntuhan
              </span>
            </div>

            {/* Visual Route Indicator */}
            <div className="space-y-3 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 text-xs">
                <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                <span className="text-slate-800 font-medium">Jalan Rusak / Sesar Aktif (Zona Merah Bahaya)</span>
              </div>
              <div className="flex items-center gap-3 text-xs pl-1">
                <div className="w-1 h-6 border-l-2 border-dashed border-emerald-500 ml-0.5" />
                <span className="text-emerald-700 font-bold text-[11px]">Koridor Aman Jalan Kaki (450 Meter)</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                <span className="text-slate-800 font-extrabold">Lapangan Terbuka Sektor B (Titik Kumpul Utama)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION ARTIKEL EDUKASI GEMPA BUMI (Sesuai Permintaan User)
         ========================================================================= */}
      <section id="section-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>ARTIKEL &amp; RISET KEBENCANAAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Artikel Edukasi Gempa Bumi Terpilih
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Informasi mendalam dan pedoman resmi bersumber dari BMKG, BNPB, dan pakar geofisika untuk membekali masyarakat dengan literasi kebencanaan.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  audio.playClick();
                  setArticleCategoryFilter(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  articleCategoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => {
                audio.playClick();
                setSelectedArticle(article);
              }}
              className="card-daylight card-daylight-hover rounded-3xl p-6 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                <span className="text-slate-600 font-medium">Oleh {article.author}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Baca Selengkapnya
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. AKSES PLATFORM SEISMORA: GLOBE 3D, PETA 2D, GAMES, & MITIGASI
         ========================================================================= */}
      <section id="section-ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-28">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            EKOSISTEM DIGITAL LENGKAP
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Jelajahi Seluruh Fitur SEISMORA
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Live Monitoring BMKG */}
          <div
            onClick={() => {
              audio.playClick();
              setActiveTab('monitoring');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
              Monitoring Gempa Real-Time
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Feed otomatis USGS &amp; BMKG dengan filter magnitudo, kedalaman, dan waktu kejadian.
            </p>
          </div>

          {/* Card 2: 3D Earth Globe NASA */}
          <div
            onClick={() => {
              audio.playClick();
              setActiveTab('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 group-hover:text-blue-700 transition">
              Peta Satelit &amp; Globe 3D
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Eksplorasi lempeng tektonik dunia dengan citra satelit resolusi tinggi dan visualisasi episentrum.
            </p>
          </div>

          {/* Card 3: 5 Games Edukasi Mitigasi */}
          <div
            onClick={() => {
              audio.playClick();
              setActiveTab('games');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 group-hover:text-amber-700 transition">
              5 Game Petualangan Bencana
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Misi evakuasi bertahan hidup, tantangan tas siaga 9kg, tebak zona aman, dan kuis kebencanaan.
            </p>
          </div>

          {/* Card 4: Buku Saku Mitigasi PDF */}
          <div
            onClick={() => {
              audio.playClick();
              setActiveTab('mitigation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 group-hover:text-purple-700 transition">
              Unduh Buku Panduan PDF
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Checklist kesiapsiagaan darurat dan generator buku saku A4 format PDF otomatis.
            </p>
          </div>
        </div>
      </section>

      {/* CITY RUPTURE 3D SIMULATION (kept as its own interactive section) */}
      <section id="section-city" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 scroll-mt-28">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
            Simulasi Dampak Patahan Kota
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Jalan Terbelah, Gedung Condong</h2>
        </div>
        <DaylightCityRupture3D
          magnitude={simulationMagnitude}
          onMagnitudeChange={mag => setSimulationMagnitude(mag)}
          activeStage={activeStage}
          onStageChange={st => setActiveStage(st)}
          height="560px"
        />
      </section>
      </div>
      </div>

      {/* ARTICLE READER MODAL */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* QUAKE DETAIL MODAL */}
      <QuakeDetailModal
        quake={selectedQuake}
        onClose={() => setSelectedQuake(null)}
      />
    </div>
  );
};
