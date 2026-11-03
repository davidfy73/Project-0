// routes/health.route.js
// GET /api/health — cek status server dan koneksi database.

import { Router } from 'express';
import { isDBConnected } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  const dbConnected = isDBConnected();
  res.status(200).json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

export default router;
