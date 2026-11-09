import React from 'react';
import { Earthquake } from '../../types/earthquake';
import { MagnitudeBadge } from '../common/MagnitudeBadge';
import { MapPin, Navigation, Clock, Waves, ChevronRight } from 'lucide-react';
import { audio } from '../../services/audioService';

interface Props {
  quake: Earthquake;
  onClick: () => void;
  isLatest?: boolean;
}

export const QuakeCard: React.FC<Props> = ({ quake, onClick, isLatest = false }) => {
  const timeElapsed = () => {
    const diffMs = Date.now() - quake.time;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari yang lalu`;
  };

  return (
    <div
      onClick={() => {
        audio.playClick();
        onClick();
      }}
      className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
        isLatest
          ? 'bg-gradient-to-br from-emerald-500/10 via-white dark:via-earth-card to-emerald-500/5 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
          : 'bg-white dark:bg-earth-card border-slate-200/80 dark:border-emerald-950/60 hover:border-emerald-500/40 hover:shadow-md'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <MagnitudeBadge magnitude={quake.magnitude} size="md" />
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-earth-surface text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-950/60">
            {quake.source}
          </span>
          {isLatest && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
              TERBARU
            </span>
          )}
        </div>

        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeElapsed()}</span>
        </div>
      </div>

      {/* Main Location Title */}
      <div className="space-y-1 mb-3">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition line-clamp-2">
          {quake.location}
        </h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Kedalaman: <strong className="text-slate-700 dark:text-slate-200">{quake.depth} km</strong></span>
          <span>•</span>
          <span>{quake.latitude.toFixed(2)}°, {quake.longitude.toFixed(2)}°</span>
        </div>
      </div>

      {/* Badges / Alerts / Distance Row */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {quake.tsunami ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
              <Waves className="w-3 h-3 animate-pulse" />
              <span>Cek Tsunami</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              Tidak berpotensi tsunami
            </span>
          )}

          {quake.distanceFromUser && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Navigation className="w-3 h-3" />
              <span>{quake.distanceFromUser.toLocaleString()} km</span>
            </span>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition" />
      </div>
    </div>
  );
};

