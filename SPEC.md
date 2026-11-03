# SPEC: PHISHYEARN

Dokumen acuan utama. AI wajib membaca file ini di awal setiap sesi. Jika ada keputusan baru, update file ini.

## 1. Tujuan
Web edukasi ancaman dan keamanan siber untuk pemula, bernuansa belajar ala Hack The Box, dilengkapi dashboard scan terinspirasi VirusTotal. User belajar lewat Module, memahami pencegahan lewat Preventive, lalu menguji pemahaman lewat Quiz.

Nama: PHISHYEARN (huruf kapital, dipakai di navbar dan footer).

## 2. Fitur Wajib (v1)
1. Autentikasi sederhana: register dan login hanya dengan username + password, logout. Tanpa email, tanpa verifikasi, tanpa forgot/reset password
2. Dashboard scan via API VirusTotal: tab URL, File, Search (hash/domain/IP)
3. Module (6 materi): Phishing, Malware, Ransomware, MITM, Social Engineering, Clickjacking
4. Preventive (7 topik): Use Strong Password, Check URL, Use Antivirus, Backup Data, Use VPN, Verify Identity, Update & Patch
5. Quiz: soal pilihan ganda dari bank soal yang dibuat dan dikelola sendiri lewat admin panel (jumlah soal bebas, urutan diacak tiap sesi), feedback benar/salah + penjelasan, skor akhir
6. About: tentang web, tujuan, daftar fitur
7. Admin Panel (role admin), fitur terbatas pada:
   - Melihat data user (daftar dan detail)
   - Menghapus user
   - Melihat progress user
   - Mengelola kuis: ubah soal dan pilihan jawaban (tambah, edit, hapus)

## 3. Layout Global
- Navbar: logo PHISHYEARN, menu profile hover/click (username, simple progress Module & Preventive, tombol logout)
- Sidebar: Dashboard, Module, Preventive, Quiz, About, Logout
- Footer: "Powered by PHISHYEARN"
- Halaman awal (belum login): hanya Login dan Register. Tidak ada halaman Forgot/Reset Password. Layout navbar/sidebar/footer hanya tampil setelah login
- Form Login: username + password, tanpa checkbox "Remember me" dan tanpa link "Forgot password?". Form Register: username + password. Tidak ada field email
- Setelah login redirect ke Dashboard; logout kembali ke halaman login
- Search bar navbar ditiadakan; pencarian terpusat langsung di tab Search pada Scanner Dashboard
- Admin Panel: halaman login sendiri (`/admin/login`), layout admin dengan sidebar: User, Progress, Quiz, Logout (route `/admin/user`, `/admin/progress`, `/admin/quiz`); tema dan komponen sama dengan sisi user

## 4. Detail per Fitur

### Autentikasi
- Username: 3-20 karakter, huruf/angka/underscore, unik (tidak membedakan huruf besar/kecil)
- Password: minimal 8 karakter
- Model User tidak menyimpan email
- Pesan error login selalu generik ("username atau password salah"), tidak membocorkan mana yang salah

### Dashboard
- Kotak input utama di tengah dengan tab URL / File / Search
- Hasil: skor deteksi (contoh 3/70 vendor), daftar vendor + status, reputasi, tanggal analisis
- Terinspirasi VirusTotal secara konsep, bukan tiruan persis; identitas visual sendiri

### Module
Tiap materi berisi: pengertian, cara kerja, contoh kasus, tanda-tanda, dampak. Isi berupa file Markdown statis di Frontend (tidak diedit lewat admin). Backend hanya mencatat progres baca per user berdasarkan slug materi.

### Preventive
Tiap topik berisi: kenapa penting, langkah praktis, kesalahan umum. Isi berupa file Markdown statis di Frontend; backend hanya mencatat progres baca per user.

### Quiz
- Bank soal dibuat dan dikelola sepenuhnya oleh admin lewat admin panel; tidak ada soal bawaan (tanpa seed)
- Jumlah soal bebas, tidak ada batas minimal maupun maksimal. Satu sesi memakai semua soal di bank dengan urutan diacak tiap sesi
- Jika bank soal kosong, halaman Quiz user menampilkan "Belum ada soal kuis"
- Soal yang dihapus admin saat sesi user sedang berjalan diabaikan saat penilaian
- Penilaian di backend; jawaban benar tidak dikirim ke frontend sebelum user menjawab
- Soal punya kategori (module/preventive), 4 opsi, satu jawaban benar, dan penjelasan singkat
- Hasil sesi disimpan (skor, jumlah total soal saat sesi itu, waktu) agar bisa dilihat admin; skor ditampilkan sebagai benar/total (misal 12/15) karena jumlah soal bisa berubah

