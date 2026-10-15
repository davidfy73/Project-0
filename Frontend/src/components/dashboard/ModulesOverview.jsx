import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldAlert, Bug, Lock, Network, Users, MousePointerClick } from 'lucide-react';

const MODULES_DATA = [
  {
    id: 'phishing',
    title: 'Phishing',
    desc: 'Teknik manipulasi kredensial via web palsu & email spoofing.',
    icon: ShieldAlert,
    accent: 'var(--accent-primary)',
    progress: 75,
    tag: 'Critical',
  },
  {
    id: 'malware',
    title: 'Malware',
    desc: 'Anatomi software berbahaya: Virus, Trojan, dan Spyware.',
    icon: Bug,
    accent: 'var(--color-danger)',
    progress: 40,
    tag: 'High',
  },
  {
    id: 'ransomware',
    title: 'Ransomware',
    desc: 'Enkripsi data paksa & pola pemerasan digital modern.',
    icon: Lock,
    accent: 'var(--color-warning)',
    progress: 20,
    tag: 'Critical',
  },
  {
    id: 'mitm',
    title: 'MITM',
    desc: 'Penyadapan lalu lintas jaringan di Wi-Fi publik & ARP spoofing.',
    icon: Network,
    accent: 'var(--color-purple)',
    progress: 60,
    tag: 'Medium',
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering',
    desc: 'Manipulasi psikologis, pretexting, dan eksploitasi human error.',
    icon: Users,
    accent: 'var(--color-info)',
    progress: 50,
    tag: 'High',
  },
  {
    id: 'clickjacking',
    title: 'Clickjacking',
    desc: 'UI Redressing dan penipuan klik melalui transparansi iframe.',
    icon: MousePointerClick,
    accent: 'var(--color-success)',
    progress: 10,
    tag: 'Medium',
  },
];

export default function ModulesOverview() {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl p-6 transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Learning Modules (6 Materi Wajib)</span>
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Pondasi edukasi ancaman siber ala Hack The Box
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/modules')}
          className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          style={{ color: 'var(--accent-primary)' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-light)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
        >
          <span>Lihat Semua</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES_DATA.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              onClick={() => navigate('/modules')}
              className="rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: 'var(--accent-deep)',
                      border: '1px solid var(--border-secondary)',
                    }}
                  >
                    <Icon size={20} style={{ color: mod.accent }} />
                  </div>
                  <span
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      color: mod.accent,
                      border: '1px solid var(--border-secondary)',
                    }}
                  >
                    {mod.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {mod.title}
                </h4>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {mod.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t space-y-1.5" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  <span>Progress</span>
                  <span className="font-mono font-medium">{mod.progress}%</span>
                </div>
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--progress-track)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${mod.progress}%`,
                      backgroundColor: mod.accent,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
