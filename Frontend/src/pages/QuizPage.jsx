import { HelpCircle, Award, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={20} style={{ color: 'var(--accent-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Cybersecurity Quiz
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          Uji pemahaman komprehensif Anda mengenai ancaman digital dan langkah mitigasi.
        </p>
      </div>

      {/* Quiz Card */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-center space-y-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{
            backgroundColor: 'var(--accent-deep)',
            border: '1px solid var(--accent-primary)',
            boxShadow: '0 0 25px var(--accent-glow)',
          }}
        >
          <Award size={32} style={{ color: 'var(--accent-primary)' }} />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Evaluasi Pemahaman Keamanan Siber
          </h2>
          <p className="text-xs sm:text-sm max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Sistem akan mengacak 15 soal pilihan ganda dari bank soal (kombinasi materi Module dan
            Preventif). Hasil penilaian dan penjelasan akan langsung diberikan setelah Anda menjawab.
          </p>
        </div>

        {/* Rules grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <span className="text-[11px] font-mono" style={{ color: 'var(--accent-light)' }}>
              JUMLAH SOAL
            </span>
            <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              15 Soal Acak
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Dipilih dari 30+ bank soal
            </p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <span className="text-[11px] font-mono" style={{ color: 'var(--color-warning)' }}>
              SISTEM PENILAIAN
            </span>
            <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              Backend Verified
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Kunci jawaban tersimpan aman
            </p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <span className="text-[11px] font-mono" style={{ color: 'var(--color-success)' }}>
              FEEDBACK
            </span>
            <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              Real-time Explanation
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Penjelasan detail tiap jawaban
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Fitur interaktif Quiz akan terhubung ke API backend pada Fase 4.')}
          className="px-8 h-12 rounded-xl text-sm font-semibold cursor-pointer transition-all inline-flex items-center gap-2"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--text-on-accent)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>Mulai Quiz</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
