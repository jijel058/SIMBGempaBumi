import React, { useState } from 'react';
import { SAFE_PLACE_ROOMS } from '../../data/safePlaceData';
import { SafePlaceRoom, SafePlaceHotspot } from '../../types/games';
import { useApp } from '../../context/AppContext';
import { audio } from '../../services/audioService';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle
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

  const renderRoomIllustration = (theme: string) => {
    if (theme === 'living-room') {
      return (
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="lrWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="lrFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D6C5B3" />
              <stop offset="100%" stopColor="#B89F86" />
            </linearGradient>
            <linearGradient id="lrSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>

          {/* Ceiling */}
          <polygon points="0,0 1000,0 920,55 80,55" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          {/* Back Wall */}
          <rect x="80" y="55" width="840" height="265" fill="url(#lrWall)" stroke="#CBD5E1" strokeWidth="2" />
          {/* Left Perspective Wall */}
          <polygon points="0,0 80,55 80,320 0,500" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
          {/* Right Perspective Wall */}
          <polygon points="1000,0 920,55 920,320 1000,500" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
          {/* Floor */}
          <polygon points="80,320 920,320 1000,500 0,500" fill="url(#lrFloor)" stroke="#94A3B8" strokeWidth="2" />

          {/* Floor Wood Planks */}
          <line x1="200" y1="320" x2="120" y2="500" stroke="#A68A71" strokeWidth="1.5" opacity="0.5" />
          <line x1="360" y1="320" x2="310" y2="500" stroke="#A68A71" strokeWidth="1.5" opacity="0.5" />
          <line x1="500" y1="320" x2="500" y2="500" stroke="#A68A71" strokeWidth="1.5" opacity="0.5" />
          <line x1="650" y1="320" x2="700" y2="500" stroke="#A68A71" strokeWidth="1.5" opacity="0.5" />
          <line x1="800" y1="320" x2="880" y2="500" stroke="#A68A71" strokeWidth="1.5" opacity="0.5" />

          {/* Baseboard */}
          <rect x="80" y="310" width="840" height="10" fill="#94A3B8" />

          {/* 1. INNER STRUCTURAL CORNER & PILLAR (x=240, y=325 -> 24%, 65%) */}
          <rect x="222" y="55" width="38" height="265" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
          <polygon points="210,320 275,320 285,370 200,370" fill="#10B981" fillOpacity="0.18" stroke="#059669" strokeWidth="1.5" strokeDasharray="5 3" />
          <rect x="212" y="372" width="66" height="16" rx="4" fill="#065F46" />
          <text x="245" y="383" textAnchor="middle" fill="#ECFDF5" fontSize="8.5" fontWeight="bold">
            SUDUT STRUKTUR
          </text>

          {/* 2. TALL BOOKSHELF WITHOUT WALL BRACKET (x=180, y=210 -> 18%, 42%) */}
          <g>
            <rect x="115" y="95" width="102" height="225" rx="3" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
            <rect x="123" y="103" width="86" height="209" fill="#92400E" />
            {/* Shelves */}
            {[140, 182, 224, 266].map((sy, idx) => (
              <rect key={idx} x="120" y={sy} width="92" height="6" fill="#451A03" />
            ))}
            {/* Books & Heavy Vase on Top */}
            <rect x="128" y="112" width="12" height="28" fill="#EF4444" />
            <rect x="142" y="115" width="10" height="25" fill="#3B82F6" />
            <rect x="154" y="110" width="14" height="30" fill="#10B981" />
            <rect x="180" y="114" width="18" height="26" rx="6" fill="#F59E0B" />
            <rect x="128" y="152" width="14" height="30" fill="#8B5CF6" />
            <rect x="144" y="156" width="12" height="26" fill="#EC4899" />
            <rect x="158" y="150" width="15" height="32" fill="#14B8A6" />
            <rect x="176" y="154" width="12" height="28" fill="#F97316" />
            <rect x="130" y="194" width="16" height="30" fill="#06B6D4" />
            <rect x="148" y="198" width="12" height="26" fill="#EAB308" />
            <rect x="165" y="192" width="22" height="32" fill="#64748B" />
            <rect x="130" y="238" width="25" height="28" fill="#CBD5E1" />
            <rect x="160" y="236" width="35" height="30" fill="#94A3B8" />
            <rect x="124" y="76" width="84" height="15" rx="4" fill="#7F1D1D" />
            <text x="166" y="87" textAnchor="middle" fill="#FEF2F2" fontSize="8.5" fontWeight="bold">
              RAK BUKU TINGGI
            </text>
          </g>

          {/* Wall Framed Painting (Left-Center) */}
          <rect x="315" y="125" width="95" height="65" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="3" />
          <rect x="322" y="132" width="81" height="51" fill="#BAE6FD" />
          <polygon points="322,183 350,152 375,183" fill="#059669" />
          <polygon points="355,183 382,146 403,183" fill="#047857" />

          {/* 3. CRYSTAL CHANDELIER (x=500, y=100 -> 50%, 20%) */}
          <g>
            <line x1="500" y1="25" x2="500" y2="72" stroke="#475569" strokeWidth="4" />
            <ellipse cx="500" cy="25" rx="22" ry="6" fill="#64748B" />
            <path d="M445,95 Q500,65 555,95" fill="none" stroke="#D97706" strokeWidth="4" />
            <ellipse cx="500" cy="95" rx="58" ry="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
            {[452, 476, 500, 524, 548].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy="84" r="7" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
                <polygon points={`${cx - 5},108 ${cx},124 ${cx + 5},108`} fill="#38BDF8" opacity="0.85" />
              </g>
            ))}
            <rect x="442" y="128" width="116" height="15" rx="4" fill="#7F1D1D" />
            <text x="500" y="139" textAnchor="middle" fill="#FEF2F2" fontSize="8.5" fontWeight="bold">
              LAMPU GANTUNG KRISTAL
            </text>
          </g>

          {/* Center Living Room Rug */}
          <ellipse cx="485" cy="390" rx="185" ry="52" fill="#0F766E" opacity="0.22" stroke="#0D9488" strokeWidth="2" />

          {/* 4. STURDY SOLID OAK TABLE (x=480, y=340 -> 48%, 68%) */}
          <g>
            {/* Left & Right Chairs */}
            <rect x="335" y="275" width="38" height="82" rx="4" fill="#64748B" />
            <rect x="335" y="325" width="52" height="12" rx="3" fill="#475569" />
            <rect x="590" y="275" width="38" height="82" rx="4" fill="#64748B" />
            <rect x="573" y="325" width="52" height="12" rx="3" fill="#475569" />

            {/* Safe Zone Highlight Under Table */}
            <rect
              x="395"
              y="305"
              width="170"
              height="82"
              rx="8"
              fill="#10B981"
              fillOpacity="0.2"
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Table Top & Thick Oak Legs */}
            <polygon points="365,288 595,288 615,308 345,308" fill="#92400E" stroke="#451A03" strokeWidth="2" />
            <rect x="345" y="308" width="270" height="14" rx="2" fill="#78350F" />
            {/* 4 Legs */}
            <rect x="362" y="322" width="16" height="78" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
            <rect x="582" y="322" width="16" height="78" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
            <rect x="392" y="322" width="12" height="62" fill="#451A03" />
            <rect x="556" y="322" width="12" height="62" fill="#451A03" />

            <rect x="415" y="395" width="130" height="17" rx="4" fill="#065F46" />
            <text x="480" y="407" textAnchor="middle" fill="#ECFDF5" fontSize="9" fontWeight="bold">
              KOLONG MEJA KAYU KOKOH
            </text>
          </g>

          {/* 5. LARGE GLASS WINDOW (x=820, y=175 -> 82%, 35%) */}
          <g>
            <rect x="720" y="88" width="180" height="175" rx="4" fill="url(#lrSky)" stroke="#475569" strokeWidth="6" />
            {/* Outdoor Trees Silhouette */}
            <circle cx="765" cy="235" r="28" fill="#22C55E" opacity="0.7" />
            <circle cx="805" cy="228" r="35" fill="#16A34A" opacity="0.75" />
            <circle cx="855" cy="238" r="25" fill="#15803D" opacity="0.7" />
            {/* Window Mullions */}
            <line x1="810" y1="88" x2="810" y2="263" stroke="#475569" strokeWidth="5" />
            <line x1="720" y1="175" x2="900" y2="175" stroke="#475569" strokeWidth="5" />
            {/* Glass Glare Lines */}
            <line x1="738" y1="108" x2="768" y2="152" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
            <line x1="830" y1="108" x2="860" y2="152" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
            {/* Curtains */}
            <path d="M708,82 L732,82 L726,272 L704,272 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M888,82 L912,82 L916,272 L894,272 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
            <rect x="752" y="270" width="116" height="16" rx="4" fill="#7F1D1D" />
            <text x="810" y="281" textAnchor="middle" fill="#FEF2F2" fontSize="8.5" fontWeight="bold">
              JENDELA KACA BESAR
            </text>
          </g>
        </svg>
      );
    }

    // Classroom Illustration ('classroom')
    return (
      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <linearGradient id="crWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="crFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* Ceiling */}
        <polygon points="0,0 1000,0 920,60 80,60" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
        {/* Back Classroom Wall */}
        <rect x="80" y="60" width="840" height="260" fill="url(#crWall)" stroke="#CBD5E1" strokeWidth="2" />
        {/* Left & Right Perspective Walls */}
        <polygon points="0,0 80,60 80,320 0,500" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
        <polygon points="1000,0 920,60 920,320 1000,500" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
        {/* Tiled Floor */}
        <polygon points="80,320 920,320 1000,500 0,500" fill="url(#crFloor)" stroke="#64748B" strokeWidth="2" />

        {/* Classroom Chalkboard / Greenboard */}
        <rect x="255" y="115" width="380" height="135" rx="4" fill="#064E3B" stroke="#78350F" strokeWidth="7" />
        <text x="445" y="155" textAnchor="middle" fill="#A7F3D0" fontSize="13" fontWeight="bold" opacity="0.85">
          MODUL GEOLOGI &amp; MITIGasi GEMPA BUMI
        </text>
        <text x="445" y="182" textAnchor="middle" fill="#ECFDF5" fontSize="11" opacity="0.75">
          DROP • COVER • HOLD ON SAAT GUNCANGAN
        </text>
        <line x1="310" y1="205" x2="580" y2="205" stroke="#34D399" strokeWidth="1.5" opacity="0.5" />

        {/* 1. MAIN REINFORCED CONCRETE PILLAR (x=160, y=275 -> 16%, 55%) */}
        <g>
          <rect x="115" y="60" width="88" height="275" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
          <rect x="123" y="60" width="72" height="275" fill="#CBD5E1" />
          <rect
            x="108"
            y="225"
            width="102"
            height="110"
            rx="6"
            fill="#10B981"
            fillOpacity="0.2"
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <rect x="104" y="342" width="112" height="16" rx="4" fill="#065F46" />
          <text x="160" y="353" textAnchor="middle" fill="#ECFDF5" fontSize="8.5" fontWeight="bold">
            KOLOM BETON UTAMA
          </text>
        </g>

        {/* 2. CEILING HANGING PROJECTOR (x=520, y=130 -> 52%, 26%) */}
        <g>
          <line x1="520" y1="30" x2="520" y2="108" stroke="#334155" strokeWidth="5" />
          <rect x="495" y="24" width="50" height="8" rx="2" fill="#475569" />
          <rect x="478" y="108" width="84" height="34" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <circle cx="502" cy="125" r="9" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="2" />
          <circle cx="542" cy="120" r="3.5" fill="#EF4444" />
          <rect x="462" y="148" width="116" height="15" rx="4" fill="#7F1D1D" />
          <text x="520" y="159" textAnchor="middle" fill="#FEF2F2" fontSize="8.5" fontWeight="bold">
            PROYEKTOR GANTUNG
          </text>
        </g>

        {/* 3. STUDENT DESKS & SAFE ZONE UNDER DESK (x=450, y=360 -> 45%, 72%) */}
        <g>
          {/* Secondary Desk on Left */}
          <polygon points="225,335 325,335 335,350 215,350" fill="#B45309" opacity="0.7" />
          <rect x="225" y="350" width="10" height="58" fill="#475569" opacity="0.7" />
          <rect x="315" y="350" width="10" height="58" fill="#475569" opacity="0.7" />

          {/* Main Student Desk at (450, 360) */}
          <rect
            x="375"
            y="322"
            width="150"
            height="82"
            rx="8"
            fill="#10B981"
            fillOpacity="0.22"
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <polygon points="365,302 535,302 550,320 350,320" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <rect x="350" y="320" width="200" height="12" rx="2" fill="#92400E" />
          <rect x="368" y="332" width="14" height="76" fill="#334155" />
          <rect x="518" y="332" width="14" height="76" fill="#334155" />
          <rect x="385" y="412" width="130" height="17" rx="4" fill="#065F46" />
          <text x="450" y="424" textAnchor="middle" fill="#ECFDF5" fontSize="9" fontWeight="bold">
            KOLONG MEJA BELAJAR
          </text>

          {/* Secondary Desk on Right */}
          <polygon points="595,335 695,335 705,350 585,350" fill="#B45309" opacity="0.7" />
          <rect x="595" y="350" width="10" height="58" fill="#475569" opacity="0.7" />
          <rect x="685" y="350" width="10" height="58" fill="#475569" opacity="0.7" />
        </g>

        {/* 4. CLASSROOM EXIT DOORWAY (x=880, y=290 -> 88%, 58%) */}
        <g>
          {/* Exit Sign */}
          <rect x="838" y="102" width="64" height="22" rx="4" fill="#059669" stroke="#A7F3D0" strokeWidth="1.5" />
          <text x="870" y="117" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
            EXIT
          </text>
          {/* Door Frame & Panel */}
          <rect x="815" y="132" width="110" height="220" rx="3" fill="#78350F" stroke="#451A03" strokeWidth="4" />
          <rect x="825" y="142" width="90" height="200" fill="#B45309" />
          {/* Door Glass Window */}
          <rect x="842" y="158" width="56" height="68" rx="2" fill="#BAE6FD" stroke="#78350F" strokeWidth="3" />
          {/* Door Handle */}
          <circle cx="838" cy="252" r="6" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
          <rect x="812" y="358" width="118" height="16" rx="4" fill="#7F1D1D" />
          <text x="871" y="369" textAnchor="middle" fill="#FEF2F2" fontSize="8.5" fontWeight="bold">
            PINTU KELUAR KELAS
          </text>
        </g>
      </svg>
    );
  };

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
          {/* Rich Vector Room Illustration Background */}
          {renderRoomIllustration(room.imageTheme)}

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

