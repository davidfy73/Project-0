// routes/admin.route.js
// Semua endpoint /api/admin/*.
// requireAuth + requireRole('admin') diterapkan di level router —
// berlaku otomatis untuk semua route di bawah ini.

import { Router } from 'express';
import requireAuth, { requireRole } from '../middleware/requireAuth.js';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/adminQuestion.controller.js';
import {
  getAdminUsers,
  getAdminUserDetail,
  deleteAdminUser,
  getAdminProgress,
} from '../controllers/adminUser.controller.js';

const router = Router();

// Terapkan pengaman di semua route admin sekaligus
router.use(requireAuth, requireRole('admin'));

// Endpoint uji admin
router.get('/ping', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Admin ping berhasil.' });
});

// ── CRUD Soal Kuis (Langkah 4) ──────────────────────────────────────────────────
router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// ── Manajemen User & Pemantauan Progres (Langkah 6) ──────────────────────────────
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserDetail);
router.delete('/users/:id', deleteAdminUser);
router.get('/progress', getAdminProgress);

export default router;
