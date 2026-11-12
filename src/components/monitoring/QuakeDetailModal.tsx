import React from 'react';
import { Earthquake } from '../../types/earthquake';
import { MagnitudeBadge } from '../common/MagnitudeBadge';
import {
  X,
  Waves,
  ExternalLink,
  ShieldAlert,
  Share2,
  Navigation
} from 'lucide-react';
import { audio } from '../../services/audioService';

interface Props {
  quake: Earthquake | null;
  onClose: () => void;
}

export const QuakeDetailModal: React.FC<Props> = ({ quake, onClose }) => {
  if (!quake) return null;

  const handleShare = () => {
    audio.playClick();
    if (navigator.share) {
      navigator.share({
        title: `Laporan Gempa M ${quake.magnitude} - SEISMORA`,
        text: `Gempa bumi M ${quake.magnitude} terjadi di ${quake.location} pada kedalaman ${quake.depth} km.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(
        `[SEISMORA Alert] Gempa M ${quake.magnitude} - ${quake.location} (Kedalaman ${quake.depth} km) ${new Date(quake.time).toLocaleString()}`
      );
      alert('Tautan & rincian gempa disalin ke clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-earth-surface rounded-2xl border border-slate-200 dark:border-emerald-900/50 shadow-2xl overflow-hidden">
        {/* Header with Magnitude accent */}
        <div className="p-6 border-b border-slate-200 dark:border-emerald-950/60 bg-gradient-to-r from-emerald-500/10 to-transparent flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MagnitudeBadge magnitude={quake.magnitude} size="lg" showLabel />
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {quake.source} VERIFIED
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white pt-2 leading-tight">
              {quake.location}
            </h3>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Tsunami Status Alert if available */}
          {quake.tsunami ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-start gap-3">
              <Waves className="w-5 h-5 flex-shrink-0 animate-pulse mt-0.5" />
              <div>
                <p className="font-bold text-sm">POTENSI PERINGATAN TSUNAMI DIPERIKSA</p>
                <p className="text-xs mt-0.5 opacity-90">
                  Parameter gempa berpotensi memicu anomali muka air laut. Masyarakat pesisir diimbau waspada dan menjauhi bibir pantai menuju zona aman.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span>Status: <strong>Tidak berpotensi tsunami</strong> menurut pemodelan geofisika.</span>
            </div>
          )}

          {/* Key Seismological Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60">
              <span className="text-[11px] text-slate-400 block font-medium">Kedalaman</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {quake.depth} km
              </span>
              <span className="text-[10px] text-slate-400 block">
                {quake.depth < 60 ? 'Dangkal (<60 km)' : quake.depth < 300 ? 'Menengah' : 'Dalam'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60">
              <span className="text-[11px] text-slate-400 block font-medium">Waktu Terdeteksi</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                {new Date(quake.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {new Date(quake.time).toLocaleDateString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60">
              <span className="text-[11px] text-slate-400 block font-medium">Koordinat Lintang/Bujur</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                {quake.latitude.toFixed(2)}°, {quake.longitude.toFixed(2)}°
              </span>
              <span className="text-[10px] text-slate-400 block">Episentrum GPS</span>
            </div>
          </div>

          {/* Felt Report (Dirasakan) for BMKG */}
          {quake.dirasakan && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                <span>Skala Intensitas Dirasakan (MMI):</span>
              </p>
              <p className="font-semibold text-slate-800 dark:text-white">{quake.dirasakan}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Berdasarkan laporan masyarakat dan sensor akselerograf jaringan InaTEWS BMKG.
              </p>
            </div>
          )}

          {/* Distance from User GPS if granted */}
          {quake.distanceFromUser && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-earth-card text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Navigation className="w-4 h-4 text-emerald-500" />
                <span>Jarak dari lokasi Anda:</span>
              </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                ~{quake.distanceFromUser.toLocaleString()} km
              </strong>
            </div>
          )}

          {/* BMKG Shakemap Preview if available */}
          {quake.shakemap && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Peta Guncangan Resmi (BMKG Shakemap):
              </span>
              <img
                src={quake.shakemap}
                alt="BMKG Shakemap"
                className="w-full rounded-xl border border-slate-200 dark:border-emerald-950/60 object-cover max-h-48"
                onError={e => {
                  (e.target as any).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-earth-dark/70 border-t border-slate-200 dark:border-emerald-950/60 flex items-center justify-between">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan Info</span>
          </button>

          <div className="flex items-center gap-2">
            {quake.url && (
              <a
                href={quake.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-200 dark:bg-earth-card hover:bg-slate-300 text-slate-800 dark:text-slate-200 transition"
              >
                <span>Halaman Resmi API</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

