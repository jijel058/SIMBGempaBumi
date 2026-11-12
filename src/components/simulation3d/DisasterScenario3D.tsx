import React, { useState, useEffect } from 'react';
import { SIMULATION_SCENARIOS } from '../../data/simulationData';
import { SimulationScenario } from '../../types/mitigation';
import { useApp } from '../../context/AppContext';
import { audio } from '../../services/audioService';
import {
  Home,
  Building2,
  GraduationCap,
  Trees,
  Car,
  Play,
  RotateCcw,
  Award,
  Timer,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DisasterScenario3D: React.FC = () => {
  const { addXp, awardBadge } = useApp();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sim-home');
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(12);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [actionHistory, setActionHistory] = useState<{
    prompt: string;
    chosenText: string;
    isBest: boolean;
    consequence: string;
    points: number;
  }[]>([]);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const scenario: SimulationScenario =
    SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];

  const currentPhase = scenario.phases[currentPhaseIndex];

  // Start Simulation
  const handleStart = () => {
    setSimulationState('running');
    setCurrentPhaseIndex(0);
    setTotalScore(0);
    setActionHistory([]);
    setTimerSeconds(12);
    setIsShaking(true);
    audio.playEarthquakeRumble(6, 1.2);
  };

  // Timer countdown during simulation
  useEffect(() => {
    let interval: any = null;
    if (simulationState === 'running') {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Time out: default to first option
            handleOptionSelect(currentPhase.options[0]);
            return 12;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulationState, currentPhaseIndex, currentPhase]);

  // Handle Option Click
  const handleOptionSelect = (option: any) => {
    audio.playClick();
    if (option.isBest) {
      audio.playSuccessChime();
    } else {
      audio.playWrongBuzzer();
    }

    const nextScore = totalScore + option.points;
    setTotalScore(nextScore);

    const newHistory = [
      ...actionHistory,
      {
        prompt: currentPhase.prompt,
        chosenText: option.text,
        isBest: option.isBest,
        consequence: option.consequence,
        points: option.points
      }
    ];
    setActionHistory(newHistory);

    // Proceed to next phase or finish
    if (currentPhaseIndex + 1 < scenario.phases.length) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
      setTimerSeconds(12);
    } else {
      // Completed simulation
      setSimulationState('completed');
      setIsShaking(false);
      addXp(Math.max(50, nextScore));

      if (nextScore >= 90) {
        awardBadge('mission_hero');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'highrise': return Building2;
      case 'school': return GraduationCap;
      case 'outdoor': return Trees;
      case 'vehicle': return Car;
      default: return Home;
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenario Selector Carousel Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {SIMULATION_SCENARIOS.map(sc => {
          const Icon = getScenarioIcon(sc.locationType);
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => {
                audio.playClick();
                setSelectedScenarioId(sc.id);
                setSimulationState('idle');
                setIsShaking(false);
              }}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold transition ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-700/20'
                  : 'bg-white dark:bg-earth-surface border-slate-200 dark:border-emerald-950/60 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Viewport Container */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-950/60 bg-gradient-to-b from-earth-card to-earth-dark shadow-2xl p-6 sm:p-8">
        {/* Seismic Status Border Overlay (Static, without bouncing the question box) */}
        {isShaking && (
          <div className="absolute inset-0 bg-red-500/5 pointer-events-none border border-red-500/25 rounded-2xl z-0" />
        )}

        {/* State 1: IDLE / BRIEFING */}
        {simulationState === 'idle' && (
          <div className="relative z-10 max-w-2xl mx-auto text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              {React.createElement(getScenarioIcon(scenario.locationType), { className: 'w-8 h-8' })}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {scenario.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
                {scenario.title}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {scenario.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-emerald-900/40 text-left text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-emerald-400">Kondisi Awal Lapangan:</p>
              <p className="italic">{scenario.initialSituation}</p>
              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                <span>Durasi Guncangan: ~{scenario.shakingDurationSec} detik</span>
                <span>Jumlah Tahapan Keputusan: {scenario.phases.length} fase</span>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Mulai Simulasi Tanggap Darurat</span>
            </button>
          </div>
        )}

        {/* State 2: RUNNING / ACTIVE DECISION PHASE */}
        {simulationState === 'running' && currentPhase && (
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Top Status Header */}
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  FASE {currentPhaseIndex + 1} DARI {scenario.phases.length}: {currentPhase.phase.toUpperCase()}
                </span>
              </div>

              {/* Decision Countdown Timer */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black ${
                  timerSeconds <= 4
                    ? 'bg-red-500 text-white'
                    : 'bg-black/50 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>{timerSeconds} detik tersisa</span>
              </div>
            </div>

            {/* Scenario Prompt */}
            <div className="p-5 rounded-xl bg-black/60 border border-emerald-500/30 backdrop-blur-md">
              <p className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentPhase.prompt}
              </p>
            </div>

            {/* Action Decision Choices */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pilih Tindakan Cepat Anda:
              </p>
              {currentPhase.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(opt)}
                  className="w-full text-left p-4 rounded-xl border border-slate-700/60 bg-white/5 hover:bg-emerald-500/15 hover:border-emerald-500/50 text-slate-200 hover:text-white transition duration-150 flex items-start gap-3 group"
                >
                  <span className="w-6 h-6 rounded-lg bg-black/50 border border-slate-600 group-hover:border-emerald-500 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:text-emerald-400 flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* State 3: COMPLETED / EVALUATION REPORT */}
        {simulationState === 'completed' && (
          <div className="relative z-10 max-w-2xl mx-auto space-y-6 py-4 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Evaluasi Simulasi Selesai</h3>
              <p className="text-xs text-slate-300">
                Skor Anda: <strong className="text-emerald-400 text-lg font-black">{totalScore} Poin</strong> (XP telah ditambahkan ke akun Anda)
              </p>
            </div>

            {/* Decision Analysis */}
            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
              {actionHistory.map((h, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                    h.isBest
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-red-950/30 border-red-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      {h.isBest ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={h.isBest ? 'text-emerald-300' : 'text-red-300'}>
                        {h.isBest ? 'Tindakan Tepat (+Points)' : 'Tindakan Berisiko'}
                      </span>
                    </span>
                    <span className="text-slate-400">{h.points} Poin</span>
                  </div>
                  <p className="text-slate-200 font-medium">{h.chosenText}</p>
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-700/40">
                    Konsekuensi: {h.consequence}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Skenario Ini</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

