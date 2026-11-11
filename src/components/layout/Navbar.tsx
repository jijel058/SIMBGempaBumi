import React, { useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  Activity,
  Globe2,
  Map,
  BookOpen,
  ShieldAlert,
  Box,
  Gamepad2,
  Info,
  Search,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  AlertOctagon,
  Menu,
  X,
  Radio
} from 'lucide-react';
import { audio } from '../../services/audioService';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    theme,
    toggleTheme,
    isSoundMuted,
    toggleSound,
    setIsEmergencyModalOpen,
    setIsSearchModalOpen,
    isLive
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; labelId: string; labelEn: string; icon: any; isHighlight?: boolean }[] = [
    { id: 'home', labelId: 'Beranda', labelEn: 'Home', icon: Globe2 },
    { id: 'monitoring', labelId: 'Monitoring Gempa', labelEn: 'Live Monitor', icon: Activity, isHighlight: true },
    { id: 'map', labelId: 'Peta Dunia', labelEn: 'Global Map', icon: Map },
    { id: 'education', labelId: 'Edukasi Gempa', labelEn: 'Education', icon: BookOpen },
    { id: 'mitigation', labelId: 'Mitigasi Bencana', labelEn: 'Mitigation', icon: ShieldAlert },
    { id: 'simulation', labelId: 'Simulasi 3D', labelEn: '3D Simulation', icon: Box },
    { id: 'games', labelId: 'Games Mitigasi', labelEn: 'Disaster Games', icon: Gamepad2 },
    { id: 'about', labelId: 'Tentang Kami', labelEn: 'About & Data', icon: Info },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    audio.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/20 dark:border-emerald-900/40 bg-white/80 dark:bg-earth-dark/85 backdrop-blur-xl transition-colors duration-200">
      {/* Top Banner Alert Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-seismo-900 text-emerald-100 text-xs py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            {language === 'id' ? 'Sistem Pemantauan Terintegrasi USGS & BMKG' : 'Integrated Global Feed: USGS & BMKG'}
          </span>
          <span className="hidden md:inline-block text-emerald-300/80">|</span>
          <span className="hidden md:inline-block text-emerald-300/90 text-[11px]">
            {language === 'id'
              ? 'Data deteksi pascakejadian resmi real-time • Bukan sistem prediksi'
              : 'Official post-event detection network • Not a prediction tool'}
          </span>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => {
                audio.playEmergencyAlert();
                setIsEmergencyModalOpen(true);
              }}
              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-0.5 rounded text-[11px] transition shadow-sm"
            >
              <AlertOctagon className="w-3 h-3 animate-spin" />
              <span>SOS HOTLINE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/25 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 stroke-[2.5]" />
              <div className="absolute -inset-1 rounded-xl bg-emerald-500/20 blur group-hover:bg-emerald-500/40 transition duration-200 -z-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  SEISMO<span className="text-emerald-500">RA</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block tracking-tight font-medium">
                Earthquake Education & Monitoring
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span>{language === 'id' ? item.labelId : item.labelEn}</span>
                  {item.isHighlight && isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Bar Button */}
            <button
              onClick={() => {
                audio.playClick();
                setIsSearchModalOpen(true);
              }}
              title="Search (Ctrl + K)"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition border border-transparent hover:border-slate-200 dark:hover:border-emerald-900/30"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isSoundMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              {isSoundMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-500" />
              )}
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={() => {
                audio.playClick();
                toggleTheme();
              }}
              title="Toggle Dark / Light Mode"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => {
                audio.playClick();
                setLanguage(language === 'id' ? 'en' : 'id');
              }}
              className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-emerald-800/40 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              {language === 'id' ? 'EN' : 'ID'}
            </button>

            {/* Direct App Launch Pill (SVG Mockup: Buka aplikasi ↗) */}
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab('monitoring');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition transform hover:-translate-y-0.5 ml-1"
            >
              <span>Buka aplikasi</span>
              <span>↗</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-emerald-950/20 dark:border-emerald-900/40 bg-white/95 dark:bg-earth-surface/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-700/20'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{language === 'id' ? item.labelId : item.labelEn}</span>
                </div>
                {item.isHighlight && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    LIVE
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-emerald-900/30 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEmergencyModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-md"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>SOS & Hotline Darurat BMKG/BNPB</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

