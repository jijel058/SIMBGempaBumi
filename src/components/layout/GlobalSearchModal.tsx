import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Activity, BookOpen, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { MagnitudeBadge } from '../common/MagnitudeBadge';
import { audio } from '../../services/audioService';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    earthquakes,
    setSelectedQuake,
    setActiveTab,
    language
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  // Global key listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const qLower = query.toLowerCase().trim();

  // Search results in earthquakes
  const quakeResults = qLower
    ? earthquakes.filter(q => q.location.toLowerCase().includes(qLower) || q.source.toLowerCase().includes(qLower)).slice(0, 5)
    : earthquakes.slice(0, 3);

  // Search results in educational topics
  const educationalTopics = [
    { title: 'Pengertian Hiposentrum & Episentrum', module: 'pengertian', category: 'Modul A' },
    { title: 'Gelombang Seismik P-Wave & S-Wave', module: 'pengertian', category: 'Modul A' },
    { title: 'Teori Tektonika Lempeng & Sesar Aktif', module: 'penyebab', category: 'Modul B' },
    { title: 'Megathrust Sunda & Ring of Fire', module: 'penyebab', category: 'Modul B' },
    { title: 'Klasifikasi Gempa Dangkal vs Dalam', module: 'jenis', category: 'Modul C' },
    { title: 'Likuefaksi (Pencairan Tanah) & Tsunami', module: 'dampak', category: 'Modul D' },
  ].filter(t => !qLower || t.title.toLowerCase().includes(qLower) || t.category.toLowerCase().includes(qLower));

  // Search results in mitigation topics
  const mitigationTopics = [
    { title: 'Teknik Drop, Cover, and Hold On', target: 'mitigation' },
    { title: 'Checklist Tas Siaga Bencana (TSB)', target: 'mitigation' },
    { title: 'Prinsip Evakuasi Pantai 20-20-20', target: 'mitigation' },
    { title: 'Simulasi Gempa di Gedung Bertingkat', target: 'simulation' },
  ].filter(m => !qLower || m.title.toLowerCase().includes(qLower));

  const handleClose = () => {
    audio.playClick();
    setQuery('');
    setIsSearchModalOpen(false);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-earth-surface rounded-2xl border border-slate-200 dark:border-emerald-900/50 shadow-2xl overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-emerald-950/60 gap-3">
          <button
            type="button"
            onClick={handleClose}
            title={language === 'id' ? 'Kembali' : 'Back'}
            aria-label={language === 'id' ? 'Kembali' : 'Back'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition flex items-center justify-center shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Search className="w-5 h-5 text-emerald-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari lokasi gempa, topik edukasi, atau mitigasi...' : 'Search earthquakes, education, or mitigation...'}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              title={language === 'id' ? 'Bersihkan pencarian' : 'Clear search'}
              aria-label={language === 'id' ? 'Bersihkan pencarian' : 'Clear search'}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            title={language === 'id' ? 'Tutup pencarian (ESC)' : 'Close search (ESC)'}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-earth-dark dark:hover:bg-white/10 rounded-md border border-slate-200 dark:border-emerald-950/60 transition cursor-pointer shrink-0"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Earthquakes */}
          <div>
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'id' ? 'Aktivitas Gempa Bumi' : 'Earthquake Events'}</span>
            </h5>
            <div className="space-y-1.5">
              {quakeResults.map(q => (
                <div
                  key={q.id}
                  onClick={() => {
                    audio.playClick();
                    setSelectedQuake(q);
                    setActiveTab('monitoring');
                    setIsSearchModalOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-emerald-950/60 hover:bg-emerald-500/5 dark:hover:bg-emerald-950/30 hover:border-emerald-500/30 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <MagnitudeBadge magnitude={q.magnitude} size="sm" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition line-clamp-1">
                        {q.location}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {q.source} • Kedalaman {q.depth} km • {new Date(q.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Educational Topics */}
          {educationalTopics.length > 0 && (
            <div>
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'id' ? 'Modul Edukasi' : 'Education Topics'}</span>
              </h5>
              <div className="space-y-1">
                {educationalTopics.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      audio.playClick();
                      setActiveTab('education');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-earth-card cursor-pointer transition flex items-center justify-between text-xs group"
                  >
                    <span className="text-slate-800 dark:text-slate-200 group-hover:text-emerald-500">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mitigation */}
          {mitigationTopics.length > 0 && (
            <div>
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'id' ? 'Panduan Mitigasi & Simulasi' : 'Mitigation & Simulation'}</span>
              </h5>
              <div className="space-y-1">
                {mitigationTopics.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      audio.playClick();
                      setActiveTab(m.target as any);
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-earth-card cursor-pointer transition flex items-center justify-between text-xs group"
                  >
                    <span className="text-slate-800 dark:text-slate-200 group-hover:text-emerald-500">
                      {m.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

