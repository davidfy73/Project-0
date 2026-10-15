import { Shield, Info, Target, ListChecks, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Info size={20} style={{ color: 'var(--accent-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            About PHISHYEARN
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          Platform edukasi ancaman dan pertahanan siber untuk pemula.
        </p>
      </div>

      {/* Main card */}
      <div
        className="rounded-2xl p-6 sm:p-8 space-y-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'var(--accent-deep)',
              border: '1px solid var(--accent-primary)',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            <Shield size={28} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-mono tracking-wider" style={{ color: 'var(--text-primary)' }}>
              PHISHYEARN
            </h2>
            <p className="text-xs" style={{ color: 'var(--accent-light)' }}>
              Cyber Threat Intelligence & Interactive Learning
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>PHISHYEARN</strong> dirancang sebagai web edukasi
            keamanan siber yang memadukan nuansa belajar interaktif ala <em>Hack The Box</em> dengan dashboard
            inspeksi ancaman terinspirasi <em>VirusTotal</em>.
          </p>
          <p>
            Tujuan utama platform ini adalah membantu pengguna pemula memahami anatomi serangan digital lewat
            materi komprehensif, menerapkan langkah-langkah preventif esensial, serta menguji pemahaman
            mereka melalui evaluasi kuis terukur.
          </p>
        </div>

        {/* Core Features Breakdown */}
        <div className="pt-4 border-t space-y-4" style={{ borderColor: 'var(--border-primary)' }}>
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ListChecks size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Fitur Wajib (v1.0)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div
              className="p-3.5 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                1. Autentikasi Kredensial
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Register, login aman (JWT + httpOnly cookie), forgot password, dan invalidasi sesi.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                2. Threat Intelligence Scanner
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Inspeksi URL, File upload, dan Search (hash/domain/IP) terinspirasi VirusTotal.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                3. Modul Edukasi (6 Topik)
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Phishing, Malware, Ransomware, MITM, Social Engineering, dan Clickjacking berbasis Markdown.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                4. Langkah Preventif (7 Topik)
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Panduan aksi nyata, kesalahan umum, dan pencegahan risiko keamanan harian.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                5. Kuis Acak Interaktif
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                15 soal acak dari bank soal 30-40 pertanyaan dengan umpan balik langsung dan evaluasi skor.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                6. Desain Royal Blue Dark
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Tampilan cybersecurity modern, bersih, terstruktur rapi, dan responsif hingga 360px.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
