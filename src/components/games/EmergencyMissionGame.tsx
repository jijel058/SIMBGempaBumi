import React, { useState, useEffect } from 'react';
import { EMERGENCY_MISSION_STEPS } from '../../data/emergencyMissionData';
import { MissionStep, MissionChoice } from '../../types/games';
import { useApp } from '../../context/AppContext';
import { audio } from '../../services/audioService';
import {
  ShieldAlert,
  Timer,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Zap,
  User,
  Radio,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EmergencyMissionGame: React.FC = () => {
  const { addXp, awardBadge, updateGameScore } = useApp();
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(15);
  const [score, setScore] = useState<number>(0);
  const [healthPoints, setHealthPoints] = useState<number>(100);
  const [selectedChoice, setSelectedChoice] = useState<MissionChoice | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [history, setHistory] = useState<{ stepTitle: string; choice: MissionChoice }[]>([]);

  const currentStep: MissionStep = EMERGENCY_MISSION_STEPS[currentStepIdx] || EMERGENCY_MISSION_STEPS[0];

  useEffect(() => {
    let timer: any = null;
    if (!selectedChoice && !isFinished) {
      timer = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            handleChoice(currentStep.choices[0]);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedChoice, isFinished, currentStep]);

  const handleChoice = (choice: MissionChoice) => {
    setSelectedChoice(choice);
    const nextScore = score + choice.points;
    setScore(nextScore);

    if (choice.isCorrect) {
      audio.playSuccessChime();
    } else {
      audio.playWrongBuzzer();
      setHealthPoints(prev => Math.max(15, prev - 25)); // Reduce HP on dangerous choice
    }

    setHistory(prev => [...prev, { stepTitle: currentStep.scenarioTitle, choice }]);
  };

  const handleNextStep = () => {
    audio.playClick();
    if (currentStepIdx + 1 < EMERGENCY_MISSION_STEPS.length) {
      setCurrentStepIdx(currentStepIdx + 1);
      setSelectedChoice(null);
      setTimerSeconds(15);
    } else {
      setIsFinished(true);
      addXp(Math.max(60, score));
      updateGameScore('emergencyMissionHighscore', score);
      awardBadge('mission_hero');
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    audio.playClick();
    setCurrentStepIdx(0);
    setTimerSeconds(15);
    setScore(0);
    setHealthPoints(100);
    setSelectedChoice(null);
    setIsFinished(false);
    setHistory([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!isFinished ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-earth-surface/95 backdrop-blur-xl border border-slate-200 dark:border-emerald-950/60 shadow-2xl space-y-6">
          {/* Mission Adventure Status HUD */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-emerald-900/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  Petualang Mitigasi SEISMORA
                </span>
                <span className="text-xs font-black text-white">
                  Misi {currentStepIdx + 1} dari {EMERGENCY_MISSION_STEPS.length}
                </span>
              </div>
            </div>

            {/* Health & Score Meters */}
            <div className="flex items-center gap-4 text-xs font-bold">
              {/* HP Meter */}
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <div className="w-20 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      healthPoints > 50 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${healthPoints}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-300">{healthPoints}%</span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-1 text-emerald-400">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{score} Pts</span>
              </div>

              {/* Countdown Timer */}
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                  timerSeconds <= 4
                    ? 'bg-red-600 text-white animate-bounce'
                    : 'bg-slate-800 text-amber-400'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timerSeconds}s</span>
              </div>
            </div>
          </div>

          {/* Scenario Situation */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Skenario Tanggap Darurat</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {currentStep.scenarioTitle}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-earth-card p-4 rounded-2xl border border-slate-200 dark:border-emerald-950/60">
              {currentStep.situation}
            </p>
          </div>

          {/* Choices */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tindakan Darurat yang Anda Ambil:
            </p>
            {currentStep.choices.map(c => {
              const isSelected = selectedChoice?.id === c.id;
              let btnStyle =
                'bg-white dark:bg-earth-card border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500 text-slate-800 dark:text-slate-200';

              if (selectedChoice) {
                if (c.isCorrect) {
                  btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-300';
                } else {
                  btnStyle = 'opacity-40 border-transparent';
                }
              }

              return (
                <button
                  key={c.id}
                  onClick={() => handleChoice(c)}
                  disabled={!!selectedChoice}
                  className={`w-full text-left p-4 rounded-2xl border text-sm transition duration-150 flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-earth-surface flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {c.isCorrect && selectedChoice ? '✓' : '•'}
                  </span>
                  <span className="leading-relaxed">{c.text}</span>
                </button>
              );
            })}
          </div>

          {/* Consequence Feedback Box */}
          {selectedChoice && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 animate-in fade-in duration-150 ${
                selectedChoice.isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-200'
              }`}
            >
              <span className="font-extrabold text-sm block">
                {selectedChoice.isCorrect ? '✓ Hasil Simulasi: TINDAKAN AMAN' : '⚠️ Hasil Simulasi: CEDERA / RISIKO TINGGI'}
              </span>
              <p className="leading-relaxed">{selectedChoice.feedback}</p>
            </div>
          )}

          {/* Next Button */}
          {selectedChoice && (
            <button
              onClick={handleNextStep}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
            >
              <span>Lanjutkan ke Tahap Misi Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-earth-surface/95 backdrop-blur-xl border border-slate-200 dark:border-emerald-950/60 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto shadow-xl">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Emergency Mission Berhasil Tuntas!
            </h3>
            <p className="text-xs text-slate-400">
              Total Skor: <strong className="text-emerald-500 text-lg font-black">{score} Poin</strong> • Sisa Kesehatan: {healthPoints}%
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang Misi</span>
          </button>
        </div>
      )}
    </div>
  );
};
