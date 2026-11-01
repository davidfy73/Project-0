# BACKEND-LIST.md

> Daftar kebutuhan backend berdasarkan hasil penelusuran folder `Frontend/src`.
> Dibuat: 1 November 2026. Acuan utama: SPEC.md.

---

## 1. Autentikasi (Siswa)

**Data yang disimpan:**
`username`, `passwordHash`, `role` (`siswa` / `admin`), `createdAt`, `lastActiveAt`, `refreshTokenHash`

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| POST | `/api/auth/register` | Daftarkan user baru (role siswa secara otomatis) |
| POST | `/api/auth/login` | Login dengan username + password, kembalikan access token dan set refresh token di cookie |
| POST | `/api/auth/refresh` | Minta access token baru menggunakan refresh token dari cookie |
| POST | `/api/auth/logout` | Hapus cookie dan invalidasi refresh token di database |

**Halaman frontend yang memakai:**
`LoginPage.jsx`, `RegisterPage.jsx`, `Navbar.jsx` (tombol logout), `useAuthStore.js`

**Data mock yang digantikan:**
- `useAuthStore.js` → `isAuthenticated: true` dan objek `user` yang dipakai hardcode
- `loginAdmin` di `useAdminStore.js` menggunakan `MOCK_ADMIN_CREDENTIALS` (akan digantikan alur login yang sama lewat endpoint ini, karena admin memakai token yang sama)

---

## 2. Profil User (Data Sesi)

**Data yang disimpan:**
Sudah ada di tabel `users` (lihat fitur Autentikasi).

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/auth/me` | Ambil data user yang sedang login (username, role, progres ringkasan) |

**Halaman frontend yang memakai:**
`Navbar.jsx` (popover profil menampilkan username, role, dan progress Module/Preventive), `DashboardPage.jsx` (sapaan `Welcome back, username`)

**Data mock yang digantikan:**
- `user.username`, `user.role`, `user.progress.modulesRead`, `user.progress.preventiveRead` di `useAuthStore.js`
- Field `user?.email` di `Navbar.jsx` baris 163 (tidak sesuai SPEC, lihat catatan di bawah)

---

## 3. Module (Materi)

**Data yang disimpan:**
`slug`, `title`, `tag` (misal "Module 01"), `sections` → array `{ sectionId, title, contentMarkdown }`

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/modules` | Ambil daftar semua modul (id, title, tag) untuk halaman daftar |
| GET | `/api/modules/:slug` | Ambil detail satu modul beserta semua seksinya |

**Halaman frontend yang memakai:**
`ModulesPage.jsx`, `ModuleDetailPage.jsx`, `components/dashboard/ModulesOverview.jsx`

**Data mock yang digantikan:**
- `MODULES_DATA` di `Frontend/src/data/modulesData.js`
- Helper `getModuleById()` dan `getNavigation()` perlu disesuaikan agar pakai data API

---

## 4. Preventive (Materi Pencegahan)

**Data yang disimpan:**
`slug`, `title`, `number` (misal "Topic 01"), `blocks` → array block `{ type, text, items?, label?, variant? }`

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/preventive` | Ambil daftar semua topik preventive |
| GET | `/api/preventive/:slug` | Ambil detail satu topik beserta semua block-nya |

**Halaman frontend yang memakai:**
`PreventivePage.jsx`, `PreventiveDetailPage.jsx`, `components/dashboard/PreventiveOverview.jsx`

**Data mock yang digantikan:**
- `PREVENTIVE_DATA` di `Frontend/src/data/preventiveData.js`
- Helper `getPreventiveBySlug()` dan `getPreventiveNavigation()` perlu disesuaikan

---

## 5. Progress Belajar (Module & Preventive)

**Data yang disimpan:**
`userId` (ref ke users), `contentType` (`module` / `preventive`), `contentSlug`, `completedAt`

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/progress` | Ambil progres belajar milik user yang login (daftar slug yang sudah selesai) |
| POST | `/api/progress` | Catat satu konten sebagai sudah dibaca (body: `{ contentType, contentSlug }`) |

**Halaman frontend yang memakai:**
`ModuleDetailPage.jsx` (perlu mencatat saat user selesai membaca seksi terakhir), `PreventiveDetailPage.jsx` (sama), `Navbar.jsx` (menampilkan ringkasan `x/6` dan `x/7`)

