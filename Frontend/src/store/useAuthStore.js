import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: true,
  user: {
    username: 'SecurityAnalyst',
    email: 'analyst@phishyearn.local',
    role: 'Trainee',
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
        username: userData?.email?.split('@')[0] || 'SecurityAnalyst',
        email: userData?.email || 'analyst@phishyearn.local',
        role: 'Trainee',
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
