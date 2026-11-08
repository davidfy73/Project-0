// config/db.js
// Koneksi mongoose ke MongoDB.
// Dipanggil dari server.js setelah env tervalidasi.

import mongoose from 'mongoose';
import env from './env.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[db] MongoDB terhubung.');
  } catch (err) {
    console.error('[db] Gagal terhubung ke MongoDB:', err.message);
  }
}

// Ekspor state koneksi untuk endpoint /api/health
export function isDBConnected() {
  // mongoose.connection.readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  return mongoose.connection.readyState === 1;
}
