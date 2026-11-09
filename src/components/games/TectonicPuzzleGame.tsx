import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { audio } from '../../services/audioService';
import {
  Globe2,
  CheckCircle2,
  RotateCcw,
  Award,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PuzzleSlot {
  slotId: string;
  regionName: string;
  expectedPlateId: string;
  boundaryDescription: string;
}

const PUZZLE_SLOTS: PuzzleSlot[] = [
  {
    slotId: 'slot-indo',
    regionName: 'Wilayah Samudra Hindia & Australia (Palung Jawa)',
    expectedPlateId: 'plate-indo',
    boundaryDescription: 'Subduksi menunjam ke bawah Lempeng Eurasia membentuk Megathrust Sunda.'
  },
  {
    slotId: 'slot-eurasia',
    regionName: 'Benua Eropa, Asia Daratan & Paparan Sunda',
    expectedPlateId: 'plate-eurasia',
    boundaryDescription: 'Lempeng benua yang menampung kepulauan Indonesia bagian barat.'
  },
  {
    slotId: 'slot-pacific',
    regionName: 'Samudra Pasifik Luas (Ring of Fire)',
    expectedPlateId: 'plate-pacific',
    boundaryDescription: 'Lempeng samudra terbesar di bumi dengan aktivitas cincin api aktif.'
  },
  {
    slotId: 'slot-sanandreas',
    regionName: 'Pesisir Barat California, Amerika Utara',
    expectedPlateId: 'plate-northam',
    boundaryDescription: 'Batas lempeng transform geser mendatar (Sesar San Andreas).'
  }
];

const PUZZLE_PIECES = [
  {
    id: 'plate-pacific',
    name: 'Lempeng Pasifik (Pacific Plate)',
    type: 'Kerak Samudra (Oceanic)',
    speed: '~8 cm/tahun barat-laut'
  },
  {
    id: 'plate-indo',
    name: 'Lempeng Indo-Australia',
    type: 'Kerak Samudra & Benua',
    speed: '~7 cm/tahun utara-timur laut'
  },
  {
    id: 'plate-eurasia',
    name: 'Lempeng Eurasia (Eurasian Plate)',
    type: 'Kerak Benua (Continental)',
    speed: '~2 cm/tahun relatif lambat'
  },
  {
    id: 'plate-northam',
    name: 'Lempeng Amerika Utara',
    type: 'Kerak Benua & Samudra',
    speed: '~2.5 cm/tahun barat daya'
  }
];

export const TectonicPuzzleGame: React.FC = () => {
  const { addXp, awardBadge, updateGameScore } = useApp();
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<{ [slotId: string]: string }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSlotClick = (slot: PuzzleSlot) => {
    if (!selectedPieceId || assignments[slot.slotId]) return;

    audio.playClick();
    if (selectedPieceId === slot.expectedPlateId) {
      audio.playSuccessChime();
      const updated = { ...assignments, [slot.slotId]: selectedPieceId };
      setAssignments(updated);
      setSelectedPieceId(null);

      // Check if all slots matched
      if (Object.keys(updated).length === PUZZLE_SLOTS.length) {
        setIsCompleted(true);
        addXp(100);
        updateGameScore('tectonicPuzzleHighscore', 100);
        awardBadge('tectonic_master');
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      }
    } else {
      audio.playWrongBuzzer();
      alert('Lempeng tersebut tidak cocok dengan zona tektonik ini. Pelajari arah penunjaman dan batas lempengnya!');
    }
  };

  const handleReset = () => {
    audio.playClick();
    setAssignments({});
    setSelectedPieceId(null);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Puzzle Lempeng Tektonik Global
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pilih lempeng tektonik di bawah, lalu klik zona geologis yang sesuai di peta tektonik bumi!
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
            {Object.keys(assignments).length} / {PUZZLE_SLOTS.length} Lempeng Terpasang
          </span>
        </div>

        {/* Geological Target Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PUZZLE_SLOTS.map(slot => {
            const assignedPieceId = assignments[slot.slotId];
            const piece = PUZZLE_PIECES.find(p => p.id === assignedPieceId);

            return (
              <div
                key={slot.slotId}
                onClick={() => handleSlotClick(slot)}
                className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  assignedPieceId
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : selectedPieceId
                    ? 'border-dashed border-emerald-500/60 bg-emerald-500/5 hover:bg-emerald-500/15'
                    : 'border-dashed border-slate-300 dark:border-emerald-950/80 bg-slate-50 dark:bg-earth-surface'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {slot.regionName}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {slot.boundaryDescription}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-emerald-950/60 flex items-center justify-between text-xs">
                  {assignedPieceId ? (
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{piece?.name}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      {selectedPieceId ? 'Klik untuk pasang di sini' : 'Belum terpasang'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Available Plate Pieces Carousel */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-emerald-950/60">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Potongan Lempeng Tersedia (Pilih Salah Satu):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PUZZLE_PIECES.map(piece => {
              const isAssigned = Object.values(assignments).includes(piece.id);
              const isSelected = selectedPieceId === piece.id;

              return (
                <button
                  key={piece.id}
                  onClick={() => {
                    if (isAssigned) return;
                    audio.playClick();
                    setSelectedPieceId(isSelected ? null : piece.id);
                  }}
                  disabled={isAssigned}
                  className={`p-3 rounded-xl border text-left transition ${
                    isAssigned
                      ? 'opacity-30 border-slate-200 bg-slate-100 dark:bg-earth-dark cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-105'
                      : 'bg-white dark:bg-earth-surface border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500'
                  }`}
                >
                  <span className="text-xs font-extrabold block line-clamp-1">{piece.name}</span>
                  <span className="text-[10px] opacity-80 block mt-0.5">{piece.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-earth-surface hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mulai Ulang Puzzle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

