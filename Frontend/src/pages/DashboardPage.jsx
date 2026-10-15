import ScannerSection from '../components/dashboard/ScannerSection';
import ModulesOverview from '../components/dashboard/ModulesOverview';
import PreventifOverview from '../components/dashboard/PreventifOverview';
import { useAuthStore } from '../store/useAuthStore';
import { Activity, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome / Intelligence Summary Bar (inspired by Web App top header) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--accent-glow)',
                color: 'var(--accent-light)',
                border: '1px solid var(--accent-deep)',
              }}
            >
              MISSION CONTROL
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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.username || 'Analyst'}!
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Pantau dan analisis ancaman siber, pelajari taktik eksploitasi, dan perkuat pertahanan sistem Anda.
          </p>
        </div>

        {/* Quick status pill */}
        <div
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: 'var(--color-success)' }} />
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Live Threat Feeds</span>
          </div>
          <span className="font-mono text-[11px]" style={{ color: 'var(--color-success)' }}>
            NORMAL
          </span>
        </div>
      </div>

      {/* Centerpiece: VirusTotal-inspired Scanner Section */}
      <section aria-label="Cyber Threat Scanner">
        <ScannerSection />
      </section>

      {/* Learning Modules Section */}
      <section aria-label="Core Modules">
        <ModulesOverview />
      </section>

      {/* Preventive Measures & Quiz Section */}
      <section aria-label="Preventive Measures">
        <PreventifOverview />
      </section>
    </div>
  );
}
