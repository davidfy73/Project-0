// config/env.js
// Baca .env dan validasi semua variabel wajib dengan zod.
// Harus di-import paling awal di server.js sebelum modul lain.

import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env sebelum apapun
dotenv.config();

const rawEnv = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET,
};

const envSchema = z.object({
  // Variabel konfigurasi
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI atau MONGO_URI wajib diisi.'),
  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET atau JWT_SECRET wajib diisi.'),
  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET wajib diisi.'),
  ACCESS_TOKEN_EXPIRES: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().min(1).default(7),
  ADMIN_USERNAME: z.string().min(1, 'ADMIN_USERNAME wajib diisi.'),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD wajib diisi.'),

  // Variabel integrasi pihak ketiga
  VIRUSTOTAL_API_KEY: z.string().min(1, 'VIRUSTOTAL_API_KEY wajib diisi.'),
});

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
  console.error(`[env] Server berhenti: variabel wajib tidak terisi atau tidak valid → ${missing}`);
  process.exit(1);
}

const env = parsed.data;

export default env;
