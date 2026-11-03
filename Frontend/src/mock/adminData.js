// mock/adminData.js
// Data mock sementara untuk admin panel.
// - INITIAL_USERS: akan diganti dengan GET /api/admin/users di Langkah 6
// - Bank soal kuis sudah tersambung langsung ke backend (/api/admin/questions)

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    username: 'root',
    role: 'admin',
    registeredAt: '2026-09-01 09:00',
    lastActive: '2026-10-30 17:30',
    progress: {
      modulesRead: 6,
      totalModules: 6,
      preventiveRead: 7,
      totalPreventive: 7,
      completedModules: ['phishing', 'malware', 'ransomware', 'mitm', 'social-engineering', 'clickjacking'],
      completedPreventive: ['use-strong-password', 'check-url', 'use-antivirus', 'backup-data', 'use-vpn', 'verify-identity', 'update-patch'],
      lastQuizScore: '15/15',
      highestQuizScore: '15/15',
    },
  },
  {
    id: 'usr-2',
    username: 'user_demo1',
    role: 'user',
    registeredAt: '2026-09-15 14:20',
    lastActive: '2026-10-30 16:15',
    progress: {
      modulesRead: 6,
      totalModules: 6,
      preventiveRead: 7,
      totalPreventive: 7,
      completedModules: ['phishing', 'malware', 'ransomware', 'mitm', 'social-engineering', 'clickjacking'],
      completedPreventive: ['use-strong-password', 'check-url', 'use-antivirus', 'backup-data', 'use-vpn', 'verify-identity', 'update-patch'],
      lastQuizScore: '12/15',
      highestQuizScore: '14/15',
    },
  },
  {
    id: 'usr-3',
    username: 'user_demo2',
    role: 'user',
    registeredAt: '2026-10-10 11:05',
    lastActive: '2026-10-28 20:45',
    progress: {
      modulesRead: 2,
      totalModules: 6,
      preventiveRead: 0,
      totalPreventive: 7,
      completedModules: ['phishing', 'malware'],
      completedPreventive: [],
      lastQuizScore: 'Belum ada',
      highestQuizScore: 'Belum ada',
    },
  },
];
