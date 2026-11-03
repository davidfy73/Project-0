// routes/quiz.route.js
// Semua endpoint /api/quiz/*.
// Dilindungi requireAuth agar hanya user yang login yang dapat mengambil soal dan mengirim jawaban.

import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getQuizQuestions,
  submitQuiz,
} from '../controllers/quiz.controller.js';

const router = Router();

// Proteksi sesi login
router.use(requireAuth);

router.get('/questions', getQuizQuestions);
router.post('/submit', submitQuiz);

export default router;
