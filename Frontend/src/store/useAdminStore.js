// store/useAdminStore.js
// State autentikasi dan data admin PHISHYEARN.
// - Autentikasi lewat /api/auth/admin-login
// - Kelola bank soal kuis tersambung penuh ke API backend (/api/admin/questions)
// - Kelola data user dan pemantauan progres tersambung ke /api/admin/users & /api/admin/progress

import { create } from 'zustand';
import api from '../lib/api.js';

let latestUsersSearchRequestId = 0;

export const useAdminStore = create((set, get) => ({
  isAdminAuthenticated: false,
  adminUser: null,

  // ── Data User (Langkah 6) ──────────────────────────────────────────────────
  users: [],
  isLoadingUsers: false,
  usersError: null,

  // ── Data Progres Belajar Seluruh User (Langkah 6) ───────────────────────────
  progressUsers: [],
  isLoadingProgress: false,
  progressError: null,

  // Bank Soal Kuis (Langkah 4)
  questions: [],
  isLoadingQuestions: false,

  // Login admin via backend — hanya role 'admin' yang diterima
  loginAdmin: async (username, password) => {
    try {
      const res = await api.post('/api/auth/admin-login', { username, password });
      const { accessToken, user } = res.data;

      // Simpan token di header default axios
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      set({
        isAdminAuthenticated: true,
        adminUser: { username: user.username, role: user.role },
        _adminAccessToken: accessToken,
      });

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ??
        (!err.response
          ? 'Gagal terhubung ke server backend. Pastikan server backend sedang aktif.'
          : 'Username atau password salah.');
      return { success: false, message };
    }
  },

  // Logout admin: panggil backend lalu bersihkan state
  logoutAdmin: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Tetap bersihkan meski request gagal
    } finally {
      delete api.defaults.headers.common['Authorization'];
      set({
        isAdminAuthenticated: false,
        adminUser: null,
        _adminAccessToken: null,
        users: [],
        progressUsers: [],
      });
    }
  },

  // Pulihkan sesi admin dari cookie refresh (dipanggil di App.jsx saat mount)
  restoreAdminSession: async () => {
    try {
      const res = await api.post('/api/auth/refresh');
      const newToken = res.data.accessToken;
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      const meRes = await api.get('/api/auth/me');
      const userData = meRes.data.user;

      if (userData.role !== 'admin') {
        // Cookie ada tapi bukan admin — abaikan
        delete api.defaults.headers.common['Authorization'];
        return;
      }

      set({
        isAdminAuthenticated: true,
        adminUser: { username: userData.username, role: userData.role },
        _adminAccessToken: newToken,
      });
    } catch {
      set({ isAdminAuthenticated: false, adminUser: null });
    }
  },

  // ── Operasi User Admin (Langkah 6) ─────────────────────────────────────────

  // Muat daftar user (opsional search, abaikan respon lama dengan request ID)
  fetchUsers: async (search = '') => {
    const requestId = ++latestUsersSearchRequestId;
    set({ isLoadingUsers: true, usersError: null });

    try {
      const trimmed = search.trim();
      const res = await api.get('/api/admin/users', {
        params: trimmed ? { search: trimmed } : {},
      });

      // Abaikan jika ada request search yang lebih baru
      if (requestId === latestUsersSearchRequestId) {
        set({
          users: res.data.users || [],
          isLoadingUsers: false,
        });
      }
      return { success: true };
    } catch (err) {
      if (requestId === latestUsersSearchRequestId) {
        const message = err.response?.data?.message || 'Gagal memuat data user.';
        set({ isLoadingUsers: false, usersError: message });
      }
      return { success: false };
    }
  },

  // Ambil detail satu user beserta ringkasan progres & kuis
  getUserDetail: async (userId) => {
    try {
      const res = await api.get(`/api/admin/users/${userId}`);
      return { success: true, user: res.data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memuat detail user.';
      return { success: false, message };
    }
  },

  // Hapus user
  deleteUser: async (userId) => {
    try {
      const res = await api.delete(`/api/admin/users/${userId}`);
      // Hapus dari state lokal
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
        progressUsers: state.progressUsers.filter((u) => u.id !== userId),
      }));
      // Sinkronkan data progres di background
      get().fetchProgress().catch(() => {});
      return { success: true, message: res.data?.message || 'User berhasil dihapus.' };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menghapus user.';
      return { success: false, message };
    }
  },

  // ── Operasi Progres Belajar Seluruh User (Langkah 6) ───────────────────────

  // Muat data progres seluruh user
  fetchProgress: async () => {
    set({ isLoadingProgress: true, progressError: null });
    try {
      const res = await api.get('/api/admin/progress');
      set({
        progressUsers: res.data.users || [],
        isLoadingProgress: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memuat progres user.';
      set({ isLoadingProgress: false, progressError: message });
      return { success: false, message };
    }
  },

  // ── Operasi Bank Soal Kuis (Langkah 4) ──────────────────────────────────────

  // Muat semua soal dari database
  fetchQuestions: async () => {
    set({ isLoadingQuestions: true });
    try {
      const res = await api.get('/api/admin/questions');
      const raw = res.data.questions || [];
      const formatted = raw.map((q) => ({
        ...q,
        id: q._id || q.id,
      }));
      set({ questions: formatted, isLoadingQuestions: false });
      return { success: true };
    } catch (err) {
      set({ isLoadingQuestions: false });
      const message = err.response?.data?.message || 'Gagal memuat bank soal.';
      return { success: false, message };
    }
  },

  // Tambah soal baru
  addQuestion: async (newQuestion) => {
    try {
      const res = await api.post('/api/admin/questions', newQuestion);
      const created = res.data.question;
      const formatted = { ...created, id: created._id || created.id };
      set((state) => ({ questions: [formatted, ...state.questions] }));
      return { success: true, question: formatted };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menambahkan soal.';
      return { success: false, message };
    }
  },

  // Perbarui soal
  updateQuestion: async (questionId, updatedFields) => {
    try {
      const res = await api.put(`/api/admin/questions/${questionId}`, updatedFields);
      const updated = res.data.question;
      const formatted = { ...updated, id: updated._id || updated.id };
      set((state) => ({
        questions: state.questions.map((q) => (q.id === questionId ? formatted : q)),
      }));
      return { success: true, question: formatted };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memperbarui soal.';
      return { success: false, message };
    }
  },

  // Hapus soal
  deleteQuestion: async (questionId) => {
    try {
      await api.delete(`/api/admin/questions/${questionId}`);
      set((state) => ({
        questions: state.questions.filter((q) => q.id !== questionId),
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menghapus soal.';
      return { success: false, message };
    }
  },
}));
