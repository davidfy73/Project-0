// controllers/auth.controller.js
// Register, login (user & admin), refresh, logout, me.

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User, { BCRYPT_COST } from '../models/User.model.js';
import env from '../config/env.js';

// ── Hash dummy untuk timing-safe login ─────────────────────────────────────────
// Di-generate sekali saat modul dimuat. Cost SAMA dengan password asli (BCRYPT_COST).
// Dipakai saat username tidak ditemukan agar waktu respons tidak membocorkan
// keberadaan username.
const DUMMY_HASH = bcrypt.hashSync('__phishyearn_dummy_timing__', BCRYPT_COST);

// ── Skema validasi zod ──────────────────────────────────────────────────────────
const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter.')
    .max(20, 'Username maksimal 20 karakter.')
    .regex(/^\w+$/, 'Username hanya boleh berisi huruf, angka, dan underscore.'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .max(64, 'Password maksimal 64 karakter.'),
});

const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi.'),
  password: z.string().min(1, 'Password wajib diisi.'),
});

// ── Helper: token dan cookie ───────────────────────────────────────────────────

function signTokens(userId, role) {
  const accessToken = jwt.sign(
    { sub: String(userId), role },
    env.ACCESS_TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: env.ACCESS_TOKEN_EXPIRES }
  );
  const refreshToken = jwt.sign(
    { sub: String(userId) },
    env.REFRESH_TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: `${env.REFRESH_TOKEN_EXPIRES_DAYS}d` }
  );
  return { accessToken, refreshToken };
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function setRefreshCookie(res, token) {
  const isProd = env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    path: '/api/auth',
    maxAge: env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', { httpOnly: true, path: '/api/auth' });
}

// ── Handler: register ──────────────────────────────────────────────────────────

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Input tidak valid.';
    return res.status(400).json({ status: 'error', message });
  }

  const { username, password } = parsed.data;

  // Cegah pendaftaran dengan username yang sama dengan akun admin (case-insensitive),
  // bahkan sebelum admin di-seed.
  if (username.toLowerCase() === env.ADMIN_USERNAME.toLowerCase()) {
    return res.status(409).json({ status: 'error', message: 'Username sudah dipakai.' });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const user = new User({
    username,
    usernameLower: username.toLowerCase(),
    passwordHash,
    role: 'user',
  });

  try {
    await user.save();
  } catch (err) {
    // E11000 = duplicate key dari index unik usernameLower
    if (err.code === 11000) {
      return res.status(409).json({ status: 'error', message: 'Username sudah dipakai.' });
    }
    throw err; // lempar ke error handler global
  }

  res.status(201).json({ status: 'ok', message: 'Akun berhasil dibuat. Silakan login.' });
}

// ── Handler internal: login (dipakai oleh /login dan /admin-login) ────────────

async function loginWithRole(req, res, expectedRole) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Input tidak valid.';
    return res.status(400).json({ status: 'error', message });
  }

  const { username, password } = parsed.data;

  // Cari user; ambil passwordHash eksplisit (select: false di schema)
  const user = await User.findOne({
    usernameLower: username.toLowerCase(),
  }).select('+passwordHash');

  // Selalu jalankan bcrypt.compare untuk mencegah timing attack:
  // - user tidak ada → bandingkan dengan DUMMY_HASH
  // - user ada → bandingkan dengan hash asli
  const hashToCheck = user ? user.passwordHash : DUMMY_HASH;
  const isMatch = await bcrypt.compare(password, hashToCheck);

  // Satu kondisi gabungan: user tidak ada, password salah, atau role tidak cocok
  // → pesan SAMA persis untuk semua kasus
  if (!user || !isMatch || user.role !== expectedRole) {
    return res.status(401).json({ status: 'error', message: 'Username atau password salah.' });
  }

  const { accessToken, refreshToken } = signTokens(user._id, user.role);

  // Simpan hash refresh token (bukan token aslinya) — satu token aktif per user
  user.refreshTokenHash = hashToken(refreshToken);
  user.lastActiveAt = new Date();
  await user.save();

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    status: 'ok',
    accessToken,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
}

export function login(req, res) {
  return loginWithRole(req, res, 'user');
}

export function adminLogin(req, res) {
  return loginWithRole(req, res, 'admin');
}

// ── Handler: refresh ───────────────────────────────────────────────────────────

export async function refresh(req, res) {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Refresh token tidak ditemukan.' });
  }

  // Verifikasi JWT refresh token
  let payload;
  try {
    payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] });
  } catch {
    clearRefreshCookie(res);
    return res.status(401).json({ status: 'error', message: 'Refresh token tidak valid atau sudah kedaluwarsa.' });
  }

  // Cari user; ambil refreshTokenHash eksplisit
  const user = await User.findById(payload.sub).select('+refreshTokenHash');
  if (!user) {
    clearRefreshCookie(res);
    return res.status(401).json({ status: 'error', message: 'Akun tidak ditemukan.' });
  }

  // Deteksi reuse: hash token yang datang, bandingkan dengan yang tersimpan
  const incomingHash = hashToken(token);
  if (!user.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
    // Token lama dipakai ulang → kemungkinan token dicuri → invalidasi semua sesi
    user.refreshTokenHash = null;
    await user.save();
    clearRefreshCookie(res);
    return res.status(401).json({ status: 'error', message: 'Refresh token tidak valid.' });
  }

  // Rotasi: terbitkan token baru, ganti hash lama
  const { accessToken, refreshToken: newRefreshToken } = signTokens(user._id, user.role);
  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save();

  setRefreshCookie(res, newRefreshToken);

  res.status(200).json({ status: 'ok', accessToken });
}

// ── Handler: logout ────────────────────────────────────────────────────────────

export async function logout(req, res) {
  const token = req.cookies?.refreshToken;

  // Hapus cookie terlebih dahulu, apapun yang terjadi
  clearRefreshCookie(res);

  if (token) {
    try {
      const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] });
      // Invalidasi refresh token di database
      await User.updateOne({ _id: payload.sub }, { refreshTokenHash: null });
    } catch {
      // Token sudah kedaluwarsa atau rusak — tidak masalah, cookie sudah dihapus
    }
  }

  res.status(200).json({ status: 'ok', message: 'Logout berhasil.' });
}

// ── Handler: me ────────────────────────────────────────────────────────────────

export async function me(req, res) {
  // req.user sudah diisi oleh requireAuth
  const { _id, username, role, createdAt, lastActiveAt } = req.user;
  res.status(200).json({
    status: 'ok',
    user: { id: _id, username, role, createdAt, lastActiveAt },
  });
}
