// TODO: Kredensial ini HANYA untuk mock frontend dan akan dihapus saat backend siap.
// Pada fase backend nanti, akun admin asli dibuat melalui seed script di backend dengan nilai rahasia dari .env.
// Pengecekan role admin yang sebenarnya juga dilakukan di backend (middleware requireRole).

export const MOCK_ADMIN_CREDENTIALS = {
  username: 'root',
  password: 'admin//404',
};

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

export const INITIAL_QUESTIONS = [
  {
    id: 'q-1',
    category: 'module',
    question: "Kamu menerima email dari 'bank' yang meminta klik tautan untuk verifikasi akun dalam 1 jam. Apa tindakan paling tepat?",
    options: [
      'Klik tautan dan segera isi data',
      'Balas email dengan data akun',
      'Abaikan tautan, buka situs resmi bank lewat browser sendiri',
      'Teruskan email ke teman agar ikut waspada',
    ],
    correctIndex: 2,
    explanation: 'Pesan yang menekan dengan batas waktu adalah ciri phishing. Jangan klik tautan di email; buka situs resmi dengan mengetik alamatnya sendiri.',
  },
  {
    id: 'q-2',
    category: 'module',
    question: 'Jenis malware apa yang mengenkripsi file korban dan menuntut tebusan uang untuk memulihkan akses?',
    options: ['Spyware', 'Ransomware', 'Adware', 'Rootkit'],
    correctIndex: 1,
    explanation: 'Ransomware adalah malware yang mengunci atau mengenkripsi data korban hingga tebusan dibayarkan.',
  },
  {
    id: 'q-3',
    category: 'preventive',
    question: 'Strategi pencadangan data 3-2-1 yang direkomendasikan memiliki arti...',
    options: [
      '3 hard disk, 2 kabel data, 1 password',
      '3 salinan data, 2 jenis media berbeda, 1 salinan di lokasi terpisah',
      '3 kali backup per hari, 2 kali per minggu, 1 kali per bulan',
      '3 user admin, 2 akun user, 1 server utama',
    ],
    correctIndex: 1,
    explanation: 'Strategi 3-2-1 berarti menyimpan 3 salinan data, pada 2 media penyimpanan berbeda, dengan 1 salinan berada di luar lokasi utama (off-site/cloud).',
  },
  {
    id: 'q-4',
    category: 'preventive',
    question: 'Manakah praktik pembuatan password yang paling aman sesuai prinsip cybersecurity?',
    options: [
      'Menggunakan tanggal lahir agar mudah diingat',
      'Menggunakan satu password rumit untuk semua akun',
      'Menggunakan passphrase panjang yang unik dan memanfaatkan password manager',
      'Mengganti huruf "a" dengan "@" pada kata umum yang pendek',
    ],
    correctIndex: 2,
    explanation: 'Passphrase yang panjang, unik di setiap platform, dan dikelola oleh password manager terbukti paling tahan terhadap serangan brute force dan credential stuffing.',
  },
  {
    id: 'q-5',
    category: 'module',
    question: 'Serangan Man-in-the-Middle (MITM) paling sering terjadi ketika korban terhubung ke...',
    options: [
      'Jaringan Wi-Fi publik tanpa enkripsi atau tanpa VPN',
      'Koneksi data seluler 4G/5G resmi',
      'Kabel LAN lokal di rumah sendiri',
      'Perangkat offline yang dimatikan',
    ],
    correctIndex: 0,
    explanation: 'Wi-Fi publik yang tidak terenkripsi memudahkan penyerang menyisipkan diri di antara pertukaran data korban dan router jaringan.',
  },
  {
    id: 'q-6',
    category: 'preventive',
    question: 'Mengapa pembaruan perangkat lunak (Update & Patch) sangat penting dilakukan secara berkala?',
    options: [
      'Hanya untuk mengubah tampilan antarmuka aplikasi',
      'Untuk menutup celah keamanan (vulnerability) yang ditemukan oleh vendor',
      'Supaya kuota internet cepat habis',
      'Agar perangkat menjadi lebih lambat',
    ],
    correctIndex: 1,
    explanation: 'Sebagian besar pembaruan perangkat lunak dirilis untuk memperbaiki kerentanan keamanan yang dapat dieksploitasi malware atau penyerang.',
  },
];
