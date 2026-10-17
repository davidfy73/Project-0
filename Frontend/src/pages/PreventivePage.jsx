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
} from 'lucide-react';

const PREVENTIVE_LIST = [
  {
    id: 'strong-password',
    title: 'Use Strong Password',
    desc: 'Membuat password kompleks, penggunaan password manager, dan aktivasi Multi-Factor Authentication (MFA).',
    icon: KeyRound,
  },
  {
    id: 'check-url',
    title: 'Check URL',
    desc: 'Menganalisis domain palsu, typosquatting, IDN homograph attack, dan sertifikat SSL/TLS.',
    icon: Link2,
  },
  {
    id: 'antivirus',
    title: 'Use Antivirus',
    desc: 'Prinsip kerja perlindungan real-time, update database definisi virus, dan heuristic scanning.',
    icon: Shield,
  },
  {
    id: 'backup-data',
    title: 'Backup Data',
    desc: 'Aturan 3-2-1 backup untuk mengamankan data penting dari serangan ransomware dan kerusakan perangkat.',
    icon: HardDriveDownload,
  },
  {
    id: 'use-vpn',
    title: 'Use VPN',
    desc: 'Enkripsi data tunneling saat terhubung ke jaringan Wi-Fi publik tanpa proteksi.',
    icon: Wifi,
  },
  {
    id: 'verify-identity',
    title: 'Verify Identity',
    desc: 'Memvalidasi identitas pengirim pesan melalui saluran terpisah sebelum mengirim data rahasia.',
    icon: UserCheck,
  },
  {
    id: 'update-patch',
    title: 'Update & Patch',
    desc: 'Pentingnya segera memasang security patch sistem operasi dan aplikasi untuk menutup CVE aktif.',
    icon: RefreshCw,
  },
];

export default function PreventivePage() {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={20} style={{ color: 'var(--color-success)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Preventive
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          7 Panduan pencegahan: Kenapa penting, langkah praktis, dan kesalahan umum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PREVENTIVE_LIST.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
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
                  <span
                    className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-secondary)',
                    }}
                  >
                    Topik 0{idx + 1}
                  </span>
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
