import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_BADGES } from '../../services/storageService';
import { audio } from '../../services/audioService';
import {
  Info,
  User,
  Trophy,
  Bell,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
  Flame,
  Award,
  ChevronDown,
  CheckCircle2,
  Mail,
  Heart
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { userProfile, language } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah gempa bumi dapat diprediksi tanggal dan jamnya?',
      a: 'TIDAK BISA. Hingga saat ini, tidak ada institusi ilmiah di dunia maupun teknologi mana pun yang mampu memprediksi waktu pasti terjadinya gempa bumi. Yang ada adalah sistem peringatan dini (Early Warning System) yang mendeteksi gelombang primer (P-wave) beberapa detik sebelum gelombang perusak (S-wave) tiba.'
    },
    {
      q: 'Mengapa Indonesia sangat sering mengalami gempa bumi?',
      a: 'Indonesia terletak di pertemuan tiga lempeng tektonik utama dunia yang aktif bergerak: Lempeng Eurasia di utara, Lempeng Indo-Australia di selatan, dan Lempeng Pasifik di timur, serta dikelilingi oleh jalur Cincin Api Pasifik (Pacific Ring of Fire).'
    },
    {
      q: 'Apa perbedaan antara Magnitudo dan Skala MMI?',
      a: 'Magnitudo mengukur total besaran energi pelepasan pada sumber gempa (bersifat tunggal dan mutlak), sedangkan Skala MMI mengukur intensitas getaran dan tingkat kerusakan yang dirasakan di suatu lokasi tertentu yang bervariasi tergantung jarak episentrum.'
    },
    {
      q: 'Kapan gempa bumi berpotensi menimbulkan tsunami?',
      a: 'Secara umum, tsunami dipicu oleh gempa bumi yang memenuhi kriteria: episentrum berada di dasar laut, kedalaman hiposentrum dangkal (< 60 km), magnitudo besar (M ≥ 7.0), dan memiliki mekanisme sesar vertikal (naik atau turun) yang mengangkat atau menurunkan kolom massa air laut.'
    },
    {
      q: 'Dari mana SEISMORA memperoleh data gempa secara real-time?',
      a: 'SEISMORA terhubung langsung secara terprogram dengan API resmi USGS Earthquake Hazards Program (Amerika Serikat) dan BMKG Open Data InaTEWS (Indonesia). Data disinkronkan otomatis tanpa manipulasi.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-in fade-in duration-200">
      {/* 1. USER DASHBOARD PROFILE */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-emerald-950/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              {userProfile.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {userProfile.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Level {userProfile.level} Resilient
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{userProfile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Pengalaman</span>
              <span className="text-lg font-black text-emerald-500">{userProfile.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60">
            <span className="text-xs text-slate-400 block">Kuis Terbaik</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {userProfile.gameScores.quizHighscore} Pts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60">
            <span className="text-xs text-slate-400 block">Emergency Mission</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {userProfile.gameScores.emergencyMissionHighscore} Pts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60">
            <span className="text-xs text-slate-400 block">Tas Siaga Score</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {userProfile.gameScores.emergencyBagHighscore} Pts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60">
            <span className="text-xs text-slate-400 block">Checklist Selesai</span>
            <span className="text-xl font-black text-emerald-500">
              {userProfile.completedChecklists.length} Item
            </span>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SEISMORA PLATFORM */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-500" />
          <span>Tentang Platform SEISMORA</span>
        </h3>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>SEISMORA</strong> adalah platform digital komprehensif berskala global yang memadukan pemantauan aktivitas gempa bumi secara real-time, visualisasi bumi 3D interaktif, modul edukasi kebumian, serta gamifikasi mitigasi bencana.
          </p>
          <p>
            Terinspirasi dari keandalan dan otoritas sistem pemantauan BMKG (Badan Meteorologi, Klimatologi, dan Geofisika), SEISMORA menghadirkan antarmuka modern yang bersih, ramah pengguna, dan berestetika hijau emerald serta sage yang nyaman dipandang.
          </p>
          <p>
            Platform ini dirancang untuk pelajar, mahasiswa, peneliti, dan masyarakat umum agar tidak sekadar melihat angka magnitudo, melainkan benar-benar memahami risiko geologis di sekitarnya dan tahu langkah penyelamatan diri yang tepat.
          </p>
        </div>
      </section>

      {/* 3. FAQ ACCORDION */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-500" />
          <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-earth-surface overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => {
                    audio.playClick();
                    setOpenFaqIndex(isOpen ? null : index);
                  }}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 text-sm font-bold text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-emerald-950/60 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

