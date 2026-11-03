// routes/admin.route.js
// Semua endpoint /api/admin/*.
// requireAuth + requireRole('admin') diterapkan di level router —
// berlaku otomatis untuk semua route di bawah ini.
// Isi fitur admin ditambahkan di Langkah 6; saat ini hanya /ping untuk uji.

import { Router } from 'express';
import requireAuth, { requireRole } from '../middleware/requireAuth.js';

const router = Router();

// Terapkan pengaman di semua route admin sekaligus
router.use(requireAuth, requireRole('admin'));

// Endpoint uji: verifikasi bahwa token admin diterima dan token user ditolak
router.get('/ping', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Admin ping berhasil.' });
});

export default router;
