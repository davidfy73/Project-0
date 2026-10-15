import { BookOpen, ShieldAlert, Bug, Lock, Network, Users, MousePointerClick, ArrowRight } from 'lucide-react';

const MODULES = [
  {
    id: 'phishing',
    title: 'Phishing',
    desc: 'Pengertian, cara kerja, contoh kasus, tanda-tanda, dan dampak manipulasi data lewat situs atau pesan tiruan.',
    icon: ShieldAlert,
    tag: 'Module 01',
  },
  {
    id: 'malware',
    title: 'Malware',
    desc: 'Klasifikasi virus, worm, trojan, spyware, dan cara mereka menginfeksi sistem operasi.',
    icon: Bug,
    tag: 'Module 02',
  },
  {
    id: 'ransomware',
    title: 'Ransomware',
    desc: 'Mekanisme enkripsi berkas, permintaan tebusan cryptocurrency, dan strategi pemulihan bencana.',
    icon: Lock,
    tag: 'Module 03',
  },
  {
    id: 'mitm',
    title: 'Man-in-the-Middle (MITM)',
    desc: 'Penyadapan paket data unencrypted pada public Wi-Fi, SSL stripping, dan teknik spoofing.',
    icon: Network,
    tag: 'Module 04',
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering',
    desc: 'Eksploitasi celah psikologis manusia melalui pretexting, baiting, shoulder surfing, dan vishing.',
    icon: Users,
    tag: 'Module 05',
  },
  {
    id: 'clickjacking',
    title: 'Clickjacking',
    desc: 'Eksploitasi antarmuka pengguna (UI redress) menggunakan transparansi iframe untuk membajak klik korban.',
    icon: MousePointerClick,
    tag: 'Module 06',
  },
];

export default function ModulesPage() {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Modules
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          6 Materi pembelajaran komprehensif ancaman siber berbasis Markdown.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map((item) => {
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
                    {item.tag}
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
                <span>Pelajari Modul</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
