// app.js
// Konfigurasi Express: middleware dan route.
// Dipisah dari server.js agar mudah diuji dan diperluas.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import env from './config/env.js';
import healthRouter from './routes/health.route.js';
import authRouter from './routes/auth.route.js';
import adminRouter from './routes/admin.route.js';
import quizRouter from './routes/quiz.route.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// ── Trust proxy ────────────────────────────────────────────────────────────────
// Diperlukan agar rate limit dan cookie secure bekerja di balik reverse proxy.
app.set('trust proxy', 1);

// Gunakan query parser 'simple' secara eksplisit agar req.query selalu berupa
// objek flat (string/array string), tidak pernah objek bertingkat.
app.set('query parser', 'simple');

// ── Middleware keamanan ─────────────────────────────────────────────────────────
app.use(helmet());

// Siapkan origin yang diizinkan untuk CORS (toleransi localhost dan 127.0.0.1 saat development)
const allowedOrigins = [
  env.CLIENT_URL,
  ...(env.NODE_ENV !== 'production'
    ? [
        env.CLIENT_URL.includes('localhost')
          ? env.CLIENT_URL.replace('localhost', '127.0.0.1')
          : env.CLIENT_URL.replace('127.0.0.1', 'localhost'),
      ]
    : []),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Batasi ukuran JSON body supaya tidak membebani server
app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

// Sanitasi NoSQL injection: panggil sanitize() langsung pada req.body.
// req.params tidak disanitasi di sini karena nilainya selalu string; validasi
// ID per route akan dilakukan di controller masing-masing (Langkah 3+).
// req.query tidak disentuh karena Express 5 menjadikannya read-only dan
// app.set('query parser', 'simple') sudah mencegah objek bertingkat.
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = mongoSanitize.sanitize(req.body);
  }
  next();
});

// ── Route ───────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/quiz', quizRouter);

// ── Fallthrough handlers ────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
