# SPEC: PHISHYEARN

Dokumen acuan utama. AI wajib membaca file ini di awal setiap sesi. Jika ada keputusan baru, update file ini.

## 1. Tujuan
Web edukasi ancaman dan keamanan siber untuk pemula, bernuansa belajar ala Hack The Box, dilengkapi dashboard scan terinspirasi VirusTotal. User belajar lewat Module, memahami pencegahan lewat Preventif, lalu menguji pemahaman lewat Quiz.

Nama: PHISHYEARN (huruf kapital, dipakai di navbar dan footer).

## 2. Fitur Wajib (v1)
1. Autentikasi: register, login (email/username + password), forgot/reset password, logout
2. Dashboard scan via API VirusTotal: tab URL, File, Search (hash/domain/IP)
3. Module (6 materi): Phishing, Malware, Ransomware, MITM, Social Engineering, Clickjacking
4. Preventif (7 topik): Use Strong Password, Check URL, Use Antivirus, Backup Data, Use VPN, Verify Identity, Update & Patch
5. Quiz: 15 soal pilihan ganda acak dari bank soal (sumber: Module + Preventif), feedback benar/salah + penjelasan, skor akhir
6. About: tentang web, tujuan, daftar fitur

## 3. Layout Global
- Navbar: logo PHISHYEARN, search bar, menu profile (lihat profil, logout)
- Sidebar: Dashboard, Module, Preventif, Quiz, About, Logout
- Footer: "Powered by PHISHYEARN"
- Halaman awal (belum login): Login, Register, Forgot Password. Layout navbar/sidebar/footer hanya tampil setelah login
- Setelah login redirect ke Dashboard; logout kembali ke halaman login
- Search bar navbar diarahkan ke fitur Search di Dashboard (hash/domain/IP/URL)

## 4. Detail per Fitur

### Dashboard
- Kotak input utama di tengah dengan tab URL / File / Search
- Hasil: skor deteksi (contoh 3/70 vendor), daftar vendor + status, reputasi, tanggal analisis
- Terinspirasi VirusTotal secara konsep, bukan tiruan persis; identitas visual sendiri

### Module
Tiap materi berisi: pengertian, cara kerja, contoh kasus, tanda-tanda, dampak. Disimpan sebagai file Markdown.

### Preventif
Tiap topik berisi: kenapa penting, langkah praktis, kesalahan umum. Disimpan sebagai file Markdown.

### Quiz
- Minimal 30-40 soal di bank soal agar 15 soal acak terasa bervariasi
- Penilaian di backend; jawaban benar tidak dikirim ke frontend sebelum user menjawab
- Soal punya kategori (module/preventif) dan penjelasan singkat

## 5. Ditunda (jangan dikerjakan dulu)
- Admin panel
- Leaderboard dan riwayat skor
- Sistem XP, badge, dan gamifikasi (warna ungu sudah disiapkan tapi belum dipakai)
- Toggle dark/light mode (v1 hanya tema gelap)
- Multi-bahasa
- Login sosial (Google/GitHub)
- Verifikasi email saat register
- Notifikasi email selain reset password

## 6. Gaya Tampilan
Tema: Royal Blue Dark Cybersecurity. Bersih, banyak ruang kosong, nuansa terminal/hacker tanpa berlebihan. Responsif sampai lebar 360px.

Aturan desain:
- Aksen utama Royal Blue (bukan hijau neon)
- Background navy gelap untuk kontras dan identitas cybersecurity
- Biru terang untuk interaksi aktif, biru gelap untuk hover/surface terpilih
- Warna status (hijau, kuning, merah, ungu) dipertahankan agar informasi mudah dibedakan
- Jangan pakai aksen biru di semua elemen; prioritaskan tombol utama, navigasi aktif, progress bar, ikon interaktif
- Font sans-serif untuk teks, monospace untuk kode, hash, dan label teknis