**Data mock yang digantikan:**
- `user.progress.modulesRead`, `user.progress.preventiveRead` di `useAuthStore.js`
- `progress.completedModules`, `progress.completedPreventive` di `adminData.js`

---

## 6. Quiz

**Data yang disimpan:**

*Tabel soal:*
`question`, `options` (array 4 teks), `correctIndex`, `explanation`, `category` (`module` / `preventive`)

*Tabel hasil kuis:*
`userId` (ref ke users), `score`, `totalQuestions`, `playedAt`

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/quiz/questions` | Ambil 15 soal acak dari bank soal (tanpa `correctIndex` di respons) |
| POST | `/api/quiz/submit` | Kirim jawaban user, backend nilai dan simpan hasilnya, kembalikan skor + penjelasan |

**Halaman frontend yang memakai:**
`QuizPage.jsx`

**Data mock yang digantikan:**
- `QUIZ_SAMPLE` hardcode 1 soal di `QuizPage.jsx` (komentar TODO sudah ada)
- `INITIAL_QUESTIONS` di `adminData.js` (hanya 6 soal, perlu seed minimal 30–40 soal)
- Logika penilaian `isCorrect = selectedOption === QUIZ_SAMPLE.correctIndex` di frontend → dipindah ke backend

---

## 7. Dashboard VirusTotal (Scanner)

**Data yang disimpan:**
Tidak ada (cache sementara di memori server dengan `node-cache`, tidak disimpan ke database).

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| POST | `/api/scan/url` | Terima URL, kirim ke VirusTotal, kembalikan hasil analisis |
| POST | `/api/scan/file` | Terima file upload (multipart), kirim ke VirusTotal, kembalikan hasil |
| GET | `/api/scan/search` | Terima query `?q=hash_atau_domain`, kirim ke VirusTotal Search, kembalikan hasil |

**Halaman frontend yang memakai:**
`ScannerSection.jsx` (komponen utama di `DashboardPage.jsx`)

**Data mock yang digantikan:**
- Seluruh objek `SAMPLE_DEMOS` dan fungsi `handleStartScan` yang sekarang pakai `setTimeout` + data dummy
- Logika deteksi mock (`lower.includes('clean')`, dsb.) digantikan respons nyata dari backend

---

## 8. Admin — Kelola User

**Data yang disimpan:**
Menggunakan tabel `users` yang sudah ada.

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/admin/users` | Ambil daftar semua user (bisa filter dengan query `?search=username`) |
| GET | `/api/admin/users/:id` | Ambil detail satu user |
| DELETE | `/api/admin/users/:id` | Hapus user beserta progres dan hasil kuisnya; admin tidak bisa hapus admin |

**Halaman frontend yang memakai:**
`AdminUserPage.jsx`, `AdminProgressPage.jsx`

**Data mock yang digantikan:**
- `INITIAL_USERS` di `adminData.js`
- `deleteUser()` di `useAdminStore.js` yang saat ini hanya filter array lokal

---

## 9. Admin — Progress User

**Data yang disimpan:**
Menggunakan tabel `users`, `progress`, dan `quiz_results`.

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/admin/users/:id/progress` | Ambil progres lengkap satu user: modul selesai, preventive selesai, skor kuis terakhir dan tertinggi |

**Halaman frontend yang memakai:**
`AdminProgressPage.jsx`

**Data mock yang digantikan:**
- `user.progress` (seluruh objek) di `INITIAL_USERS` dalam `adminData.js`

---

## 10. Admin — Kelola Konten (Module & Preventive)

**Data yang disimpan:**
Sama dengan tabel `modules` dan `preventive`.

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| PUT | `/api/admin/modules/:slug` | Update isi (sections/markdown) satu modul |
| PUT | `/api/admin/preventive/:slug` | Update isi (blocks) satu topik preventive |

**Halaman frontend yang memakai:**
Halaman admin konten (belum ada di routing sekarang, akan ditambahkan saat Fase 6)

**Data mock yang digantikan:**
Tidak ada halaman mock-nya, ini murni fitur baru yang dibangun saat Fase 6.

---

## 11. Admin — Kelola Soal Kuis

**Data yang disimpan:**
Tabel `questions` (sama dengan fitur Quiz).

**Endpoint:**
| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/admin/questions` | Ambil semua soal di bank soal |
| POST | `/api/admin/questions` | Tambah soal baru |
| PUT | `/api/admin/questions/:id` | Edit soal yang sudah ada |
| DELETE | `/api/admin/questions/:id` | Hapus soal dari bank soal |

