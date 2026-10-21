import { HelpCircle, Award, ArrowRight } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in pb-8">
      {/* Header halaman */}
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={20} style={{ color: 'var(--accent-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Quiz
          </h1>
        </div>
      </div>

      {/* Satu kartu di tengah */}
      <div
        className="rounded-2xl p-8 sm:p-12 text-center space-y-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-transform duration-300 hover:scale-105"
          style={{
            backgroundColor: 'var(--accent-deep)',
            border: '1px solid var(--accent-primary)',
            boxShadow: '0 0 25px var(--accent-glow)',
          }}
        >
          <Award size={32} style={{ color: 'var(--accent-primary)' }} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Siap menguji pemahamanmu?
          </h2>
          <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Jawab pertanyaannya, lalu lihat penjelasan di setiap jawaban.
          </p>
        </div>

        <div className="pt-2">
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
    </div>
  );
}
