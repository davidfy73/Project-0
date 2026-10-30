import { useState } from 'react';
import { ArrowRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

// TODO: Di versi final, jawaban benar (correctIndex) tidak boleh ada di frontend dan dinilai langsung di backend.
const QUIZ_SAMPLE = {
  category: 'phishing',
  question:
    "Kamu menerima email dari 'bank' yang meminta klik tautan untuk verifikasi akun dalam 1 jam. Apa tindakan paling tepat?",
  options: [
    'Klik tautan dan segera isi data',
    'Balas email dengan data akun',
    'Abaikan tautan, buka situs resmi bank lewat browser sendiri',
    'Teruskan email ke teman agar ikut waspada',
  ],
  correctIndex: 2,
  explanation:
    'Pesan yang menekan dengan batas waktu adalah ciri phishing. Jangan klik tautan di email; buka situs resmi dengan mengetik alamatnya sendiri.',
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === QUIZ_SAMPLE.correctIndex;

  const handleSelect = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  return (
    <div className="w-full flex items-center justify-center py-6 sm:py-10 px-2 sm:px-4 animate-in fade-in">
      {/* Kartu Kuis bergaya referensi: Hard Shadow solid, Rounded, Border jelas */}
      <div
        className="w-full max-w-[480px] rounded-3xl p-6 sm:p-9 transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--border-primary)',
          boxShadow: '8px 8px 0px var(--accent-deep)',
        }}
      >
        {/* Header Kartu: Kiri atas Teks PHISHYEARN, Kanan atas Tombol Panah Lanjut */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs sm:text-sm font-semibold tracking-wide"
            style={{ color: 'var(--text-secondary)' }}
          >
            PHISHYEARN
          </span>

          <button
            type="button"
            disabled={!isAnswered || showResult}
            onClick={() => setShowResult(true)}
            aria-label="Lihat Hasil Kuis"
            className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 ${
              isAnswered && !showResult
                ? 'cursor-pointer hover:translate-x-1'
                : 'cursor-not-allowed opacity-40'
            }`}
            style={{
              color: isAnswered && !showResult ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: isAnswered && !showResult ? 'var(--bg-elevated)' : 'transparent',
              outlineColor: 'var(--accent-light)',
            }}
          >
            <ArrowRight size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Judul Besar Tebal & Garis Bawah Aksen */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Quiz Time
          </h1>
          <div
            className="h-1.5 w-24 sm:w-28 mx-auto mt-3 rounded-full"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          />
        </div>

        {!showResult ? (
          <>
            {/* Teks Soal: Rata Tengah & Tebal */}
            <div className="text-center mb-7 px-1 sm:px-3">
              <p
                className="text-sm sm:text-base font-bold leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                {QUIZ_SAMPLE.question}
              </p>
            </div>

            {/* 4 Opsi Jawaban: Full-width button, A B C D bold */}
            <div className="space-y-3 mb-6" role="radiogroup" aria-label="Pilihan Jawaban">
              {QUIZ_SAMPLE.options.map((optionText, idx) => {
                const letter = OPTION_LETTERS[idx];
                const isThisOptionCorrect = idx === QUIZ_SAMPLE.correctIndex;
                const isThisOptionSelected = selectedOption === idx;

                let optionBg = 'var(--bg-elevated)';
                let optionBorder = 'var(--border-primary)';
                let letterColor = 'var(--text-secondary)';
                let textColor = 'var(--text-primary)';
                let opacityClass = '';

                if (isAnswered) {
                  if (isThisOptionCorrect) {
                    optionBg = 'rgba(32, 201, 151, 0.15)';
                    optionBorder = 'var(--color-success)';
                    letterColor = 'var(--color-success)';
                    textColor = 'var(--text-primary)';
                  } else if (isThisOptionSelected && !isThisOptionCorrect) {
                    optionBg = 'rgba(255, 91, 100, 0.15)';
                    optionBorder = 'var(--color-danger)';
                    letterColor = 'var(--color-danger)';
                    textColor = 'var(--text-primary)';
                  } else {
                    opacityClass = 'opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    role="radio"
                    aria-checked={isThisOptionSelected}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl flex items-start gap-3 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      !isAnswered ? 'cursor-pointer' : 'cursor-default'
                    } ${opacityClass}`}
                    style={{
                      backgroundColor: optionBg,
                      border: `1.5px solid ${optionBorder}`,
                      color: textColor,
                    }}
                    onMouseOver={(e) => {
                      if (!isAnswered) {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isAnswered) {
                        e.currentTarget.style.borderColor = 'var(--border-primary)';
                      }
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outlineColor = 'var(--accent-light)';
                    }}
                  >
                    <span
                      className="font-extrabold text-sm sm:text-base shrink-0 select-none"
                      style={{ color: letterColor }}
                    >
                      {letter}.
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-snug flex-1 pt-0.5">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Kotak Feedback setelah menjawab */}
            {isAnswered && (
              <div
                className="rounded-2xl p-4 sm:p-5 border transition-all animate-in fade-in"
                style={{
                  backgroundColor: isCorrect
                    ? 'rgba(32, 201, 151, 0.1)'
                    : 'rgba(255, 91, 100, 0.1)',
                  borderColor: isCorrect ? 'var(--color-success)' : 'var(--color-danger)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <XCircle size={18} style={{ color: 'var(--color-danger)' }} />
                  )}
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: isCorrect ? 'var(--color-success)' : 'var(--color-danger)',
                    }}
                  >
                    {isCorrect ? 'Benar!' : 'Kurang tepat'}
                  </span>
                </div>
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {QUIZ_SAMPLE.explanation}
                </p>
                <div className="mt-3 pt-2 border-t flex justify-end" style={{ borderColor: 'var(--border-primary)' }}>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    Klik tanda panah (→) di kanan atas untuk melihat skor
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* State Hasil Kuis */
          <div className="py-6 text-center space-y-6 animate-in fade-in">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
              style={{
                backgroundColor: isCorrect
                  ? 'rgba(32, 201, 151, 0.18)'
                  : 'rgba(255, 91, 100, 0.18)',
                border: `1.5px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}`,
              }}
            >
              {isCorrect ? (
                <CheckCircle2 size={32} style={{ color: 'var(--color-success)' }} />
              ) : (
                <XCircle size={32} style={{ color: 'var(--color-danger)' }} />
              )}
            </div>

            <div>
              <h2
                className="text-2xl font-extrabold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Skor akhir: {isCorrect ? '1/1' : '0/1'}
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                {isCorrect
                  ? 'Luar biasa! Pemahaman kamu terhadap tanda-tanda phishing sangat baik.'
                  : 'Jangan berkecil hati! Pelajari kembali materi Module Phishing dan coba lagi.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 h-11 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all inline-flex items-center justify-center gap-2"
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
                <span>Ulangi</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
