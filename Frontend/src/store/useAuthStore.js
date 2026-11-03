// store/useAuthStore.js
// State autentikasi user PHISHYEARN.
// Access token disimpan di memori (bukan localStorage/sessionStorage).
// Refresh token ada di cookie httpOnly — tidak bisa diakses JS.

import { create } from 'zustand';
import api from '../lib/api.js';
import { useProgressStore } from './useProgressStore.js';

export const useAuthStore = create((set, get) => ({
  // null = belum diketahui (belum cek /me), false = belum login, object = data user
  isAuthenticated: false,
  accessToken: null,
  user: null,

  // Dipakai oleh interceptor api.js saat token di-refresh
  setAccessToken: (token) => {
    set({ accessToken: token });
    // Pasang di header default untuk request berikutnya
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Dipanggil setelah login berhasil
  login: (userData, token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({
      isAuthenticated: true,
      accessToken: token,
      user: {
        id: userData.id,
        username: userData.username,
        role: userData.role,
      },
    });

    // Muat progres belajar hanya jika role adalah 'user'
    if (userData.role === 'user') {
      useProgressStore.getState().fetchProgress();
    }
  },

  // Dipanggil saat logout atau refresh gagal
  clearAuth: () => {
    delete api.defaults.headers.common['Authorization'];
    set({ isAuthenticated: false, accessToken: null, user: null });
    useProgressStore.getState().reset();
  },

  // Logout: panggil backend lalu bersihkan state
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Tetap bersihkan state meski request gagal
    } finally {
      get().clearAuth();
    }
  },

  // Coba pulihkan sesi dari cookie refresh token yang masih valid.
  // Dipanggil satu kali di App.jsx saat mount.
  restoreSession: async () => {
    try {
      const res = await api.post('/api/auth/refresh');
      const newToken = res.data.accessToken;
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Ambil data user dengan token baru
      const meRes = await api.get('/api/auth/me');
      const userData = meRes.data.user;

      set({
        isAuthenticated: true,
        accessToken: newToken,
        user: {
          id: userData.id,
          username: userData.username,
          role: userData.role,
        },
      });

      // Muat progres belajar hanya jika role adalah 'user'
      if (userData.role === 'user') {
        useProgressStore.getState().fetchProgress();
      }
    } catch {
      // Cookie tidak ada atau sudah expired → tetap belum login & reset progres
      set({ isAuthenticated: false, accessToken: null, user: null });
      useProgressStore.getState().reset();
    }
  },
}));
