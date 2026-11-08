// lib/api.js
// Axios instance terpusat untuk semua panggilan ke backend PHISHYEARN.
//
// - baseURL menggunakan path relatif secara default (didukung Vite proxy di dev & CloudFront di prod)
// - withCredentials: true agar cookie refresh token ikut dikirim di setiap request
// - Interceptor response: jika 401 dari endpoint selain /refresh dan /login,
//   coba refresh token sekali, lalu ulangi request. Jika refresh juga gagal,
//   clear state login dan redirect ke halaman login.

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // kirim cookie refreshToken di setiap request
});

// ── Interceptor: tangani 401 dengan auto-refresh ───────────────────────────────
// Simpan flag agar hanya satu refresh berjalan sekaligus
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jangan coba refresh jika:
    // - bukan 401
    // - sudah pernah dicoba (_retry flag)
    // - request itu sendiri adalah /refresh atau /login
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/admin-login') ||
      originalRequest.url?.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Antri request yang datang saat refresh sedang berjalan
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post('/api/auth/refresh');
        const newToken = res.data.accessToken;

        // Simpan token baru di store
        // Import dinamis untuk menghindari circular dependency
        const { useAuthStore } = await import('../store/useAuthStore.js');
        useAuthStore.getState().setAccessToken(newToken);

        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh gagal → logout paksa
        const { useAuthStore } = await import('../store/useAuthStore.js');
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
