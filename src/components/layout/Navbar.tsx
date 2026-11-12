import React, { useLayoutEffect, useRef, useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { useDiorama, NavIntent } from '../../context/DioramaContext';
import {
  Activity,
  Globe2,
  Map as MapIcon,
  BookOpen,
  ShieldAlert,
  Box,
  Gamepad2,
  Info,
  Search,
  Volume2,
  VolumeX,
  AlertOctagon,
  Menu,
  X,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { audio } from '../../services/audioService';

interface SubItem {
  label: string;
  labelEn: string;
  tab: NavigationTab;
  anchor?: string;
  intent?: Omit<NavIntent, 'nonce'>;
}

interface NavItem {
  id: NavigationTab;
  labelId: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  live?: boolean;
  sub: SubItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    labelId: 'Beranda',
    labelEn: 'Home',
    icon: Globe2,
    sub: [
      { label: 'Hero', labelEn: 'Hero', tab: 'home', anchor: 'top' },
      { label: 'Fitur Utama', labelEn: 'Features', tab: 'home', anchor: 'section-features' },
      { label: 'Artikel', labelEn: 'Articles', tab: 'home', anchor: 'section-articles' },
      { label: 'Ekosistem', labelEn: 'Ecosystem', tab: 'home', anchor: 'section-ecosystem' }
    ]
  },
  {
    id: 'monitoring',
    labelId: 'Monitoring',
    labelEn: 'Live Monitor',
    icon: Activity,
    live: true,
    sub: [
      { label: 'Feed Real-Time', labelEn: 'Live Feed', tab: 'monitoring' },
      { label: 'Lihat di Peta', labelEn: 'On Map', tab: 'map', intent: { mapMode: '2d' } },
      { label: 'Lihat di Globe', labelEn: 'On Globe', tab: 'map', intent: { mapMode: '3d' } }
    ]
  },
  {
    id: 'map',
    labelId: 'Peta Dunia',
    labelEn: 'Global Map',
    icon: MapIcon,
    sub: [
      { label: 'Peta 2D', labelEn: '2D Map', tab: 'map', intent: { mapMode: '2d' } },
      { label: 'Globe 3D', labelEn: '3D Globe', tab: 'map', intent: { mapMode: '3d' } }
    ]
  },
  {
    id: 'education',
    labelId: 'Edukasi',
    labelEn: 'Education',
    icon: BookOpen,
    sub: [
      { label: 'Modul Belajar', labelEn: 'Modules', tab: 'education', anchor: 'top' },
      { label: 'Artikel', labelEn: 'Articles', tab: 'education', anchor: 'section-edu-articles' }
    ]
  },
  {
    id: 'mitigation',
    labelId: 'Mitigasi',
    labelEn: 'Mitigation',
    icon: ShieldAlert,
    sub: [
      { label: 'Panduan & Checklist', labelEn: 'Guide & Checklist', tab: 'mitigation' },
      { label: 'Rute Evakuasi', labelEn: 'Evacuation', tab: 'home', anchor: 'section-features' }
    ]
  },
  {
    id: 'simulation',
    labelId: 'Simulasi 3D',
    labelEn: '3D Simulation',
    icon: Box,
    sub: [
      { label: 'Patahan Kota', labelEn: 'City Rupture', tab: 'simulation', intent: { simTab: 'city-rupture' } },
      { label: 'Globe NASA', labelEn: 'NASA Globe', tab: 'simulation', intent: { simTab: 'globe' } },
      { label: 'Latihan Darurat', labelEn: 'Drills', tab: 'simulation', intent: { simTab: 'scenarios' } }
    ]
  },
  {
    id: 'games',
    labelId: 'Games',
    labelEn: 'Games',
    icon: Gamepad2,
    sub: [
      { label: 'Hub Game', labelEn: 'Game Hub', tab: 'games' },
      { label: 'Latihan 3D', labelEn: '3D Drills', tab: 'simulation', intent: { simTab: 'scenarios' } }
    ]
  },
  {
    id: 'about',
    labelId: 'Tentang',
    labelEn: 'About',
    icon: Info,
    sub: [{ label: 'Tentang & Sumber Data', labelEn: 'About & Data', tab: 'about' }]
  }
];

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    isSoundMuted,
    toggleSound,
    setIsEmergencyModalOpen,
    setIsSearchModalOpen,
    isLive
  } = useApp();
  const { setIntent } = useDiorama();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverId, setHoverId] = useState<NavigationTab | null>(null);
  const [activeSub, setActiveSub] = useState<string>('');
  const [stripX, setStripX] = useState<number>(0);

  const barRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Partial<Record<NavigationTab, HTMLButtonElement | null>>>({});

  const displayId = hoverId ?? activeTab;
  const displayItem = NAV_ITEMS.find(n => n.id === displayId);
  const tr = (id: string, en: string) => (language === 'id' ? id : en);

  useLayoutEffect(() => {
    const bar = barRef.current;
    const btn = itemRefs.current[displayId];
    if (!bar || !btn) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const center = btnRect.left - barRect.left + btnRect.width / 2;
    const half = 150;
    setStripX(Math.max(half, Math.min(center, barRect.width - half)));
  }, [displayId, language, activeTab]);

  const scrollToAnchor = (anchor?: string) => {
    window.setTimeout(
      () => {
        if (!anchor || anchor === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      anchor && activeTab !== 'home' ? 160 : 0
    );
  };

  const goTo = (tab: NavigationTab, sub?: SubItem) => {
    audio.playClick();
    if (sub?.intent) setIntent(sub.intent);
    setActiveTab(tab);
    setMobileOpen(false);
    setHoverId(null);
    if (sub) setActiveSub(sub.label);
    else setActiveSub('');
    if (sub?.anchor) scrollToAnchor(sub.anchor);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-5 pt-3" onMouseLeave={() => setHoverId(null)}>
      <div ref={barRef} className="relative max-w-7xl mx-auto">
        {/* ---- Liquid-glass bar -------------------------------------------- */}
        <div className="glass-panel rounded-[1.75rem] h-16 pl-3 pr-2.5 sm:pl-4 sm:pr-3 flex items-center justify-between gap-3">
          {/* Brand */}
          <button
            onClick={() => goTo('home')}
            className="flex items-center gap-2.5 select-none group shrink-0"
            aria-label="SEISMORA home"
          >
            <span className="relative flex items-center justify-center w-10 h-10 rounded-2xl glass-btn-primary">
              <Activity className="w-5 h-5 text-white stroke-[2.6]" />
            </span>
            <span className="text-left leading-tight">
              <span className="flex items-center gap-1.5 font-black text-lg tracking-[0.12em] text-slate-900">
                SEISMO<span className="text-emerald-600">RA</span>
                {isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-500 tracking-tight">
                Earthquake Education &amp; Monitoring
              </span>
            </span>
          </button>

          {/* Desktop menu */}
          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              const isHover = hoverId === item.id;
              return (
                <button
                  key={item.id}
                  ref={el => {
                    itemRefs.current[item.id] = el;
                  }}
                  onMouseEnter={() => setHoverId(item.id)}
                  onFocus={() => setHoverId(item.id)}
                  onClick={() => goTo(item.id)}
                  className={`relative px-3.5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'glass-btn-primary text-white'
                      : isHover
                        ? 'bg-white/70 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tr(item.labelId, item.labelEn)}
                  {item.live && !isActive && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utilities */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Search "pill" (glass input + round action button) */}
            <button
              onClick={() => {
                audio.playClick();
                setIsSearchModalOpen(true);
              }}
              title="Search (Ctrl + K)"
              className="hidden 2xl:flex items-center gap-2 pl-4 pr-1 h-10 rounded-full bg-white/80 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_8px_rgba(15,23,42,0.08)] text-xs font-semibold text-slate-500 hover:bg-white transition w-52"
            >
              <span className="flex-1 text-left">{tr('Cari gempa, negara…', 'Search quakes…')}</span>
              <span className="w-8 h-8 rounded-full glass-btn-primary flex items-center justify-center">
                <Search className="w-3.5 h-3.5 text-white" />
              </span>
            </button>
            <button
              onClick={() => {
                audio.playClick();
                setIsSearchModalOpen(true);
              }}
              title="Search (Ctrl + K)"
              className="2xl:hidden w-10 h-10 rounded-full glass-btn-secondary flex items-center justify-center"
            >
              <Search className="w-4 h-4 text-slate-700" />
            </button>

            <button
              onClick={toggleSound}
              title={isSoundMuted ? 'Unmute' : 'Mute'}
              className="hidden sm:flex w-10 h-10 rounded-full glass-btn-secondary items-center justify-center"
            >
              {isSoundMuted ? (
                <VolumeX className="w-4 h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            <button
              onClick={() => {
                audio.playClick();
                setLanguage(language === 'id' ? 'en' : 'id');
              }}
              className="hidden sm:flex w-10 h-10 rounded-full glass-btn-secondary items-center justify-center text-[11px] font-black text-slate-700"
            >
              {language === 'id' ? 'EN' : 'ID'}
            </button>

            <button
              onClick={() => {
                audio.playEmergencyAlert();
                setIsEmergencyModalOpen(true);
              }}
              className="flex items-center gap-1.5 h-10 px-3.5 rounded-full text-xs font-black text-white bg-gradient-to-b from-red-500 to-red-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_4px_14px_rgba(220,38,38,0.35)] hover:brightness-110 transition"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            <button
              onClick={() => goTo('monitoring')}
              className="hidden 2xl:flex items-center gap-1 h-10 px-4 rounded-full glass-btn-secondary text-xs font-black text-slate-800"
            >
              {tr('Buka aplikasi', 'Open app')}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden w-10 h-10 rounded-full glass-btn-secondary flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* ---- Sub-menu strip hanging under the active / hovered item ------ */}
        {displayItem && displayItem.sub.length > 0 && (
          <div
            key={displayItem.id}
            className="hidden xl:flex absolute top-full mt-1.5 -translate-x-1/2 items-center gap-0.5 px-1.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-800/95 via-emerald-700/95 to-teal-700/95 backdrop-blur-xl border border-white/20 shadow-[0_14px_30px_-8px_rgba(6,78,59,0.55),inset_0_1px_1px_rgba(255,255,255,0.25)] animate-in fade-in slide-in-from-top-1 duration-200"
            style={{ left: stripX }}
          >
            {displayItem.sub.map(s => {
              const on = displayItem.id === activeTab && activeSub === s.label;
              return (
                <button
                  key={s.label}
                  onClick={() => goTo(s.tab, s)}
                  className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition ${
                    on ? 'bg-white/25 text-white' : 'text-emerald-50/90 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {tr(s.label, s.labelEn)}
                </button>
              );
            })}
          </div>
        )}

        {/* ---- Mobile / tablet drawer -------------------------------------- */}
        {mobileOpen && (
          <div className="xl:hidden glass-panel rounded-3xl mt-2 p-3 space-y-1 max-h-[75vh] overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => goTo(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition ${
                      isActive ? 'glass-btn-primary text-white' : 'text-slate-700 hover:bg-white/70'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {tr(item.labelId, item.labelEn)}
                    </span>
                    {item.live && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-emerald-700 font-black">
                        LIVE
                      </span>
                    )}
                  </button>
                  {isActive && item.sub.length > 1 && (
                    <div className="mt-1 mb-1 ml-5 pl-3 border-l-2 border-emerald-500/40 space-y-0.5">
                      {item.sub.map(s => (
                        <button
                          key={s.label}
                          onClick={() => goTo(s.tab, s)}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white/70"
                        >
                          {tr(s.label, s.labelEn)}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-2 flex gap-2">
              <button
                onClick={toggleSound}
                className="flex-1 h-10 rounded-2xl glass-btn-secondary flex items-center justify-center gap-2 text-xs font-bold text-slate-700"
              >
                {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                Audio
              </button>
              <button
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                className="flex-1 h-10 rounded-2xl glass-btn-secondary text-xs font-black text-slate-700"
              >
                {language === 'id' ? 'English' : 'Indonesia'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
