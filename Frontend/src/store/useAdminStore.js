import { create } from 'zustand';
import { MOCK_ADMIN_CREDENTIALS, INITIAL_USERS, INITIAL_QUESTIONS } from '../mock/adminData';

// TODO: Store ini mengelola state mock untuk admin di frontend.
// Saat backend siap, operasi autentikasi dan data admin akan dipindahkan ke API (/api/admin/*)
// dengan pengecekan token JWT dan middleware role 'admin' di backend.

export const useAdminStore = create((set, get) => ({
  isAdminAuthenticated: Boolean(sessionStorage.getItem('phishyearn_admin_session')),
  adminUser: sessionStorage.getItem('phishyearn_admin_session')
    ? { username: 'root', role: 'admin' }
    : null,
  users: INITIAL_USERS,
  questions: INITIAL_QUESTIONS,

  loginAdmin: (username, password) => {
    // Validasi sederhana mock frontend
    if (
      username === MOCK_ADMIN_CREDENTIALS.username &&
      password === MOCK_ADMIN_CREDENTIALS.password
    ) {
      sessionStorage.setItem('phishyearn_admin_session', 'true');
      set({
        isAdminAuthenticated: true,
        adminUser: { username: 'root', role: 'admin' },
      });
      return { success: true };
    }

    return {
      success: false,
      message: 'Username atau password salah',
    };
  },

  logoutAdmin: () => {
    sessionStorage.removeItem('phishyearn_admin_session');
    set({
      isAdminAuthenticated: false,
      adminUser: null,
    });
  },

  deleteUser: (userId) => {
    const { users } = get();
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser || targetUser.role === 'admin') {
      return false;
    }

    set({
      users: users.filter((u) => u.id !== userId),
    });
    return true;
  },

  addQuestion: (newQuestion) => {
    const { questions } = get();
    const id = `q-${Date.now()}`;
    const questionToAdd = { ...newQuestion, id };
    set({
      questions: [questionToAdd, ...questions],
    });
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
    set({
      questions: questions.filter((q) => q.id !== questionId),
    });
    return true;
  },
}));
