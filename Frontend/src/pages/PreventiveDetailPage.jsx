import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { getPreventiveNavigation } from '../data/preventiveData';

export default function PreventiveDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const navInfo = getPreventiveNavigation(slug);

  // Jika slug tidak valid, redirect ke halaman /preventive
  if (!navInfo) {
    return <Navigate to="/preventive" replace />;
  }

  const { topic, currentIndex, totalTopics, isFirst, isLast, prevTopic, nextTopic } = navInfo;
  const [isCompleted, setIsCompleted] = useState(false);

  // Cek status selesai dari localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('preventive_completed') || '{}');
      setIsCompleted(!!saved[topic.slug]);
    } catch {
      setIsCompleted(false);
    }
  }, [topic.slug]);

  // Scroll ke atas setiap kali slug berubah
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const handlePrevious = () => {
    if (isFirst || !prevTopic) return;
    navigate(`/preventive/${prevTopic.slug}`);
  };

  const handleNext = () => {
    if (isLast) {
      navigate('/preventive');
    } else if (nextTopic) {
      navigate(`/preventive/${nextTopic.slug}`);
    }
  };

  const handleMarkCompleteAndNext = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('preventive_completed') || '{}');
      saved[topic.slug] = true;
      localStorage.setItem('preventive_completed', JSON.stringify(saved));
      setIsCompleted(true);
    } catch (err) {
      console.error('Failed to save preventive completion', err);
    }

    if (isLast) {
      navigate('/preventive');
    } else if (nextTopic) {
      navigate(`/preventive/${nextTopic.slug}`);
    }
  };

  // Komponen markdown untuk highlight backtick & bold text
  const markdownComponents = {
    p: ({ children }) => <span className="leading-relaxed">{children}</span>,
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
    ),
    code: ({ children, ...props }) => (
      <code
        className="font-mono text-xs sm:text-[13px] px-1.5 py-0.5 rounded font-medium inline-block my-0.5"
        style={{
          backgroundColor: '#16263d',
          color: '#60A5FA',
          border: '1px solid rgba(96, 165, 250, 0.25)',
        }}
        {...props}
      >
        {children}
      </code>
    ),
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-10 animate-in fade-in">
      {/* Top Bar: Navigasi kembali & Tag Topik */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          to="/preventive"
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
          style={{ color: 'var(--text-muted)' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-light)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Preventive</span>
        </Link>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span
              className="flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(32, 201, 151, 0.15)',
                color: 'var(--color-success)',
                border: '1px solid rgba(32, 201, 151, 0.3)',
              }}
            >
              <Check size={12} />
              <span>Selesai</span>
            </span>
          )}
          <span
            className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--accent-light)',
              border: '1px solid var(--border-secondary)',
            }}
          >
            {topic.number}
          </span>
        </div>
      </div>

      {/* Header Halaman: Teks monospace Topik N / 7, Judul Topik Besar, Garis Pemisah */}
      <div className="mb-6">
        <div className="font-mono text-xs sm:text-sm tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Topic {currentIndex + 1} / {totalTopics}
        </div>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1 mb-5"
          style={{ color: 'var(--text-primary)' }}
        >
          {topic.title}
        </h1>
        <div className="border-b" style={{ borderColor: 'var(--border-primary)' }} />
      </div>

      {/* Konten Halaman Lengkap (Semua blok materi dalam satu halaman penuh) */}
      <div className="space-y-4">
        {topic.blocks.map((block, idx) => {
          if (block.type === 'section') {
            return (
              <div
                key={idx}
                className="pt-8 pb-2 mt-8 first:mt-0 first:pt-0 border-t first:border-t-0"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <h2
                  className="text-base sm:text-lg font-mono font-bold tracking-wider uppercase text-[var(--accent-light)]"
                >
                  {block.text}
                </h2>
              </div>
            );
          }

          if (block.type === 'h3') {
            return (
              <h3
                key={idx}
                className="text-lg sm:text-xl font-bold mt-6 mb-2 tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {block.text}
              </h3>
            );
          }

          if (block.type === 'paragraph') {
            return (
              <div
                key={idx}
                className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]"
              >
                <ReactMarkdown components={markdownComponents}>{block.text}</ReactMarkdown>
              </div>
            );
          }

          if (block.type === 'list') {
            return (
              <ul
                key={idx}
                className="list-disc pl-6 my-3 space-y-2 text-sm sm:text-base text-[var(--text-secondary)]"
              >
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed pl-1">
                    <ReactMarkdown components={markdownComponents}>{item}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === 'callout') {
            const isWarning = block.variant === 'warning';
            return (
              <div
                key={idx}
                className="p-4 my-5 rounded-r-xl border-l-4"
                style={{
                  borderLeftColor: isWarning ? 'var(--color-warning)' : 'var(--color-success)',
                  backgroundColor: isWarning
                    ? 'rgba(251, 191, 36, 0.08)'
                    : 'rgba(32, 201, 151, 0.08)',
                  borderTop: isWarning
                    ? '1px solid rgba(251, 191, 36, 0.15)'
                    : '1px solid rgba(32, 201, 151, 0.15)',
                  borderRight: isWarning
                    ? '1px solid rgba(251, 191, 36, 0.15)'
                    : '1px solid rgba(32, 201, 151, 0.15)',
                  borderBottom: isWarning
                    ? '1px solid rgba(251, 191, 36, 0.15)'
                    : '1px solid rgba(32, 201, 151, 0.15)',
                }}
              >
                <div className="flex items-start gap-3">
                  {isWarning ? (
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
                  ) : (
                    <Lightbulb size={18} className="shrink-0 mt-0.5 text-emerald-400" />
                  )}
                  <div className="text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]">
                    <span
                      className={`font-bold mr-1.5 ${
                        isWarning ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {block.label}
                    </span>
                    <ReactMarkdown components={markdownComponents}>{block.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Bagian Bawah: Tombol Previous, Topik N / 7, Tombol Next, Tombol Hijau Mark Complete & Next */}
      <div
        className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        {/* Tombol Previous di Kiri */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirst}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            isFirst ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'
          }`}
          style={{
            backgroundColor: 'var(--bg-card)',
            color: isFirst ? 'var(--text-muted)' : 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Teks Topik N / 7 di Tengah */}
        <div className="font-mono text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Topic {currentIndex + 1} / {totalTopics}
        </div>

        {/* Tombol Next & Tombol Hijau Mark Complete & Next di Kanan */}
        <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
          {/* Tombol Next / Selesai */}
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
          >
            {isLast ? 'Selesai' : 'Next'}
          </button>

          {/* Tombol Hijau Mark Complete & Next / Completed ✓ */}
          {isCompleted ? (
            <button
              type="button"
              disabled
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-not-allowed opacity-90 shadow-sm"
              style={{
                backgroundColor: 'rgba(32, 201, 151, 0.18)',
                color: 'var(--color-success)',
                border: '1px solid rgba(32, 201, 151, 0.4)',
              }}
            >
              <Check size={15} />
              <span>Completed ✓</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMarkCompleteAndNext}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm text-white"
              style={{
                backgroundColor: 'var(--color-success)',
                border: '1px solid var(--color-success)',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <span>Mark Complete & Next</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
