// routes/auth.route.js
// Semua endpoint /api/auth/*

import { Router } from 'express';
import {
  register,
  login,
  adminLogin,
  refresh,
  logout,
  me,
} from '../controllers/auth.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimits.js';

const router = Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/admin-login', loginLimiter, adminLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
