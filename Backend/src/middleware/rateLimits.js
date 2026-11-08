// middleware/rateLimits.js
// Rate limiter untuk endpoint auth.
// Semua jawaban 429 dalam format JSON konsisten.

import rateLimit from 'express-rate-limit';

const jsonHandler = (message) => (_req, res) => {
  res.status(429).json({ status: 'error', message });
};

/**
 * Login dan admin-login: 10 percobaan gagal per 15 menit per IP.
 * Percobaan yang berhasil (2xx) tidak dihitung.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonHandler('Terlalu banyak percobaan login. Coba lagi setelah 15 menit.'),
});

/**
 * Register: 10 pendaftaran per jam per IP (berhasil atau gagal sama-sama dihitung).
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonHandler('Terlalu banyak percobaan pendaftaran. Coba lagi setelah 1 jam.'),
});

/**
 * Scan rate limiter per user:
 * Maksimal 20 request scan per 5 menit per user.
 * Dipasang setelah requireAuth agar req.user._id tersedia.
 */
export const scanUserLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  validate: { keyGeneratorIpFallback: false },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonHandler('Terlalu banyak permintaan scan dari akun Anda. Coba lagi dalam beberapa menit.'),
});
