// store/useAdminStore.js
// State autentikasi dan data admin PHISHYEARN.
// - Autentikasi lewat /api/auth/admin-login
// - Kelola bank soal kuis tersambung penuh ke API backend (/api/admin/questions)
// - Data users masih mock sampai Langkah 6

import { create } from 'zustand';
import { INITIAL_USERS } from '../mock/adminData';
import api from '../lib/api.js';

export const useAdminStore = create((set, get) => ({
  isAdminAuthenticated: false,
  adminUser: null,

  // Data user admin (Langkah 6)
  users: INITIAL_USERS,

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
          ? 'Gagal terhubung ke server backend. Pastikan server backend sudah dijalankan di port 5000.'
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
      set({ isAdminAuthenticated: false, adminUser: null, _adminAccessToken: null });
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

  // ── Operasi User Mock (Langkah 6) ───────────────────────────────────────────
  // TODO Langkah 6: ganti deleteUser dengan DELETE /api/admin/users/:id
  deleteUser: (userId) => {
    const { users } = get();
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser || targetUser.role === 'admin') return false;
    set({ users: users.filter((u) => u.id !== userId) });
    return true;
  },
}));
