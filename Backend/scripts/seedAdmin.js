// scripts/seedAdmin.js
// Buat akun admin dari ADMIN_USERNAME dan ADMIN_PASSWORD di .env.
// Aman dijalankan berulang: jika admin sudah ada, tidak menimpa password.
//
// Jalankan dari folder Backend/:
//   node scripts/seedAdmin.js

// Import env.js PALING AWAL agar dotenv.config() berjalan sebelum modul lain.
import env from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User, { BCRYPT_COST } from '../src/models/User.model.js';

async function seed() {
  await connectDB();

  const usernameLower = env.ADMIN_USERNAME.toLowerCase();

  const existing = await User.findOne({ usernameLower });

  if (existing) {
    if (existing.role !== 'admin') {
      // Akun dengan username ini ada tapi bukan admin — jangan ubah apa pun
      console.error(
        `[seed] Berhenti: username "${existing.username}" sudah ada dengan role "${existing.role}". ` +
        'Tidak ada perubahan yang dilakukan.'
      );
      await mongoose.connection.close();
      process.exit(1);
    }

    // Admin sudah ada — tidak perlu buat lagi
    console.log(`[seed] Akun admin "${existing.username}" sudah ada. Tidak ada perubahan.`);
    await mongoose.connection.close();
    return;
  }

  // Buat akun admin baru
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, BCRYPT_COST);
  await User.create({
    username: env.ADMIN_USERNAME,
    usernameLower,
    passwordHash,
    role: 'admin',
  });

  console.log(`[seed] Akun admin "${env.ADMIN_USERNAME}" berhasil dibuat.`);
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error('[seed] Error tidak terduga:', err.message);
  mongoose.connection.close().finally(() => process.exit(1));
});
