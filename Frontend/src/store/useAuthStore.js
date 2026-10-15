import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: true, // Default true agar dashboard langsung dapat ditinjau
  user: {
    username: 'SecurityAnalyst',
    email: 'analyst@phishyearn.local',
    role: 'Trainee',
  },
  login: (userData) =>
    set({
      isAuthenticated: true,
      user: {
        username: userData?.email?.split('@')[0] || 'SecurityAnalyst',
        email: userData?.email || 'analyst@phishyearn.local',
        role: 'Trainee',
      },
    }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
