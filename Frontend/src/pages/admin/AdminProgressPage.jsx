// pages/admin/AdminProgressPage.jsx
// Halaman pemantauan progres belajar seluruh user untuk admin.
// Mengambil data nyata dari GET /api/admin/progress.

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, CheckCircle2, Circle, BookOpen, ShieldCheck, Trophy, Loader2, RefreshCw } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

// Daftar 6 Modul dan 7 Preventive statis untuk referensi rincian ceklis di dalam accordion
const ALL_MODULES = [
  { id: 'phishing', title: 'Phishing' },
  { id: 'malware', title: 'Malware' },
  { id: 'ransomware', title: 'Ransomware' },
  { id: 'mitm', title: 'Man-in-the-Middle (MITM)' },
  { id: 'social-engineering', title: 'Social Engineering' },
  { id: 'clickjacking', title: 'Clickjacking' },
];

const ALL_PREVENTIVES = [
  { id: 'use-strong-password', title: 'Use Strong Password' },
  { id: 'check-url', title: 'Check URL' },
  { id: 'use-antivirus', title: 'Use Antivirus' },
  { id: 'backup-data', title: 'Backup Data' },
  { id: 'use-vpn', title: 'Use VPN' },
  { id: 'verify-identity', title: 'Verify Identity' },
  { id: 'update-patch', title: 'Update & Patch' },
];

