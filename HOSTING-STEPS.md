# Deploy Phisyearn (MERN) ke AWS, Step by Step

Panduan ini untuk deploy tanpa domain dulu. Domain (mis. `.my.id`) bisa ditambahkan belakangan.

## Arsitektur

```
Browser
   |
   v
CloudFront (HTTPS, alamat xxxx.cloudfront.net)
   |-- /*      --> S3 (file hasil build React)
   |-- /api/*  --> EC2 (Nginx --> Express/Node via PM2) --> MongoDB Atlas
```

Dengan susunan ini frontend dan API berada di satu alamat HTTPS, jadi masalah mixed content dan CORS hilang.

**Prasyarat:** kode backend dan frontend sudah jalan di lokal, dan semua route API berawalan `/api` (mis. `/api/auth/login`).

> Cek biaya dan batas free tier terbaru di halaman resmi AWS sebelum mulai.

---

## Daftar Layanan yang Dipakai

### Layanan AWS

|#|Layanan|Fungsi|Dipakai di|Wajib?|
|---|---|---|---|---|
|1|**IAM**|Akun dan hak akses (user admin, MFA)|Tahap 1|Ya|
|2|**Billing & Budgets**|Alarm biaya supaya tidak kaget tagihan|Tahap 1|Ya|
|3|**EC2**|Server untuk backend Express/Node|Tahap 4-7|Ya|
|4|**Security Group** (bagian EC2)|Firewall server (SSH dan HTTP)|Tahap 4|Ya|
|5|**Elastic IP** (bagian EC2)|IP tetap untuk server|Tahap 4|Ya|
|6|**S3**|Menyimpan file hasil build React|Tahap 8|Ya|
|7|**CloudFront**|HTTPS, CDN, dan penyatu alamat frontend + `/api`|Tahap 9|Ya|
|8|**CloudWatch**|Monitoring dan log|Setelah jalan|Nanti|

### Non-AWS

|Tool|Fungsi|Dipakai di|
|---|---|---|
|**MongoDB Atlas**|Database (region AWS Singapore)|Tahap 2|
|**Git + GitHub**|Sumber kode untuk deploy|Tahap 3, 6|
|**Node.js (via nvm)**|Runtime backend|Tahap 5|
|**PM2**|Menjaga app Node tetap jalan dan restart otomatis|Tahap 5-6|
|**Nginx**|Reverse proxy di server (port 80 ke Node)|Tahap 7|

### Ditunda dulu (opsional)

- **Route 53 / registrar** dan **ACM**: domain dan sertifikat HTTPS sendiri.
- **Systems Manager Parameter Store** atau **Secrets Manager**: simpan secret lebih aman.
- **GitHub Actions**: deploy otomatis.
- **Amplify Hosting**: alternatif lebih simpel untuk frontend saja (tidak dipakai di rencana ini).

---

## Tahap 1. Amankan akun AWS

- [ ] Login sebagai root, aktifkan **MFA** di root.
- [ ] Buka **IAM**, buat user admin (atau IAM Identity Center) untuk kerja harian.
- [ ] Aktifkan MFA di user tersebut, lalu **jangan pakai root lagi**.
- [ ] Buka **Billing > Budgets**, buat budget bulanan kecil (mis. US$5) dengan notifikasi email.
- [ ] Pilih region dan konsisten pakai itu, mis. **Asia Pacific (Singapore) `ap-southeast-1`**.

---

## Tahap 2. Database: MongoDB Atlas

1. Daftar di MongoDB Atlas, buat cluster (tier gratis), provider **AWS**, region **Singapore**.
2. **Database Access**: buat user database dengan password kuat.
3. **Network Access**: sementara tambahkan IP kamu untuk tes dari lokal. IP server EC2 ditambahkan di Tahap 5.
4. Ambil connection string:
    
    ```
    mongodb+srv://<user>:<password>@<cluster>.mongodb.net/phisyearn?retryWrites=true&w=majority
    ```
    
5. Tes dari lokal dengan mengisi `MONGO_URI` di `.env` backend, lalu jalankan backend.

