import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuizGame } from './QuizGame';
import { EmergencyMissionGame } from './EmergencyMissionGame';
import { SafePlaceGame } from './SafePlaceGame';
import { EmergencyBagGame } from './EmergencyBagGame';
import { TectonicPuzzleGame } from './TectonicPuzzleGame';
import { INITIAL_BADGES, saveUserProfile } from '../../services/storageService';
import { audio } from '../../services/audioService';
import {
  Gamepad2,
  Brain,
  ShieldAlert,
  Search,
  Backpack,
  Globe2,
  Trophy,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  User,
  Star,
  Edit3,
  Check,
  Target,
  Compass
} from 'lucide-react';

export const GamesHubView: React.FC = () => {
  const { userProfile, addXp, language } = useApp();
  const [activeGame, setActiveGame] = useState<
    'quiz' | 'mission' | 'safe_place' | 'bag_challenge' | 'puzzle'
  >('mission');

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [playerNameInput, setPlayerNameInput] = useState<string>(userProfile.name);

  const handleSavePlayerName = () => {
    if (playerNameInput.trim()) {
      audio.playClick();
      userProfile.name = playerNameInput.trim();
      saveUserProfile(userProfile);
      setIsEditingName(false);
    }
  };

  // Calculate total stars earned across games
  const totalStars = Math.floor(
    (userProfile.gameScores.quizHighscore +
      userProfile.gameScores.emergencyMissionHighscore +
      userProfile.gameScores.safePlaceHighscore +
      userProfile.gameScores.emergencyBagHighscore +
      userProfile.gameScores.tectonicPuzzleHighscore) / 20
  );

  const gamesList = [
    {
      id: 'mission' as const,
      title: 'Earthquake Survival Mission',
      subtitle: 'Keputusan tanggap darurat bercabang & bar HP',
      icon: ShieldAlert,
      score: userProfile.gameScores.emergencyMissionHighscore,
      badge: 'Petualangan Darurat'
    },
    {
      id: 'safe_place' as const,
      title: 'Find the Safe Zone',
      subtitle: 'Temukan titik berlindung aman di ruangan',
      icon: Target,
      score: userProfile.gameScores.safePlaceHighscore,
      badge: 'Visual Spotting'
    },
    {
      id: 'bag_challenge' as const,
      title: 'Emergency Bag Challenge',
      subtitle: 'Susun tas siaga 72 jam kapasitas 9 kg',
      icon: Backpack,
      score: userProfile.gameScores.emergencyBagHighscore,
      badge: 'Strategi Bertahan'
    },
    {
      id: 'quiz' as const,
      title: 'Earthquake Quiz',
      subtitle: 'Uji wawasan geologi & fenomena seismik',
      icon: Brain,
      score: userProfile.gameScores.quizHighscore,
      badge: 'Tantangan Ilmiah'
    },
    {
      id: 'puzzle' as const,
      title: 'Plate Tectonic Puzzle',
      subtitle: 'Susun lempeng & zona subduksi megathrust',
      icon: Compass,
      score: userProfile.gameScores.tectonicPuzzleHighscore,
      badge: 'Simulasi Lempeng'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Gamification Header Banner with Player Identification Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-earth-surface to-earth-dark text-white shadow-2xl relative overflow-hidden border border-emerald-900/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEISMORA Disaster Adventure Arena</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Pusat Petualangan & Game Mitigasi Gempa
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pelajari tindakan penyelamatan bencana melalui petualangan interaktif yang mendalam. Kumpulkan poin pengalaman (XP), raih bintang kesiapsiagaan, dan tuntaskan seluruh lencana survivor!
            </p>
          </div>

          {/* Interactive Player ID & Star Score Card (Inspired by friendly gamified onboarding) */}
          <div className="bg-black/50 backdrop-blur-xl border border-emerald-500/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 min-w-[280px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-black text-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              {userProfile.level}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  Level {userProfile.level} Survivor
                </span>
                {/* Total Stars Counter */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{totalStars} Bintang</span>
                </div>
              </div>

              {/* Editable Player Name */}
              {!isEditingName ? (
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white">{userProfile.name}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded text-slate-400 hover:text-emerald-400 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="text"
                    value={playerNameInput}
                    onChange={e => setPlayerNameInput(e.target.value)}
                    className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded border border-emerald-500 focus:outline-none w-36"
                  />
                  <button
                    onClick={handleSavePlayerName}
                    className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 pt-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{userProfile.xp} Total XP Akumulasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {gamesList.map(game => {
          const Icon = game.icon;
          const isActive = activeGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => {
                audio.playClick();
                setActiveGame(game.id);
              }}
              className={`p-4 rounded-2xl border text-left transition duration-150 flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-700/25 scale-[1.02]'
                  : 'bg-white dark:bg-earth-surface border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/40 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-earth-card text-slate-400'
                    }`}
                  >
                    {game.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm line-clamp-1">{game.title}</h4>
                  <p
                    className={`text-[11px] mt-0.5 line-clamp-1 ${
                      isActive ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {game.subtitle}
                  </p>
                </div>
              </div>

              <div
                className={`mt-3 pt-2 border-t text-[11px] font-bold flex items-center justify-between ${
                  isActive ? 'border-white/20 text-emerald-100' : 'border-slate-100 dark:border-emerald-950/60 text-slate-500'
                }`}
              >
                <span>Skor Terbaik:</span>
                <span className={isActive ? 'text-white' : 'text-emerald-500 font-extrabold'}>
                  {game.score} Pts
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Component Canvas */}
      <div className="pt-2">
        {activeGame === 'mission' && <EmergencyMissionGame />}
        {activeGame === 'safe_place' && <SafePlaceGame />}
        {activeGame === 'bag_challenge' && <EmergencyBagGame />}
        {activeGame === 'quiz' && <QuizGame />}
        {activeGame === 'puzzle' && <TectonicPuzzleGame />}
      </div>

      {/* Badges & Achievements Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              Lencana Prestasi Kesiapsiagaan Anda
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-500">
            {userProfile.badges.length} / {INITIAL_BADGES.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INITIAL_BADGES.map(badge => {
            const isUnlocked = userProfile.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border text-center space-y-2 transition ${
                  isUnlocked
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-earth-card border-slate-200 dark:border-emerald-950/40 opacity-40 grayscale'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-earth-surface mx-auto flex items-center justify-center text-emerald-500 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-xs block line-clamp-1">{badge.title}</span>
                  <span className="text-[10px] text-slate-400 block line-clamp-2 mt-0.5 leading-snug">
                    {badge.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
