// controllers/progress.controller.js
// Catat dan baca progres belajar materi Module & Preventive per user.

import { z } from 'zod';
import Progress from '../models/Progress.model.js';
import {
  MODULE_SLUGS,
  PREVENTIVE_SLUGS,
  isValidSlug,
} from '../constants/slugs.js';

// Skema validasi request body complete
const completeSchema = z.object({
  slug: z
    .string({ required_error: 'Slug materi wajib diisi.' })
    .trim()
    .refine((val) => isValidSlug(val), {
      message: 'Slug materi tidak sah.',
    }),
});

/**
 * Helper untuk memformat objek progres user
 * memisahkan completedSlugs menjadi module dan preventive beserta jumlahnya.
 */
function formatProgress(completedSlugs = []) {
  const module = completedSlugs.filter((s) => MODULE_SLUGS.includes(s));
  const preventive = completedSlugs.filter((s) => PREVENTIVE_SLUGS.includes(s));

  return {
    module,
    preventive,
    moduleCount: module.length,
    moduleTotal: MODULE_SLUGS.length,
    preventiveCount: preventive.length,
    preventiveTotal: PREVENTIVE_SLUGS.length,
  };
}

// GET /api/progress — Baca progres belajar milik user login
export async function getProgress(req, res) {
  // userId selalu dari token autentikasi
  const progressDoc = await Progress.findOne({ userId: req.user._id }).lean();

  const completedSlugs = progressDoc?.completedSlugs || [];
  const progress = formatProgress(completedSlugs);

  res.status(200).json({
    status: 'ok',
    progress,
  });
}

// POST /api/progress/complete — Tandai satu materi selesai dibaca (idempoten)
export async function completeProgress(req, res) {
  const parsed = completeSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Input tidak valid.';
    return res.status(400).json({ status: 'error', message });
  }

  const { slug } = parsed.data;

  // Idempoten: $addToSet memastikan slug tidak digandakan,
  // upsert: true otomatis membuat dokumen jika user baru pertama kali menyelesaikan materi
  const updatedDoc = await Progress.findOneAndUpdate(
    { userId: req.user._id },
    { $addToSet: { completedSlugs: slug } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  const progress = formatProgress(updatedDoc.completedSlugs || []);

  res.status(200).json({
    status: 'ok',
    message: 'Progres materi berhasil diperbarui.',
    progress,
  });
}
