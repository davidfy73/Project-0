import { useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPreventiveBySlug, getPreventiveNavigation } from '../data/preventiveData';
import { useProgressStore } from '../store/useProgressStore';

export default function PreventiveDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const navInfo = getPreventiveNavigation(slug);

  if (!navInfo) {
    return <Navigate to="/preventive" replace />;
  }

  const { topic, currentIndex, totalTopics, isFirst, isLast, prevTopic, nextTopic } = navInfo;

  const { preventive: completedPreventive, completeMaterial, isCompleting } = useProgressStore();
  const isCompleted = completedPreventive.includes(topic.slug);

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

  const handleMarkComplete = async () => {
    if (isCompleted || isCompleting) return;
    const res = await completeMaterial(topic.slug);
    if (res.success) {
      toast.success(`Topik "${topic.title}" berhasil ditandai selesai!`);
    } else {
      toast.error(res.message);
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
              className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
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

      {/* Header Materi */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
          <span>Panduan Pencegahan Keamanan Siber</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1 mb-5" style={{ color: 'var(--text-primary)' }}>
          {topic.title}
        </h1>
        <div className="border-b" style={{ borderColor: 'var(--border-primary)' }} />
      </div>

      {/* Konten Berdasarkan Tipe Blok */}
      <div className="space-y-6">
        {topic.blocks.map((block, idx) => {
          if (block.type === 'section-title') {
            return (
              <h2
                key={idx}
                className="text-lg sm:text-xl font-bold tracking-tight pt-4 first:pt-0"
                style={{ color: 'var(--text-primary)' }}
              >
                {block.text}
              </h2>
            );
          }

          if (block.type === 'paragraph') {
            return (
              <p key={idx} className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <ReactMarkdown components={markdownComponents}>{block.text}</ReactMarkdown>
              </p>
            );
          }

          if (block.type === 'checklist') {
            return (
              <div
                key={idx}
                className="rounded-2xl p-5 border space-y-3"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                }}
              >
                {block.label && (
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--color-success)' }}>
                    <CheckCircle2 size={16} />
                    <span>{block.label}</span>
                  </h3>
                )}
                <ul className="space-y-2.5">
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <Check size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
                      <ReactMarkdown components={markdownComponents}>{item}</ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          if (block.type === 'callout') {
            const isDanger = block.variant === 'danger';
            return (
              <div
                key={idx}
                className="rounded-2xl p-4 sm:p-5 border flex items-start gap-3.5"
                style={{
                  backgroundColor: isDanger ? 'rgba(255, 91, 100, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                  borderColor: isDanger ? 'rgba(255, 91, 100, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                }}
              >
                <div
                  className="p-2 rounded-xl shrink-0"
                  style={{
                    backgroundColor: isDanger ? 'rgba(255, 91, 100, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: isDanger ? 'var(--color-danger)' : 'var(--accent-primary)',
                  }}
                >
                  {isDanger ? <XCircle size={18} /> : <Lightbulb size={18} />}
                </div>
                <div className="space-y-1">
                  {block.label && (
                    <h4
                      className="text-xs sm:text-sm font-bold"
                      style={{ color: isDanger ? 'var(--color-danger)' : 'var(--accent-light)' }}
                    >
                      {block.label}
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <ReactMarkdown components={markdownComponents}>{block.text}</ReactMarkdown>
                  </p>
                </div>
              </div>
            );
          }

          if (block.type === 'steps') {
            return (
              <div className="space-y-3">
                {block.label && (
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {block.label}
                  </h3>
                )}
                <div className="space-y-3">
                  {block.items.map((step, stepIdx) => (
                    <div
                      key={stepIdx}
                      className="rounded-2xl p-4 border flex items-start gap-3.5"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-primary)',
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5"
                        style={{
                          backgroundColor: 'var(--accent-deep)',
                          color: 'var(--accent-light)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                        }}
                      >
                        {stepIdx + 1}
                      </span>
                      <div className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <ReactMarkdown components={markdownComponents}>{step}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Bottom Bar: Navigasi & Tandai Selesai */}
      <div
        className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        {/* Tombol Previous */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirst || !prevTopic}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Info Topik N / total */}
        <div className="font-mono text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Topic {currentIndex + 1} / {totalTopics}
        </div>

        {/* Tombol Next & Tombol Tandai Selesai */}
        <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
          {/* Tombol Next */}
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
            {isLast ? 'Ke Menu Preventive' : 'Next'}
          </button>

          {/* Tombol Tandai Selesai */}
          <button
            type="button"
            disabled={isCompleted || isCompleting}
            onClick={handleMarkComplete}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:cursor-not-allowed"
            style={{
              backgroundColor: isCompleted ? 'rgba(32, 201, 151, 0.18)' : 'var(--color-success)',
              color: isCompleted ? 'var(--color-success)' : '#FFFFFF',
              border: isCompleted ? '1px solid rgba(32, 201, 151, 0.4)' : '1px solid var(--color-success)',
              opacity: isCompleting ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!isCompleted && !isCompleting) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseOut={(e) => {
              if (!isCompleted && !isCompleting) e.currentTarget.style.opacity = '1';
            }}
          >
            {isCompleting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : isCompleted ? (
              <>
                <Check size={15} />
                <span>Selesai ✓</span>
              </>
            ) : (
              <span>Tandai Selesai</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
