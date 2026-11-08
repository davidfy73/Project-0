// server.js
// Entry point: muat dotenv di paling atas, validasi env, koneksi DB, lalu start server.

import dotenv from 'dotenv';
dotenv.config();

import './src/config/env.js';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';
import env from './src/config/env.js';

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[server] PHISHYEARN backend berjalan di port ${PORT} (${env.NODE_ENV})`);
  });
}

start();
