// middleware/requireAuth.js
// requireAuth  — verifikasi access token dan ambil user dari database.
// requireRole  — cek role setelah requireAuth.

import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import env from '../config/env.js';

const ONE_MINUTE_MS = 60 * 1000;

/**
 * Middleware: wajib login.
 * - Baca header "Authorization: Bearer <token>"
 * - Verifikasi access token (HS256)
 * - Ambil user dari DB (tolak 401 jika sudah dihapus admin)
 * - Perbarui lastActiveAt maksimal sekali per menit per user
 * - Pasang req.user untuk handler berikutnya
 */
export default async function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
  }

  const token = authHeader.slice(7); // buang "Bearer "

  let payload;
  try {
    payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ status: 'error', message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }

  // Ambil user dari DB — ini juga menangkap user yang sudah dihapus admin
  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Akun tidak ditemukan.' });
  }

  // Perbarui lastActiveAt sekali per menit (fire-and-forget, tidak memblokir request)
  const now = new Date();
  if (!user.lastActiveAt || now - user.lastActiveAt > ONE_MINUTE_MS) {
    User.updateOne({ _id: user._id }, { lastActiveAt: now }).exec().catch(() => {});
    user.lastActiveAt = now;
  }

  req.user = user;
  next();
}

/**
 * Middleware factory: cek role.
 * Harus dipasang setelah requireAuth.
 * Contoh: requireRole('admin') atau requireRole('admin', 'user')
 *
 * @param {...string} roles
 */
export function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak.' });
    }
    next();
  };
}
