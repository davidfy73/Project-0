// store/useScanStore.js
// State management untuk scanner VirusTotal (URL, File, Lookup).
// Mengatur request, polling berkala (tiap 5 detik), penanganan kuota 429, dan pembatalan polling.

import { create } from 'zustand';
import api from '../lib/api.js';

const INITIAL_TAB_STATE = {
  result: null,
  isLoading: false,
  statusText: '',
  error: null,
  retryAfter: 0,
};

let currentRequestId = 0;
let activePollingTimer = null;
let activeCountdownTimer = null;

export const useScanStore = create((set, get) => ({
  // State per tab
  urlTab: { ...INITIAL_TAB_STATE },
  fileTab: { ...INITIAL_TAB_STATE },
  lookupTab: { ...INITIAL_TAB_STATE },

  // Hentikan polling dan bersihkan semua timer aktif
  cancelPolling: () => {
    currentRequestId += 1;
    if (activePollingTimer) {
      clearTimeout(activePollingTimer);
      activePollingTimer = null;
    }
    if (activeCountdownTimer) {
      clearInterval(activeCountdownTimer);
      activeCountdownTimer = null;
    }

    // Reset status loading jika sedang berjalan
    const state = get();
    const updates = {};
    if (state.urlTab.isLoading) updates.urlTab = { ...state.urlTab, isLoading: false, statusText: '' };
    if (state.fileTab.isLoading) updates.fileTab = { ...state.fileTab, isLoading: false, statusText: '' };
    if (state.lookupTab.isLoading) updates.lookupTab = { ...state.lookupTab, isLoading: false, statusText: '' };

    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },

  // Reset data tab tertentu
  resetTab: (tabKey) => {
    get().cancelPolling();
    const key = `${tabKey}Tab`;
    set({ [key]: { ...INITIAL_TAB_STATE } });
  },

  // ── Polling Runner ─────────────────────────────────────────────────────────
  _pollAnalysis: (tabKey, analysisId, reqId, attemptCount = 0) => {
    const key = `${tabKey}Tab`;

    // 1. Cek apakah request sudah dibatalkan atau diganti oleh request baru
    if (reqId !== currentRequestId) return;

    // 2. Batas maksimal polling: 24 kali x 5 detik = 120 detik (2 menit)
    if (attemptCount >= 24) {
      set({
        [key]: {
          ...get()[key],
          isLoading: false,
          statusText: '',
          error: 'Waktu analisis melebihi batas waktu (2 menit). Silakan periksa kembali nanti di VirusTotal.',
        },
      });
      return;
    }

    // 3. Jadwalkan polling berikutnya dalam 5 detik
    activePollingTimer = setTimeout(async () => {
      if (reqId !== currentRequestId) return;

      set({
        [key]: {
          ...get()[key],
          statusText: 'Mengecek pembaruan status analisis di VirusTotal...',
        },
      });

      try {
        const res = await api.get(`/api/scan/analysis/${encodeURIComponent(analysisId)}`);
        if (reqId !== currentRequestId) return;

        const data = res.data?.data;

        // Jika selesai, tampilkan hasil lengkap
        if (data?.status === 'completed') {
          set({
            [key]: {
              ...INITIAL_TAB_STATE,
              result: data,
            },
          });
          return;
        }

        // Jika masih di antrean atau sedang dianalisis, lanjutkan polling
        const statusLabel =
          data?.status === 'in_progress'
            ? 'Sedang dianalisis oleh vendor keamanan...'
            : 'Menunggu antrean analisis VirusTotal...';

        set({
          [key]: {
            ...get()[key],
            statusText: statusLabel,
          },
        });

        get()._pollAnalysis(tabKey, analysisId, reqId, attemptCount + 1);
      } catch (err) {
        if (reqId !== currentRequestId) return;

        // Tangani 429 saat polling (jangan kirim ulang scan, tunggu hitung mundur lalu lanjutkan polling)
        if (err.response?.status === 429) {
          const retryAfterSec = Number(err.response?.data?.retryAfter) || 15;
          get()._startCountdown(tabKey, retryAfterSec, () => {
            get()._pollAnalysis(tabKey, analysisId, reqId, attemptCount + 1);
          });
          return;
        }

        const message = err.response?.data?.message || 'Gagal mengambil pembaruan analisis.';
        set({
          [key]: {
            ...get()[key],
            isLoading: false,
            statusText: '',
            error: message,
          },
        });
      }
    }, 5000);
  },

  // ── Helper Countdown untuk 429 ─────────────────────────────────────────────
  _startCountdown: (tabKey, seconds, onComplete) => {
    const key = `${tabKey}Tab`;
    if (activeCountdownTimer) {
      clearInterval(activeCountdownTimer);
      activeCountdownTimer = null;
    }

    let remaining = seconds;
    set({
      [key]: {
        ...get()[key],
        retryAfter: remaining,
        statusText: `Batas kuota tercapai. Menunggu ${remaining} detik sebelum melanjutkan pengecekan...`,
      },
    });

    activeCountdownTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(activeCountdownTimer);
        activeCountdownTimer = null;
        set({
          [key]: {
            ...get()[key],
            retryAfter: 0,
            statusText: 'Melanjutkan proses analisis...',
          },
        });
        if (typeof onComplete === 'function') {
          onComplete();
        }
      } else {
        set({
          [key]: {
            ...get()[key],
            retryAfter: remaining,
            statusText: `Batas kuota tercapai. Menunggu ${remaining} detik sebelum melanjutkan pengecekan...`,
          },
        });
      }
    }, 1000);
  },

  // ── Aksi: Scan URL ─────────────────────────────────────────────────────────
  scanUrl: async (rawUrl) => {
    get().cancelPolling();
    const reqId = ++currentRequestId;

    set({
      urlTab: {
        ...INITIAL_TAB_STATE,
        isLoading: true,
        statusText: 'Mengirim URL ke VirusTotal...',
      },
    });

    try {
      const res = await api.post('/api/scan/url', { url: rawUrl });
      if (reqId !== currentRequestId) return;

      const data = res.data?.data;

      // Jika analisis langsung selesai (misal laporan sudah ada di VT atau cache hit)
      if (data?.status === 'completed') {
        set({
          urlTab: {
            ...INITIAL_TAB_STATE,
            result: data,
          },
        });
        return { success: true };
      }

      // Jika dalam antrean / in_progress, mulai polling
      if (data?.analysisId) {
        set({
          urlTab: {
            ...get().urlTab,
            statusText: 'Menunggu antrean analisis VirusTotal...',
          },
        });
        get()._pollAnalysis('url', data.analysisId, reqId, 0);
        return { success: true, queued: true };
      }

      throw new Error('Respons analisis tidak valid dari server.');
    } catch (err) {
      if (reqId !== currentRequestId) return;

      if (err.response?.status === 429) {
        const retryAfterSec = Number(err.response?.data?.retryAfter) || 15;
        const msg = err.response?.data?.message || 'Batas scan tercapai.';
        set({
          urlTab: {
            ...INITIAL_TAB_STATE,
            error: msg,
          },
        });
        get()._startCountdown('url', retryAfterSec);
        return { success: false, rateLimited: true };
      }

      const message = err.response?.data?.message || 'Gagal memindai URL. Coba lagi nanti.';
      set({
        urlTab: {
          ...INITIAL_TAB_STATE,
          error: message,
        },
      });
      return { success: false, message };
    }
  },

  // ── Aksi: Scan File ────────────────────────────────────────────────────────
  scanFile: async (file) => {
    get().cancelPolling();
    const reqId = ++currentRequestId;

    // Pengecekan ukuran di frontend (maks 32 MB)
    const MAX_SIZE = 32 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      set({
        fileTab: {
          ...INITIAL_TAB_STATE,
          error: 'Ukuran file melebihi batas maksimum 32 MB.',
        },
      });
      return { success: false, message: 'Ukuran file melebihi batas maksimum 32 MB.' };
    }

    set({
      fileTab: {
        ...INITIAL_TAB_STATE,
        isLoading: true,
        statusText: 'Memeriksa dan menganalisis file...',
      },
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Biarkan Axios mengatur header Content-Type multipart secara otomatis
      const res = await api.post('/api/scan/file', formData);
      if (reqId !== currentRequestId) return;

      const data = res.data?.data;

      // Jika hash sudah dikenal di VT, hasil langsung completed tanpa upload ulang
      if (data?.status === 'completed') {
        set({
          fileTab: {
            ...INITIAL_TAB_STATE,
            result: data,
          },
        });
        return { success: true };
      }

      // Jika file baru di-upload dan sedang dianalisis, mulai polling
      if (data?.analysisId) {
        set({
          fileTab: {
            ...get().fileTab,
            statusText: 'File diunggah. Menunggu proses analisis di sandbox...',
          },
        });
        get()._pollAnalysis('file', data.analysisId, reqId, 0);
        return { success: true, queued: true };
      }

      throw new Error('Respons analisis tidak valid dari server.');
    } catch (err) {
      if (reqId !== currentRequestId) return;

      if (err.response?.status === 413) {
        set({
          fileTab: {
            ...INITIAL_TAB_STATE,
            error: 'Ukuran file melebihi batas maksimum 32 MB.',
          },
        });
        return { success: false, message: 'Ukuran file melebihi batas maksimum 32 MB.' };
      }

      if (err.response?.status === 429) {
        const retryAfterSec = Number(err.response?.data?.retryAfter) || 15;
        const msg = err.response?.data?.message || 'Batas scan tercapai.';
        set({
          fileTab: {
            ...INITIAL_TAB_STATE,
            error: msg,
          },
        });
        get()._startCountdown('file', retryAfterSec);
        return { success: false, rateLimited: true };
      }

      const message = err.response?.data?.message || 'Gagal memproses file. Coba lagi nanti.';
      set({
        fileTab: {
          ...INITIAL_TAB_STATE,
          error: message,
        },
      });
      return { success: false, message };
    }
  },

  // ── Aksi: Lookup Indicator (Hash / Domain / IP) ─────────────────────────────
  lookup: async (query) => {
    get().cancelPolling();
    const reqId = ++currentRequestId;

    set({
      lookupTab: {
        ...INITIAL_TAB_STATE,
        isLoading: true,
        statusText: 'Mencari indikator ancaman di VirusTotal...',
      },
    });

    try {
      const res = await api.post('/api/scan/lookup', { query: query.trim() });
      if (reqId !== currentRequestId) return;

      const data = res.data?.data;

      set({
        lookupTab: {
          ...INITIAL_TAB_STATE,
          result: data,
        },
      });
      return { success: true };
    } catch (err) {
      if (reqId !== currentRequestId) return;

      if (err.response?.status === 429) {
        const retryAfterSec = Number(err.response?.data?.retryAfter) || 15;
        const msg = err.response?.data?.message || 'Batas scan tercapai.';
        set({
          lookupTab: {
            ...INITIAL_TAB_STATE,
            error: msg,
          },
        });
        get()._startCountdown('lookup', retryAfterSec);
        return { success: false, rateLimited: true };
      }

      const message = err.response?.data?.message || 'Gagal melakukan pencarian indikator.';
      set({
        lookupTab: {
          ...INITIAL_TAB_STATE,
          error: message,
        },
      });
      return { success: false, message };
    }
  },
}));
