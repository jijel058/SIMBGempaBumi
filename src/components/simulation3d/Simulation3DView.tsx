import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDiorama } from '../../context/DioramaContext';
import { EarthGlobe3D } from './EarthGlobe3D';
import { DaylightCityRupture3D } from './DaylightCityRupture3D';
import { DisasterScenario3D } from './DisasterScenario3D';
import { QuakeDetailModal } from '../monitoring/QuakeDetailModal';
import { audio } from '../../services/audioService';
import {
  Box,
  Globe2,
  ShieldAlert,
  Building2
} from 'lucide-react';

export const Simulation3DView: React.FC = () => {
  const { earthquakes, selectedQuake, setSelectedQuake } = useApp();
  const { intent } = useDiorama();
  const [activeSubTab, setActiveSubTab] = useState<'city-rupture' | 'globe' | 'scenarios'>(
    intent.simTab ?? 'city-rupture'
  );
  React.useEffect(() => {
    if (intent.simTab) setActiveSubTab(intent.simTab);
  }, [intent.nonce]);
  const [ruptureMag, setRuptureMag] = useState<number>(6.8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-emerald-950/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Interactive 3D WebGL Simulation &amp; Scrollytelling
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Visualisasi &amp; Simulasi Gempa 3D
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulasi rekahan patahan kota, globe bumi fotorealistis NASA, dan skenario aksi penyelamatan diri Drop, Cover, Hold On.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-sm">
          <button
            onClick={() => {
              audio.playClick();
              setActiveSubTab('city-rupture');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeSubTab === 'city-rupture'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Patahan Kota 3D</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              setActiveSubTab('globe');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeSubTab === 'globe'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Globe Seismik NASA</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              setActiveSubTab('scenarios');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeSubTab === 'scenarios'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Latihan Tanggap Darurat</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Daylight City Rupture 3D */}
      {activeSubTab === 'city-rupture' && (
        <div className="space-y-6">
          <DaylightCityRupture3D
            magnitude={ruptureMag}
            onMagnitudeChange={mag => setRuptureMag(mag)}
            height="620px"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">
                Patahan Sesar Darat Dangkal
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualisasi dinamika pergeseran lateral (strike-slip fault) yang memotong badan jalan raya perkotaan dan merusak pipa utilitas bawah tanah.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider block">
                Kerentanan Struktur Gedung
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menunjukkan efek osilasi inersia gedung tinggi yang condong (-11° dan +13°) akibat resonansi frekuensi gelombang seismik permukaan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider block">
                Armada Darurat &amp; Rute Aman
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unit pemadam kebakaran dan ambulans bersiaga di batas zona aman, memandu warga menyusuri koridor evakuasi menuju ruang terbuka hijau.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Interactive Earth Globe 3D */}
      {activeSubTab === 'globe' && (
        <div className="space-y-6">
          <EarthGlobe3D
            earthquakes={earthquakes}
            height="620px"
            onSelectQuake={q => setSelectedQuake(q)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider block">
                Pemetaan Geografis Nyata
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap titik di permukaan globe 3D diposisikan menggunakan koordinat lintang &amp; bujur aktual dari stasiun pemantau USGS dan BMKG.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">
                Perambatan Gelombang Seismik
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Animasi gelombang cincin di sekitar episentrum mengilustrasikan perambatan gelombang seismik P dan S menjauhi titik hiposentrum.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider block">
                Model Irisan Lapisan Bumi
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan tombol &apos;Lapisan Bumi&apos; di pojok kiri atas globe untuk melihat irisan 3D Kerak Bumi, Mantel, Inti Luar, dan Inti Dalam.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: 5 Disaster Scenarios */}
      {activeSubTab === 'scenarios' && <DisasterScenario3D />}

      {/* Detail Modal */}
      <QuakeDetailModal quake={selectedQuake} onClose={() => setSelectedQuake(null)} />
    </div>
  );
};