---

## Tahap 3. Rapikan kode sebelum deploy

**Backend**

- [ ] Semua konfigurasi dari environment variable (`process.env`), dan `.env` ada di `.gitignore`.
- [ ] Port dari env: `const PORT = process.env.PORT || 5000;`
- [ ] Ada script start di `package.json`: `"start": "node server.js"` (sesuaikan nama file).
- [ ] Semua route berawalan `/api`.
- [ ] Tambahkan endpoint cek sehat, mis. `GET /api/health` yang mengembalikan `{ ok: true }`.

**Frontend**

- [ ] Panggilan API memakai path relatif: `fetch("/api/...")` atau axios dengan `baseURL: "/api"`.
- [ ] Untuk dev lokal, atur proxy (Vite: `server.proxy`, CRA: `"proxy"` di `package.json`) ke backend lokal.
- [ ] Tes build: `npm run build` (hasilnya di `dist/` untuk Vite atau `build/` untuk CRA).

**Git**

- [ ] Commit dan push semua ke GitHub (repo private juga boleh).

---

## Tahap 4. Buat server EC2

1. Buka **EC2 > Launch instance**.
2. Isi:
    - Name: `phisyearn-backend`
    - AMI: **Ubuntu Server 24.04 LTS**
    - Instance type: yang free-tier eligible di akunmu (mis. `t3.micro`/`t2.micro`)
    - Key pair: buat baru (`phisyearn-key`), simpan file `.pem` dengan aman
    - Network: **Security Group** baru dengan aturan:
        
        |Type|Port|Source|
        |---|---|---|
        |SSH|22|**My IP** (bukan 0.0.0.0/0)|
        |HTTP|80|0.0.0.0/0|
        
    - Storage: 8-20 GB gp3
3. Launch, lalu buka **Elastic IPs > Allocate**, **Associate** ke instance supaya IP tidak berubah saat restart.
4. Catat **Public IPv4 DNS** instance (bentuknya `ec2-xx-xx-xx-xx.ap-southeast-1.compute.amazonaws.com`). Ini dipakai di CloudFront nanti.
5. Kembali ke Atlas > **Network Access**, tambahkan **Elastic IP** server ini.

> Port 5000 (Node) **tidak** dibuka ke publik. Akses lewat Nginx di port 80.

---

## Tahap 5. Setup server

Masuk via SSH:

```bash
chmod 400 phisyearn-key.pem
ssh -i phisyearn-key.pem ubuntu@<ELASTIC_IP>
```

Update sistem dan pasang paket dasar:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git
```

Pasang Node.js LTS (via nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v && npm -v
```

Pasang PM2:

```bash
npm install -g pm2
```

---

## Tahap 6. Deploy backend

```bash
cd ~
git clone https://github.com/<username>/<repo>.git phisyearn
cd phisyearn/Backend
npm install --omit=dev
```

Buat file environment:

```bash
nano .env
```

Isi (sesuaikan dengan kebutuhan app):

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=isi-dengan-string-acak-panjang
```

Jalankan dengan PM2:

```bash
pm2 start server.js --name phisyearn-api   # sesuaikan nama file entry
pm2 save
pm2 startup                                # jalankan perintah yang ditampilkan
curl http://localhost:5000/api/health      # harus merespons
```

Perintah berguna: `pm2 logs`, `pm2 status`, `pm2 restart phisyearn-api`.

---

## Tahap 7. Nginx sebagai reverse proxy

```bash
sudo nano /etc/nginx/sites-available/phisyearn
```

```nginx
server {
    listen 80 default_server;
    server_name _;

    client_max_body_size 10m;

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}
```

Aktifkan:

```bash
sudo ln -s /etc/nginx/sites-available/phisyearn /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Tes dari laptop: `curl http://<ELASTIC_IP>/api/health`.

Kalau pakai cookie `secure` atau auth di belakang proxy, tambahkan di Express: `app.set("trust proxy", 1);`

---

## Tahap 8. Frontend ke S3

