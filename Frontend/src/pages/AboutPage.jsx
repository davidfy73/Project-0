import { Shield, Search, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    title: 'Dashboard',
    desc: 'Periksa URL, file, atau hash/domain/IP untuk melihat apakah aman.',
  },
  {
    icon: BookOpen,
    title: 'Module',
    desc: 'Pelajari ancaman siber seperti Phishing, Malware, Ransomware, MITM, Social Engineering, dan Clickjacking.',
  },
  {
    icon: ShieldCheck,
    title: 'Preventive',
    desc: 'Panduan langkah praktis untuk menjaga keamanan akun dan perangkatmu sehari-hari.',
  },
  {
    icon: HelpCircle,
    title: 'Quiz',
    desc: 'Uji pemahamanmu dengan soal acak, lengkap dengan penjelasan jawaban.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Baca Module',
    desc: 'Pahami bentuk, pola, dan cara kerja berbagai ancaman digital.',
  },
  {
    number: '02',
    title: 'Terapkan Preventive',
    desc: 'Gunakan panduan praktis untuk menjaga keamanan akun dan perangkatmu.',
  },
  {
    number: '03',
    title: 'Uji lewat Quiz',
    desc: 'Asah dan evaluasi pemahamanmu melalui kuis interaktif.',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16 pb-8 animate-in fade-in">
      {/* 1. Hero Section */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Logo Shield dengan Glow Lembut */}
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-105"
          style={{
            backgroundColor: 'var(--accent-deep)',
            border: '1px solid var(--accent-primary)',
            boxShadow: '0 0 30px var(--accent-glow)',
          }}
        >
          <Shield className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--accent-primary)' }} />
        </div>

        {/* Judul Monospace */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-widest mb-3"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          PHISHYEARN
        </h1>

        {/* Tagline */}
        <p
          className="text-sm sm:text-base md:text-lg font-medium mb-4"
          style={{ color: 'var(--accent-light)' }}
        >
          Belajar keamanan siber dengan cara yang simpel
        </p>

        {/* Paragraf Pendek */}
        <p
          className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed px-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          PHISHYEARN adalah web edukasi keamanan siber untuk pemula. Kamu belajar mengenali ancaman digital, tahu cara melindungi diri, lalu menguji pemahamanmu lewat kuis.
        </p>
      </div>

      {/* 2. Section "Toolkit" */}
      <div className="space-y-5">
        <div>
          <h2
            className="text-xl sm:text-2xl font-bold uppercase tracking-wider"
            style={{ color: 'var(--accent-primary)' }}
          >
            TOOLKIT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-5 sm:p-6 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px var(--accent-glow)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mb-4"
                  style={{
                    backgroundColor: 'var(--accent-deep)',
                    border: '1px solid var(--accent-primary)',
                  }}
                >
                  <Icon size={20} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <h3
                  className="text-base sm:text-lg font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Section "Learning Path" */}
      <div className="space-y-5">
        <div>
          <h2
            className="text-xl sm:text-2xl font-bold uppercase tracking-wider"
            style={{ color: 'var(--accent-primary)' }}
          >
            LEARNING PATH
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 30px var(--accent-glow)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs mb-4"
                  style={{
                    backgroundColor: 'var(--accent-deep)',
                    border: '1px solid var(--accent-primary)',
                    color: 'var(--accent-light)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
