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

export default router;
