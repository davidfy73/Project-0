// controllers/quiz.controller.js
// Endpoint kuis untuk sisi user (/api/quiz).

import mongoose from 'mongoose';
import { z } from 'zod';
import Question from '../models/Question.model.js';
import QuizResult from '../models/QuizResult.model.js';

// Skema validasi submit jawaban kuis
const submitAnswerItemSchema = z.object({
  questionId: z
    .string()
    .trim()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Format questionId tidak valid.',
    }),
  selectedOption: z
    .coerce
    .number()
    .int('Pilihan jawaban harus berupa angka bulat.')
    .min(0, 'Pilihan jawaban minimal indeks 0.')
    .max(3, 'Pilihan jawaban maksimal indeks 3.'),
});

const submitQuizSchema = z
  .object({
    answers: z
      .array(submitAnswerItemSchema, {
        required_error: 'Array answers wajib dikirim.',
      })
      .min(1, 'Minimal harus menyertakan 1 jawaban.'),
  })
  .refine(
    (data) => {
      const ids = data.answers.map((a) => a.questionId);
      return new Set(ids).size === ids.length;
    },
    {
      message: 'Terdapat questionId duplikat dalam jawaban yang dikirim.',
      path: ['answers'],
    }
  );

// GET /api/quiz/questions — Ambil semua soal dengan urutan acak
// CATATAN: correctIndex dan explanation TIDAK dikirimkan ke frontend!
export async function getQuizQuestions(_req, res) {
  // Ambil semua soal, kecualikan correctIndex dan explanation
  const questions = await Question.find({}, '-correctIndex -explanation').lean();

  // Acak urutan soal (Fisher-Yates shuffle) tiap kali sesi diminta
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Format id agar ramah frontend
  const formattedQuestions = shuffled.map((q) => ({
    id: q._id,
    category: q.category,
    question: q.question,
    options: q.options,
  }));

  res.status(200).json({
    status: 'ok',
    questions: formattedQuestions,
  });
}

// POST /api/quiz/submit — Nilai jawaban di backend dan simpan hasil sesi
export async function submitQuiz(req, res) {
  const parsed = submitQuizSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Input jawaban tidak valid.';
    return res.status(400).json({ status: 'error', message });
  }

  const { answers } = parsed.data;

  // Ambil soal yang cocok dari database
  const questionIds = answers.map((a) => a.questionId);
  const dbQuestions = await Question.find({ _id: { $in: questionIds } }).lean();

  const questionMap = new Map(dbQuestions.map((q) => [String(q._id), q]));

  let score = 0;
  let totalQuestions = 0;
  const details = [];

  for (const item of answers) {
    const dbQuestion = questionMap.get(item.questionId);

    // Soal yang sudah dihapus oleh admin saat sesi berjalan diabaikan (tidak dihitung)
    if (!dbQuestion) {
      continue;
    }

    totalQuestions += 1;
    const isCorrect = dbQuestion.correctIndex === item.selectedOption;
    if (isCorrect) {
      score += 1;
    }

    details.push({
      questionId: dbQuestion._id,
      category: dbQuestion.category,
      question: dbQuestion.question,
      options: dbQuestion.options,
      selectedOption: item.selectedOption,
      correctIndex: dbQuestion.correctIndex, // Kunci jawaban resmi dirilis di sini
      isCorrect,
      explanation: dbQuestion.explanation,   // Penjelasan jawaban resmi dirilis di sini
    });
  }

  // Simpan hasil sesi jika terdapat soal yang valid
  if (totalQuestions > 0) {
    await QuizResult.create({
      userId: req.user._id,
      score,
      totalQuestions,
    });
  }

  res.status(200).json({
    status: 'ok',
    score,
    totalQuestions,
    details,
  });
}
