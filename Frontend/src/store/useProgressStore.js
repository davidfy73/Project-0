// store/useProgressStore.js
// State progres belajar materi Module & Preventive per user.
// Menggunakan data nyata dari backend (/api/progress).

import { create } from 'zustand';
import api from '../lib/api.js';

const INITIAL_STATE = {
  module: [],
  preventive: [],
  moduleCount: 0,
  moduleTotal: 6,
  preventiveCount: 0,
  preventiveTotal: 7,
  isLoading: false,
  isCompleting: false,
  error: null,
};

export const useProgressStore = create((set, get) => ({
  ...INITIAL_STATE,

  // Muat progres belajar dari server
  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/api/progress');
      const data = res.data.progress || {};
      set({
        module: data.module || [],
        preventive: data.preventive || [],
        moduleCount: data.moduleCount ?? 0,
        moduleTotal: data.moduleTotal ?? 6,
        preventiveCount: data.preventiveCount ?? 0,
        preventiveTotal: data.preventiveTotal ?? 7,
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memuat progres belajar.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  // Tandai materi selesai dibaca (idempoten)
  completeMaterial: async (slug) => {
    set({ isCompleting: true, error: null });
    try {
      const res = await api.post('/api/progress/complete', { slug });
      const data = res.data.progress || {};
      set({
        module: data.module || [],
        preventive: data.preventive || [],
        moduleCount: data.moduleCount ?? get().moduleCount,
        moduleTotal: data.moduleTotal ?? get().moduleTotal,
        preventiveCount: data.preventiveCount ?? get().preventiveCount,
        preventiveTotal: data.preventiveTotal ?? get().preventiveTotal,
        isCompleting: false,
      });
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menandai materi selesai.';
      set({ isCompleting: false, error: message });
      return { success: false, message };
    }
  },

  // Reset progres saat logout atau sesi berakhir
  reset: () => {
    set({ ...INITIAL_STATE });
  },
}));