### Admin Panel
- Akses hanya role admin; semua route `/api/admin/*` lewat middleware autentikasi + cek role di backend, user biasa yang mengakses mendapat 403
- Data user: daftar (dengan pencarian username) dan detail: username, role, tanggal daftar, aktivitas terakhir
- Hapus user: wajib konfirmasi; ikut menghapus progres dan hasil kuis user tersebut; admin tidak bisa menghapus akun admin (termasuk dirinya sendiri)
- Progres user: Module (x/6), Preventive (x/7), skor kuis terakhir dan tertinggi
- Kelola kuis: admin membuat sendiri semua soal (kategori module/preventive, pertanyaan, 4 pilihan jawaban, jawaban benar, penjelasan); tambah, edit, hapus soal. Tidak ada batas minimal atau maksimal jumlah soal. Perubahan langsung dipakai sesi kuis berikutnya di sisi user

## 5. Ditunda (jangan dikerjakan dulu)
- Forgot/reset password dan email apa pun (lupa password = akun dibuat ulang)
- Reset password oleh admin
- Tambah dan edit data user oleh admin
- Edit materi Module dan Preventive lewat admin (materi tetap file Markdown statis)
- Pengaturan jumlah soal per sesi dari admin (v1: satu sesi memakai semua soal di bank)
- Dashboard statistik admin (jumlah user, rata-rata progres, rata-rata nilai, user aktif)
- Leaderboard dan riwayat skor untuk user
- Sistem XP, badge, dan gamifikasi (warna ungu sudah disiapkan tapi belum dipakai)
- Toggle dark/light mode (v1 hanya tema gelap)
- Multi-bahasa
- Login sosial (Google/GitHub)

## 6. Gaya Tampilan
Tema: Royal Blue Dark Cybersecurity. Bersih, banyak ruang kosong, nuansa terminal/hacker tanpa berlebihan. Responsif sampai lebar 360px.

Aturan desain:
- Aksen utama Royal Blue (bukan hijau neon)
- Background navy gelap untuk kontras dan identitas cybersecurity
- Biru terang untuk interaksi aktif, biru gelap untuk hover/surface terpilih
- Warna status (hijau, kuning, merah, ungu) dipertahankan agar informasi mudah dibedakan
- Jangan pakai aksen biru di semua elemen; prioritaskan tombol utama, navigasi aktif, progress bar, ikon interaktif
- Font sans-serif untuk teks, monospace untuk kode, hash, dan label teknis
- Halaman auth: kartu di tengah dengan ikon perisai + wordmark PHISHYEARN, judul, form, tombol utama biru

Pemetaan elemen UI:
- Navigasi aktif/underline, tombol utama, progress bar, ikon aktif: #3B82F6
- Hover tombol utama: #2563EB
- Focus ring: #93C5FD
- Border kartu terpilih: #3B82F6
- Elemen disabled: #64748B
- Teks pada tombol utama: #FFFFFF
- Tombol hapus/aksi berbahaya: #FF5B64

CSS variables (wajib dipakai, jangan hardcode warna di komponen):

```css
:root {
  /* Background */
  --bg-primary: #0F1725;
  --bg-secondary: #111C2B;   /* navbar */
  --bg-card: #162233;
  --bg-elevated: #1D2A3D;

  /* Royal Blue */
  --accent-primary: #3B82F6;
  --accent-hover: #2563EB;
  --accent-light: #93C5FD;
  --accent-deep: #1E3A5F;
  --accent-glow: rgba(59, 130, 246, 0.13);

  /* Text */
  --text-primary: #F1F5F9;
  --text-secondary: #8FA2BD;
  --text-muted: #64748B;
  --text-on-accent: #FFFFFF;

  /* Borders */
  --border-primary: #253246;
  --border-secondary: #334155;
  --progress-track: #37465D;

  /* Status */
  --color-success: #20C997;
  --color-warning: #FBBF24;
  --color-danger: #FF5B64;
  --color-purple: #C86BFF;
  --color-info: #60A5FA;
}
```

## 7. Stack

Frontend (folder `Frontend/`): React + Vite, Tailwind, react-router-dom, axios, react-hook-form + zod, zustand, react-markdown, react-hot-toast, lucide-react

Backend (folder `Backend/`): Node + Express, MongoDB + Mongoose, dotenv, cors, cookie-parser, nodemon (dev)
- Auth: bcrypt, jsonwebtoken
- Keamanan: helmet, express-rate-limit, zod, express-mongo-sanitize
- VirusTotal: axios, multer, node-cache, p-queue

Aturan stack: jangan install library di luar daftar ini tanpa bertanya dulu. Nodemailer dan layanan email tidak dipakai.

