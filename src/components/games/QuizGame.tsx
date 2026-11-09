import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { QuizQuestion } from '../../types/games';
import { useApp } from '../../context/AppContext';
import { audio } from '../../services/audioService';
import {
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizGame: React.FC = () => {
  const { addXp, awardBadge, updateGameScore } = useApp();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Filter questions by difficulty
  const questions = QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
  const currentQ: QuizQuestion = questions[currentIndex] || questions[0];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      audio.playSuccessChime();
      setScore(prev => prev + currentQ.points);
    } else {
      audio.playWrongBuzzer();
    }
  };

  const handleNext = () => {
    audio.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedOption === currentQ.correctIndex ? currentQ.points : 0);
      addXp(finalScore);
      awardBadge('first_quiz');
      updateGameScore('quizHighscore', finalScore);

      if (finalScore >= 60) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestart = (newDiff?: 'easy' | 'medium' | 'hard') => {
    audio.playClick();
    if (newDiff) setDifficulty(newDiff);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Difficulty Switcher */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Pilih Tingkat Kesulitan:
        </span>
        <div className="flex gap-1.5">
          {(['easy', 'medium', 'hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => handleRestart(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                difficulty === diff
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {diff === 'easy' ? 'Mudah' : diff === 'medium' ? 'Sedang' : 'Sulit'}
            </button>
          ))}
        </div>
      </div>

      {!isFinished ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-xl space-y-6">
          {/* Progress & Score */}
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Pertanyaan {currentIndex + 1} dari {questions.length}
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              Skor: <strong className="text-emerald-500 text-sm">{score}</strong> Poin
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-earth-surface overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Kategori: {currentQ.category}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let optStyle =
                'bg-slate-50 dark:bg-earth-surface border-slate-200 dark:border-emerald-950/60 text-slate-800 dark:text-slate-200 hover:border-emerald-500';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  optStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                } else if (idx === selectedOption) {
                  optStyle = 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-300';
                } else {
                  optStyle = 'opacity-40 border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition flex items-center justify-between ${optStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-earth-dark flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 animate-in fade-in duration-150">
              <span className="font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-500" />
                <span>Pembahasan Ilmiah:</span>
              </span>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
            >
              <span>{currentIndex + 1 < questions.length ? 'Pertanyaan Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="p-8 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-2xl text-center space-y-6 animate-in fade-in duration-200">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-xl">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Kuis Selesai!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kamu berhasil menyelesaikan kuis tingkat {difficulty === 'easy' ? 'Mudah' : difficulty === 'medium' ? 'Sedang' : 'Sulit'}.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 max-w-sm mx-auto">
            <span className="text-xs text-slate-400 block font-semibold uppercase">Total Skor Diperoleh:</span>
            <span className="text-4xl font-black text-emerald-500 block my-1">{score} Poin</span>
            <span className="text-xs text-slate-500 block font-medium">+{score} XP telah ditambahkan ke profil Anda!</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleRestart()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Lagi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

