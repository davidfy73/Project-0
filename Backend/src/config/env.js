// config/env.js
// Baca .env dan validasi semua variabel wajib dengan zod.
// Harus di-import paling awal di server.js sebelum modul lain.

import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env sebelum apapun
dotenv.config();

const envSchema = z.object({
  // Variabel wajib
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().min(1).max(65535),
  CLIENT_URL: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRES: z.string().min(1),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().min(1),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),

  // Variabel wajib
  VIRUSTOTAL_API_KEY: z.string().min(1, 'VIRUSTOTAL_API_KEY wajib diisi.'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
  console.error(`[env] Server berhenti: variabel wajib tidak terisi atau tidak valid → ${missing}`);
  process.exit(1);
}

const env = parsed.data;

export default env;
