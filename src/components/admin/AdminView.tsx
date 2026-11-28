/**
 * FILE: src/components/admin/AdminView.tsx
 * FUNGSI: Halaman Login Admin dan Admin Dashboard CRUD untuk mengelola data gempa bumi di MySQL XAMPP.
 * ISI:
 * - Halaman Login Admin: Input username/email & password, fitur show/hide password, validasi akun ke tabel `admins`
 *   (password hash Bcrypt), pembuatan session token & CSRF token, serta proteksi rute otomatis (#admin-dashboard).
 * - Admin Dashboard: 4 Kartu Statistik (Total Data Gempa, Berdasarkan Magnitudo, Berdasarkan Kedalaman, Gempa Terbaru).
 * - Tabel & Fitur CRUD: Pencarian lokasi/ID/MMI, filter magnitudo/kedalaman/tanggal, pagination, modal Tambah Data (Create),
 *   modal Edit Data (Update), dan modal Konfirmasi Hapus Data (Delete) yang langsung tersinkronisasi ke halaman publik.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  AdminUser,
  AdminEarthquakeRecord,
  AdminEarthquakeInput,
  adminLogin,
  adminLogout,
  checkAdminSession,
  fetchAdminEarthquakeList,
  createAdminEarthquake,
  updateAdminEarthquake,
  deleteAdminEarthquake
} from '../../services/adminApi';
import { MagnitudeBadge } from '../common/MagnitudeBadge';
import { audio } from '../../services/audioService';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  Database,
  Activity,
  Layers,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Waves,
  Filter
} from 'lucide-react';

const EMPTY_FORM: AdminEarthquakeInput = {
  source: 'BMKG',
  magnitude: 5.2,
  location: '',
  latitude: -6.84,
  longitude: 107.05,
  depth: 12,
  hoursAgo: 1,
  tanggalKejadian: '',
  tsunami: false,
  status: 'CONFIRMED',
  felt: 500,
  dirasakan: '',
  url: 'https://data.bmkg.go.id/gempabumi/'
};

export const AdminView: React.FC = () => {
  const { refreshEarthquakes } = useApp();

  // Auth & Session states
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // CRUD & Table states
  const [records, setRecords] = useState<AdminEarthquakeRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Search, Filters, and Pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [magFilter, setMagFilter] = useState<'all' | 'low' | 'mid' | 'high' | 'major'>('all');
  const [depthFilter, setDepthFilter] = useState<'all' | 'shallow' | 'intermediate' | 'deep'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Modal states (Create / Edit / Delete)
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string>('');
  const [formData, setFormData] = useState<AdminEarthquakeInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSavingForm, setIsSavingForm] = useState<boolean>(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminEarthquakeRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const showNotice = useCallback((type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Load earthquake records from protected backend
  const loadAdminRecords = useCallback(async () => {
    setIsLoadingData(true);
    const res = await fetchAdminEarthquakeList();
    setIsLoadingData(false);

    if (res.unauthorized) {
      setAdminUser(null);
      setAuthError('Sesi login telah berakhir. Silakan login kembali untuk mengakses Admin Dashboard.');
      window.location.hash = 'admin-login';
      return;
    }

    if (!res.ok) {
      showNotice('error', res.message || 'Gagal memuat data gempa dari database.');
      return;
    }

    setRecords(res.records);
  }, [showNotice]);

  // Verify session on mount & protect direct URL access (#admin-dashboard)
  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      setIsCheckingSession(true);
      const res = await checkAdminSession();
      if (!mounted) return;
      if (res.authenticated && res.admin) {
        setAdminUser(res.admin);
        window.location.hash = 'admin-dashboard';
        await loadAdminRecords();
      } else {
        setAdminUser(null);
        if (window.location.hash === '#admin-dashboard') {
          setAuthError('Anda wajib login sebagai Admin terlebih dahulu untuk mengakses Dashboard.');
        }
        window.location.hash = 'admin-login';
      }
      setIsCheckingSession(false);
    };
    verify();
    return () => {
      mounted = false;
    };
  }, [loadAdminRecords]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setAuthError('Username atau email admin wajib diisi.');
      audio.playWrongBuzzer();
      return;
    }
    if (!password) {
      setAuthError('Password wajib diisi.');
      audio.playWrongBuzzer();
      return;
    }

    setIsSubmittingLogin(true);
    const res = await adminLogin(trimmedId, password);
    setIsSubmittingLogin(false);

    if (!res.ok || !res.admin) {
      setAuthError(res.message);
      audio.playWrongBuzzer();
      return;
    }

    audio.playSuccessChime();
    setAdminUser(res.admin);
    setPassword('');
    window.location.hash = 'admin-dashboard';
    showNotice('success', `Selamat datang kembali, ${res.admin.fullName}!`);
    await loadAdminRecords();
  };

  // Handle Logout
  const handleLogout = async () => {
    audio.playClick();
    await adminLogout();
    setAdminUser(null);
    setRecords([]);
    setIdentifier('');
    setPassword('');
    window.location.hash = 'admin-login';
    showNotice('success', 'Anda telah berhasil logout dari sesi Admin.');
  };

  // Compute Dashboard Summary Statistics
  const dashboardStats = useMemo(() => {
    const total = records.length;
    const magLow = records.filter(r => r.magnitude < 5.0).length;
    const magMid = records.filter(r => r.magnitude >= 5.0 && r.magnitude < 6.0).length;
    const magHigh = records.filter(r => r.magnitude >= 6.0).length;

    const depthShallow = records.filter(r => r.depth <= 60).length;
    const depthIntermediate = records.filter(r => r.depth > 60 && r.depth <= 300).length;
    const depthDeep = records.filter(r => r.depth > 300).length;

    const latest = records.length > 0 ? records[0] : null;

    return {
      total,
      magLow,
      magMid,
      magHigh,
      depthShallow,
      depthIntermediate,
      depthDeep,
      latest
    };
  }, [records]);

  // Filtered records for table
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchLoc = rec.rawLocation.toLowerCase().includes(q) || rec.location.toLowerCase().includes(q);
        const matchId = rec.id.toLowerCase().includes(q) || rec.externalId.toLowerCase().includes(q);
        const matchMmi = (rec.dirasakan || '').toLowerCase().includes(q);
        if (!matchLoc && !matchId && !matchMmi) return false;
      }

      if (magFilter === 'low' && rec.magnitude >= 5.0) return false;
      if (magFilter === 'mid' && (rec.magnitude < 5.0 || rec.magnitude >= 6.0)) return false;
      if (magFilter === 'high' && rec.magnitude < 6.0) return false;
      if (magFilter === 'major' && rec.magnitude < 7.0) return false;

      if (depthFilter === 'shallow' && rec.depth > 60) return false;
      if (depthFilter === 'intermediate' && (rec.depth <= 60 || rec.depth > 300)) return false;
      if (depthFilter === 'deep' && rec.depth <= 300) return false;

      if (dateFilter.trim()) {
        const df = dateFilter.toLowerCase();
        if (!rec.tanggalKejadian.toLowerCase().includes(df)) return false;
      }

      return true;
    });
  }, [records, searchQuery, magFilter, depthFilter, dateFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, magFilter, depthFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  // Open Create Modal
  const handleOpenCreate = () => {
    audio.playClick();
    const todayStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    setFormMode('create');
    setEditingId('');
    setFormData({
      ...EMPTY_FORM,
      tanggalKejadian: todayStr
    });
    setFormErrors([]);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (record: AdminEarthquakeRecord) => {
    audio.playClick();
    setFormMode('edit');
    setEditingId(record.id);
    setFormData({
      id: record.id,
      externalId: record.externalId,
      source: record.source,
      magnitude: record.magnitude,
      location: record.rawLocation || record.location,
      latitude: record.latitude,
      longitude: record.longitude,
      depth: record.depth,
      hoursAgo: record.hoursAgo,
      tanggalKejadian: record.tanggalKejadian,
      tsunami: record.tsunami,
      status: record.status,
      alert: record.alert,
      felt: record.felt,
      dirasakan: record.dirasakan || '',
      url: record.url || 'https://data.bmkg.go.id/gempabumi/'
    });
    setFormErrors([]);
    setIsFormModalOpen(true);
  };

  // Client-side validation before sending to backend
  const validateFormClient = (data: AdminEarthquakeInput): string[] => {
    const errs: string[] = [];
    if (!data.location || data.location.trim().length < 3) {
      errs.push('Lokasi atau wilayah gempa wajib diisi (minimal 3 karakter).');
    }
    if (!data.tanggalKejadian || data.tanggalKejadian.trim().length < 3) {
      errs.push('Tanggal kejadian wajib diisi (contoh: 28 Nov 2026).');
    }
    if (isNaN(data.magnitude) || data.magnitude < 0.1 || data.magnitude > 10.0) {
      errs.push('Magnitudo harus berada pada rentang 0.1 hingga 10.0 SR.');
    }
    if (isNaN(data.depth) || data.depth < 1 || data.depth > 1000) {
      errs.push('Kedalaman harus berada pada rentang 1 hingga 1000 km.');
    }
    if (isNaN(data.latitude) || data.latitude < -90 || data.latitude > 90) {
      errs.push('Koordinat Latitude harus berada pada rentang -90° hingga 90°.');
    }
    if (isNaN(data.longitude) || data.longitude < -180 || data.longitude > 180) {
      errs.push('Koordinat Longitude harus berada pada rentang -180° hingga 180°.');
    }
    if (isNaN(data.hoursAgo) || data.hoursAgo < 0) {
      errs.push('Offset jam kejadian tidak boleh bernilai negatif.');
    }
    return errs;
  };

  // Save Create / Edit Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrs = validateFormClient(formData);
    if (clientErrs.length > 0) {
      setFormErrors(clientErrs);
      audio.playWrongBuzzer();
      return;
    }

    setIsSavingForm(true);
    setFormErrors([]);

    const res =
      formMode === 'create'
        ? await createAdminEarthquake(formData)
        : await updateAdminEarthquake({ ...formData, id: editingId });

    setIsSavingForm(false);

    if (res.unauthorized) {
      setIsFormModalOpen(false);
      setAdminUser(null);
      setAuthError('Sesi login telah berakhir. Silakan login kembali.');
      window.location.hash = 'admin-login';
      return;
    }

    if (!res.ok) {
      setFormErrors([res.message]);
      audio.playWrongBuzzer();
      return;
    }

    audio.playSuccessChime();
    setIsFormModalOpen(false);
    showNotice('success', res.message);
    await loadAdminRecords();
    await refreshEarthquakes();
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteAdminEarthquake(deleteTarget.id);
    setIsDeleting(false);

    if (res.unauthorized) {
      setDeleteTarget(null);
      setAdminUser(null);
      setAuthError('Sesi login telah berakhir. Silakan login kembali.');
      window.location.hash = 'admin-login';
      return;
    }

    if (!res.ok) {
      showNotice('error', res.message);
      audio.playWrongBuzzer();
      return;
    }

    audio.playSuccessChime();
    setDeleteTarget(null);
    showNotice('success', res.message);
    await loadAdminRecords();
    await refreshEarthquakes();
  };

  // Loading state while verifying session
  if (isCheckingSession) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">
          Memverifikasi sesi keamanan Admin EPICORA...
        </p>
      </div>
    );
  }

  // ============================================================================
  // VIEW 1: HALAMAN LOGIN ADMIN (Protected Gatekeeper)
  // ============================================================================
  if (!adminUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-200">
        <div className="max-w-md mx-auto bg-white dark:bg-earth-surface rounded-3xl border border-slate-200 dark:border-emerald-950/60 shadow-2xl overflow-hidden">
          {/* Top Emerald Accent Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EPICORA Security Portal</span>
              </span>
              <Lock className="w-5 h-5 text-emerald-300" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Login Admin Dashboard
            </h1>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Masuk menggunakan akun administrator untuk mengelola database gempa bumi Indonesia (MySQL XAMPP).
            </p>
          </div>

          {/* Login Form Body */}
          <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-5">
            {authError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {notification && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
                  notification.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{notification.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Username atau Email Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="Masukkan username atau email (misal: admin)"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-emerald-900/50 bg-slate-50 dark:bg-earth-card text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Password Admin
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 dark:border-emerald-900/50 bg-slate-50 dark:bg-earth-card text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3.5 rounded-xl glass-btn-primary text-white font-extrabold text-sm shadow-lg hover:brightness-105 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmittingLogin ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login ke Dashboard Admin</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: ADMIN DASHBOARD & CRUD DATA GEMPA
  // ============================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Admin Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-emerald-950/60 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
              <Database className="w-3.5 h-3.5" />
              <span>MySQL XAMPP • seismora_db.gempa_indonesia</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
              {adminUser.role}: {adminUser.fullName} ({adminUser.username})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Admin Dashboard &amp; Manajemen Data Gempa
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola data gempa bumi Indonesia secara langsung pada database MySQL. Setiap perubahan otomatis tersinkronisasi ke halaman Monitoring, Peta 2D, dan Globe 3D.
          </p>
        </div>

        {/* Admin Action Buttons (Sejajar 1 Baris Horizontal) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-btn-primary text-white font-extrabold text-xs shadow-md hover:brightness-105 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Gempa</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              loadAdminRecords();
            }}
            disabled={isLoadingData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-earth-card border border-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 transition whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Sinkronkan</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs transition whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Data Gempa */}
        <div className="p-5 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Total Data Gempa (DB)</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {dashboardStats.total}{' '}
            <span className="text-xs font-semibold text-slate-400">Rekaman</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            Tersimpan di tabel `gempa_indonesia`
          </p>
        </div>

        {/* Card 2: Berdasarkan Magnitudo */}
        <div className="p-5 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Berdasarkan Magnitudo</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-sm font-black text-emerald-800 block">{dashboardStats.magLow}</span>
              <span className="text-[10px] font-bold text-emerald-700">M &lt; 5.0</span>
            </div>
            <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-sm font-black text-amber-800 block">{dashboardStats.magMid}</span>
              <span className="text-[10px] font-bold text-amber-700">M 5.0–5.9</span>
            </div>
            <div className="p-1.5 rounded-xl bg-red-50 border border-red-200">
              <span className="text-sm font-black text-red-800 block">{dashboardStats.magHigh}</span>
              <span className="text-[10px] font-bold text-red-700">M &ge; 6.0</span>
            </div>
          </div>
        </div>

        {/* Card 3: Berdasarkan Kedalaman */}
        <div className="p-5 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Berdasarkan Kedalaman</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-1.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-sm font-black text-rose-800 block">{dashboardStats.depthShallow}</span>
              <span className="text-[10px] font-bold text-rose-700">&le; 60 km</span>
            </div>
            <div className="p-1.5 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-sm font-black text-blue-800 block">{dashboardStats.depthIntermediate}</span>
              <span className="text-[10px] font-bold text-blue-700">61–300 km</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-100 border border-slate-300">
              <span className="text-sm font-black text-slate-800 block">{dashboardStats.depthDeep}</span>
              <span className="text-[10px] font-bold text-slate-600">&gt; 300 km</span>
            </div>
          </div>
        </div>

        {/* Card 4: Gempa Terbaru di Database */}
        <div className="p-5 rounded-2xl bg-white dark:bg-earth-card border border-slate-200 dark:border-emerald-950/60 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Gempa Terbaru Tercatat</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          {dashboardStats.latest ? (
            <>
              <div className="flex items-center gap-2 pt-0.5">
                <MagnitudeBadge magnitude={dashboardStats.latest.magnitude} size="sm" />
                <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate">
                  {dashboardStats.latest.tanggalKejadian}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                {dashboardStats.latest.rawLocation}
              </p>
              <p className="text-[11px] text-slate-400">
                Kedalaman {dashboardStats.latest.depth} km • ID: {dashboardStats.latest.id}
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-400 pt-2">Belum ada data gempa</p>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-earth-surface border border-slate-200 dark:border-emerald-950/60 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search by Location / ID */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari lokasi, wilayah, skala MMI, atau ID gempa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Filter by Magnitude */}
          <div className="md:col-span-2">
            <select
              value={magFilter}
              onChange={e => setMagFilter(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua Magnitudo</option>
              <option value="low">M &lt; 5.0 (Ringan)</option>
              <option value="mid">M 5.0 - 5.9 (Sedang)</option>
              <option value="high">M &ge; 6.0 (Kuat)</option>
              <option value="major">M &ge; 7.0 (Megathrust)</option>
            </select>
          </div>

          {/* Filter by Depth */}
          <div className="md:col-span-3">
            <select
              value={depthFilter}
              onChange={e => setDepthFilter(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua Kedalaman</option>
              <option value="shallow">Dangkal (&le; 60 km)</option>
              <option value="intermediate">Menengah (61 - 300 km)</option>
              <option value="deep">Dalam (&gt; 300 km)</option>
            </select>
          </div>

          {/* Filter by Date / Year */}
          <div className="md:col-span-2">
            <input
              type="text"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              placeholder="Filter Tanggal/Thn..."
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Menampilkan <strong className="text-emerald-600">{filteredRecords.length}</strong> dari{' '}
              <strong>{records.length}</strong> data gempa di database
            </span>
          </div>

          {(searchQuery || magFilter !== 'all' || depthFilter !== 'all' || dateFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setMagFilter('all');
                setDepthFilter('all');
                setDateFilter('');
              }}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Reset Filter Pencarian
            </button>
          )}
        </div>
      </div>

      {/* Earthquake Database CRUD Table */}
      <div className="bg-white dark:bg-earth-surface rounded-3xl border border-slate-200 dark:border-emerald-950/60 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-earth-card border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">ID Gempa</th>
                <th className="py-3.5 px-4">Tanggal Kejadian</th>
                <th className="py-3.5 px-4">Lokasi / Wilayah Gempa</th>
                <th className="py-3.5 px-4">Koordinat (Lat, Lng)</th>
                <th className="py-3.5 px-4">Magnitudo</th>
                <th className="py-3.5 px-4">Kedalaman</th>
                <th className="py-3.5 px-4">Keterangan / Dirasakan (MMI)</th>
                <th className="py-3.5 px-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada data gempa yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map(rec => (
                  <tr
                    key={rec.id}
                    className="hover:bg-emerald-50/40 dark:hover:bg-white/5 transition"
                  >
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                        {rec.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {rec.externalId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {rec.tanggalKejadian}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {rec.hoursAgo < 24
                          ? 'Kategori: 24 Jam'
                          : rec.hoursAgo <= 168
                            ? 'Kategori: 7 Hari'
                            : 'Kategori: 30 Hari'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <div className="font-extrabold text-slate-900 dark:text-white leading-snug">
                        {rec.rawLocation}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          {rec.source}
                        </span>
                        {rec.tsunami && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">
                            <Waves className="w-3 h-3" />
                            <span>Potensi Tsunami</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {rec.latitude.toFixed(4)}°, {rec.longitude.toFixed(4)}°
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <MagnitudeBadge magnitude={rec.magnitude} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                        {rec.depth} km
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {rec.depth <= 60 ? 'Dangkal' : rec.depth <= 300 ? 'Menengah' : 'Dalam'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-xs">
                      {rec.dirasakan ? (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                          {rec.dirasakan}
                        </p>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Tidak ada catatan MMI</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] transition"
                          title="Edit Data Gempa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            audio.playClick();
                            setDeleteTarget(rec);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-[11px] transition"
                          title="Hapus Data Gempa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> (Total{' '}
              {filteredRecords.length} data)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-extrabold text-xs transition ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================================
          MODAL 1: CREATE / EDIT DATA GEMPA (Portal to document.body)
         ============================================================================ */}
      {isFormModalOpen &&
        createPortal(
          <div
            onClick={() => setIsFormModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl glass-btn-primary text-white flex items-center justify-center">
                    {formMode === 'create' ? <Plus className="w-5 h-5" /> : <Edit3 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">
                      {formMode === 'create'
                        ? 'Tambah Data Gempa Bumi Baru'
                        : `Edit Data Gempa (${editingId})`}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Tabel Database: <code className="font-mono font-bold">seismora_db.gempa_indonesia</code>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-4 text-xs">
                {formErrors.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 space-y-1">
                    <span className="font-extrabold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Validasi Input Gagal:</span>
                    </span>
                    <ul className="list-disc list-inside pl-1 space-y-0.5">
                      {formErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Lokasi / Wilayah Gempa */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-extrabold text-slate-700 block">
                      Lokasi / Wilayah Gempa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Contoh: 10 km BaratDaya KAB-CIANJUR-JABAR (Sesar Cugenang)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Tanggal & Waktu Kejadian */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">
                      Tanggal &amp; Waktu Kejadian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tanggalKejadian}
                      onChange={e => setFormData({ ...formData, tanggalKejadian: e.target.value })}
                      placeholder="Contoh: 21 Nov 2022 atau 28 Nov 2026 14:20 WIB"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Kategori Filter Rentang Waktu (hours_ago) */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">
                      Kategori Tampilan Rentang Waktu (`hours_ago`)
                    </label>
                    <select
                      value={
                        formData.hoursAgo < 24
                          ? '2'
                          : formData.hoursAgo <= 168
                            ? '48'
                            : '240'
                      }
                      onChange={e =>
                        setFormData({ ...formData, hoursAgo: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="2">Tampil di 24 Jam, 7 Hari &amp; 30 Hari (Terbaru)</option>
                      <option value="48">Tampil di 7 Hari &amp; 30 Hari (Minggu Ini)</option>
                      <option value="240">Tampil di 30 Hari (Arsip Historis)</option>
                    </select>
                  </div>

                  {/* Magnitudo */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">
                      Magnitudo (SR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10.0"
                      required
                      value={formData.magnitude}
                      onChange={e =>
                        setFormData({ ...formData, magnitude: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Kedalaman */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">
                      Kedalaman (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      required
                      value={formData.depth}
                      onChange={e =>
                        setFormData({ ...formData, depth: parseInt(e.target.value, 10) || 1 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Latitude */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">
                      Koordinat Latitude (-90 s/d 90) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      min="-90"
                      max="90"
                      required
                      value={formData.latitude}
                      onChange={e =>
                        setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Longitude */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">
                      Koordinat Longitude (-180 s/d 180) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      min="-180"
                      max="180"
                      required
                      value={formData.longitude}
                      onChange={e =>
                        setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Sumber Data */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">Sumber Instansi</label>
                    <select
                      value={formData.source}
                      onChange={e =>
                        setFormData({ ...formData, source: e.target.value as 'BMKG' | 'USGS' })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="BMKG">BMKG (Indonesia)</option>
                      <option value="USGS">USGS (Global)</option>
                    </select>
                  </div>

                  {/* Potensi Tsunami */}
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">Status Tsunami</label>
                    <select
                      value={formData.tsunami ? '1' : '0'}
                      onChange={e =>
                        setFormData({ ...formData, tsunami: e.target.value === '1' })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="0">Tidak Berpotensi Tsunami</option>
                      <option value="1">Berpotensi Tsunami</option>
                    </select>
                  </div>

                  {/* Keterangan / Wilayah Dirasakan (Skala MMI) */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-extrabold text-slate-700 block">
                      Keterangan / Wilayah Dirasakan (Skala MMI)
                    </label>
                    <input
                      type="text"
                      value={formData.dirasakan || ''}
                      onChange={e => setFormData({ ...formData, dirasakan: e.target.value })}
                      placeholder="Contoh: V-VI Cianjur, IV Garut, III Sukabumi, II-III Jakarta"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingForm}
                    className="px-5 py-2.5 rounded-xl glass-btn-primary text-white font-extrabold shadow-md hover:brightness-105 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingForm ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {formMode === 'create' ? 'Simpan Data Baru' : 'Simpan Perubahan'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ============================================================================
          MODAL 2: KONFIRMASI HAPUS DATA GEMPA (Portal to document.body)
         ============================================================================ */}
      {deleteTarget &&
        createPortal(
          <div
            onClick={() => setDeleteTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-base text-slate-900">
                    Konfirmasi Hapus Data Gempa
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Apakah Anda yakin ingin menghapus data gempa berikut secara permanen dari database MySQL?
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-700">{deleteTarget.id}</span>
                  <MagnitudeBadge magnitude={deleteTarget.magnitude} size="sm" />
                </div>
                <p className="font-extrabold text-slate-900">{deleteTarget.rawLocation}</p>
                <p className="text-[11px] text-slate-500">
                  Tanggal: {deleteTarget.tanggalKejadian} • Kedalaman: {deleteTarget.depth} km
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Ya, Hapus dari Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
