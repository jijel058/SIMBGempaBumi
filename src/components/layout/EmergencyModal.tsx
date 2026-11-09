import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, Phone, X, ShieldAlert, CheckCircle2, Siren } from 'lucide-react';
import { audio } from '../../services/audioService';

export const EmergencyModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, language } = useApp();

  if (!isEmergencyModalOpen) return null;

  const hotlines = [
    { name: 'BMKG Hotline Gempa Bumi', number: '196', desc: 'Informasi gempa bumi dan peringatan dini tsunami', color: 'emerald' },
    { name: 'BNPB Kedaruratan Bencana', number: '117', desc: 'Laporan dampak bencana dan bantuan evakuasi nasional', color: 'red' },
    { name: 'BASARNAS (Pencarian & Penyelamatan)', number: '115', desc: 'Operasi SAR untuk korban tertimbun / hilang', color: 'amber' },
    { name: 'Ambulans / Gawat Darurat Medis', number: '118 / 119', desc: 'Penanganan korban luka berat dan pertolongan pertama', color: 'blue' },
    { name: 'Pemadam Kebakaran', number: '113', desc: 'Penanganan kebakaran sekunder akibat kebocoran gas/korsleting', color: 'rose' },
    { name: 'Kepolisian RI', number: '110', desc: 'Keamanan wilayah dan pengaturan jalur evakuasi darurat', color: 'slate' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-earth-surface rounded-2xl border border-red-500/40 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
              <Siren className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl tracking-tight">
                {language === 'id' ? 'Pusat Panggilan Darurat & Panduan SOS' : 'Emergency SOS & Hotlines'}
              </h3>
              <p className="text-xs text-red-100">
                {language === 'id' ? 'Layanan Terpadu Tanggap Bencana Gempa Bumi Nasional' : 'Official National Disaster Response Lines'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              setIsEmergencyModalOpen(false);
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Quick Immediate Action Warning */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
            <h4 className="font-bold text-red-800 dark:text-red-300 text-sm flex items-center gap-2 mb-2">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>APAKAH ANDA BARU SAJA MERASAKAN GEMPA BESAR?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-red-900 dark:text-red-200">
              <div className="p-2 rounded-lg bg-white/80 dark:bg-black/30 border border-red-200/50">
                <strong>1. DROP & COVER</strong>
                <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-300">Merunduk dan lindungi kepala di bawah meja kokoh.</p>
              </div>
              <div className="p-2 rounded-lg bg-white/80 dark:bg-black/30 border border-red-200/50">
                <strong>2. JAUHI PANTAI</strong>
                <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-300">Jika dekat laut dan gempa kuat, segera ke bukit/tempat tinggi.</p>
              </div>
              <div className="p-2 rounded-lg bg-white/80 dark:bg-black/30 border border-red-200/50">
                <strong>3. MATIKAN GAS</strong>
                <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-300">Lepas regulator gas dan jangan nyalakan korek api.</p>
              </div>
            </div>
          </div>

          {/* Hotline List */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-3">
              Daftar Nomor Panggilan Darurat (Bebas Pulsa / Hotline)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotlines.map((h, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-950/60 bg-slate-50 dark:bg-earth-card hover:border-emerald-500/50 transition flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm block">
                      {h.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      {h.desc}
                    </span>
                  </div>
                  <a
                    href={`tel:${h.number.split(' ')[0]}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition ml-2 whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{h.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Kit Reminder */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Tips Komunikasi Saat Bencana:</span> Gunakan SMS atau aplikasi pesan teks singkat dibanding panggilan telepon suara, untuk menjaga kapasitas bandwidth jaringan seluler tetap terbuka bagi tim evakuasi darurat.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-earth-dark/70 border-t border-slate-200 dark:border-emerald-950/60 text-right">
          <button
            onClick={() => {
              audio.playClick();
              setIsEmergencyModalOpen(false);
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold transition"
          >
            Tutup Jendela SOS
          </button>
        </div>
      </div>
    </div>
  );
};

