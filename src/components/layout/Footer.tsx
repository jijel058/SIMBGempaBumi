import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, ShieldCheck, ExternalLink, Heart, Radio, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveTab, setIsEmergencyModalOpen } = useApp();

  return (
    <footer className="border-t border-emerald-950/20 dark:border-emerald-900/40 bg-slate-50 dark:bg-earth-dark/95 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                SEISMO<span className="text-emerald-500">RA</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Global Earthquake Education & Monitoring Platform. Menghubungkan masyarakat dengan data seismik resmi, visualisasi interaktif, dan literasi mitigasi bencana.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>USGS & BMKG Live Data Feed</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              {language === 'id' ? 'Navigasi Utama' : 'Main Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className="hover:text-emerald-500 transition"
                >
                  {language === 'id' ? 'Monitoring Gempa Real-Time' : 'Live Earthquake Monitoring'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('map')}
                  className="hover:text-emerald-500 transition"
                >
                  {language === 'id' ? 'Peta Gempa & Lempeng Dunia' : 'Global Interactive Map'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('simulation')}
                  className="hover:text-emerald-500 transition"
                >
                  {language === 'id' ? 'Simulasi 3D & Skenario' : '3D Disaster Simulation'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('games')}
                  className="hover:text-emerald-500 transition"
                >
                  {language === 'id' ? 'Permainan Mitigasi (Gamification)' : 'Earthquake Mini Games'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('mitigation')}
                  className="hover:text-emerald-500 transition"
                >
                  {language === 'id' ? 'Panduan Mitigasi Lengkap' : 'Disaster Mitigation Guide'}
                </button>
              </li>
            </ul>
          </div>

          {/* Official Emergency Contacts */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              <span>{language === 'id' ? 'Panggilan Darurat RI' : 'Emergency Hotlines'}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-emerald-950/60">
                <span>BMKG Info Gempa</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">196</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-emerald-950/60">
                <span>BNPB (Kedaruratan)</span>
                <span className="font-bold text-red-500">117</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-emerald-950/60">
                <span>BASARNAS (Pencarian & SAR)</span>
                <span className="font-bold text-amber-500">115</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Ambulans Medis</span>
                <span className="font-bold text-slate-900 dark:text-white">118 / 119</span>
              </div>
            </div>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="mt-3 w-full py-1.5 text-center text-xs font-bold rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Lihat Seluruh Kontak Darurat & Panduan SOS
            </button>
          </div>

          {/* Official API Data Attribution */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'id' ? 'Sumber Data Resmi' : 'Official Data Sources'}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://earthquake.usgs.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-500 transition"
                >
                  <span>USGS Earthquake Hazards Program</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.bmkg.go.id/gempabumi/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-500 transition"
                >
                  <span>BMKG Open Data (InaTEWS)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://bnpb.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-500 transition"
                >
                  <span>BNPB Indonesia</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.openstreetmap.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-500 transition"
                >
                  <span>OpenStreetMap & CartoDB</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="rounded-xl p-4 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-emerald-300">
                DISCLAIMER & INTEGRITAS ILMIAH:
              </span>{' '}
              Website SEISMORA adalah platform media edukasi dan pemantauan gempa bumi. Informasi gempa bumi yang disajikan bersumber dari rekaman sensor seismometer BMKG dan USGS setelah gelombang seismik terjadi. Secara ilmiah, hingga saat ini{' '}
              <strong className="text-slate-800 dark:text-slate-200">TIDAK ADA teknologi yang mampu memprediksi waktu pasti terjadinya gempa bumi</strong>. Platform ini bukan pengganti sistem peringatan dini resmi negara.
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-200 dark:border-emerald-950/80 pt-6">
          <p>
            © {new Date().getFullYear()} SEISMORA Platform. All rights reserved. Built for Global Disaster Preparedness.
          </p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>for Community Safety & Resilience</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

