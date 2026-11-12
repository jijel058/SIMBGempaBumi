import React, { useState } from 'react';
import { EDUCATION_MODULES, EducationModule } from '../../data/educationData';
import { EDUCATIONAL_ARTICLES, EducationalArticle } from '../../data/articleData';
import { ArticleModal } from './ArticleModal';
import { audio } from '../../services/audioService';
import {
  BookOpen,
  Clock,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  FileText,
  ArrowUpRight,
  Layers
} from 'lucide-react';

export const EducationView: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('pengertian');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['pengertian']);
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const activeModule: EducationModule =
    EDUCATION_MODULES.find(m => m.id === selectedModuleId) || EDUCATION_MODULES[0];

  const articleCategories = ['Semua', 'Geologi', 'Mitigasi', 'Teknologi', 'Kesiapsiagaan', 'Evakuasi'];
  const filteredArticles =
    selectedCategory === 'Semua'
      ? EDUCATIONAL_ARTICLES
      : EDUCATIONAL_ARTICLES.filter(a => a.category === selectedCategory);

  const toggleBookmark = (id: string) => {
    audio.playClick();
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const renderInteractiveDiagram = (type?: string) => {
    switch (type) {
      case 'hypocenter':
        return (
          <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-earth-dark border border-emerald-500/30 text-white my-4 space-y-3 select-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
              Visualisasi Anatomi Seismik:
            </span>
            <div className="relative h-44 rounded-xl bg-black/40 border border-emerald-900/40 flex flex-col justify-between p-4 overflow-hidden">
              {/* Surface Level */}
              <div className="relative z-10 flex items-center justify-between border-b border-emerald-500/40 pb-2">
                <span className="text-xs font-black text-emerald-300">Permukaan Bumi (Surface)</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-extrabold animate-pulse">
                  <span>📍 Episentrum (Epicenter)</span>
                </div>
              </div>

              {/* Crust Depth */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <div className="w-0.5 h-12 bg-dashed border-l border-dashed border-red-400" />
                <span className="text-[10px] text-slate-400 font-mono">Kedalaman (Depth) km</span>
              </div>

              {/* Hypocenter in Crust */}
              <div className="relative z-10 flex items-center justify-center gap-2 pt-2 border-t border-slate-700/60">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span>★ Hiposentrum / Fokus (Titik Patah Batuan)</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Episentrum adalah proyeksi tegak lurus dari hiposentrum ke atas permukaan tanah.
            </p>
          </div>
        );

      case 'waves':
        return (
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 my-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 block">
              Perbandingan Gelombang Seismik:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-900/40">
                <div className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-between mb-1">
                  <span>Gelombang P (Primer)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 font-bold">~6-8 km/s</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Gelombang longitudinal tercepat. Partikel bergerak maju-mundur searah rambatan. Pertama kali terekam stasiun seismograf.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-900/40">
                <div className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-between mb-1">
                  <span>Gelombang S (Sekunder)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 font-bold">~3-4.5 km/s</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Gelombang transversal geser. Partikel bergetar tegak lurus arah rambatan. Memicu kerusakan struktur bangunan terparah.
                </p>
              </div>
            </div>
          </div>
        );

      case 'liquefaction':
        return (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 my-4 space-y-2 text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Mekanisme Terjadinya Likuefaksi (Pencairan Tanah):</span>
            </span>
            <p className="leading-relaxed">
              1. <strong>Kondisi Awal:</strong> Lapisan tanah berpasir memiliki rongga antar butiran yang dipenuhi air tanah (jenuh air).<br />
              2. <strong>Guncangan Seismik:</strong> Gelombang geser gempa mengguncang butiran pasir secara berulang dan rapat.<br />
              3. <strong>Tekanan Air Naik:</strong> Tekanan air pori meningkat drastis hingga kontak gesek antar butiran pasir hilang sama sekali.<br />
              4. <strong>Likuifaksi Terjadi:</strong> Tanah berperilaku seperti cairan lumpur pekat, menenggelamkan pondasi gedung dan menggeser pemukiman.
            </p>
          </div>
        );

      case 'layers':
        return (
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 my-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Struktur Lapisan Dalam Bumi &amp; Dinamika Litosfer:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="font-black block text-emerald-700">1. Kerak Bumi (Crust)</span>
                <span className="text-[10px] font-mono text-emerald-600">0 – 70 km</span>
                <p className="text-[11px] text-slate-600 mt-1">Lapisan batuan padat terluar tempat seluruh hiposentrum gempa dangkal terjadi.</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <span className="font-black block text-amber-700">2. Mantel (Asthenosphere)</span>
                <span className="text-[10px] font-mono text-amber-600">70 – 2.900 km</span>
                <p className="text-[11px] text-slate-600 mt-1">Batuan semi-plastis panas dengan arus konveksi yang menggerakkan lempeng tektonik.</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-950">
                <span className="font-black block text-orange-700">3. Inti Luar (Outer Core)</span>
                <span className="text-[10px] font-mono text-orange-600">2.900 – 5.150 km</span>
                <p className="text-[11px] text-slate-600 mt-1">Besi dan nikel cair bersuhu ~4.500°C yang menyerap gelombang S-Wave.</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                <span className="font-black block text-rose-700">4. Inti Dalam (Inner Core)</span>
                <span className="text-[10px] font-mono text-rose-600">5.150 – 6.371 km</span>
                <p className="text-[11px] text-slate-600 mt-1">Bola besi-nikel padat bertekanan ekstrem dengan suhu mencapai ~5.500°C.</p>
              </div>
            </div>
          </div>
        );

      case 'faults':
        return (
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 my-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Mekanisme 3 Jenis Patahan / Sesar Aktif:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-earth-surface border border-slate-200">
                <div className="font-extrabold text-rose-600 mb-1">Sesar Naik (Thrust / Reverse)</div>
                <p className="text-[11px] text-slate-600">Akibat gaya tekan (kompresi). Blok hanging wall bergerak naik. Pemicu utama gempa Megathrust &amp; Tsunami.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-earth-surface border border-slate-200">
                <div className="font-extrabold text-blue-600 mb-1">Sesar Turun (Normal Fault)</div>
                <p className="text-[11px] text-slate-600">Akibat gaya regangan (ekstensi). Blok batuan atas merosot turun mengikuti bidang patahan.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-earth-surface border border-slate-200">
                <div className="font-extrabold text-amber-600 mb-1">Sesar Geser (Strike-Slip)</div>
                <p className="text-[11px] text-slate-600">Dua blok kerak bergeser mendatar berpapasan (contoh: Sesar Semangko, Sesar Lembang, Sesar Palu-Koro).</p>
              </div>
            </div>
          </div>
        );

      case 'mmi':
        return (
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 my-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Tabel Cepat Skala Intensitas Guncangan (SIG-BMKG &amp; MMI):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300">
                <span className="font-black text-slate-700 block">I – II MMI</span>
                <span className="text-[10px] font-bold text-slate-500">Tidak Dirasakan</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
                <span className="font-black text-emerald-800 block">III – V MMI</span>
                <span className="text-[10px] font-bold text-emerald-700">Dirasakan Ringan</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300">
                <span className="font-black text-amber-800 block">VI MMI</span>
                <span className="text-[10px] font-bold text-amber-700">Kerusakan Ringan</span>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-300">
                <span className="font-black text-orange-800 block">VII – VIII MMI</span>
                <span className="text-[10px] font-bold text-orange-700">Kerusakan Sedang</span>
              </div>
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 col-span-2 sm:col-span-1">
                <span className="font-black text-red-800 block">IX – XII MMI</span>
                <span className="text-[10px] font-bold text-red-700">Kerusakan Berat</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="border-b border-slate-200 dark:border-emerald-950/60 pb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Earthquake Knowledge Center
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Edukasi & Literasi Gempa Bumi
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pelajari konsep ilmiah kegempaan dari dasar hingga komprehensif, disajikan dengan bahasa visual yang mudah dipahami.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Module Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Daftar Modul Pembelajaran:
          </h3>
          <div className="space-y-2">
            {EDUCATION_MODULES.map(m => {
              const isSelected = m.id === selectedModuleId;

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    audio.playClick();
                    setSelectedModuleId(m.id);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition duration-150 flex items-start justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-700/20'
                      : 'bg-white dark:bg-earth-card border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/40 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-500'
                      }`}
                    >
                      {m.badge}
                    </span>
                    <h4 className="font-extrabold text-sm line-clamp-1">{m.title}</h4>
                    <span className={`text-[11px] flex items-center gap-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      <Clock className="w-3 h-3" />
                      <span>{m.readTime}</span>
                    </span>
                  </div>

                  <ChevronRight className={`w-4 h-4 mt-2 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module Reading Area */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-xl space-y-8">
            {/* Header of Active Module */}
            <div className="border-b border-slate-100 dark:border-emerald-950/60 pb-6 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded bg-emerald-500/10">
                  {activeModule.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {activeModule.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {activeModule.subtitle}
                </p>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={() => toggleBookmark(activeModule.id)}
                title="Bookmark Modul"
                className={`p-3 rounded-xl border transition ${
                  bookmarkedIds.includes(activeModule.id)
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-slate-50 dark:bg-earth-card border-slate-200 dark:border-emerald-950/60 text-slate-400 hover:text-emerald-500'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>

            {/* Sections Content */}
            <div className="space-y-8">
              {activeModule.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                    <span>{sec.heading}</span>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {sec.content}
                  </p>

                  {/* Bullet points if any */}
                  {sec.bulletPoints && (
                    <ul className="space-y-2 pl-2">
                      {sec.bulletPoints.map((bp, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Callout box if any */}
                  {sec.callout && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                      <span className="font-bold block text-emerald-700 dark:text-emerald-300">
                        {sec.callout.title}
                      </span>
                      <p className="leading-relaxed">{sec.callout.text}</p>
                    </div>
                  )}

                  {/* Interactive Diagram if any */}
                  {sec.diagramType && renderInteractiveDiagram(sec.diagramType)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Articles Section inside Education Page */}
      <div id="section-edu-articles" className="pt-8 border-t border-slate-200 dark:border-emerald-950/60 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Seismology &amp; Disaster Literacy Library
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Artikel &amp; Kajian Ilmiah Kegempaan
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kumpulan artikel mendalam seputar geologi Indonesia, kesiapsiagaan keluarga, teknologi deteksi dini, dan panduan evakuasi.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {articleCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  audio.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 text-slate-600 dark:text-slate-300 hover:border-emerald-500/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map(art => (
            <div
              key={art.id}
              onClick={() => {
                audio.playClick();
                setSelectedArticle(art);
              }}
              className="group cursor-pointer p-6 rounded-3xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-emerald-950/40 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[70%]">
                  {art.source}
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  <span>Baca</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
};

