// middleware/errorHandler.js
// 404 handler dan error handler global.
// Dipasang terakhir di app.js setelah semua route.

import env from '../config/env.js';

/**
 * 404 handler — request tidak cocok dengan route manapun.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ status: 'error', message: 'Endpoint tidak ditemukan.' });
}

/**
 * Error handler global — Express 5 meneruskan semua error (sync & async) ke sini.
 * Signature wajib 4 parameter agar Express mengenalinya sebagai error handler.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // JSON body rusak (SyntaxError dari express.json)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: 'error', message: 'Body JSON tidak valid.' });
  }

  // Body melebihi batas ukuran (express.json limit)
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ status: 'error', message: 'Ukuran request terlalu besar.' });
  }

  // Log detail error di sisi server (tidak dikirim ke client)
  if (env.NODE_ENV !== 'production') {
    console.error('[error]', err);
  } else {
    console.error('[error]', err.message);
  }

  // Respons generik ke client — tidak membocorkan detail internal
  const statusCode = typeof err.status === 'number' ? err.status : 500;
  res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 ? 'Terjadi kesalahan pada server.' : err.message,
  });
}
