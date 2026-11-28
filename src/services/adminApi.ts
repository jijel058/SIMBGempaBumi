/**
 * FILE: src/services/adminApi.ts
 * FUNGSI: Layanan komunikasi frontend ke backend PHP & MySQL XAMPP untuk fitur Admin Dashboard.
 * ISI:
 * - adminLogin(): Mengirim kredensial username/email & password ke endpoint backend (?action=login).
 * - checkAdminSession() & adminLogout(): Memvalidasi sesi aktif (?action=session) dan mengakhiri sesi (?action=logout).
 * - fetchAdminEarthquakeList(): Mengambil seluruh rekaman tabel `gempa_indonesia` untuk tabel Admin (?action=admin_list).
 * - createAdminEarthquake(), updateAdminEarthquake(), deleteAdminEarthquake():
 *   Menjalankan operasi CRUD ke database MySQL dilengkapi header keamanan X-Session-Token dan X-CSRF-Token,
 *   serta membersihkan cache publik agar perubahan data langsung tampil di halaman utama.
 */
import { clearEarthquakeCache } from './earthquakeApi';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AdminEarthquakeRecord {
  id: string;
  externalId: string;
  source: 'BMKG' | 'USGS';
  magnitude: number;
  location: string;
  rawLocation: string;
  latitude: number;
  longitude: number;
  depth: number;
  hoursAgo: number;
  tanggalKejadian: string;
  time: number;
  tsunami: boolean;
  status: string;
  alert: 'green' | 'yellow' | 'orange' | 'red';
  felt: number;
  dirasakan: string;
  url: string;
}

export interface AdminEarthquakeInput {
  id?: string;
  externalId?: string;
  source: 'BMKG' | 'USGS';
  magnitude: number;
  location: string;
  latitude: number;
  longitude: number;
  depth: number;
  hoursAgo: number;
  tanggalKejadian: string;
  tsunami: boolean;
  status: string;
  alert?: 'green' | 'yellow' | 'orange' | 'red';
  felt?: number;
  dirasakan?: string;
  url?: string;
}

const ADMIN_API_BASE = 'http://localhost/seismora/api_gempa.php';
const SESSION_TOKEN_KEY = 'epicora_admin_session_token';
const CSRF_TOKEN_KEY = 'epicora_admin_csrf_token';