export default function AdminProgressPage() {
  const {
    progressUsers,
    fetchProgress,
    isLoadingProgress,
    progressError,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const filteredUsers = progressUsers.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const formatActivity = (dateStr) => {
    if (!dateStr) return 'Belum ada';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? 'Belum ada'
      : d.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  const formatQuizScore = (scoreObj) => {
    if (!scoreObj || typeof scoreObj.score !== 'number' || typeof scoreObj.total !== 'number') {
      return '-';
    }
    if (scoreObj.total <= 0) {
      return `${scoreObj.score}/${scoreObj.total} (0%)`;
    }
    const pct = Math.round((scoreObj.score / scoreObj.total) * 100);
    return `${scoreObj.score}/${scoreObj.total} (${pct}%)`;
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Kolom Pencarian di Atas */}
      <div className="border-b pb-4 flex justify-between items-center gap-4" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          Total: <span className="font-bold text-[var(--text-primary)]">{progressUsers.length}</span> user
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Cari username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl text-xs sm:text-sm outline-none transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-primary)';
            }}
          />
        </div>
      </div>

      {/* Banner Pesan Error */}
      {progressError && (
        <div
          className="p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm"
          style={{
            backgroundColor: 'rgba(255, 91, 100, 0.1)',
            borderColor: 'rgba(255, 91, 100, 0.3)',
            color: 'var(--color-danger)',
          }}
        >
          <span>{progressError}</span>
          <button
            type="button"
            onClick={() => fetchProgress()}
            className="px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={12} />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Daftar User & Progres */}
      <div className="space-y-4">
        {isLoadingProgress ? (
          <div
            className="rounded-2xl p-12 text-center text-sm border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-muted)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin text-[var(--accent-primary)]" />
              <span>Memuat data progres user...</span>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isExpanded = expandedUserId === user.id;
            const p = user.progress || {};
            const modulesRead = p.modulesRead || 0;
            const totalModules = p.totalModules ?? 6;
            const preventiveRead = p.preventiveRead || 0;
            const totalPreventive = p.totalPreventive ?? 7;

            // Aman dari pembagian nol
            const modulePercent = totalModules > 0 ? Math.round((modulesRead / totalModules) * 100) : 0;
            const preventivePercent = totalPreventive > 0 ? Math.round((preventiveRead / totalPreventive) * 100) : 0;

            const completedModules = p.completedModules || [];
            const completedPreventive = p.completedPreventive || [];

            return (
              <div
                key={user.id}
                className="rounded-2xl border transition-all overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: isExpanded ? 'var(--accent-primary)' : 'var(--border-primary)',
                }}
              >
                {/* Baris Utama (Bisa Diklik) */}
                <div
                  onClick={() => toggleExpand(user.id)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none hover:bg-[var(--bg-elevated)]/30 transition-colors"
                >
                  {/* Kolom 1: Info User */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                        style={{
                          backgroundColor: 'var(--accent-deep)',
                          color: 'var(--accent-light)',
                          border: '1px solid var(--border-secondary)',
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                            {user.username}
                          </span>
                          <span
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded"
                            style={{
                              backgroundColor: 'var(--bg-elevated)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {user.role}
                          </span>
                        </div>
                        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                          Aktivitas: {formatActivity(user.lastActiveAt)}
                        </span>
                      </div>
                    </div>

                    <div className="lg:hidden text-[var(--text-muted)]">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Kolom 2: Progress Bars (Module & Preventive) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 max-w-xl">
                    {/* Module Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                          <BookOpen size={13} style={{ color: 'var(--accent-primary)' }} />
                          <span>Module</span>
                        </span>
                        <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {modulesRead}/{totalModules}
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--progress-track)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${modulePercent}%`,
                            backgroundColor: 'var(--accent-primary)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Preventive Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                          <ShieldCheck size={13} style={{ color: 'var(--color-success)' }} />
                          <span>Preventive</span>
                        </span>
                        <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {preventiveRead}/{totalPreventive}
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--progress-track)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${preventivePercent}%`,
                            backgroundColor: 'var(--color-success)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kolom 3: Skor Kuis Terakhir & Tertinggi */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs font-mono shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: 'var(--border-primary)' }}>
                    <div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Kuis Terakhir</div>
                      <div className="font-bold text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                        {formatQuizScore(p.lastQuizScore)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Skor Tertinggi</div>
                      <div className="font-bold text-xs sm:text-sm mt-0.5 flex items-center gap-1" style={{ color: 'var(--color-warning)' }}>
                        <Trophy size={13} />
                        <span>{formatQuizScore(p.highestQuizScore)}</span>
                      </div>
                    </div>

                    <div className="hidden lg:block pl-2" style={{ color: 'var(--text-muted)' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Panel Rincian Ceklis Materi (Accordion Dropdown) */}
                {isExpanded && (
                  <div
                    className="p-5 border-t space-y-5 animate-in fade-in"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-primary)',
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Daftar Module */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--accent-light)' }}>
                          <BookOpen size={14} />
                          <span>Rincian Modul ({modulesRead}/{totalModules} Selesai)</span>
                        </h4>

                        <div className="space-y-1.5">
                          {ALL_MODULES.map((m) => {
                            const isDone = completedModules.includes(m.id);
                            return (
                              <div
                                key={m.id}
                                className="flex items-center justify-between p-2.5 rounded-xl border text-xs"
                                style={{
                                  backgroundColor: 'var(--bg-card)',
                                  borderColor: 'var(--border-primary)',
                                }}
                              >
                                <span style={{ color: 'var(--text-primary)' }}>{m.title}</span>
                                {isDone ? (
                                  <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--color-success)' }}>
                                    <CheckCircle2 size={14} />
                                    <span>Selesai</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                    <Circle size={14} />
                                    <span>Belum</span>
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Daftar Preventive */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--color-success)' }}>
                          <ShieldCheck size={14} />
                          <span>Rincian Preventive ({preventiveRead}/{totalPreventive} Selesai)</span>
                        </h4>

                        <div className="space-y-1.5">
                          {ALL_PREVENTIVES.map((pv) => {
                            const isDone = completedPreventive.includes(pv.id);
                            return (
                              <div
                                key={pv.id}
                                className="flex items-center justify-between p-2.5 rounded-xl border text-xs"
                                style={{
                                  backgroundColor: 'var(--bg-card)',
                                  borderColor: 'var(--border-primary)',
                                }}
                              >
                                <span style={{ color: 'var(--text-primary)' }}>{pv.title}</span>
                                {isDone ? (
                                  <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--color-success)' }}>
                                    <CheckCircle2 size={14} />
                                    <span>Selesai</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                    <Circle size={14} />
                                    <span>Belum</span>
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div
            className="rounded-2xl p-12 text-center text-sm border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-muted)',
            }}
          >
            {searchTerm ? 'Tidak ada data progres ditemukan' : 'Belum ada user'}
          </div>
        )}
      </div>
    </div>
  );
}
