// controllers/adminQuestion.controller.js
// CRUD bank soal kuis oleh admin (/api/admin/questions).

import mongoose from 'mongoose';
import { z } from 'zod';
import Question from '../models/Question.model.js';

// Skema validasi soal kuis
const questionSchema = z
  .object({
    category: z.enum(['module', 'preventive'], {
      required_error: 'Kategori wajib dipilih (module atau preventive).',
    }),
    question: z.string().trim().min(10, 'Pertanyaan minimal 10 karakter.'),
    options: z
      .array(z.string().trim().min(1, 'Opsi jawaban tidak boleh kosong.'))
      .length(4, 'Pilihan jawaban harus berjumlah tepat 4 opsi.'),
    correctIndex: z.coerce.number().int().min(0).max(3),
    explanation: z.string().trim().min(1, 'Penjelasan jawaban wajib diisi.'),
  })
  .refine(
    (data) => {
      const normalized = data.options.map((opt) => opt.toLowerCase());
      return new Set(normalized).size === 4;
    },
    {
      message: '4 pilihan jawaban harus berbeda (tidak boleh sama).',
      path: ['options'],
    }
  );

// GET /api/admin/questions — Ambil semua soal
export async function getQuestions(_req, res) {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'ok',
    questions,
  });
}

// POST /api/admin/questions — Tambah soal baru
export async function createQuestion(req, res) {
  const parsed = questionSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Input tidak valid.';
    return res.status(400).json({ status: 'error', message });
  }

  const { category, question, options, correctIndex, explanation } = parsed.data;

  const newQuestion = await Question.create({
    category,
    question,
    options,
    correctIndex,
    explanation,
  });

  res.status(201).json({
    status: 'ok',
    message: 'Soal kuis berhasil ditambahkan.',
    question: newQuestion,
  });
}

// PUT /api/admin/questions/:id — Edit soal yang ada
export async function updateQuestion(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 'error', message: 'ID soal tidak valid.' });
  }

  const parsed = questionSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Input tidak valid.';
    return res.status(400).json({ status: 'error', message });
  }

  const { category, question, options, correctIndex, explanation } = parsed.data;

  const updated = await Question.findByIdAndUpdate(
    id,
    { category, question, options, correctIndex, explanation },
    { new: true, runValidators: true }
  );

  if (!updated) {
    return res.status(404).json({ status: 'error', message: 'Soal tidak ditemukan.' });
  }

  res.status(200).json({
    status: 'ok',
    message: 'Soal kuis berhasil diperbarui.',
    question: updated,
  });
}

// DELETE /api/admin/questions/:id — Hapus soal
export async function deleteQuestion(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 'error', message: 'ID soal tidak valid.' });
  }

  const deleted = await Question.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ status: 'error', message: 'Soal tidak ditemukan.' });
  }

  res.status(200).json({
    status: 'ok',
    message: 'Soal kuis berhasil dihapus.',
  });
}
