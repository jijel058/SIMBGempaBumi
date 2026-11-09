import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuakeCard } from './QuakeCard';
import { QuakeDetailModal } from './QuakeDetailModal';
import { Earthquake, TimeRangeFilter } from '../../types/earthquake';
import {
  Activity,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Calendar,
  Layers,
  MapPin,
  AlertTriangle,
  ArrowUpDown,
  Radio,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { audio } from '../../services/audioService';

export const MonitoringView: React.FC = () => {
  const {
    earthquakes,
    stats,
    isLive,
    lastUpdated,
    isLoading,
    apiError,
    refreshEarthquakes,
    selectedQuake,
    setSelectedQuake,
    language
  } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [minMagnitude, setMinMagnitude] = useState<number>(0);
  const [maxDepth, setMaxDepth] = useState<number>(800);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('24h');
  const [selectedSource, setSelectedSource] = useState<'all' | 'BMKG' | 'USGS'>('all');
  const [tsunamiOnly, setTsunamiOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'time' | 'magnitude' | 'depth'>('time');

  const handleTimeRangeChange = (tr: TimeRangeFilter) => {
    audio.playClick();
    setTimeRange(tr);
    refreshEarthquakes(tr);
  };

  const handleRefresh = () => {
    audio.playClick();
    refreshEarthquakes(timeRange);
  };

  // Filter & Sort
  const filteredQuakes = earthquakes
    .filter(q => {
      if (searchQuery.trim()) {
        const ql = searchQuery.toLowerCase();
        if (!q.location.toLowerCase().includes(ql) && !q.source.toLowerCase().includes(ql)) {
          return false;
        }
      }
      if (q.magnitude < minMagnitude) return false;
      if (q.depth > maxDepth) return false;
      if (selectedSource !== 'all' && q.source !== selectedSource) return false;
      if (tsunamiOnly && !q.tsunami) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'magnitude') return b.magnitude - a.magnitude;
      if (sortBy === 'depth') return a.depth - b.depth;
      return b.time - a.time;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-emerald-950/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Live Global Seismic Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Monitoring Gempa Bumi Real-Time
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data terverifikasi langsung dari stasiun seismometer USGS Earthquake Hazards Program & InaTEWS BMKG.
          </p>
        </div>

        {/* Refresh & Last Updated Status */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-400 block">Pembaruan Terakhir:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Menyinkronkan...' : 'Perbarui Data'}</span>
          </button>
        </div>
      </div>

      {/* API Notice / Offline Warning if any */}
      {apiError && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>{apiError} Memuat dataset cadangan real-time resmi.</span>
          </div>
          <span className="text-[11px] opacity-80">{lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}

      {/* Quick Statistics Bar */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Gempa (24 Jam)</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalToday} <span className="text-xs font-normal text-slate-400">Kejadian</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Magnitudo Terbesar Hari Ini</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <div className="text-2xl font-black text-red-500">
              M {stats.maxMagnitudeToday.toFixed(1)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Rata-Rata Kedalaman</span>
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.avgDepth} <span className="text-xs font-normal text-slate-400">km (Dangkal)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Gempa Signifikan (M 5.5+)</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500">
              {stats.significantCount} <span className="text-xs font-normal text-slate-400">Wilayah</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Control Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari wilayah/negara (misal: Banten, Jawa, Taiwan, Japan, Chile)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/40 bg-slate-50 dark:bg-earth-card text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Time Range Selector (24h, 7d, 30d) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60">
            {(['24h', '7d', '30d'] as TimeRangeFilter[]).map(tr => (
              <button
                key={tr}
                onClick={() => handleTimeRangeChange(tr)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  timeRange === tr
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                }`}
              >
                {tr === '24h' ? '24 Jam' : tr === '7d' ? '7 Hari' : '30 Hari'}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-emerald-900/40 bg-slate-50 dark:bg-earth-card text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
            >
              <option value="time">Urutkan: Waktu Terbaru</option>
              <option value="magnitude">Urutkan: Magnitudo Terbesar</option>
              <option value="depth">Urutkan: Kedalaman Terdangkal</option>
            </select>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-emerald-950/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Min Magnitude Buttons */}
            <span className="font-semibold text-slate-500">Filter Magnitudo:</span>
            {[0, 4.0, 5.0, 6.0].map(m => (
              <button
                key={m}
                onClick={() => {
                  audio.playClick();
                  setMinMagnitude(m);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                  minMagnitude === m
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-transparent border-slate-200 dark:border-emerald-950/80 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                }`}
              >
                {m === 0 ? 'Semua M' : `M ≥ ${m}`}
              </button>
            ))}

            {/* Source selector */}
            <div className="h-4 w-px bg-slate-300 dark:bg-emerald-950/80 mx-1" />
            <span className="font-semibold text-slate-500">Sumber:</span>
            {(['all', 'BMKG', 'USGS'] as const).map(src => (
              <button
                key={src}
                onClick={() => {
                  audio.playClick();
                  setSelectedSource(src);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                  selectedSource === src
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-transparent border-slate-200 dark:border-emerald-950/80 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                }`}
              >
                {src === 'all' ? 'Semua Sumber' : src}
              </button>
            ))}
          </div>

          <div className="text-slate-500 font-medium">
            Menampilkan <strong className="text-emerald-500">{filteredQuakes.length}</strong> dari {earthquakes.length} data gempa
          </div>
        </div>
      </div>

      {/* Earthquakes Grid / Feed */}
      {filteredQuakes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-emerald-900/40 bg-white dark:bg-earth-surface space-y-3">
          <Activity className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200">Tidak ada gempa yang cocok dengan filter</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba turunkan ambang batas magnitudo atau hapus kata kunci pencarian wilayah Anda.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setMinMagnitude(0);
              setSelectedSource('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Reset Seluruh Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuakes.map((quake, index) => (
            <QuakeCard
              key={quake.id}
              quake={quake}
              isLatest={index === 0 && !searchQuery && minMagnitude === 0}
              onClick={() => setSelectedQuake(quake)}
            />
          ))}
        </div>
      )}

      {/* Earthquake Detail Modal */}
      <QuakeDetailModal quake={selectedQuake} onClose={() => setSelectedQuake(null)} />
    </div>
  );
};

