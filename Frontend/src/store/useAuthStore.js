import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: true,
  user: {
    username: 'SecurityAnalyst',
    role: 'user',
    progress: {
      modulesRead: 4,
      totalModules: 6,
      preventiveRead: 5,
      totalPreventive: 7,
    },
  },
  login: (userData) =>
    set({
      isAuthenticated: true,
      user: {
        username: userData?.username || 'SecurityAnalyst',
        role: 'user',
        progress: {
          modulesRead: 4,
          totalModules: 6,
          preventiveRead: 5,
          totalPreventive: 7,
        },
      },
    }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
