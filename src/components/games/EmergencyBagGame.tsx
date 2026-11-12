import React, { useState } from 'react';
import { BAG_CHALLENGE_ITEMS } from '../../data/bagChallengeData';
import { BagItem } from '../../types/games';
import { useApp } from '../../context/AppContext';
import { audio } from '../../services/audioService';
import {
  Backpack,
  Plus,
  Minus,
  RotateCcw,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EmergencyBagGame: React.FC = () => {
  const { addXp, awardBadge, updateGameScore } = useApp();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const MAX_WEIGHT_KG = 9.0;

  const currentWeight = selectedItemIds.reduce((sum, id) => {
    const item = BAG_CHALLENGE_ITEMS.find(i => i.id === id);
    return sum + (item ? item.weightKg : 0);
  }, 0);

  const toggleItem = (item: BagItem) => {
    if (isEvaluated) return;
    audio.playClick();

    if (selectedItemIds.includes(item.id)) {
      setSelectedItemIds(prev => prev.filter(id => id !== item.id));
    } else {
      if (currentWeight + item.weightKg > MAX_WEIGHT_KG) {
        audio.playWrongBuzzer();
        alert(`Beban tas melebihi kapasitas maksimum (${MAX_WEIGHT_KG} kg)! Keluarkan barang lain terlebih dahulu.`);
        return;
      }
      setSelectedItemIds(prev => [...prev, item.id]);
    }
  };

  const handleEvaluate = () => {
    audio.playClick();
    let score = 0;

    selectedItemIds.forEach(id => {
      const item = BAG_CHALLENGE_ITEMS.find(i => i.id === id);
      if (item?.isEssential) score += 10;
      else score -= 15; // Penalty for useless heavy item
    });

    // Bonus if packed key essentials without overloading
    const essentialsPacked = selectedItemIds.filter(id => {
      const it = BAG_CHALLENGE_ITEMS.find(i => i.id === id);
      return it?.isEssential;
    }).length;

    if (essentialsPacked >= 8 && currentWeight <= MAX_WEIGHT_KG) {
      score += 25;
    }

    const clampedScore = Math.max(0, score);
    setFinalScore(clampedScore);
    setIsEvaluated(true);
    addXp(clampedScore);
    updateGameScore('emergencyBagHighscore', clampedScore);

    if (clampedScore >= 80) {
      awardBadge('perfect_bag');
      audio.playSuccessChime();
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    }
  };

  const handleReset = () => {
    audio.playClick();
    setSelectedItemIds([]);
    setIsEvaluated(false);
    setFinalScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Backpack Status Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
            <Backpack className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Tantangan Tas Siaga Bencana (TSB)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih perbekalan hidup 72 jam pertama tanpa melebihi batas beban tas!
            </p>
          </div>
        </div>

        {/* Weight Meter */}
        <div className="space-y-1 sm:text-right min-w-[160px]">
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold">
            <Scale className="w-4 h-4 text-slate-400" />
            <span className={currentWeight > MAX_WEIGHT_KG ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}>
              Beban: {currentWeight.toFixed(1)} / {MAX_WEIGHT_KG} kg
            </span>
          </div>
          <div className="w-full sm:w-44 h-2.5 rounded-full bg-slate-100 dark:bg-earth-surface overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                currentWeight > 7.5 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (currentWeight / MAX_WEIGHT_KG) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Item Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BAG_CHALLENGE_ITEMS.map(item => {
          const isSelected = selectedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item)}
              className={`p-4 rounded-xl border transition cursor-pointer select-none flex items-start justify-between gap-2 ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/60 shadow-sm'
                  : 'bg-white dark:bg-earth-surface border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/30'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block line-clamp-1">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Berat: <strong>{item.weightKg} kg</strong>
                </span>

                {isEvaluated && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 leading-snug">
                    {item.explanation}
                  </p>
                )}
              </div>

              <button
                className={`p-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-earth-dark text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isSelected ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Action / Evaluation Footer Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-lg flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
          {selectedItemIds.length} Barang Terpilih ke Dalam Tas
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-earth-surface hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kosongkan Tas</span>
          </button>

          {!isEvaluated ? (
            <button
              onClick={handleEvaluate}
              disabled={selectedItemIds.length === 0}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md"
            >
              Evaluasi Isi Tas Saya
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Skor: <strong className="text-emerald-500 text-base">{finalScore} Poin</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