1. Build di lokal: `npm run build` di folder Frontend.
2. Buka **S3 > Create bucket**: nama unik (mis. `phisyearn-frontend-<angka>`), region sama, **Block all public access tetap ON**.
3. Upload isi folder build (`dist/` atau `build/`) ke bucket.

---

## Tahap 9. CloudFront (satu alamat untuk frontend dan API)

**Distribution dengan origin S3**

1. **CloudFront > Create distribution**.
2. Origin: bucket S3 tadi, Origin access: **Origin access control (OAC)**, lalu **Create new OAC**.
3. Default root object: `index.html`.
4. Setelah dibuat, salin **bucket policy** yang disarankan CloudFront dan tempel di S3 > bucket > Permissions > Bucket policy.

**Tambah origin EC2**

1. Tab **Origins > Create origin**:
    - Origin domain: **Public IPv4 DNS** EC2 (bukan IP angka)
    - Protocol: **HTTP only**
2. Tab **Behaviors > Create behavior**:
    - Path pattern: `/api/*`
    - Origin: EC2
    - Viewer protocol policy: Redirect HTTP to HTTPS
    - Allowed methods: **GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE**
    - Cache policy: **CachingDisabled**
    - Origin request policy: **AllViewerExceptHostHeader**

**Dukungan React Router (SPA)**

- Tab **Error pages**, buat custom error response untuk **403** dan **404**: response page path `/index.html`, HTTP response code **200**.

**Alamat akhir:** `https://xxxx.cloudfront.net`

> Alternatif lebih sederhana untuk frontend saja: **AWS Amplify Hosting** (hubungkan repo GitHub). Tapi karena API tetap butuh satu alamat HTTPS, pendekatan CloudFront di atas lebih rapi.

---

## Tahap 10. Uji akhir

- [ ] Buka `https://xxxx.cloudfront.net`, halaman muncul.
- [ ] Refresh di halaman dalam (mis. `/login`), tidak 404.
- [ ] Buka tab Network browser, request `/api/...` sukses (status 200).
- [ ] Register/login dan operasi CRUD utama berfungsi.
- [ ] Data masuk ke Atlas.

---

## Update / redeploy

**Backend**

```bash
ssh -i phisyearn-key.pem ubuntu@<ELASTIC_IP>
cd ~/phisyearn && git pull
cd Backend && npm install --omit=dev
pm2 restart phisyearn-api
```

**Frontend**

1. `npm run build`
2. Upload ulang isi build ke S3 (ganti file lama).
3. Di CloudFront > **Invalidations**, buat invalidation `/*` supaya versi baru langsung terlihat.

---

## Troubleshooting cepat

|Gejala|Cek|
|---|---|
|`/api` 502/504 dari CloudFront|Nginx jalan? (`sudo systemctl status nginx`), Security Group port 80 terbuka? origin pakai DNS publik dan protocol HTTP only?|
|`/api` 502 dari Nginx|PM2 jalan? (`pm2 status`), port di `.env` sama dengan di Nginx?|
|Backend tidak bisa konek DB|Elastic IP sudah di Atlas Network Access? `MONGO_URI` benar? password ada karakter khusus (perlu URL-encode)?|
|Login jalan tapi cookie tidak tersimpan|`trust proxy`, pengaturan cookie (`secure`, `sameSite`), dan origin request policy|
|Halaman lama masih muncul|Buat invalidation di CloudFront|
|Frontend 403 dari S3|Bucket policy OAC sudah dipasang? Default root object `index.html`?|

---

## Setelah semuanya jalan (opsional)

- Beli domain `.my.id`, arahkan ke CloudFront, dan pasang sertifikat gratis lewat **ACM** (sertifikat untuk CloudFront dibuat di region **us-east-1**).
- Otomatisasi deploy dengan **GitHub Actions**.
- Monitoring dengan **CloudWatch** (alarm CPU, status check).
- Pindahkan secret ke **SSM Parameter Store** atau **Secrets Manager**.
- Batasi akses API (rate limit, `helmet`, validasi input) sebelum dipakai publik.
