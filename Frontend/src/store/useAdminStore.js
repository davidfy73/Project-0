// store/useAdminStore.js
// State autentikasi dan data admin PHISHYEARN.
// Mock credentials dan sessionStorage DIHAPUS — admin sekarang memakai
// alur JWT yang sama dengan user biasa, lewat /api/auth/admin-login.
// Data users dan questions masih pakai mock lokal sampai Langkah 4 & 6.

import { create } from 'zustand';
import { INITIAL_USERS, INITIAL_QUESTIONS } from '../mock/adminData';
import api from '../lib/api.js';

export const useAdminStore = create((set, get) => ({
  isAdminAuthenticated: false,
  adminUser: null,
  // Data berikut masih mock — akan diganti saat Langkah 4 (Quiz) dan Langkah 6 (Admin User)
  users: INITIAL_USERS,
  questions: INITIAL_QUESTIONS,

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

  // ── Operasi mock yang belum terhubung ke backend ────────────────────────────
  // TODO Langkah 6: ganti deleteUser dengan DELETE /api/admin/users/:id
  deleteUser: (userId) => {
    const { users } = get();
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser || targetUser.role === 'admin') return false;
    set({ users: users.filter((u) => u.id !== userId) });
    return true;
  },

  // TODO Langkah 4: ganti addQuestion/updateQuestion/deleteQuestion dengan /api/admin/questions
  addQuestion: (newQuestion) => {
    const { questions } = get();
    const id = `q-${Date.now()}`;
    const questionToAdd = { ...newQuestion, id };
    set({ questions: [questionToAdd, ...questions] });
    return questionToAdd;
  },

  updateQuestion: (questionId, updatedFields) => {
    const { questions } = get();
    set({
      questions: questions.map((q) =>
        q.id === questionId ? { ...q, ...updatedFields } : q
      ),
    });
    return true;
  },

  deleteQuestion: (questionId) => {
    const { questions } = get();
    set({ questions: questions.filter((q) => q.id !== questionId) });
    return true;
  },
}));