## 8. Alur Autentikasi
- Access token berumur pendek (sekitar 15 menit), dikirim lewat header Authorization
- Refresh token (sekitar 7 hari) di cookie httpOnly, secure, sameSite; hash-nya disimpan di database
- Jangan simpan token di localStorage (rentan XSS)
- Register: validasi username + password, cek username unik, hash password, simpan user
- Login: cek username + password, buat kedua token
- Refresh: minta access token baru lewat cookie
- Logout: hapus cookie dan invalidasi refresh token di database
- Rate limit ketat pada login dan register (tidak ada recovery, jadi brute force harus dibatasi)
- Role: akun punya field `role` dengan dua nilai saja: `user` (pengguna PHISHYEARN) dan `admin` (admin panel). Register publik selalu menghasilkan role `user`; akun admin dibuat lewat seed script, bukan register publik. Jangan pakai istilah lain (siswa, trainee, student) di kode maupun tampilan
- Login admin memakai alur token yang sama; role dicek di backend lewat middleware `requireRole`, bukan hanya di frontend
- User yang dihapus admin: refresh token ikut tidak berlaku, sesi aktifnya tidak bisa diperpanjang

## 9. Aturan Keamanan
- API key dan secret hanya di `Backend/.env`; `.env` wajib di `.gitignore`; sediakan `Backend/.env.example` tanpa nilai rahasia (tanpa variabel email)
- Frontend tidak pernah memegang API key VirusTotal; frontend memanggil backend, backend memanggil VirusTotal
- Validasi semua input (zod) di backend, sanitasi terhadap NoSQL injection
- Konfigurasi CORS hanya untuk origin frontend (CLIENT_URL)
- Cache hasil dan antrean untuk request VirusTotal (limit gratis sekitar 4/menit dan 500/hari, non-komersial; cek ulang di dokumentasi resmi sebelum deploy)
- Upload file dibatasi ukurannya, dengan pesan error jelas
- Jangan tampilkan stack trace atau detail error internal ke user
- Jalankan `npm audit` sebelum deploy
- Semua route `/api/admin/*` wajib melewati middleware autentikasi dan cek role; respons API admin tidak pernah menyertakan hash password atau refresh token
- Markdown dirender tanpa HTML mentah (react-markdown default) untuk mencegah XSS

## 10. Struktur Proyek
```
Project-0/
├── SPEC.md
├── .gitignore
├── Backend/    (termasuk .env dan .env.example)
└── Frontend/
```
Struktur folder di dalam Backend dan Frontend ditentukan saat fasenya dikerjakan, lalu dicatat di CLAUDE.md atau di sini.

## 11. Aturan Kerja untuk AI
- Baca SPEC.md di awal setiap sesi
- Satu fitur per prompt; jelaskan rencana dan file yang akan diubah sebelum menulis kode
- Jangan tambah fitur di luar yang tertulis di Fitur Wajib
- Jangan ubah file di luar yang disebut dalam prompt
- Jangan refactor tanpa diminta
- Perubahan sekecil mungkin saat memperbaiki bug
- Gunakan CSS variables dari bagian Gaya Tampilan, bukan warna hardcode
- Konten materi (Module/Preventive) harus akurat; tandai bagian yang tidak yakin agar saya verifikasi
- Setelah selesai, sebutkan cara menguji hasilnya

## 12. Urutan Pengerjaan dan Status
Tandai [x] jika fase selesai. Fase berbasis data/logika: backend dulu, uji dengan Postman/Thunder Client, baru frontend. Fase berbasis konten/tampilan: frontend dulu.

- [x] Fase 0: Persiapan. Repo git, `.gitignore`, `Backend/.env`, akun + API key VirusTotal, MongoDB (Atlas/lokal), `npm run dev` jalan di Frontend dan Backend
- [x] Fase 1: Kerangka frontend (tanpa backend). Navbar, sidebar, footer, routing dengan halaman kosong, halaman Login dan Register (username + password), tema Royal Blue. Selesai jika semua menu bisa diklik dan konsisten di HP dan desktop
- [x] Fase 2: Autentikasi. Backend (koneksi DB, model User: username, password hash, role, aktivitas terakhir; register/login, refresh/logout, middleware proteksi + requireRole, rate limit, seed admin), lalu frontend (hubungkan form login/register, state user, protected route, redirect)
- [x] Fase 3: Progres Module dan Preventive. Materi tetap file Markdown di Frontend; backend: model Progress (userId, slug materi yang sudah selesai), endpoint catat dan baca progres. Isi materi wajib diverifikasi
- [x] Fase 4: Quiz. Backend (model Question/QuizResult; CRUD soal untuk admin di `/api/admin/questions` dengan requireRole; endpoint user ambil semua soal diacak tanpa jawaban benar + submit dan penilaian; tanpa seed, soal dibuat lewat panel admin), lalu sambungkan frontend admin halaman Quiz dan bangun ulang halaman Quiz user (quiz interaktif, feedback, skor akhir)
- [ ] Fase 5: Dashboard VirusTotal. Backend (service, endpoint URL/file/search, cache, antrean, error limit/ukuran file), lalu frontend (tab input, tampilan hasil)
- [ ] Fase 6: Admin Panel. Backend dulu (`/api/admin/*`: daftar + detail user, hapus user, progres user; uji dengan Postman/Thunder Client, termasuk uji user biasa ditolak 403 dan admin tidak bisa hapus admin), lalu sambungkan frontend admin halaman User dan Progress yang sudah jadi (halaman Quiz sudah disambungkan di Fase 4)
- [ ] Fase 7: About, finishing, review keamanan, deploy (Frontend ke Vercel/Netlify, Backend ke Render/Railway, DB di Atlas)

