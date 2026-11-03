# BACKEND-STEPS: Langkah Membuat Backend PHISHYEARN

Acuan: SPEC.md (selalu dibaca AI di awal setiap sesi). Dokumen ini hanya gambaran dan instruksi per langkah. Perintah dan prompt detail dibuat saat langkahnya dikerjakan.

## Cara Kerja (berlaku di semua langkah)

1. Satu langkah = satu prompt (atau beberapa prompt kecil), jangan digabung
2. Backend dibuat dan diuji dulu lewat Thunder Client/Postman
3. Setelah lolos uji, baru sambungkan frontend ke API itu dan ganti data mock
4. Uji di browser, lalu commit (cek `git status --short` dulu)
5. Centang langkah di sini, lalu lanjut

Aturan tetap: role hanya `user` dan `admin`, tanpa email, rahasia hanya di `Backend/.env`, jangan install library di luar SPEC.md, AI wajib menjelaskan rencana dulu sebelum menulis kode.

## Gambaran Alur

```
[x] Persiapan -> [x] Rapikan frontend -> [x] Backend dasar -> [x] Auth -> [x] Quiz
-> [x] Progress -> [x] Admin (User + Progress) -> [ ] Scan VirusTotal -> [ ] Deploy
```

Urutan ini sengaja: Auth dulu karena semua fitur lain butuh login; Quiz sebelum Admin lainnya karena soal harus bisa dibuat admin sebelum kuis user bisa diuji; Scan terakhir karena paling rumit (batas API, upload file).

---

## Langkah 0: Persiapan (di terminal sendiri)

Tujuan: lingkungan siap sebelum AI menyentuh backend.

- [x] `.gitignore` melindungi `.env` dan `node_modules`
- [x] Library backend terpasang, `type: module`
- [x] Database MongoDB lokal (Docker, container phishyearn-server) jalan
- [x] `Backend/.env` terisi (database, dua secret token, akun admin dari env)
- [x] `Backend/.env.example` sesuai (nama variabel saja, tanpa nilai)

Selesai jika: `.env` terisi dan tidak muncul di `git status`.

## Langkah 1: Rapikan Frontend (di Antigravity)

Tujuan: frontend bersih dari sisa keputusan lama sebelum disambungkan.

- [x] Hapus semua referensi email
- [x] Samakan istilah role jadi `user` dan `admin` (hapus "Trainee" dan "siswa")
- [x] Rapikan halaman admin Quiz (jumlah soal bebas, tanpa saran minimal)
- [x] Catat daftar slug resmi 6 Module dan 7 Preventive

Selesai jika: pencarian "email", "siswa", dan "Trainee" di `Frontend/src` kosong, aplikasi tetap jalan.

## Langkah 2: Backend Dasar

Tujuan: server berdiri, tersambung ke database, siap diisi fitur.

- [x] Struktur folder Backend yang sederhana (config, models, routes, controllers, middleware)
- [x] Server Express yang membaca pengaturan dari `.env` dan berhenti dengan pesan jelas jika ada yang kosong
- [x] Koneksi ke MongoDB lokal
- [x] Middleware keamanan dasar: header aman, CORS hanya untuk alamat frontend, pembaca cookie, sanitasi input, penanganan error tanpa membocorkan detail
- [x] Satu endpoint cek kesehatan (`/api/health`)

Selesai jika: `npm run dev` jalan, `/api/health` menjawab OK, dan log menunjukkan database terhubung.

## Langkah 3: Autentikasi

Tujuan: user bisa daftar, login, tetap login saat halaman di-refresh, dan logout. Admin punya pintu masuk sendiri.

- [x] Model User: username, password (di-hash), role, aktivitas terakhir, tanggal daftar
- [x] Register (selalu role `user`), login, refresh, logout, dan "siapa saya" (`me`)
- [x] Login admin di jalur terpisah, hanya menerima role `admin`
- [x] Pengaman route: `requireAuth` (harus login) dan `requireRole` (cek role di backend)
- [x] Pembatas percobaan login dan register
- [x] Seed akun admin dari `ADMIN_USERNAME` dan `ADMIN_PASSWORD` di `.env`
- [x] Sambungkan frontend: form login/register user, login admin, penanda login, route terlindungi, logout. Hapus kredensial mock admin.

Cara sesi bekerja: access token singkat dikirim lewat header, refresh token di cookie httpOnly, tidak ada token di localStorage.

Selesai jika: daftar, login, refresh halaman tetap login, logout, login admin berhasil, dan user biasa ditolak di area admin (403).

## Langkah 4: Quiz (termasuk soal dari admin)

Tujuan: admin membuat sendiri soal dan jawaban; user mengerjakan kuis dari soal itu.

Yang dibuat:

