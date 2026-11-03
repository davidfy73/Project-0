// server.js
// Entry point: validasi env, koneksi DB, lalu start server.
// Import env.js paling awal supaya dotenv sudah di-load sebelum modul lain.

import './src/config/env.js';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';
import env from './src/config/env.js';

async function start() {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`[server] PHISHYEARN backend berjalan di port ${env.PORT} (${env.NODE_ENV})`);
  });
}

start();