## 13. Keputusan Terbuka (isi saat sudah diputuskan)
- Hash password: bcrypt ✅
- Bahasa konten: Indonesia ✅ (satu bahasa saja)
- Autentikasi: username + password saja, tanpa email dan recovery ✅
- Logo: ikon perisai + wordmark PHISHYEARN (sudah ada di desain halaman auth) ✅
- Checkbox "Remember me" pada login: dihapus ✅ (masa sesi tetap, mengikuti umur refresh token)

## 14. Riwayat Revisi & Catatan Perubahan
- **Revisi Navbar & Profile Menu**:
  1. Hapus search bar dari Navbar; pencarian hash, domain, IP, dan URL difokuskan pada Scanner Dashboard.
  2. Perubahan interaksi profil Navbar menjadi hover popover (tetap mendukung click/tap pada layar sentuh).
  3. Popover profil menampilkan username, serta simple reading progress untuk Module (cth. 4/6 materi) dan Preventive (cth. 5/7 topik) dilengkapi mini progress bar.
  4. Hapus tombol/menu "Lihat Profil & Info" dari popover profil; menyisakan informasi user, indikator progres belajar, dan tombol Logout.
- **Revisi Autentikasi & Admin (30 Okt 2026)**:
  1. Autentikasi disederhanakan: login dan register hanya username + password. Email, forgot password, reset password, dan Nodemailer dihapus dari spec.
  2. Desain halaman Login (field email jadi username, hapus link "Forgot password?" dan checkbox "Remember me"), Register (hapus field email), dan halaman Reset Password (dihapus) perlu disesuaikan.
  3. Admin Panel dipersempit: lihat data user, hapus user, lihat progres user, dan kelola materi + soal/jawaban kuis. Tambah/edit user, reset password, dan dashboard statistik admin ditunda.
  4. Materi Module dan Preventive sempat direncanakan pindah ke database; dibatalkan, lihat revisi 1 Nov 2026.
- **Revisi Admin & Status Frontend (1 Nov 2026)**:
  1. Frontend sisi user dan admin sudah selesai dengan data mock; berikutnya backend.
  2. Sidebar admin final: User (lihat data + hapus user), Progress (progres tiap user), Quiz (ubah soal dan pilihan jawaban), Logout.
  3. Menu Materi admin dihapus; materi Module dan Preventive tetap file Markdown statis di Frontend. Backend hanya mencatat progres baca.
  4. Frontend admin memakai kredensial mock di `mock/adminData.js`; harus dihapus saat backend tersambung. Admin asli dibuat lewat seed script dari `Backend/.env`.
- **Revisi Istilah Role (1 Nov 2026)**:
  1. Istilah "siswa" dan "Trainee" dihapus. Sisi PHISHYEARN memakai role `user`, admin panel memakai role `admin`.
  2. Nilai role yang valid di database, backend, dan frontend hanya `user` dan `admin`; badge role di admin panel menampilkan teks "user" atau "admin".
  3. Data mock diganti: username `siswa_demo1` dan `siswa_demo2` menjadi `user_demo1` dan `user_demo2`.
- **Revisi Quiz (1 Nov 2026)**:
  1. Quiz tidak lagi memakai angka tetap (15 soal, minimal 30-40). Jumlah soal bebas dan sepenuhnya ditentukan admin; satu sesi memakai semua soal di bank dengan urutan acak.
  2. Semua soal dan jawaban dibuat sendiri lewat admin panel; tidak ada seed bank soal.
  3. Skor disimpan dan ditampilkan sebagai benar/total karena jumlah soal bisa berubah.
  4. CRUD soal untuk admin dipindah ke Fase 4 (bersama Quiz) karena soal harus bisa dibuat sebelum kuis user bisa diuji.
  5. Frontend yang perlu disesuaikan: teks "disarankan minimal 30" di halaman admin Quiz dihapus, dan halaman Quiz user nantinya memuat semua soal dari backend.