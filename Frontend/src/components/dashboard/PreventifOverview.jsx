import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  KeyRound,
  Link2,
  Shield,
  HardDriveDownload,
  Wifi,
  UserCheck,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const PREVENTIF_TOPICS = [
  { id: 'password', title: 'Use Strong Password', icon: KeyRound, done: true },
  { id: 'check-url', title: 'Check URL', icon: Link2, done: true },
  { id: 'antivirus', title: 'Use Antivirus', icon: Shield, done: true },
  { id: 'backup', title: 'Backup Data', icon: HardDriveDownload, done: false },
  { id: 'vpn', title: 'Use VPN', icon: Wifi, done: true },
  { id: 'verify-identity', title: 'Verify Identity', icon: UserCheck, done: false },
  { id: 'update-patch', title: 'Update & Patch', icon: RefreshCw, done: true },
];

export default function PreventifOverview() {
  const navigate = useNavigate();
  const completedCount = PREVENTIF_TOPICS.filter((t) => t.done).length;
  const percentage = Math.round((completedCount / PREVENTIF_TOPICS.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 7 Preventif Checklist Card */}
      <div
        className="lg:col-span-2 rounded-2xl p-6 transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <ShieldCheck size={20} style={{ color: 'var(--color-success)' }} />
              <span>Panduan Preventif (7 Topik Keamanan)</span>
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Tindakan pencegahan dan best practices pertahanan siber
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/preventif')}
            className="text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            style={{ color: 'var(--accent-primary)' }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-light)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
          >
            <span>Selengkapnya</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PREVENTIF_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                onClick={() => navigate('/preventif')}
                className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: 'var(--accent-deep)',
                      color: 'var(--accent-light)',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {topic.title}
                  </span>
                </div>
                {topic.done ? (
                  <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                ) : (
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{ borderColor: 'var(--border-secondary)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz Challenge Teaser Card */}
      <div
        className="rounded-2xl p-6 flex flex-col justify-between transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-deep) 150%)',
        }}
      >
        <div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{
              backgroundColor: 'var(--accent-glow)',
              border: '1px solid var(--accent-primary)',
            }}
          >
            <HelpCircle size={24} style={{ color: 'var(--accent-primary)' }} />
          </div>

          <span
            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--accent-light)',
              border: '1px solid var(--border-primary)',
            }}
          >
            Interactive Evaluation
          </span>

          <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: 'var(--text-primary)' }}>
            Cybersecurity Quiz
          </h3>
          <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            Uji pemahaman Anda dengan 15 soal pilihan ganda acak dari bank soal materi Module dan
            Preventif.
          </p>

          <div
            className="p-3 rounded-xl mb-4 text-xs space-y-1"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
              <span>Bank Soal:</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)' }}>30-40 Pertanyaan</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
              <span>Format:</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)' }}>15 Soal Acak</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/quiz')}
          className="w-full h-11 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--text-on-accent)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.35)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>Mulai Quiz Sekarang</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