**Halaman frontend yang memakai:**
`AdminQuizPage.jsx`

**Data mock yang digantikan:**
- `INITIAL_QUESTIONS` di `adminData.js`
- `addQuestion()`, `updateQuestion()`, `deleteQuestion()` di `useAdminStore.js`

---

## Daftar Semua Tabel / Koleksi Database

- `users` — data akun (username, hash password, role, tanggal daftar, aktivitas terakhir, refresh token hash)
- `modules` — konten 6 materi ancaman siber (slug, judul, sections berisi Markdown)
- `preventive` — konten 7 topik pencegahan (slug, judul, blocks)
- `progress` — catatan progres per user (userId, contentType, contentSlug, waktu selesai)
- `questions` — bank soal kuis (pertanyaan, 4 opsi, jawaban benar, penjelasan, kategori)
- `quiz_results` — hasil sesi kuis per user (userId, skor, jumlah soal, waktu main)

---

## Urutan Pengerjaan yang Disarankan

1. **Setup dasar** — koneksi MongoDB, struktur folder Backend, `.env`, middleware global (helmet, cors, rate-limit, sanitasi)
2. **Model User + Autentikasi** — register, login, refresh, logout, seed akun admin, middleware `requireAuth` dan `requireRole`
3. **Model Module & Preventive + seed** — buat model, seed data dari `modulesData.js` dan `preventiveData.js` yang sudah ada di frontend, endpoint GET publik
4. **Progress belajar** — model Progress, endpoint GET dan POST, hubungkan ke halaman detail module/preventive
5. **Model Question + seed bank soal** — buat minimal 30 soal, endpoint ambil 15 acak (tanpa jawaban benar) dan submit
6. **Admin endpoints** — daftar/detail/hapus user, progres user, CRUD soal, edit konten; semua lewat middleware `requireRole('admin')`
7. **VirusTotal Scanner** — service axios ke VirusTotal API, endpoint scan URL/file/search, cache `node-cache`, antrean `p-queue`
8. **Integrasi frontend** — ganti semua data mock dengan panggilan axios ke backend

---

## Hal di Frontend yang Tidak Cocok dengan SPEC.md

1. **Field `email` masih ada di kode** — `useAuthStore.js` menyimpan `email: 'analyst@phishyearn.local'`, fungsi `login()` mengambil `userData?.email?.split('@')[0]`, dan `Navbar.jsx` baris 163 menampilkan `user?.email`. SPEC menyatakan tidak ada email sama sekali — semua referensi ini harus dihapus sebelum backend dibuat.

2. **`useAuthStore.js` selalu `isAuthenticated: true`** — state awal sudah terautentikasi tanpa cek token, sehingga protected route tidak berfungsi nyata. Harus diubah ke `false` dan autentikasi didasarkan pada access token valid.

3. **Admin pakai `sessionStorage`, bukan JWT** — `useAdminStore.js` menyimpan sesi admin di `sessionStorage` dengan string `'true'`. Setelah backend siap, admin harus memakai alur token yang sama dengan siswa, bukan session storage terpisah.

4. **`QuizPage.jsx` hanya menampilkan 1 soal** — frontend belum mengimplementasikan alur 15 soal bertahap. Perlu dibangun ulang saat Fase 4: ambil 15 soal dari backend, tampilkan satu per satu, kirim semua jawaban sekaligus di akhir.

5. **`correctIndex` ada di frontend** — `QuizPage.jsx` membawa `correctIndex` di konstanta lokal `QUIZ_SAMPLE`. Ada komentar TODO yang menyadari ini. Jawaban benar tidak boleh dikirim ke frontend sebelum user menjawab.

6. **Halaman admin konten belum ada** — SPEC mewajibkan admin bisa edit materi Module dan Preventive (editor Markdown + preview), tapi routing dan halaman untuk ini belum dibuat di frontend. Perlu ditambahkan di Fase 6 bersamaan dengan backend-nya.

7. **`role` di mock tidak konsisten** — mock siswa memakai `role: 'siswa'` di `adminData.js`, tapi di `useAuthStore.js` memakai `role: 'Trainee'`. SPEC menetapkan nilai yang valid adalah `siswa` dan `admin`. Perlu diseragamkan sebelum backend dibuat.
