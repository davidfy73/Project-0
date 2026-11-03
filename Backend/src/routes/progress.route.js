// routes/progress.route.js
// Endpoint progres belajar user (/api/progress).

import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getProgress,
  completeProgress,
} from '../controllers/progress.controller.js';

const router = Router();

// Wajib autentikasi
router.use(requireAuth);

router.get('/', getProgress);
router.post('/complete', completeProgress);

export default router;
