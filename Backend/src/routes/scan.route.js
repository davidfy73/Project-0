// routes/scan.route.js
// Endpoint scanner VirusTotal v3 untuk URL, File, dan Lookup (hash, domain, IP).
// Memerlukan login (requireAuth) dan dibatasi oleh rate limiter per user.

import { Router } from 'express';
import multer from 'multer';
import requireAuth from '../middleware/requireAuth.js';
import { scanUserLimiter } from '../middleware/rateLimits.js';
import { VT_CONFIG } from '../constants/virustotal.js';
import {
  handleScanUrl,
  handleScanFile,
  handleLookup,
  handleGetAnalysis,
} from '../controllers/scan.controller.js';

const router = Router();

// 1. Wajib terautentikasi (user dan admin boleh)
router.use(requireAuth);

// 2. Rate limiter per user (dipasang setelah requireAuth agar req.user._id tersedia)
router.use(scanUserLimiter);

// 3. Konfigurasi multer menggunakan memoryStorage (tidak pernah disimpan ke disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: VT_CONFIG.MAX_FILE_SIZE_BYTES, // 32 MB
  },
});

/**
 * Middleware wrapper untuk upload single file dengan penanganan error ukuran file (413).
 */
function uploadFileMiddleware(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          status: 'fail',
          message: 'Ukuran file melebihi batas maksimum 32 MB.',
        });
      }
      return res.status(400).json({
        status: 'fail',
        message: err.message || 'Gagal memproses upload file.',
      });
    }
    next();
  });
}

// ── Rute Scan ────────────────────────────────────────────────────────────────

// Scan URL
router.post('/url', handleScanUrl);

// Scan File (upload multipart)
router.post('/file', uploadFileMiddleware, handleScanFile);

// Lookup Hash / Domain / IP
router.post('/lookup', handleLookup);

// Polling status analisis
router.get('/analysis/:id', handleGetAnalysis);

export default router;
