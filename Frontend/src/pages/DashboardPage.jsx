import ScannerSection from '../components/dashboard/ScannerSection';
import { useAuthStore } from '../store/useAuthStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome Bar */}
      <div
        className="flex items-center justify-between pb-3 border-b"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--accent-glow)',
                color: 'var(--accent-light)',
                border: '1px solid var(--accent-deep)',
              }}
            >
              THREAT INTELLIGENCE
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome back, {user?.username || 'Analyst'}!
          </h1>
        </div>
      </div>

      {/* Main Focus: VirusTotal-inspired Scanner Section */}
      <section aria-label="Cyber Threat Scanner" className="pt-2">
        <ScannerSection />
      </section>
    </div>
  );
}