export function getStoredSessionToken(): string {
  try {
    return sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function getStoredCsrfToken(): string {
  try {
    return sessionStorage.getItem(CSRF_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function saveAuthTokens(sessionToken: string, csrfToken: string): void {
  try {
    sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
    sessionStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
  } catch {
    // Ignore storage error
  }
}

export function clearAuthTokens(): void {
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
  } catch {
    // Ignore storage error
  }
}

function buildHeaders(includeCsrf = false): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  const sessionToken = getStoredSessionToken();
  if (sessionToken) {
    headers['X-Session-Token'] = sessionToken;
  }
  if (includeCsrf) {
    const csrfToken = getStoredCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return headers;
}

export async function adminLogin(
  identifier: string,
  password: string
): Promise<{ ok: boolean; admin?: AdminUser; message: string }> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();
    if (!res.ok || data.status !== 'success') {
      return {
        ok: false,
        message: data.message || 'Autentikasi gagal. Periksa kembali username/email dan password Anda.'
      };
    }

    saveAuthTokens(data.sessionToken || '', data.csrfToken || '');
    return {
      ok: true,
      admin: data.admin,
      message: data.message || 'Login berhasil.'
    };
  } catch {
    return {
      ok: false,
      message:
        'Tidak dapat terhubung ke server backend MySQL XAMPP (http://localhost/seismora/api_gempa.php). Pastikan Apache & MySQL di XAMPP sudah menyala.'
    };
  }
}

export async function checkAdminSession(): Promise<{
  authenticated: boolean;
  admin: AdminUser | null;
}> {
  const token = getStoredSessionToken();
  if (!token) {
    return { authenticated: false, admin: null };
  }

  try {
    const res = await fetch(`${ADMIN_API_BASE}?action=session`, {
      method: 'GET',
      headers: buildHeaders(false),
      credentials: 'include'
    });
    if (!res.ok) {
      clearAuthTokens();
      return { authenticated: false, admin: null };
    }
    const data = await res.json();
    if (data.status === 'authenticated' && data.admin) {
      if (data.csrfToken) {
        saveAuthTokens(token, data.csrfToken);
      }
      return { authenticated: true, admin: data.admin };
    }
    clearAuthTokens();
    return { authenticated: false, admin: null };
  } catch {
    return { authenticated: false, admin: null };
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch(`${ADMIN_API_BASE}?action=logout`, {
      method: 'POST',
      headers: buildHeaders(false),
      credentials: 'include'
    });
  } catch {
    // Ignore network error on logout
  } finally {
    clearAuthTokens();
  }
}

export async function fetchAdminEarthquakeList(): Promise<{
  ok: boolean;
  unauthorized?: boolean;
  records: AdminEarthquakeRecord[];
  message?: string;
}> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}?action=admin_list`, {
      method: 'GET',
      headers: buildHeaders(false),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.status === 401 || data.code === 'UNAUTHORIZED') {
      clearAuthTokens();
      return {
        ok: false,
        unauthorized: true,
        records: [],
        message: data.message || 'Sesi login telah berakhir.'
      };
    }

    if (!res.ok || data.status !== 'success') {
      return {
        ok: false,
        records: [],
        message: data.message || 'Gagal memuat data gempa dari database.'
      };
    }

    return {
      ok: true,
      records: Array.isArray(data.records) ? data.records : []
    };
  } catch {
    return {
      ok: false,
      records: [],
      message: 'Gagal menghubungi server database MySQL XAMPP.'
    };
  }
}

export async function createAdminEarthquake(
  input: AdminEarthquakeInput
): Promise<{ ok: boolean; unauthorized?: boolean; record?: AdminEarthquakeRecord; message: string }> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}?action=create`, {
      method: 'POST',
      headers: buildHeaders(true),
      credentials: 'include',
      body: JSON.stringify(input)
    });

    const data = await res.json();
    if (res.status === 401 || data.code === 'UNAUTHORIZED') {
      clearAuthTokens();
      return { ok: false, unauthorized: true, message: data.message || 'Sesi berakhir.' };
    }

    if (!res.ok || data.status !== 'success') {
      return {
        ok: false,
        message: data.message || 'Gagal menambahkan data gempa.'
      };
    }

    clearEarthquakeCache();
    return {
      ok: true,
      record: data.record,
      message: data.message || 'Data gempa berhasil ditambahkan.'
    };
  } catch {
    return {
      ok: false,
      message: 'Gagal menghubungi server database MySQL XAMPP.'
    };
  }
}

export async function updateAdminEarthquake(
  input: AdminEarthquakeInput & { id: string }
): Promise<{ ok: boolean; unauthorized?: boolean; record?: AdminEarthquakeRecord; message: string }> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}?action=update`, {
      method: 'POST',
      headers: buildHeaders(true),
      credentials: 'include',
      body: JSON.stringify(input)
    });

    const data = await res.json();
    if (res.status === 401 || data.code === 'UNAUTHORIZED') {
      clearAuthTokens();
      return { ok: false, unauthorized: true, message: data.message || 'Sesi berakhir.' };
    }

    if (!res.ok || data.status !== 'success') {
      return {
        ok: false,
        message: data.message || 'Gagal memperbarui data gempa.'
      };
    }

    clearEarthquakeCache();
    return {
      ok: true,
      record: data.record,
      message: data.message || 'Data gempa berhasil diperbarui.'
    };
  } catch {
    return {
      ok: false,
      message: 'Gagal menghubungi server database MySQL XAMPP.'
    };
  }
}

export async function deleteAdminEarthquake(
  id: string
): Promise<{ ok: boolean; unauthorized?: boolean; message: string }> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}?action=delete`, {
      method: 'POST',
      headers: buildHeaders(true),
      credentials: 'include',
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    if (res.status === 401 || data.code === 'UNAUTHORIZED') {
      clearAuthTokens();
      return { ok: false, unauthorized: true, message: data.message || 'Sesi berakhir.' };
    }

    if (!res.ok || data.status !== 'success') {
      return {
        ok: false,
        message: data.message || 'Gagal menghapus data gempa.'
      };
    }

    clearEarthquakeCache();
    return {
      ok: true,
      message: data.message || 'Data gempa berhasil dihapus.'
    };
  } catch {
    return {
      ok: false,
      message: 'Gagal menghubungi server database MySQL XAMPP.'
    };
  }
}