Pemetaan elemen UI:
- Navigasi aktif/underline, tombol utama, progress bar, ikon aktif: #3B82F6
- Hover tombol utama: #2563EB
- Focus ring: #93C5FD
- Border kartu terpilih: #3B82F6
- Elemen disabled: #64748B
- Teks pada tombol utama: #FFFFFF

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
- Auth: bcrypt, jsonwebtoken, crypto (bawaan), nodemailer
- Keamanan: helmet, express-rate-limit, zod, express-mongo-sanitize
- VirusTotal: axios, multer, node-cache, p-queue

Aturan stack: jangan install library di luar daftar ini tanpa bertanya dulu.

## 8. Alur Autentikasi
- Access token berumur pendek (sekitar 15 menit), dikirim lewat header Authorization
- Refresh token (sekitar 7 hari) di cookie httpOnly, secure, sameSite; hash-nya disimpan di database
- Jangan simpan token di localStorage (rentan XSS)
- Register: validasi, hash password, simpan user
- Login: cek password, buat kedua token
- Refresh: minta access token baru lewat cookie
- Logout: hapus cookie dan invalidasi refresh token di database
- Forgot password: token acak berumur singkat (sekitar 15 menit), simpan hash-nya, kirim link lewat email, hapus token setelah dipakai
- Respons forgot password selalu sama agar email user tidak bisa ditebak
- Rate limit ketat pada login, register, forgot password

## 9. Aturan Keamanan
- API key dan secret hanya di `Backend/.env`; `.env` wajib di `.gitignore`; sediakan `Backend/.env.example` tanpa nilai rahasia
- Frontend tidak pernah memegang API key VirusTotal; frontend memanggil backend, backend memanggil VirusTotal
- Validasi semua input (zod) di backend, sanitasi terhadap NoSQL injection
- Konfigurasi CORS hanya untuk origin frontend (CLIENT_URL)
- Cache hasil dan antrean untuk request VirusTotal (limit gratis sekitar 4/menit dan 500/hari, non-komersial; cek ulang di dokumentasi resmi sebelum deploy)
- Upload file dibatasi ukurannya, dengan pesan error jelas
- Jangan tampilkan stack trace atau detail error internal ke user
- Jalankan `npm audit` sebelum deploy

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
- Konten materi (Module/Preventif) harus akurat; tandai bagian yang tidak yakin agar saya verifikasi
- Setelah selesai, sebutkan cara menguji hasilnya

## 12. Urutan Pengerjaan dan Status
Tandai [x] jika fase selesai. Fase berbasis data/logika: backend dulu, uji dengan Postman/Thunder Client, baru frontend. Fase berbasis konten/tampilan: frontend dulu.

- [ ] Fase 0: Persiapan. Repo git, `.gitignore`, `Backend/.env`, akun + API key VirusTotal, MongoDB (Atlas/lokal), `npm run dev` jalan di Frontend dan Backend
- [ ] Fase 1: Kerangka frontend (tanpa backend). Navbar, sidebar, footer, routing dengan halaman kosong, tema Royal Blue. Selesai jika semua menu bisa diklik dan konsisten di HP dan desktop
- [ ] Fase 2: Autentikasi. Backend (koneksi DB, model User, register/login, refresh/logout, middleware proteksi, rate limit), lalu frontend (halaman login/register, state user, protected route, redirect), terakhir forgot/reset password (email)
- [ ] Fase 3: Module dan Preventif. Template halaman materi + 13 file Markdown. Draf boleh dari AI, isi wajib diverifikasi
- [ ] Fase 4: Quiz. Backend (model Question/QuizResult, seed bank soal, endpoint 15 soal acak + submit), lalu frontend (quiz interaktif, feedback, skor akhir)
- [ ] Fase 5: Dashboard VirusTotal. Backend (service, endpoint URL/file/search, cache, antrean, error limit/ukuran file), lalu frontend (tab input, tampilan hasil, hubungkan search navbar)
- [ ] Fase 6: About, halaman profil, finishing, review keamanan, deploy (Frontend ke Vercel/Netlify, Backend ke Render/Railway, DB di Atlas)

## 13. Keputusan Terbuka (isi saat sudah diputuskan)
- Layanan email untuk reset password: Nodemailer + SMTP ✅
- Hash password: bcrypt ✅
- Bahasa konten: [Indonesia / Inggris / keduanya]
- Logo: [belum dibuat]
