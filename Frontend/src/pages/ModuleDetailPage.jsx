import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getNavigation } from '../data/modulesData';
import { useProgressStore } from '../store/useProgressStore';

export default function ModuleDetailPage() {
  const { slug, section } = useParams();
  const navigate = useNavigate();

  const currentSectionId = section || '1';
  const navInfo = getNavigation(slug, currentSectionId);

  const { module: completedModules, completeMaterial, isCompleting } = useProgressStore();
  const isCompleted = completedModules.includes(slug);

  // Setiap kali berganti halaman/section/modul, scroll kembali ke atas
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug, currentSectionId]);

  // Jika modul atau section tidak ditemukan
  if (!navInfo) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--color-danger)' }}
        >
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Materi Tidak Ditemukan
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Modul atau section yang Anda tuju tidak tersedia atau URL tidak valid.
        </p>
        <div className="pt-2">
          <Link
            to="/modules"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-on-accent)',
            }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Halaman Modules</span>
          </Link>
        </div>
      </div>
    );
  }

  const { module, section: currentSection, currentSectionNum, totalSections, isFirst, isLast, prev, next } = navInfo;
  const isLastSection = currentSectionNum === totalSections;

  const handlePrevious = () => {
    if (isFirst || !prev) return;
    navigate(prev.path);
  };

  const handleNext = () => {
    if (next) {
      navigate(next.path);
    }
  };

  // Handler tombol Tandai Selesai
  const handleMarkComplete = async () => {
    if (isCompleted || isCompleting) return;
    const res = await completeMaterial(slug);
    if (res.success) {
      toast.success(`Modul "${module.title}" berhasil ditandai selesai!`);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-10 animate-in fade-in">
      {/* Tombol kembali ke daftar modul & Tag Modul */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          to="/modules"
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
          style={{ color: 'var(--text-muted)' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-light)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Modules</span>
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
            {module.title}
          </span>
        </div>
      </div>

      {/* Bagian Atas: Monospace Section N / total, Judul Section Besar, Garis Pemisah */}
      <div className="mb-6">
        <div className="font-mono text-xs sm:text-sm tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Section {currentSectionNum} / {totalSections}
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1 mb-5" style={{ color: 'var(--text-primary)' }}>
          {currentSection.title}
        </h1>
        <div className="border-b" style={{ borderColor: 'var(--border-primary)' }} />
      </div>

      {/* Isi Konten Materi */}
      <div className="leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {children}
              </h2>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base sm:text-lg font-bold mt-6 mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-4 space-y-1.5 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote
                className="border-l-4 pl-4 py-2 my-4 rounded-r-lg text-sm sm:text-base italic"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--accent-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                {children}
              </blockquote>
            ),
            code: ({ inline, children, ...props }) => {
              if (inline || typeof children === 'string') {
                return (
                  <code
                    className="font-mono text-xs sm:text-[13px] px-1.5 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: 'var(--accent-deep)',
                      color: 'var(--accent-light)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <pre
                  className="p-4 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono my-4 border"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <code>{children}</code>
                </pre>
              );
            },
          }}
        >
          {currentSection.content}
        </ReactMarkdown>
      </div>

      {/* Bagian Bawah: Navigasi Antar Section & Tandai Selesai */}
      <div
        className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        {/* Tombol Previous */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirst || !prev}
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

        {/* Teks Section N / total di Tengah */}
        <div className="font-mono text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Section {currentSectionNum} / {totalSections}
        </div>

        {/* Tombol Navigasi di Kanan */}
        <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
          {/* Badge +10 XP */}
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(200, 107, 255, 0.12)',
              color: 'var(--color-purple)',
              border: '1px solid rgba(200, 107, 255, 0.25)',
            }}
          >
            <Sparkles size={13} />
            <span>+10 XP</span>
          </div>

          {!isLastSection ? (
            /* Tombol Next untuk section 1 dan 2 */
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--text-on-accent)',
                border: 'none',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
            >
              Next
            </button>
          ) : (
            /* Tombol Tandai Selesai di section terakhir */
            <button
              type="button"
              disabled={isCompleted || isCompleting}
              onClick={handleMarkComplete}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:cursor-not-allowed"
              style={{
                backgroundColor: isCompleted ? 'rgba(32, 201, 151, 0.18)' : 'var(--accent-primary)',
                color: isCompleted ? 'var(--color-success)' : 'var(--text-on-accent)',
                border: isCompleted ? '1px solid rgba(32, 201, 151, 0.4)' : '1px solid var(--accent-primary)',
                opacity: isCompleting ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!isCompleted && !isCompleting) e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              }}
              onMouseOut={(e) => {
                if (!isCompleted && !isCompleting) e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
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
          )}
        </div>
      </div>
    </div>
  );
}
