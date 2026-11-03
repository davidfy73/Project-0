import { useState, useEffect } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
  Loader2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sesi Kuis User
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { score, totalQuestions, details }

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);

    try {
      const res = await api.get('/api/quiz/questions');
      setQuestions(res.data.questions || []);
    } catch (err) {
      const message =
        err.response?.data?.message ??
        (!err.response
          ? 'Gagal terhubung ke server backend. Pastikan server backend sedang aktif.'
          : 'Terjadi kesalahan saat memuat soal kuis.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isOptionSelected = selectedOption !== undefined;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (optionIndex) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Validasi semua soal sudah dijawab
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      toast.error(`Mohon jawab semua soal (${answeredCount}/${questions.length} terjawab).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q.id,
          selectedOption: answers[q.id],
        })),
      };

      const res = await api.post('/api/quiz/submit', payload);
      setResult(res.data);
      toast.success('Kuis berhasil dikumpulkan!');
    } catch (err) {
      const message = err.response?.data?.message ?? 'Gagal mengumpulkan kuis.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 1. State Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in">
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Menyiapkan bank soal kuis...
        </p>
      </div>
    );
  }

  // ── 2. State Error ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-10 px-4">
        <div
          className="w-full max-w-md rounded-3xl p-8 text-center space-y-5 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: '8px 8px 0px var(--accent-deep)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(255, 91, 100, 0.12)',
              color: 'var(--color-danger)',
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Gagal Memuat Kuis
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {error}
            </p>
          </div>
          <button
            type="button"
            onClick={loadQuestions}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all inline-flex items-center gap-2"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-on-accent)',
              border: 'none',
            }}
          >
            <RotateCcw size={16} />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  // ── 3. State Bank Kosong ──────────────────────────────────────────────────────
  if (!questions || questions.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12 px-4 animate-in fade-in">
        <div
          className="w-full max-w-lg rounded-3xl p-8 sm:p-10 text-center space-y-5 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: '8px 8px 0px var(--accent-deep)',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <HelpCircle size={32} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
              Belum Ada Soal Kuis
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Bank soal saat ini masih kosong. Administrator belum menambahkan materi kuis ke dalam sistem. Silakan kembali lagi nanti.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={loadQuestions}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all inline-flex items-center gap-2"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <RotateCcw size={15} />
              <span>Muat Ulang</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 4. State Hasil Kuis (Setelah Submit) ───────────────────────────────────────
  if (result) {
    const isPassing = result.score >= Math.ceil(result.totalQuestions / 2);

    return (
      <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-3 sm:px-4 space-y-6 animate-in fade-in">
        {/* Kartu Ringkasan Skor */}
        <div
          className="w-full rounded-3xl p-6 sm:p-9 text-center space-y-5 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: '8px 8px 0px var(--accent-deep)',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
            style={{
              backgroundColor: isPassing
                ? 'rgba(32, 201, 151, 0.18)'
                : 'rgba(255, 91, 100, 0.18)',
              border: `1.5px solid ${isPassing ? 'var(--color-success)' : 'var(--color-danger)'}`,
            }}
          >
            {isPassing ? (
              <Award size={34} style={{ color: 'var(--color-success)' }} />
            ) : (
              <XCircle size={34} style={{ color: 'var(--color-danger)' }} />
            )}
          </div>

          <div>
            <span
              className="text-xs font-mono uppercase tracking-wider font-semibold"
              style={{ color: 'var(--text-muted)' }}
            >
              Hasil Sesi Kuis
            </span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold mt-1 mb-2 font-mono"
              style={{ color: 'var(--text-primary)' }}
            >
              {result.score} / {result.totalQuestions}
            </h1>
            <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {isPassing
                ? 'Luar biasa! Pemahaman Anda terhadap materi keamanan siber sangat baik.'
                : 'Perlu sedikit latihan lagi. Baca kembali Module & Preventive, lalu coba kembali!'}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={loadQuestions}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all inline-flex items-center gap-2"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--text-on-accent)',
                border: 'none',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <RotateCcw size={16} />
              <span>Ulangi Kuis</span>
            </button>
          </div>
        </div>

        {/* Review Detail per Soal */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold px-1" style={{ color: 'var(--text-primary)' }}>
            Pembahasan Soal ({result.details?.length || 0} Soal)
          </h2>

          {result.details?.map((item, idx) => (
            <div
              key={item.questionId || idx}
              className="rounded-2xl p-5 border space-y-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: item.isCorrect ? 'rgba(32, 201, 151, 0.4)' : 'rgba(255, 91, 100, 0.4)',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <span
                    className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: 'var(--accent-glow)',
                      color: 'var(--accent-light)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {item.isCorrect ? (
                    <>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                      <span style={{ color: 'var(--color-success)' }}>Benar</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} style={{ color: 'var(--color-danger)' }} />
                      <span style={{ color: 'var(--color-danger)' }}>Kurang Tepat</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {item.question}
              </p>

              {/* Opsi Jawaban Review */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {item.options?.map((opt, optIdx) => {
                  const isUserPick = optIdx === item.selectedOption;
                  const isCorrectKey = optIdx === item.correctIndex;

                  let border = 'var(--border-primary)';
                  let bg = 'var(--bg-elevated)';
                  let color = 'var(--text-secondary)';

                  if (isCorrectKey) {
                    border = 'var(--color-success)';
                    bg = 'rgba(32, 201, 151, 0.12)';
                    color = 'var(--color-success)';
                  } else if (isUserPick && !item.isCorrect) {
                    border = 'var(--color-danger)';
                    bg = 'rgba(255, 91, 100, 0.12)';
                    color = 'var(--color-danger)';
                  }

                  return (
                    <div
                      key={optIdx}
                      className="p-2.5 rounded-xl border flex items-start gap-2"
                      style={{ backgroundColor: bg, borderColor: border, color }}
                    >
                      <span className="font-bold font-mono shrink-0">{OPTION_LETTERS[optIdx]}.</span>
                      <span className="flex-1 font-medium">{opt}</span>
                      {isCorrectKey && <CheckCircle2 size={14} className="shrink-0 mt-0.5" />}
                      {isUserPick && !isCorrectKey && <XCircle size={14} className="shrink-0 mt-0.5" />}
                    </div>
                  );
                })}
              </div>

              {/* Penjelasan */}
              <div
                className="p-3 rounded-xl border text-xs leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span className="font-semibold text-white mr-1.5">Penjelasan:</span>
                <span>{item.explanation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── 5. State Sesi Berjalan (Mengerjakan Soal Bertahap) ─────────────────────────
  return (
    <div className="w-full flex items-center justify-center py-6 sm:py-10 px-2 sm:px-4 animate-in fade-in">
      <div
        className="w-full max-w-[540px] rounded-3xl p-6 sm:p-9 transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--border-primary)',
          boxShadow: '8px 8px 0px var(--accent-deep)',
        }}
      >
        {/* Header Kartu: Brand & Kategori */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-xs sm:text-sm font-semibold tracking-wide"
            style={{ color: 'var(--text-secondary)' }}
          >
            PHISHYEARN QUIZ
          </span>

          <span
            className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--accent-glow)',
              color: 'var(--accent-light)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            {currentQuestion?.category || 'module'}
          </span>
        </div>

        {/* Progress Indikator */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono font-semibold" style={{ color: 'var(--accent-light)' }}>
              Soal {currentIndex + 1} dari {questions.length}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {Object.keys(answers).length} dijawab
            </span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--progress-track)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                backgroundColor: 'var(--accent-primary)',
              }}
            />
          </div>
        </div>

        {/* Teks Soal */}
        <div className="mb-6">
          <h2
            className="text-sm sm:text-base font-bold leading-relaxed"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentQuestion?.question}
          </h2>
        </div>

        {/* 4 Opsi Jawaban (A, B, C, D) */}
        <div className="space-y-3 mb-8" role="radiogroup" aria-label="Pilihan Jawaban">
          {currentQuestion?.options?.map((optionText, idx) => {
            const letter = OPTION_LETTERS[idx];
            const isSelected = selectedOption === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className="w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-start gap-3 cursor-pointer select-none"
                style={{
                  backgroundColor: isSelected ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-primary)',
                  boxShadow: isSelected ? '0 0 0 2px var(--accent-primary)' : 'none',
                }}
              >
                <span
                  className="font-extrabold font-mono text-sm sm:text-base shrink-0 select-none"
                  style={{ color: isSelected ? 'var(--accent-light)' : 'var(--text-secondary)' }}
                >
                  {letter}.
                </span>
                <span
                  className="text-xs sm:text-sm font-medium leading-snug flex-1 pt-0.5"
                  style={{ color: isSelected ? 'var(--text-on-accent)' : 'var(--text-primary)' }}
                >
                  {optionText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tombol Navigasi Bawah */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <ArrowLeft size={16} />
            <span>Sebelumnya</span>
          </button>

          {!isLastQuestion ? (
            <button
              type="button"
              disabled={!isOptionSelected}
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--text-on-accent)',
                border: 'none',
              }}
              onMouseOver={(e) => {
                if (isOptionSelected) e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              }}
              onMouseOut={(e) => {
                if (isOptionSelected) e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              }}
            >
              <span>Selanjutnya</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={!isOptionSelected || isSubmitting}
              onClick={handleSubmitQuiz}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-success)',
                color: '#FFFFFF',
                border: 'none',
              }}
              onMouseOver={(e) => {
                if (isOptionSelected && !isSubmitting) {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.filter = 'none';
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span>Selesai & Kumpulkan</span>
                  <Send size={15} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
