import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore.js';
import {
  ShieldCheck,
  KeyRound,
  Link2,
  Shield,
  HardDriveDownload,
  Wifi,
  UserCheck,
  RefreshCw,
  ArrowRight,
  Check,
} from 'lucide-react';

const PREVENTIVE_LIST = [
  {
    id: 'use-strong-password',
    title: 'Use Strong Password',
    desc: 'Gunakan password kuat dan unik, password manager, serta aktifkan MFA.',
    icon: KeyRound,
  },
  {
    id: 'check-url',
    title: 'Check URL',
    desc: 'Periksa alamat situs untuk menghindari domain palsu dan tautan berbahaya.',
    icon: Link2,
  },
  {
    id: 'use-antivirus',
    title: 'Use Antivirus',
    desc: 'Gunakan antivirus yang aktif dan terbaru untuk mendeteksi serta mencegah malware.',
    icon: Shield,
  },
  {
    id: 'backup-data',
    title: 'Backup Data',
    desc: 'Cadangkan data secara berkala dengan strategi 3-2-1 agar mudah dipulihkan.',
    icon: HardDriveDownload,
  },
  {
    id: 'use-vpn',
    title: 'Use VPN',
    desc: 'Gunakan VPN untuk mengenkripsi koneksi dan meningkatkan privasi saat online.',
    icon: Wifi,
  },
  {
    id: 'verify-identity',
    title: 'Verify Identity',
    desc: 'Verifikasi identitas pengirim sebelum membagikan data atau menyetujui permintaan.',
    icon: UserCheck,
  },
  {
    id: 'update-patch',
    title: 'Update & Patch',
    desc: 'Perbarui sistem dan aplikasi secara berkala untuk menutup celah keamanan.',
    icon: RefreshCw,
  },
];

export default function PreventivePage() {
  const navigate = useNavigate();
  const completedPreventive = useProgressStore((state) => state.preventive);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={20} style={{ color: 'var(--color-success)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Preventive
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PREVENTIVE_LIST.map((item, idx) => {
          const Icon = item.icon;
          const isDone = completedPreventive.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/preventive/${item.id}`)}
              className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--accent-deep)',
                      color: 'var(--accent-light)',
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isDone && (
                      <span
                        title="Topic Selesai"
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: 'rgba(32, 201, 151, 0.18)',
                          color: 'var(--color-success)',
                          border: '1px solid rgba(32, 201, 151, 0.35)',
                        }}
                      >
                        <Check size={12} />
                      </span>
                    )}
                    <span
                      className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-secondary)',
                      }}
                    >
                      Topic 0{idx + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </div>

              <div
                className="mt-6 pt-3 border-t flex items-center justify-between text-xs font-semibold"
                style={{
                  borderColor: 'var(--border-primary)',
                  color: 'var(--accent-primary)',
                }}
              >
                <span>Baca Panduan</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
