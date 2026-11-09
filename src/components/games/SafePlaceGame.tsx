import React, { useState } from 'react';
import { SAFE_PLACE_ROOMS } from '../../data/safePlaceData';
import { SafePlaceRoom, SafePlaceHotspot } from '../../types/games';
import { useApp } from '../../context/AppContext';
import { audio } from '../../services/audioService';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SafePlaceGame: React.FC = () => {
  const { addXp, awardBadge, updateGameScore } = useApp();
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number>(0);
  const [discoveredSpots, setDiscoveredSpots] = useState<{ [id: string]: boolean }>({});
  const [score, setScore] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<SafePlaceHotspot | null>(null);

  const room: SafePlaceRoom = SAFE_PLACE_ROOMS[selectedRoomIdx] || SAFE_PLACE_ROOMS[0];

  const handleSpotClick = (spot: SafePlaceHotspot) => {
    if (discoveredSpots[spot.id]) return;

    audio.playClick();
    if (spot.isSafe) {
      audio.playSuccessChime();
    } else {
      audio.playWrongBuzzer();
    }

    const nextScore = Math.max(0, score + spot.scoreImpact);
    setScore(nextScore);
    setLastFeedback(spot);

    const updated = { ...discoveredSpots, [spot.id]: true };
    setDiscoveredSpots(updated);

    // Check if all spots in room found
    if (Object.keys(updated).length === room.hotspots.length) {
      addXp(Math.max(50, nextScore));
      updateGameScore('safePlaceHighscore', nextScore);
      awardBadge('safe_spotter');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleReset = (roomIdx?: number) => {
    audio.playClick();
    if (typeof roomIdx === 'number') setSelectedRoomIdx(roomIdx);
    setDiscoveredSpots({});
    setScore(0);
    setLastFeedback(null);
  };

  const remainingSafeSpots = room.hotspots.filter(h => h.isSafe && !discoveredSpots[h.id]).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Room Tabs */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-sm">
        <div className="flex gap-2">
          {SAFE_PLACE_ROOMS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => handleReset(i)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedRoomIdx === i
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Skor: <strong className="text-emerald-500 text-sm">{score}</strong> Poin
        </div>
      </div>

      {/* Main Room Canvas with Interactive Hotspots */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{room.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{room.description}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {remainingSafeSpots} Titik Aman Belum Ditemukan
          </span>
        </div>

        {/* Room Illustration Arena */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-slate-100 dark:from-earth-dark to-slate-200 dark:to-earth-surface border-2 border-dashed border-emerald-500/30 overflow-hidden select-none">
          {/* Decorative Room Visual Background Elements */}
          <div className="absolute inset-x-8 top-12 h-0.5 bg-slate-300 dark:bg-emerald-950/80" />
          <div className="absolute left-1/2 top-12 bottom-0 w-0.5 bg-slate-300 dark:bg-emerald-950/80" />

          {/* Hotspots */}
          {room.hotspots.map(spot => {
            const isDiscovered = !!discoveredSpots[spot.id];
            return (
              <div
                key={spot.id}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                {!isDiscovered ? (
                  <button
                    onClick={() => handleSpotClick(spot)}
                    className="relative group p-2 rounded-full bg-white dark:bg-earth-surface border-2 border-emerald-500 shadow-lg hover:scale-125 transition-transform duration-150 animate-pulse"
                  >
                    <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-20">
                      Periksa Objek Ini?
                    </span>
                  </button>
                ) : (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md animate-in zoom-in-75 duration-150 ${
                      spot.isSafe
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-red-500 text-white border-red-400'
                    }`}
                  >
                    {spot.isSafe ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{spot.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback Card */}
        {lastFeedback && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-1 animate-in fade-in duration-150 ${
              lastFeedback.isSafe
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {lastFeedback.isSafe ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                <span>{lastFeedback.name}: {lastFeedback.isSafe ? 'ZONA AMAN TERLINDUNG (+Points)' : 'ZONA BAHAYA RUNTUHAN'}</span>
              </span>
              <span>{lastFeedback.scoreImpact > 0 ? `+${lastFeedback.scoreImpact}` : lastFeedback.scoreImpact} Poin</span>
            </div>
            <p className="leading-relaxed">{lastFeedback.reason}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => handleReset()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-earth-surface hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Ruangan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

