import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MITIGATION_CHECKLIST_DATA } from '../../data/mitigationData';
import { MitigationItem } from '../../types/mitigation';
import { generateMitigationGuidePDF } from '../../services/pdfService';
import { audio } from '../../services/audioService';
import {
  ShieldAlert,
  CheckSquare,
  Square,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MitigationView: React.FC = () => {
  const { userProfile, toggleChecklist, addXp, awardBadge } = useApp();
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>('before');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [activeStepAnim, setActiveStepAnim] = useState<number>(0);

  const handleDownloadPDF = () => {
    audio.playClick();
    setIsDownloadingPdf(true);
    try {
      generateMitigationGuidePDF();
      addXp(30);
    } catch (e) {
      console.error('PDF error:', e);
      alert('Gagal mengunduh PDF. Silakan coba kembali.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleChecklistClick = (item: MitigationItem) => {
    toggleChecklist(item.id);
    const completedNow = !userProfile.completedChecklists.includes(item.id);
    if (completedNow) {
      addXp(15);
      // Check if all before items completed
      const beforeIds = MITIGATION_CHECKLIST_DATA.filter(i => i.category === 'before').map(i => i.id);
      const allBeforeDone = beforeIds.every(id =>
        id === item.id ? true : userProfile.completedChecklists.includes(id)
      );
      if (allBeforeDone) {
        awardBadge('checklist_done');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  const filteredItems = MITIGATION_CHECKLIST_DATA.filter(i => i.category === activeTab);
  const completedCount = filteredItems.filter(i => userProfile.completedChecklists.includes(i.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-emerald-950/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Disaster Preparedness Protocol
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Panduan Mitigasi & Kesiapsiagaan Gempa Bumi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Langkah sistematis prabencana, tanggap darurat, dan pascabencana berbasis standar BNPB & BMKG.
          </p>
        </div>

        {/* Download PDF Guide Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloadingPdf}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition hover:scale-105 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloadingPdf ? 'Menyiapkan PDF...' : 'Download Buku Panduan PDF'}</span>
        </button>
      </div>

      {/* 3 Phases Category Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            audio.playClick();
            setActiveTab('before');
          }}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'before'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-700/20'
              : 'bg-white dark:bg-earth-card border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
            Fase 1
          </span>
          <h3 className="text-base font-black mt-0.5">A. SEBELUM GEMPA</h3>
          <p className={`text-xs mt-1 ${activeTab === 'before' ? 'text-emerald-100' : 'text-slate-400'}`}>
            Kesiapsiagaan prabencana, perkuatan rumah, & Tas Siaga.
          </p>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            setActiveTab('during');
          }}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'during'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-700/20'
              : 'bg-white dark:bg-earth-card border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
            Fase 2
          </span>
          <h3 className="text-base font-black mt-0.5">B. SAAT GEMPA</h3>
          <p className={`text-xs mt-1 ${activeTab === 'during' ? 'text-emerald-100' : 'text-slate-400'}`}>
            Drop, Cover, Hold On & perlindungan kepala seketika.
          </p>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            setActiveTab('after');
          }}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'after'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-700/20'
              : 'bg-white dark:bg-earth-card border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
            Fase 3
          </span>
          <h3 className="text-base font-black mt-0.5">C. SETELAH GEMPA</h3>
          <p className={`text-xs mt-1 ${activeTab === 'after' ? 'text-emerald-100' : 'text-slate-400'}`}>
            Evakuasi tertib, antisipasi aftershocks, & tsunami pesisir.
          </p>
        </button>
      </div>

      {/* Featured Visual Demonstration for 'during' (Drop, Cover, Hold On) */}
      {activeTab === 'during' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-earth-surface to-earth-dark text-white border border-emerald-900/50 shadow-2xl space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Protokol Perlindungan Emas
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              Tiga Langkah Wajib: Drop, Cover, Hold On!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Klik setiap tahapan di bawah untuk melihat peragaan visual dan instruksi spesifik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: '1. DROP (Merunduk)',
                desc: 'Segera jatuhkan tubuh ke tangan dan lutut sebelum gempa menjatuhkan Anda. Posisi ini melindungi Anda dari terpental dan memungkinkan Anda merangkak ke tempat aman.',
                icon: 'ShieldCheck',
                color: 'emerald'
              },
              {
                step: '2. COVER (Lindungi)',
                desc: 'Lindungi kepala dan leher dengan satu lengan. Merangkaklah ke bawah meja makan atau meja kerja yang kokoh. Jauhi jendela kaca yang bisa meledak ke arah dalam.',
                icon: 'ShieldCheck',
                color: 'amber'
              },
              {
                step: '3. HOLD ON (Bertahan)',
                desc: 'Pegang erat kaki meja dengan satu tangan; jika meja bergeser, ikutlah bergerak bersamanya. Tetap berlindung hingga getaran tanah benar-benar berhenti.',
                icon: 'ShieldCheck',
                color: 'red'
              }
            ].map((st, idx) => (
              <div
                key={idx}
                onClick={() => {
                  audio.playClick();
                  setActiveStepAnim(idx);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  activeStepAnim === idx
                    ? 'bg-emerald-600/20 border-emerald-500 shadow-xl'
                    : 'bg-black/30 border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-base flex items-center justify-center mb-3">
                  0{idx + 1}
                </div>
                <h4 className="font-extrabold text-base text-white">{st.step}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Checklist Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-emerald-950/60 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Checklist Praktis Tindakan ({activeTab === 'before' ? 'Prabencana' : activeTab === 'during' ? 'Tanggap Darurat' : 'Pascabencana'})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Klik setiap item yang telah Anda siapkan atau pahami untuk menyimpan progres kesiapsiagaan Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {completedCount} dari {filteredItems.length} Selesai
            </span>
            <div className="w-24 h-2.5 rounded-full bg-slate-100 dark:bg-earth-dark overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(completedCount / filteredItems.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map(item => {
            const isCompleted = userProfile.completedChecklists.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleChecklistClick(item)}
                className={`p-4 rounded-2xl border transition cursor-pointer select-none flex items-start gap-3.5 group ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-50 dark:bg-earth-card border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/40'
                }`}
              >
                <button className="mt-0.5 text-emerald-500 flex-shrink-0">
                  {isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-extrabold transition ${
                        isCompleted
                          ? 'text-emerald-800 dark:text-emerald-300 line-through opacity-85'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {item.priority === 'high' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                        PENTING
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

