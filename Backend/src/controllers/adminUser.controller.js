// controllers/adminUser.controller.js
// Endpoint kelola user dan pemantauan progres belajar untuk admin.
// Dilindungi requireAuth + requireRole('admin') di admin.route.js.

import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Progress from '../models/Progress.model.js';
import QuizResult from '../models/QuizResult.model.js';
import { MODULE_SLUGS, PREVENTIVE_SLUGS } from '../constants/slugs.js';

/**
 * Escape karakter spesial regex untuk mencegah RegEx Injection / ReDoS.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Hitung skor kuis terakhir dan tertinggi.
 * - Terakhir: kuis dengan playedAt terbaru (indeks 0 jika array sudah disort playedAt: -1).
 * - Tertinggi: dibandingkan berdasarkan rasio score / totalQuestions (bukan angka mentah).
 * Mengembalikan objek { score, total } atau null.
 */
function computeQuizScores(quizResults) {
  if (!quizResults || quizResults.length === 0) {
    return {
      lastQuizScore: null,
      highestQuizScore: null,
    };
  }

  // Kuis terbaru
  const latest = quizResults[0];
  const lastQuizScore = {
    score: latest.score,
    total: latest.totalQuestions,
  };

  // Kuis tertinggi berdasarkan rasio score / totalQuestions
  let highest = quizResults[0];
  let highestRatio = highest.totalQuestions > 0 ? highest.score / highest.totalQuestions : 0;

  for (let i = 1; i < quizResults.length; i++) {
    const q = quizResults[i];
    const ratio = q.totalQuestions > 0 ? q.score / q.totalQuestions : 0;
    if (ratio > highestRatio) {
      highestRatio = ratio;
      highest = q;
    }
  }

  const highestQuizScore = {
    score: highest.score,
    total: highest.totalQuestions,
  };

  return { lastQuizScore, highestQuizScore };
}

/**
 * GET /api/admin/users
 * Mengambil daftar seluruh user.
 * Query opsional: ?search= (cari berdasarkan username, case-insensitive, aman dari regex injection).
 * Password dan refresh token hash tidak pernah diekspos.
 */
export async function getAdminUsers(req, res, next) {
  try {
    const { search } = req.query;
    const filter = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      filter.username = new RegExp(escapeRegex(search.trim()), 'i');
    }

    const users = await User.find(filter)
      .select('_id username role lastActiveAt createdAt')
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      role: u.role,
      lastActiveAt: u.lastActiveAt,
      createdAt: u.createdAt,
    }));

    return res.status(200).json({
      status: 'success',
      total: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/users/:id
 * Mengambil detail satu user beserta ringkasan progres dan riwayat kuisnya.
 */
export async function getAdminUserDetail(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'ID user tidak valid.' });
    }

    const user = await User.findById(id).select('_id username role lastActiveAt createdAt');
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User tidak ditemukan.' });
    }

    // Ambil progres belajar
    const progressDoc = await Progress.findOne({ userId: user._id });
    const completedSlugs = progressDoc?.completedSlugs || [];
    const completedModules = completedSlugs.filter((s) => MODULE_SLUGS.includes(s));
    const completedPreventive = completedSlugs.filter((s) => PREVENTIVE_SLUGS.includes(s));

    // Ambil riwayat kuis (urutkan playedAt: -1)
    const quizResults = await QuizResult.find({ userId: user._id }).sort({ playedAt: -1 });
    const { lastQuizScore, highestQuizScore } = computeQuizScores(quizResults);

    return res.status(200).json({
      status: 'success',
      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt,
        progress: {
          modulesRead: completedModules.length,
          totalModules: MODULE_SLUGS.length,
          preventiveRead: completedPreventive.length,
          totalPreventive: PREVENTIVE_SLUGS.length,
          completedModules,
          completedPreventive,
          lastQuizScore,
          highestQuizScore,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/users/:id
 * Menghapus user beserta seluruh Progress dan QuizResult miliknya.
 * Akun role admin TIDAK bisa dihapus (403), termasuk akun sendiri.
 */
export async function deleteAdminUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'ID user tidak valid.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User tidak ditemukan.' });
    }

    // Lindungi semua akun admin
    if (user.role === 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Akun admin dilindungi dan tidak dapat dihapus.',
      });
    }

    // Hapus user dan semua data terkait
    // Refresh token tersimpan di dokumen User itu sendiri sehingga ikut musnah
    await Promise.all([
      User.findByIdAndDelete(user._id),
      Progress.deleteMany({ userId: user._id }),
      QuizResult.deleteMany({ userId: user._id }),
    ]);

    return res.status(200).json({
      status: 'success',
      message: `User "${user.username}" dan seluruh data progres/kuis berhasil dihapus.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/progress
 * Progres semua user (khusus role 'user'):
 * username, Module x/6, Preventive x/7, skor kuis terakhir & tertinggi.
 * Mengambil data secara batch untuk menghindari masalah query N+1.
 */
export async function getAdminProgress(req, res, next) {
  try {
    // Ambil semua user dengan role 'user'
    const users = await User.find({ role: 'user' })
      .select('_id username role lastActiveAt createdAt')
      .sort({ createdAt: -1 });

    if (users.length === 0) {
      return res.status(200).json({
        status: 'success',
        total: 0,
        users: [],
      });
    }

    const userIds = users.map((u) => u._id);

    // Ambil data progres dan kuis untuk seluruh user sekaligus (2 query, no N+1)
    const [progressList, quizList] = await Promise.all([
      Progress.find({ userId: { $in: userIds } }),
      QuizResult.find({ userId: { $in: userIds } }).sort({ playedAt: -1 }),
    ]);

    // Map progres per userId
    const progressMap = new Map();
    for (const p of progressList) {
      progressMap.set(p.userId.toString(), p.completedSlugs || []);
    }

    // Kelompokkan kuis per userId
    const quizMap = new Map();
    for (const q of quizList) {
      const uId = q.userId.toString();
      if (!quizMap.has(uId)) {
        quizMap.set(uId, []);
      }
      quizMap.get(uId).push(q);
    }

    // Gabungkan hasil di memori
    const result = users.map((u) => {
      const uId = u._id.toString();
      const completedSlugs = progressMap.get(uId) || [];
      const completedModules = completedSlugs.filter((s) => MODULE_SLUGS.includes(s));
      const completedPreventive = completedSlugs.filter((s) => PREVENTIVE_SLUGS.includes(s));

      const userQuizzes = quizMap.get(uId) || [];
      const { lastQuizScore, highestQuizScore } = computeQuizScores(userQuizzes);

      return {
        id: uId,
        username: u.username,
        role: u.role,
        lastActiveAt: u.lastActiveAt,
        createdAt: u.createdAt,
        progress: {
          modulesRead: completedModules.length,
          totalModules: MODULE_SLUGS.length,
          preventiveRead: completedPreventive.length,
          totalPreventive: PREVENTIVE_SLUGS.length,
          completedModules,
          completedPreventive,
          lastQuizScore,
          highestQuizScore,
        },
      };
    });

    return res.status(200).json({
      status: 'success',
      total: result.length,
      users: result,
    });
  } catch (err) {
    next(err);
  }
}