- [x] Model Question (kategori, pertanyaan, 4 pilihan, jawaban benar, penjelasan) dan QuizResult (skor, total soal, waktu)
- [x] Sisi admin: tambah, edit, hapus, dan lihat soal
- [x] Sisi user: ambil semua soal dengan urutan acak (jawaban benar tidak dikirim), kirim jawaban, penilaian dilakukan di backend, hasil disimpan
- [x] Tanpa seed soal dan tanpa angka tetap; jumlah soal bebas
- [x] Sambungkan frontend: halaman admin Quiz (CRUD soal) dan halaman Quiz user (bangun ulang agar memuat semua soal dari backend dan menampilkan skor benar/total)

Selesai jika: admin membuat beberapa soal, user menyelesaikan satu sesi penuh, skor tersimpan, dan bank kosong menampilkan "Belum ada soal kuis".

## Langkah 5: Progress Belajar

Tujuan: sistem tahu materi mana yang sudah dibaca tiap user.

Yang dibuat:

- [x] Model Progress: user dan daftar slug materi yang selesai
- [x] Catat materi selesai dan baca progres sendiri
- [x] Backend hanya menerima slug yang sah (6 Module dan 7 Preventive); isi materi tetap file di Frontend
- [x] Sambungkan frontend: tombol/penanda selesai di halaman Module dan Preventive, serta ringkasan progres di popover profil Navbar

Selesai jika: membaca materi menambah angka progres (misal 3/6) dan angka bertahan setelah logout dan login lagi.

## Langkah 6: Admin (User dan Progress)

Tujuan: admin bisa melihat, memantau, dan menghapus user.

Yang dibuat:

- [x] Daftar user (dengan pencarian) dan detail user
- [x] Hapus user, ikut menghapus progres dan hasil kuisnya; akun admin tidak bisa dihapus
- [x] Progres semua user: Module x/6, Preventive x/7, skor kuis terakhir dan tertinggi
- [x] Semua route admin lewat `requireAuth` dan `requireRole('admin')`; respons tidak pernah memuat hash password atau token
- [x] Sambungkan frontend: halaman User dan Progress di admin panel

Selesai jika: daftar user tampil nyata, hapus user bekerja dengan konfirmasi, progres sesuai aktivitas user, dan user biasa tidak bisa memanggil route admin.

## Langkah 7: Scan VirusTotal [BERIKUTNYA]

Tujuan: dashboard scan memakai VirusTotal sungguhan tanpa membocorkan API key.

Yang dibuat:

- [ ] Layanan yang memanggil VirusTotal dari backend (API key hanya di `.env`)
- [ ] Scan URL, scan file (upload), dan pencarian hash/domain/IP
- [ ] Cache hasil dan antrean agar tidak melewati batas request gratis
- [ ] Pesan error jelas untuk batas tercapai dan file terlalu besar; file upload tidak disimpan ke disk
- [ ] Sambungkan frontend: tiga tab di Scanner, ganti data demo dengan hasil asli

Selesai jika: scan URL dan pencarian hash menampilkan hasil nyata, dan batas ditangani dengan pesan yang rapi.

## Langkah 8: Finishing dan Deploy

Tujuan: web bisa diakses publik dengan aman.

- [ ] Audit keamanan: tidak ada secret di kode atau repo, cookie dan CORS benar untuk production, respons tidak membocorkan data, `npm audit` bersih
- [ ] Hapus sisa data mock di frontend
- [ ] Siapkan variabel lingkungan untuk production
- [ ] Deploy: Backend ke Render/Railway, Frontend ke Vercel/Netlify, database tetap di Atlas
- [ ] Jalankan seed admin sekali di database production dengan password baru yang kuat

Selesai jika: kamu bisa mendaftar, login, mengerjakan kuis, dan login admin dari alamat publik.

---

## Penanda Versi (opsional, pakai git tag)

- [x] `v0.1.0` frontend selesai dengan data mock
- [x] `v0.2.0` auth tersambung
- [x] `v0.3.0` quiz tersambung
- [x] `v0.4.0` progress dan admin tersambung
- [ ] `v0.5.0` scan tersambung
- [ ] `v1.0.0` siap deploy

## Catatan Hosting yang Perlu Diingat Sejak Awal

- Frontend dan backend beda alamat di production: cookie refresh token butuh pengaturan `secure` dan `sameSite` yang tepat, dan frontend wajib mengirim cookie (`withCredentials`)
- `CLIENT_URL` di production harus persis sama dengan alamat frontend
- Server gratis bisa "tidur" saat sepi, jadi request pertama lambat (normal)
- Batas gratis VirusTotal dan syaratnya (non-komersial) perlu dicek ulang sebelum deploy publik
