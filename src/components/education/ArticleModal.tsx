import React from 'react';
import { EducationalArticle } from '../../data/articleData';
import { audio } from '../../services/audioService';
import {
  X,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface Props {
  article: EducationalArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<Props> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              {article.category}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline-block">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1 hidden sm:flex">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6 space-y-6 text-slate-800">
          {/* Article Title & Metadata */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-b border-slate-100 pb-4">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {article.date}
              </span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Sumber: {article.source}
              </span>
            </div>
          </div>

          {/* Lead Paragraph */}
          <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
            "{article.content.lead}"
          </p>

          {/* Article Sections */}
          <div className="space-y-8">
            {article.content.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {section.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {section.body}
                </p>

                {section.highlights && (
                  <div className="space-y-2 pl-2 border-l-2 border-emerald-500/40 my-3">
                    {section.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.tipBox && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs sm:text-sm space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      {section.tipBox.title}
                    </p>
                    <p className="text-amber-800/90 leading-relaxed">{section.tipBox.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Closing & Mitigation Reminder */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-800">
              <BookOpen className="w-4 h-4" />
              Kesiapsiagaan Dimulai Dari Pengetahuan Mandiri
            </h4>
            <p className="text-xs text-emerald-800/90 leading-relaxed">
              Bagikan artikel edukasi resmi ini kepada keluarga dan rekan terdekat Anda. Mengetahui tindakan yang benar dalam 60 detik pertama adalah pembeda antara keselamatan dan bahaya.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            SEISMORA Earthquake Educational Series
          </span>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            Tutup Artikel
          </button>
        </div>
      </div>
    </div>
  );
};

