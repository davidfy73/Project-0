// controllers/scan.controller.js
// Handler untuk endpoint scan URL, file, lookup, dan polling analisis.

import {
  scanUrl,
  scanFile,
  lookupTarget,
  getAnalysis,
  RateLimitError,
} from '../services/virustotal.service.js';
import { VT_CONFIG } from '../constants/virustotal.js';

// Regex ketat untuk deteksi otomatis tipe target pencarian
const REGEX_MD5 = /^[a-fA-F0-9]{32}$/;
const REGEX_SHA1 = /^[a-fA-F0-9]{40}$/;
const REGEX_SHA256 = /^[a-fA-F0-9]{64}$/;
const REGEX_IPV4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
const REGEX_DOMAIN = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
const REGEX_ANALYSIS_ID = /^[a-zA-Z0-9_-]+$/;

/**
 * Helper penanganan error konsisten pada controller scan.
 */
function handleControllerError(err, res, next) {
  if (err instanceof RateLimitError || err.statusCode === 429) {
    if (err.retryAfter) {
      res.set('Retry-After', String(err.retryAfter));
    }
    return res.status(429).json({
      status: 'fail',
      message: err.message || 'Batas scan tercapai, coba lagi sebentar.',
      retryAfter: err.retryAfter,
    });
  }

  if (err.statusCode && err.statusCode < 500) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  next(err);
}

/**
 * POST /api/scan/url
 * Body: { url }
 * Hanya http/https, batasi panjang.
 */
export async function handleScanUrl(req, res, next) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ status: 'fail', message: 'URL tidak boleh kosong.' });
    }

    const trimmedUrl = url.trim();

    if (trimmedUrl.length > VT_CONFIG.MAX_URL_LENGTH) {
      return res.status(400).json({
        status: 'fail',
        message: `Panjang URL melebihi batas maksimum ${VT_CONFIG.MAX_URL_LENGTH} karakter.`,
      });
    }

    // Validasi protokol http/https
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      return res.status(400).json({
        status: 'fail',
        message: 'URL harus diawali dengan http:// atau https://.',
      });
    }

    try {
      new URL(trimmedUrl);
    } catch {
      return res.status(400).json({ status: 'fail', message: 'Format URL tidak valid.' });
    }

    const report = await scanUrl(trimmedUrl);
    return res.status(200).json({ status: 'success', data: report });
  } catch (err) {
    handleControllerError(err, res, next);
  }
}

/**
 * POST /api/scan/file
 * Multipart/form-data: field 'file'
 * Menggunakan memoryStorage (tidak disimpan ke disk), batas 32 MB.
 */
export async function handleScanFile(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: 'fail',
        message: 'File tidak ditemukan dalam permintaan upload.',
      });
    }

    try {
      const report = await scanFile(req.file.buffer, req.file.originalname);
      return res.status(200).json({ status: 'success', data: report });
    } finally {
      // Lepas buffer dari memori segera setelah diproses
      req.file.buffer = null;
    }
  } catch (err) {
    handleControllerError(err, res, next);
  }
}

/**
 * POST /api/scan/lookup
 * Body: { query }
 * Deteksi otomatis hash (MD5/SHA1/SHA256), IP, atau domain.
 */
export async function handleLookup(req, res, next) {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Query pencarian tidak boleh kosong.',
      });
    }

    const trimmedQuery = query.trim();
    let type = null;

    if (
      REGEX_MD5.test(trimmedQuery) ||
      REGEX_SHA1.test(trimmedQuery) ||
      REGEX_SHA256.test(trimmedQuery)
    ) {
      type = 'hash';
    } else if (REGEX_IPV4.test(trimmedQuery)) {
      type = 'ip';
    } else if (REGEX_DOMAIN.test(trimmedQuery)) {
      type = 'domain';
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Query harus berupa hash (MD5/SHA1/SHA256), alamat IP, atau domain yang valid.',
      });
    }

    const report = await lookupTarget(trimmedQuery, type);
    return res.status(200).json({ status: 'success', data: report });
  } catch (err) {
    handleControllerError(err, res, next);
  }
}

/**
 * GET /api/scan/analysis/:id
 * Polling status analisis berdasarkan ID analisis VirusTotal.
 */
export async function handleGetAnalysis(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || !REGEX_ANALYSIS_ID.test(id.trim())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Format ID analisis tidak valid.',
      });
    }

    const report = await getAnalysis(id.trim());
    return res.status(200).json({ status: 'success', data: report });
  } catch (err) {
    handleControllerError(err, res, next);
  }
}
