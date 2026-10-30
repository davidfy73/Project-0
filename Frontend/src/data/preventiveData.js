// Data konten panduan Preventive 7 topik keamanan siber bergaya Hack The Box (HTB) Academy
// Format blok: section, h3, paragraph, list, callout (variant: 'warning' | 'tips')

export const PREVENTIVE_DATA = [
  {
    slug: 'use-strong-password',
    number: 'Topic 01',
    title: 'Use Strong Password',
    blocks: [
      { type: 'section', text: 'SECTION 1 — Pengertian' },
      { type: 'h3', text: 'Apa Itu Strong Password?' },
      {
        type: 'paragraph',
        text: '`Strong Password` adalah kata sandi yang sulit ditebak atau dibobol. Kata sandi yang kuat biasanya panjang, unik, dan tidak menggunakan informasi pribadi yang mudah ditemukan.',
      },
      { type: 'h3', text: 'Kenapa Penting?' },
      {
        type: 'paragraph',
        text: 'Kata sandi melindungi akun dari akses yang tidak sah. Kata sandi yang lemah atau digunakan berulang kali dapat meningkatkan risiko pencurian akun. Jika satu akun bocor, akun lain yang memakai kata sandi sama juga bisa terancam.',
      },
      { type: 'section', text: 'SECTION 2 — Cara Menerapkan' },
      { type: 'h3', text: 'Gunakan Kata Sandi yang Panjang' },
      {
        type: 'paragraph',
        text: 'Buat kata sandi dengan panjang minimal 12–16 karakter jika layanan mendukungnya. Gunakan kombinasi kata yang tidak mudah ditebak atau campuran huruf, angka, dan simbol.',
      },
      { type: 'h3', text: 'Gunakan Kata Sandi Berbeda' },
      {
        type: 'paragraph',
        text: 'Setiap akun sebaiknya memiliki kata sandi yang unik. Hindari menggunakan kata sandi yang sama untuk email, media sosial, dan akun keuangan.',
      },
      { type: 'h3', text: 'Gunakan Password Manager' },
      {
        type: 'paragraph',
        text: '`Password Manager` membantu menyimpan dan membuat kata sandi yang kuat. Kamu tidak perlu menghafal semua kata sandi secara manual.',
      },
      { type: 'h3', text: 'Aktifkan Multi-Factor Authentication' },
      {
        type: 'paragraph',
        text: '`Multi-Factor Authentication (MFA)` menambahkan lapisan keamanan selain kata sandi. Jika tersedia, aktifkan fitur ini untuk mengurangi risiko akses tidak sah.',
      },
      {
        type: 'callout',
        variant: 'warning',
        label: 'Kesalahan umum:',
        text: 'Menggunakan tanggal lahir, nama sendiri, atau kata sandi seperti `123456`.',
      },
      {
        type: 'callout',
        variant: 'tips',
        label: 'Tips:',
        text: 'Prioritaskan keamanan email utama karena email sering digunakan untuk memulihkan akun lain.',
      },
    ],
  },
  {
    slug: 'check-url',
    number: 'Topic 02',
    title: 'Check URL',
    blocks: [
      { type: 'section', text: 'SECTION 1 — Pengertian' },
      { type: 'h3', text: 'Apa Itu Check URL?' },
      {
        type: 'paragraph',
        text: '`Check URL` adalah kebiasaan memeriksa alamat situs sebelum membuka tautan atau memasukkan informasi pribadi. Tujuannya adalah memastikan situs yang dikunjungi sesuai dengan tujuan dan bukan situs tiruan.',
      },
      { type: 'h3', text: 'Kenapa Penting?' },
      {
        type: 'paragraph',
        text: 'Penyerang sering menggunakan `Phishing` untuk membuat situs palsu yang menyerupai layanan asli. Alamat situsnya mungkin hanya berbeda satu huruf atau menggunakan nama domain yang menyesatkan.',
      },
      { type: 'h3', text: 'Apa yang Perlu Diperhatikan?' },
      {
        type: 'paragraph',
        text: 'Periksa nama domain dan ejaannya. Ikon gembok atau `HTTPS` menunjukkan koneksi terenkripsi, tetapi tidak menjamin bahwa situs tersebut aman atau resmi.',
      },
      { type: 'section', text: 'SECTION 2 — Cara Menerapkan' },
      { type: 'h3', text: 'Periksa Nama Domain' },
      {
        type: 'paragraph',
        text: 'Baca alamat situs dengan teliti. Pastikan nama domain benar dan tidak memiliki tambahan kata atau karakter yang mencurigakan.',
      },
      { type: 'h3', text: 'Jangan Langsung Membuka Tautan' },
      {
        type: 'paragraph',
        text: 'Jika menerima tautan melalui email, SMS, atau pesan media sosial, periksa pengirim dan konteks pesannya. Untuk layanan penting, buka situs melalui alamat resmi yang kamu ketik sendiri atau melalui aplikasi resminya.',
      },
      { type: 'h3', text: 'Waspadai Domain yang Meniru' },
      {
        type: 'paragraph',
        text: 'Penyerang dapat menggunakan nama yang mirip dengan situs asli. Perhatikan salah eja, subdomain yang membingungkan, dan ekstensi domain yang tidak biasa.',
      },
      { type: 'h3', text: 'Gunakan Pemeriksa URL' },
      {
        type: 'paragraph',
        text: 'Jika ragu, kamu dapat memeriksa reputasi tautan menggunakan layanan keamanan seperti VirusTotal. Namun, hasil pemeriksaan bukan jaminan mutlak bahwa suatu tautan aman.',
      },
      {
        type: 'callout',
        variant: 'warning',
        label: 'Kesalahan umum:',
        text: 'Menganggap semua situs dengan `HTTPS` pasti terpercaya.',
      },
      {
        type: 'callout',
        variant: 'tips',
        label: 'Tips:',
        text: 'Jangan memasukkan kata sandi atau kode `OTP` setelah membuka tautan yang datang dari pesan mendadak atau mencurigakan.',
      },
    ],
  },
  {
    slug: 'use-antivirus',
    number: 'Topic 03',
    title: 'Use Antivirus',
    blocks: [
      { type: 'section', text: 'SECTION 1 — Pengertian' },
      { type: 'h3', text: 'Apa Itu Antivirus?' },
      {
        type: 'paragraph',
        text: '`Antivirus` adalah perangkat lunak keamanan yang membantu mendeteksi, memblokir, dan menghapus `Malware`. Malware adalah perangkat lunak berbahaya yang dapat mencuri data, merusak sistem, atau mengganggu aktivitas perangkat.',
      },
      { type: 'h3', text: 'Kenapa Penting?' },
      {
        type: 'paragraph',
        text: 'Perangkat dapat terinfeksi melalui unduhan berbahaya, lampiran email, situs palsu, atau aplikasi yang tidak terpercaya. Antivirus membantu mengurangi risiko tersebut dengan memeriksa file dan aktivitas yang mencurigakan.',
      },
      { type: 'h3', text: 'Apakah Antivirus Selalu Cukup?' },
      {
        type: 'paragraph',
        text: 'Tidak. Antivirus dapat melewatkan ancaman baru atau serangan yang menggunakan teknik tertentu. Karena itu, antivirus perlu didukung oleh pembaruan sistem dan kebiasaan digital yang aman.',
      },
      { type: 'section', text: 'SECTION 2 — Cara Menerapkan' },
      { type: 'h3', text: 'Gunakan Antivirus Terpercaya' },
      {
        type: 'paragraph',
        text: 'Pilih antivirus dari penyedia resmi. Pada Windows, kamu dapat menggunakan Microsoft Defender yang sudah tersedia secara bawaan.',
      },
      { type: 'h3', text: 'Aktifkan Perlindungan Real-Time' },
      {
        type: 'paragraph',
        text: '`Real-Time Protection` memeriksa file dan aktivitas saat perangkat digunakan. Pastikan fitur ini aktif jika tersedia.',
      },
      { type: 'h3', text: 'Perbarui Database Keamanan' },
      {
        type: 'paragraph',
        text: 'Antivirus membutuhkan pembaruan agar dapat mengenali ancaman terbaru. Aktifkan pembaruan otomatis jika memungkinkan.',
      },
      { type: 'h3', text: 'Lakukan Pemindaian' },
      {
        type: 'paragraph',
        text: 'Jalankan `Scan` secara berkala dan lakukan pemeriksaan ketika perangkat menunjukkan perilaku yang tidak biasa. Ikuti rekomendasi keamanan dari aplikasi antivirus.',
      },
      { type: 'h3', text: 'Hindari Antivirus Palsu' },
      {
        type: 'paragraph',
        text: 'Jangan memasang aplikasi keamanan dari iklan mencurigakan atau situs tidak resmi. Sebagian aplikasi palsu justru dapat membawa malware.',
      },
      {
        type: 'callout',
        variant: 'warning',
        label: 'Kesalahan umum:',
        text: 'Menonaktifkan antivirus karena dianggap memperlambat perangkat tanpa memahami risikonya.',
      },
      {
        type: 'callout',
        variant: 'tips',
        label: 'Tips:',
        text: 'Jika antivirus mendeteksi ancaman, jangan langsung membuka atau memulihkan file tersebut. Periksa hasil deteksi dan ikuti panduan penanganan yang disarankan.',
      },
    ],
  },
  {
    slug: 'backup-data',
    number: 'Topic 04',
    title: 'Backup Data',
    blocks: [
      { type: 'section', text: 'SECTION 1 — Pengertian' },
      { type: 'h3', text: 'Apa Itu Backup Data?' },
      {
        type: 'paragraph',
        text: '`Backup Data` adalah proses membuat salinan data agar dapat dipulihkan jika data asli hilang, rusak, atau tidak dapat diakses. Data yang dicadangkan dapat berupa dokumen, foto, video, dan file pekerjaan.',
      },
      { type: 'h3', text: 'Kenapa Penting?' },
      {
        type: 'paragraph',
        text: 'Data dapat hilang akibat kerusakan perangkat, kesalahan pengguna, pencurian, atau serangan `Ransomware`. Backup membantu mengurangi dampak kehilangan data dan mempercepat pemulihan.',
      },
      { type: 'h3', text: 'Jenis Backup' },
      {
        type: 'paragraph',
        text: '`Local Backup` menyimpan salinan pada media seperti hard disk eksternal. `Cloud Backup` menyimpan salinan pada layanan penyimpanan online. Keduanya memiliki kelebihan dan risiko yang berbeda.',
      },
      { type: 'section', text: 'SECTION 2 — Cara Menerapkan' },
      { type: 'h3', text: 'Tentukan Data yang Penting' },
      {
        type: 'paragraph',
        text: 'Prioritaskan file yang sulit diganti, seperti dokumen pribadi, proyek, foto, dan data pekerjaan. Pastikan file penting masuk dalam jadwal pencadangan.',
      },
      { type: 'h3', text: 'Gunakan Lebih dari Satu Salinan' },
      {
        type: 'paragraph',
        text: 'Salah satu panduan yang dapat digunakan adalah aturan `3-2-1`:',
      },
      {
        type: 'list',
        items: [
          'Simpan tiga salinan data.',
          'Gunakan dua jenis media penyimpanan.',
          'Simpan satu salinan di lokasi terpisah.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Salinan terpisah membantu melindungi data jika perangkat utama rusak atau terkena serangan.',
      },
      { type: 'h3', text: 'Jadwalkan Backup' },
      {
        type: 'paragraph',
        text: 'Lakukan backup secara rutin sesuai frekuensi perubahan data. Aktifkan pencadangan otomatis jika layanan mendukungnya.',
      },
      { type: 'h3', text: 'Lindungi Salinan Backup' },
      {
        type: 'paragraph',
        text: 'Gunakan kata sandi yang kuat dan `Encryption` jika tersedia. Simpan setidaknya satu salinan secara offline atau terpisah dari perangkat utama untuk mengurangi risiko terkena ransomware.',
      },
      { type: 'h3', text: 'Uji Pemulihan Data' },
      {
        type: 'paragraph',
        text: 'Backup tidak berguna jika file tidak dapat dipulihkan. Cobalah memulihkan beberapa file secara berkala untuk memastikan salinannya berfungsi.',
      },
      {
        type: 'callout',
        variant: 'warning',
        label: 'Kesalahan umum:',
        text: 'Menganggap sinkronisasi cloud selalu sama dengan backup. Jika file terhapus atau terenkripsi, perubahan tersebut bisa ikut tersinkronisasi.',
      },
      {
        type: 'callout',
        variant: 'tips',
        label: 'Tips:',
        text: 'Buat jadwal backup yang konsisten dan periksa hasilnya, bukan hanya mengandalkan notifikasi bahwa proses telah dimulai.',
      },
    ],
  },
  {
    slug: 'use-vpn',
    number: 'Topic 05',
    title: 'Use VPN',
    blocks: [
      { type: 'section', text: 'SECTION 1 — Pengertian' },
      { type: 'h3', text: 'Apa Itu VPN?' },
      {
        type: 'paragraph',
        text: '`Virtual Private Network (VPN)` membuat koneksi terenkripsi antara perangkat dan server VPN. Koneksi ini membantu melindungi lalu lintas jaringan dari pihak lain pada jalur komunikasi tertentu.',
      },
      { type: 'h3', text: 'Kenapa Penting?' },
      {
        type: 'paragraph',
        text: 'Saat menggunakan jaringan publik, seperti Wi-Fi di kafe atau bandara, VPN dapat membantu mengurangi risiko pengamatan terhadap lalu lintas jaringan. VPN juga dapat menyamarkan alamat IP publik pengguna dari situs yang diakses, karena situs tersebut biasanya melihat alamat IP server VPN.',
      },
      { type: 'h3', text: 'Apakah VPN Membuat Kita Sepenuhnya Aman?' },
      {
        type: 'paragraph',
        text: 'Tidak. VPN tidak menjamin anonimitas dan tidak otomatis melindungi perangkat dari malware, phishing, atau situs palsu. Penyedia VPN juga dapat memiliki akses terhadap sebagian informasi koneksi, tergantung pada cara layanan tersebut beroperasi.',
      },
      { type: 'section', text: 'SECTION 2 — Cara Menerapkan' },
      { type: 'h3', text: 'Pilih Penyedia VPN Terpercaya' },
      {
        type: 'paragraph',
        text: 'Periksa reputasi penyedia, kebijakan privasi, metode keamanan, dan cara mereka menangani data pengguna. Hindari layanan yang membuat klaim keamanan berlebihan tanpa penjelasan yang jelas.',
      },
      { type: 'h3', text: 'Unduh dari Sumber Resmi' },
      {
        type: 'paragraph',
        text: 'Pasang aplikasi VPN dari situs resmi penyedia atau toko aplikasi tepercaya. Hindari aplikasi yang dibagikan melalui tautan tidak dikenal.',
      },
      { type: 'h3', text: 'Aktifkan Sebelum Menggunakan Jaringan Publik' },
      {
        type: 'paragraph',
        text: 'Hubungkan VPN sebelum melakukan aktivitas yang membutuhkan perlindungan tambahan di jaringan yang tidak kamu percaya. Tetap hindari transaksi sensitif jika jaringan menunjukkan tanda-tanda mencurigakan.',
      },
      { type: 'h3', text: 'Periksa Pengaturan VPN' },
      {
        type: 'paragraph',
        text: 'Pastikan koneksi berhasil tersambung. Jika tersedia, pelajari fitur seperti `Kill Switch`, yang dapat memutus akses internet ketika koneksi VPN terputus.',
      },
      { type: 'h3', text: 'Tetap Periksa Keamanan Situs' },
      {
        type: 'paragraph',
        text: 'VPN tidak menggantikan pemeriksaan URL, penggunaan `HTTPS`, atau perlindungan akun. Kamu tetap harus berhati-hati saat membuka tautan dan mengunduh file.',
      },
      {
        type: 'callout',
        variant: 'warning',
        label: 'Kesalahan umum:',
        text: 'Menganggap VPN gratis atau VPN apa pun pasti aman.',
      },
      {
        type: 'callout',
        variant: 'tips',
        label: 'Tips:',
        text: 'Gunakan VPN sebagai salah satu lapisan perlindungan, bukan sebagai pengganti kebiasaan berinternet yang aman.',
      },
    ],
  },
  {
    slug: 'verify-identity',
    number: 'Topic 06',
    title: 'Verify Identity',
    blocks: [
      { type: 'section', text: 'SECTION 1 — Pengertian' },
      { type: 'h3', text: 'Apa Itu Verify Identity?' },
      {
        type: 'paragraph',
        text: '`Verify Identity` adalah proses memastikan bahwa seseorang benar-benar pihak yang mereka klaim. Verifikasi ini penting ketika menerima permintaan informasi, akses akun, pembayaran, atau tindakan sensitif lainnya.',
      },
      { type: 'h3', text: 'Kenapa Penting?' },
      {
        type: 'paragraph',
        text: 'Penyerang dapat menyamar sebagai teman, staf perusahaan, petugas bank, atau tim dukungan teknis. Teknik ini sering digunakan dalam `Social Engineering`, yaitu manipulasi psikologis untuk membuat seseorang melakukan tindakan tertentu.',
      },
      { type: 'h3', text: 'Bagaimana Penyamaran Dilakukan?' },
      {
        type: 'paragraph',
        text: 'Penyerang dapat menggunakan akun palsu, alamat email yang mirip, nomor telepon yang tidak dikenal, atau pesan yang mendesak. Mereka mungkin meminta kata sandi, kode `OTP`, data pribadi, atau transfer uang.',
      },
      { type: 'section', text: 'SECTION 2 — Cara Menerapkan' },
      { type: 'h3', text: 'Verifikasi Melalui Saluran Resmi' },
      {
        type: 'paragraph',
        text: 'Jika seseorang mengaku berasal dari bank atau perusahaan, hubungi pihak tersebut melalui nomor telepon, aplikasi, atau situs resmi. Jangan hanya menggunakan kontak yang diberikan dalam pesan mencurigakan.',
      },
      { type: 'h3', text: 'Jangan Membagikan Informasi Rahasia' },
      {
        type: 'paragraph',
        text: 'Jangan pernah memberikan kata sandi atau kode `OTP` kepada orang lain. Petugas yang sah tidak seharusnya meminta kode tersebut untuk mengambil alih akunmu.',
      },
      { type: 'h3', text: 'Waspadai Permintaan Mendesak' },
      {
        type: 'paragraph',
        text: 'Pesan yang memaksa kamu bertindak cepat, mengancam pemblokiran akun, atau menawarkan hadiah mendadak patut dicurigai. Berhenti sejenak dan periksa kebenaran informasinya.',
      },
      { type: 'h3', text: 'Konfirmasi Permintaan yang Tidak Biasa' },
      {
        type: 'paragraph',
        text: 'Jika rekan kerja atau anggota keluarga meminta uang atau data sensitif, konfirmasikan melalui saluran komunikasi lain. Misalnya, lakukan panggilan ke nomor yang sudah kamu kenal.',
      },
      { type: 'h3', text: 'Periksa Detail Pengirim' },
      {
        type: 'paragraph',
        text: 'Perhatikan alamat email, nama akun, dan konteks pesan. Nama tampilan dan foto profil saja tidak cukup untuk membuktikan identitas seseorang.',
      },
      {
        type: 'callout',
        variant: 'warning',
        label: 'Kesalahan umum:',
        text: 'Langsung percaya karena pesan menggunakan nama, foto, atau logo pihak yang dikenal.',
      },
      {
        type: 'callout',
        variant: 'tips',
        label: 'Tips:',
        text: 'Jika permintaan melibatkan uang, akses akun, atau informasi sensitif, selalu verifikasi melalui saluran kedua yang tepercaya.',
      },
    ],
  },
  {
    slug: 'update-patch',
    number: 'Topic 07',
    title: 'Update & Patch',
    blocks: [
      { type: 'section', text: 'SECTION 1 — Pengertian' },
      { type: 'h3', text: 'Apa Itu Update dan Patch?' },
      {
        type: 'paragraph',
        text: '`Update` adalah pembaruan perangkat lunak yang dapat berisi fitur baru, perbaikan bug, atau peningkatan keamanan. `Patch` adalah perbaikan yang diterapkan untuk mengatasi masalah tertentu, termasuk celah keamanan.',
      },
      { type: 'h3', text: 'Kenapa Penting?' },
      {
        type: 'paragraph',
        text: 'Perangkat lunak yang tidak diperbarui dapat memiliki `Vulnerability`, yaitu kelemahan yang dapat dimanfaatkan penyerang. Jika celah tersebut diketahui publik, perangkat yang belum mendapat perbaikan bisa menjadi sasaran serangan.',
      },
      { type: 'h3', text: 'Apa yang Perlu Diperbarui?' },
      {
        type: 'paragraph',
        text: 'Pembaruan tidak hanya berlaku untuk sistem operasi. Browser, aplikasi, perangkat lunak keamanan, firmware router, dan aplikasi pada ponsel juga dapat membutuhkan pembaruan.',
      },
      { type: 'section', text: 'SECTION 2 — Cara Menerapkan' },
      { type: 'h3', text: 'Aktifkan Pembaruan Otomatis' },
      {
        type: 'paragraph',
        text: 'Jika memungkinkan, aktifkan `Automatic Updates` untuk sistem operasi dan aplikasi penting. Hal ini membantu memastikan perbaikan keamanan dipasang tepat waktu.',
      },
      { type: 'h3', text: 'Unduh Pembaruan dari Sumber Resmi' },
      {
        type: 'paragraph',
        text: 'Gunakan fitur pembaruan bawaan sistem operasi atau situs resmi pengembang. Hindari file pembaruan dari iklan, pop-up, atau tautan yang tidak dikenal.',
      },
      { type: 'h3', text: 'Periksa Pembaruan Secara Berkala' },
      {
        type: 'paragraph',
        text: 'Jangan hanya mengandalkan notifikasi. Periksa pembaruan untuk aplikasi yang jarang digunakan dan perangkat yang terhubung ke jaringan, seperti router.',
      },
      { type: 'h3', text: 'Restart Jika Diperlukan' },
      {
        type: 'paragraph',
        text: 'Sebagian pembaruan baru berlaku setelah perangkat dimulai ulang. Simpan pekerjaan terlebih dahulu, lalu lakukan restart sesuai petunjuk.',
      },
      { type: 'h3', text: 'Hentikan Penggunaan Perangkat Lunak yang Tidak Didukung' },
      {
        type: 'paragraph',
        text: 'Perangkat lunak yang sudah tidak menerima pembaruan keamanan memiliki risiko lebih tinggi. Jika memungkinkan, gunakan versi yang masih didukung atau pertimbangkan penggantinya.',
      },
      {
        type: 'callout',
        variant: 'warning',
        label: 'Kesalahan umum:',
        text: 'Menunda pembaruan keamanan terlalu lama atau memasang pembaruan dari sumber tidak resmi.',
      },
      {
        type: 'callout',
        variant: 'tips',
        label: 'Tips:',
        text: 'Prioritaskan pembaruan keamanan yang memperbaiki celah kritis, terutama pada sistem operasi, browser, dan aplikasi yang terhubung ke internet.',
      },
    ],
  },
];

// Mapping slug alias jika diperlukan (misal strong-password -> use-strong-password)
const ALIAS_MAP = {
  'strong-password': 'use-strong-password',
  antivirus: 'use-antivirus',
};

// Helper untuk mencari topik berdasarkan slug
export function getPreventiveBySlug(slug) {
  const normalizedSlug = ALIAS_MAP[slug] || slug;
  return PREVENTIVE_DATA.find((item) => item.slug === normalizedSlug) || null;
}

// Helper untuk navigasi antar topik
export function getPreventiveNavigation(slug) {
  const normalizedSlug = ALIAS_MAP[slug] || slug;
  const currentIndex = PREVENTIVE_DATA.findIndex((item) => item.slug === normalizedSlug);

  if (currentIndex === -1) return null;

  const topic = PREVENTIVE_DATA[currentIndex];
  const totalTopics = PREVENTIVE_DATA.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalTopics - 1;

  const prevTopic = isFirst ? null : PREVENTIVE_DATA[currentIndex - 1];
  const nextTopic = isLast ? null : PREVENTIVE_DATA[currentIndex + 1];

  return {
    topic,
    currentIndex,
    totalTopics,
    isFirst,
    isLast,
    prevTopic,
    nextTopic,
  };
}
