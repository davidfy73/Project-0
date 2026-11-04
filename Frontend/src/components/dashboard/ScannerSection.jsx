// components/dashboard/ScannerSection.jsx
// Antarmuka Cyber Threat Scanner terinspirasi VirusTotal:
// Header + 3 Tab (Summary, Detection, Details).

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Globe,
  UploadCloud,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Loader2,
  Clock,
  XCircle,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useScanStore } from '../../store/useScanStore';

export default function ScannerSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('URL'); // 'URL' | 'FILE' | 'LOOKUP'
  const [resultTab, setResultTab] = useState('summary'); // 'summary' | 'detection' | 'details'

  // Input lokal
  const [urlInput, setUrlInput] = useState('');
  const [lookupInput, setLookupInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  // Filter lokal tab Detection
  const [engineSearch, setEngineSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'malicious' | 'suspicious' | 'harmless' | 'undetected'
  const [showAllEngines, setShowAllEngines] = useState(false);

  // Accordion state di tab Details
  const [openSections, setOpenSections] = useState({
    headers: false,
    redirections: false,
    links: false,
    dns: false,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Salin state
  const [copied, setCopied] = useState(false);

  // Scan Store
  const {
    urlTab,
    fileTab,
    lookupTab,
    scanUrl,
    scanFile,
    lookup,
    resetTab,
    cancelPolling,
  } = useScanStore();

  // Bersihkan polling saat komponen unmount
  useEffect(() => {
    return () => {
      cancelPolling();
    };
  }, [cancelPolling]);

  // Sinkronkan tab dari search params jika ada
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const queryParam = searchParams.get('q');
    if (tabParam === 'search') {
      setActiveTab('LOOKUP');
      if (queryParam) {
        setLookupInput(queryParam);
        lookup(queryParam);
      }
    }
  }, [searchParams, lookup]);

  // Handle ganti tab input
  const handleTabChange = (tabKey) => {
    cancelPolling();
    setActiveTab(tabKey);
    setResultTab('summary');
    setEngineSearch('');
    setCategoryFilter('all');
    setShowAllEngines(false);
  };

  // Ambil data tab aktif saat ini
  const getCurrentState = () => {
    if (activeTab === 'URL') return urlTab;
    if (activeTab === 'FILE') return fileTab;
    return lookupTab;
  };

  const currentTabState = getCurrentState();
  const scanResult = currentTabState.result;

  // ── Handler Submit ─────────────────────────────────────────────────────────

  const handleScanUrlSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!urlInput.trim() || currentTabState.isLoading || currentTabState.retryAfter > 0) return;
    setResultTab('summary');
    await scanUrl(urlInput.trim());
  };

  const handleScanFileSubmit = async () => {
    if (!selectedFile || currentTabState.isLoading || currentTabState.retryAfter > 0) return;
    setFileError(null);

    // Validasi ukuran di frontend (maks 32 MB)
    const MAX_SIZE = 32 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setFileError('Ukuran file melebihi batas maksimum 32 MB.');
      return;
    }

    setResultTab('summary');
    await scanFile(selectedFile);
  };

  const handleLookupSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!lookupInput.trim() || currentTabState.isLoading || currentTabState.retryAfter > 0) return;
    setResultTab('summary');
    await lookup(lookupInput.trim());
  };

  const handleResetCurrent = () => {
    if (activeTab === 'URL') {
      setUrlInput('');
      resetTab('url');
    } else if (activeTab === 'FILE') {
      setSelectedFile(null);
      setFileError(null);
      resetTab('file');
    } else {
      setLookupInput('');
      setSearchParams({});
      resetTab('lookup');
    }
    setResultTab('summary');
    setEngineSearch('');
    setCategoryFilter('all');
    setShowAllEngines(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileError(null);
      if (file.size > 32 * 1024 * 1024) {
        setFileError('Ukuran file melebihi batas maksimum 32 MB.');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileError(null);
      if (file.size > 32 * 1024 * 1024) {
        setFileError('Ukuran file melebihi batas maksimum 32 MB.');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleCopyTarget = () => {
    if (!scanResult?.target) return;
    navigator.clipboard.writeText(scanResult.target);
    setCopied(true);
    toast.success('Target berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Format tanggal rapi
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return isNaN(d.getTime())
      ? '-'
      : d.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  // Format ukuran berkas (Bytes -> KB / MB)
  const formatBytes = (bytes) => {
    if (typeof bytes !== 'number' || bytes <= 0) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ── Render Verdict Config ──────────────────────────────────────────────────
  const getVerdictConfig = (verdict) => {
    if (verdict === 'berbahaya') {
      return {
        label: 'Berbahaya (Malicious)',
        color: 'var(--color-danger)',
        bg: 'rgba(255, 91, 100, 0.15)',
        border: 'rgba(255, 91, 100, 0.35)',
        icon: ShieldAlert,
      };
    }
    if (verdict === 'mencurigakan') {
      return {
        label: 'Mencurigakan (Suspicious)',
        color: 'var(--color-warning)',
        bg: 'rgba(251, 191, 36, 0.15)',
        border: 'rgba(251, 191, 36, 0.35)',
        icon: AlertTriangle,
      };
    }
    return {
      label: 'Aman (Clean)',
      color: 'var(--color-success)',
      bg: 'rgba(32, 201, 151, 0.15)',
      border: 'rgba(32, 201, 151, 0.35)',
      icon: ShieldCheck,
    };
  };

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 transition-all relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Background radial glow aura */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      />

      {/* Header Judul */}
      <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-3"
          style={{
            backgroundColor: 'var(--accent-glow)',
            color: 'var(--accent-light)',
            border: '1px solid var(--accent-deep)',
          }}
        >
          <Globe size={13} />
          <span>CYBER THREAT SCANNER</span>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5"
          style={{ color: 'var(--text-primary)' }}
        >
          Inspeksi URL, File, & Indikator Siber
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Analisis file mencurigakan, domain, alamat IP, dan URL untuk mendeteksi malware dan phishing
          menggunakan intelijen ancaman VirusTotal secara aman.
        </p>
      </div>

      {/* Navigasi Tiga Tab: URL | FILE | LOOKUP */}
      <div
        className="flex items-center justify-center border-b max-w-md mx-auto mb-6 relative z-10"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        {[
          { key: 'URL', label: 'URL', icon: Globe },
          { key: 'FILE', label: 'FILE', icon: UploadCloud },
          { key: 'LOOKUP', label: 'LOOKUP', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className="flex-1 py-3 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wider relative transition-colors cursor-pointer"
              style={{
                color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={16} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
              <span>{tab.label}</span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Area Input atau Hasil Scan ─────────────────────────────────────── */}
      {!scanResult ? (
        <div className="max-w-2xl mx-auto relative z-10">
          {/* TAB 1: URL */}
          {activeTab === 'URL' && (
            <form onSubmit={handleScanUrlSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Globe
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <input
                    type="url"
                    placeholder="https://example.com/suspicious-link"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={currentTabState.isLoading}
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-xs sm:text-sm outline-none transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-primary)';
                      e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-primary)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    currentTabState.isLoading ||
                    !urlInput.trim() ||
                    currentTabState.retryAfter > 0
                  }
                  className="h-12 px-6 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-on-accent)',
                  }}
                >
                  {currentTabState.isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Memindai...</span>
                    </>
                  ) : currentTabState.retryAfter > 0 ? (
                    <>
                      <Clock size={16} />
                      <span>Tunggu ({currentTabState.retryAfter}s)</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Scan URL</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: FILE */}
          {activeTab === 'FILE' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                disabled={currentTabState.isLoading}
                onChange={handleFileChange}
              />
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !currentTabState.isLoading && fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: selectedFile ? 'var(--accent-primary)' : 'var(--border-secondary)',
                  opacity: currentTabState.isLoading ? 0.6 : 1,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: 'var(--accent-deep)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <UploadCloud size={28} />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--accent-light)' }}>
                      {selectedFile.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {(selectedFile.size / 1024).toFixed(1)} KB — Siap dianalisis
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Pilih file atau seret & lepas (drag & drop) di sini
                    </p>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      Maksimal ukuran: 32 MB. Mendukung EXE, PDF, DOCX, APK, ZIP, dsb.
                    </p>
                    <span
                      className="inline-block px-4 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        color: 'var(--text-on-accent)',
                      }}
                    >
                      Pilih Berkas
                    </span>
                  </div>
                )}
              </div>

              {fileError && (
                <div
                  className="p-3 rounded-xl border text-xs"
                  style={{
                    backgroundColor: 'rgba(255, 91, 100, 0.1)',
                    borderColor: 'rgba(255, 91, 100, 0.3)',
                    color: 'var(--color-danger)',
                  }}
                >
                  {fileError}
                </div>
              )}

              {selectedFile && (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={currentTabState.isLoading}
                    onClick={() => {
                      setSelectedFile(null);
                      setFileError(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={currentTabState.isLoading || currentTabState.retryAfter > 0}
                    onClick={handleScanFileSubmit}
                    className="px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--text-on-accent)',
                    }}
                  >
                    {currentTabState.isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Mengunggah & Menganalisis...</span>
                      </>
                    ) : currentTabState.retryAfter > 0 ? (
                      <>
                        <Clock size={14} />
                        <span>Tunggu ({currentTabState.retryAfter}s)</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={14} />
                        <span>Upload & Scan</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOOKUP */}
          {activeTab === 'LOOKUP' && (
            <form onSubmit={handleLookupSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    placeholder="Domain (google.com), IP (8.8.8.8), atau hash MD5/SHA-1/SHA-256"
                    value={lookupInput}
                    onChange={(e) => setLookupInput(e.target.value)}
                    disabled={currentTabState.isLoading}
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-xs sm:text-sm outline-none transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-primary)';
                      e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-primary)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    currentTabState.isLoading ||
                    !lookupInput.trim() ||
                    currentTabState.retryAfter > 0
                  }
                  className="h-12 px-6 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-on-accent)',
                  }}
                >
                  {currentTabState.isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Mencari...</span>
                    </>
                  ) : currentTabState.retryAfter > 0 ? (
                    <>
                      <Clock size={16} />
                      <span>Tunggu ({currentTabState.retryAfter}s)</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Cari Indikator</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Skeleton Loading & Indikator Status */}
          {currentTabState.isLoading && (
            <div className="mt-8 space-y-4 animate-in fade-in">
              <div
                className="p-4 rounded-xl border flex items-center gap-3"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-primary)',
                }}
              >
                <Loader2 size={18} className="animate-spin text-[var(--accent-primary)] shrink-0" />
                <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--accent-light)' }}>
                  {currentTabState.statusText || 'Sedang memproses...'}
                </span>
              </div>

              {/* Skeleton Bars */}
              <div
                className="p-6 rounded-2xl border space-y-4 animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[var(--bg-elevated)] rounded-md w-1/3" />
                    <div className="h-3 bg-[var(--bg-elevated)] rounded-md w-2/3" />
                  </div>
                </div>
                <div className="h-3 bg-[var(--bg-elevated)] rounded-full w-full" />
                <div className="grid grid-cols-4 gap-3 pt-2">
                  <div className="h-12 bg-[var(--bg-elevated)] rounded-xl" />
                  <div className="h-12 bg-[var(--bg-elevated)] rounded-xl" />
                  <div className="h-12 bg-[var(--bg-elevated)] rounded-xl" />
                  <div className="h-12 bg-[var(--bg-elevated)] rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* Pesan Error / Rate Limit Banner */}
          {currentTabState.error && (
            <div
              className="mt-6 p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm animate-in fade-in"
              style={{
                backgroundColor: 'rgba(255, 91, 100, 0.1)',
                borderColor: 'rgba(255, 91, 100, 0.3)',
                color: 'var(--color-danger)',
              }}
            >
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <p className="font-semibold">{currentTabState.error}</p>
                {currentTabState.retryAfter > 0 && (
                  <p className="text-xs mt-1 text-[var(--text-muted)]">
                    Tombol akan aktif kembali dalam <strong className="text-[var(--text-primary)]">{currentTabState.retryAfter}</strong> detik.
                  </p>
                )}
              </div>
            </div>
          )}

          <p
            className="text-[11px] text-center leading-relaxed mt-6"
            style={{ color: 'var(--text-muted)' }}
          >
            Data yang dikirim akan diperiksa terhadap basis data ancaman VirusTotal secara aman.
            Kunci API Anda terlindungi di sisi server.
          </p>
        </div>
      ) : (
        /* ── HASIL SCAN / ANALYSIS VIEW (VirusTotal Inspired) ─────────────────── */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 relative z-10">
          {(() => {
            const verdictInfo = getVerdictConfig(scanResult.verdict);
            const VerdictIcon = verdictInfo.icon;
            const stats = scanResult.stats || {};
            const header = scanResult.header || {};
            const details = scanResult.details || {};
            const allEngines = scanResult.allEngines || [];

            const safeScore = typeof header.score === 'number' ? header.score : (stats.malicious || 0);
            const safeTotal = typeof header.total === 'number' ? header.total : (stats.total || 0);

            // Perhitungan persentase segmen aman dari pembagian nol
            const malPct = safeTotal > 0 ? (stats.malicious / safeTotal) * 100 : 0;
            const suspPct = safeTotal > 0 ? (stats.suspicious / safeTotal) * 100 : 0;
            const harmPct = safeTotal > 0 ? (stats.harmless / safeTotal) * 100 : 0;
            const undetPct = safeTotal > 0 ? (stats.undetected / safeTotal) * 100 : 0;

            // Filter daftar engine di tab Detection
            const filteredEngines = allEngines.filter((engine) => {
              if (categoryFilter !== 'all' && engine.category !== categoryFilter) {
                return false;
              }
              if (engineSearch.trim()) {
                const q = engineSearch.toLowerCase().trim();
                const matchName = engine.engineName?.toLowerCase().includes(q);
                const matchResult = engine.result?.toLowerCase().includes(q);
                return matchName || matchResult;
              }
              return true;
            });

            const displayedEngines = showAllEngines ? filteredEngines : filteredEngines.slice(0, 20);

            return (
              <>
                {/* ── 1. HEADER HASIL ────────────────────────────────────────── */}
                <div
                  className="rounded-2xl p-5 sm:p-6 border space-y-4"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-secondary)',
                  }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      {/* Skor Deteksi */}
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center shrink-0"
                        style={{
                          backgroundColor: verdictInfo.bg,
                          border: `2px solid ${verdictInfo.color}`,
                        }}
                      >
                        <span
                          className="text-xl sm:text-2xl font-black font-mono leading-none"
                          style={{ color: verdictInfo.color }}
                        >
                          {safeScore}
                        </span>
                        <span
                          className="text-[10px] font-mono leading-tight mt-1"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          /{safeTotal}
                        </span>
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                            style={{
                              backgroundColor: verdictInfo.bg,
                              color: verdictInfo.color,
                              border: `1px solid ${verdictInfo.border}`,
                            }}
                          >
                            <VerdictIcon size={13} />
                            <span>{verdictInfo.label}</span>
                          </span>
                          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                            Tipe: <strong style={{ color: 'var(--text-primary)' }}>{scanResult.type?.toUpperCase()}</strong>
                          </span>
                        </div>

                        {/* Target & Tombol Salin */}
                        <div className="flex items-center gap-2">
                          <h3
                            className="text-sm sm:text-base font-mono font-bold break-all truncate"
                            style={{ color: 'var(--text-primary)' }}
                            title={scanResult.target}
                          >
                            {scanResult.target}
                          </h3>
                          <button
                            type="button"
                            onClick={handleCopyTarget}
                            title="Salin target"
                            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer shrink-0"
                          >
                            {copied ? <Check size={14} className="text-[var(--color-success)]" /> : <Copy size={14} />}
                          </button>
                        </div>

                        {/* Chips / Metadata Header */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                          {header.httpStatus && (
                            <span
                              className="px-2 py-0.5 rounded text-[11px] font-bold"
                              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
                            >
                              HTTP {header.httpStatus}
                            </span>
                          )}
                          {header.contentType && (
                            <span
                              className="px-2 py-0.5 rounded text-[11px]"
                              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
                            >
                              {header.contentType}
                            </span>
                          )}
                          {header.ip && (
                            <span
                              className="px-2 py-0.5 rounded text-[11px]"
                              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
                            >
                              IP: {header.ip}
                            </span>
                          )}
                          <span>Analisis: {formatDate(header.lastAnalysisDate || scanResult.analysisDate)}</span>
                        </div>

                        {/* Tags jika ada */}
                        {Array.isArray(header.tags) && header.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {header.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                                style={{
                                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                                  color: 'var(--accent-light)',
                                  border: '1px solid rgba(59, 130, 246, 0.25)',
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tombol Aksi Header */}
                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                      <button
                        type="button"
                        onClick={handleResetCurrent}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--text-on-accent)',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
                      >
                        <RotateCcw size={14} />
                        <span>Analisis Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* Tautan VirusTotal Ringkas */}
                  {scanResult.permalink && (
                    <div className="pt-2 border-t flex justify-end" style={{ borderColor: 'var(--border-primary)' }}>
                      <a
                        href={scanResult.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer text-[var(--accent-light)] hover:underline"
                      >
                        <span>Lihat laporan lengkap di VirusTotal</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {/* ── 2. TIGA TAB HASIL (Summary, Detection, Details) ───────── */}
                <div
                  className="flex border-b"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  {[
                    { key: 'summary', label: 'Summary' },
                    { key: 'detection', label: `Detection (${allEngines.length})` },
                    { key: 'details', label: 'Details' },
                  ].map((tab) => {
                    const isActive = resultTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setResultTab(tab.key)}
                        className="px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide relative transition-colors cursor-pointer"
                        style={{
                          color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                        }}
                      >
                        <span>{tab.label}</span>
                        {isActive && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-[2px]"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ── TAB CONTENT: SUMMARY ────────────────────────────────────── */}
                {resultTab === 'summary' && (
                  <div className="space-y-6 animate-in fade-in">
                    {/* Segmented Distribution Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                        <span>Distribusi Deteksi Keamanan</span>
                        <span>{safeScore} ancaman dari {safeTotal} engine</span>
                      </div>
                      <div
                        className="w-full h-3 rounded-full overflow-hidden flex"
                        style={{ backgroundColor: 'var(--progress-track)' }}
                      >
                        {safeTotal > 0 ? (
                          <>
                            <div style={{ width: `${malPct}%`, backgroundColor: 'var(--color-danger)' }} title={`Malicious: ${stats.malicious || 0}`} />
                            <div style={{ width: `${suspPct}%`, backgroundColor: 'var(--color-warning)' }} title={`Suspicious: ${stats.suspicious || 0}`} />
                            <div style={{ width: `${harmPct}%`, backgroundColor: 'var(--color-success)' }} title={`Harmless: ${stats.harmless || 0}`} />
                            <div style={{ width: `${undetPct}%`, backgroundColor: 'var(--text-muted)' }} title={`Undetected: ${stats.undetected || 0}`} />
                          </>
                        ) : (
                          <div style={{ width: '100%', backgroundColor: 'var(--progress-track)' }} />
                        )}
                      </div>
                    </div>

                    {/* 4 Kartu Statistik */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div
                        className="p-3.5 rounded-xl border text-center"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
                      >
                        <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Malicious</div>
                        <div className="text-xl font-bold font-mono mt-1" style={{ color: 'var(--color-danger)' }}>
                          {stats.malicious || 0}
                        </div>
                      </div>

                      <div
                        className="p-3.5 rounded-xl border text-center"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
                      >
                        <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Suspicious</div>
                        <div className="text-xl font-bold font-mono mt-1" style={{ color: 'var(--color-warning)' }}>
                          {stats.suspicious || 0}
                        </div>
                      </div>

                      <div
                        className="p-3.5 rounded-xl border text-center"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
                      >
                        <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Harmless</div>
                        <div className="text-xl font-bold font-mono mt-1" style={{ color: 'var(--color-success)' }}>
                          {stats.harmless || 0}
                        </div>
                      </div>

                      <div
                        className="p-3.5 rounded-xl border text-center"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
                      >
                        <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Undetected</div>
                        <div className="text-xl font-bold font-mono mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {stats.undetected || 0}
                        </div>
                      </div>
                    </div>

                    {/* Banner Bersih jika 0 deteksi */}
                    {(stats.malicious || 0) === 0 && (stats.suspicious || 0) === 0 ? (
                      <div
                        className="p-4 rounded-xl border flex items-center gap-3 text-xs sm:text-sm"
                        style={{
                          backgroundColor: 'rgba(32, 201, 151, 0.1)',
                          borderColor: 'rgba(32, 201, 151, 0.3)',
                          color: 'var(--color-success)',
                        }}
                      >
                        <ShieldCheck size={20} className="shrink-0" />
                        <span className="font-semibold">
                          Tidak ada engine yang mendeteksi ancaman pada target ini.
                        </span>
                      </div>
                    ) : (
                      <div
                        className="p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm"
                        style={{
                          backgroundColor: 'rgba(255, 91, 100, 0.08)',
                          borderColor: 'rgba(255, 91, 100, 0.25)',
                          color: 'var(--color-danger)',
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldAlert size={18} className="shrink-0" />
                          <span>Ditemukan {stats.malicious || 0} engine keamanan yang mendeteksi potensi ancaman.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setResultTab('detection')}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)] cursor-pointer shrink-0"
                        >
                          Lihat Rincian Engine
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB CONTENT: DETECTION ──────────────────────────────────── */}
                {resultTab === 'detection' && (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      {/* Category Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        {[
                          { key: 'all', label: `Semua (${allEngines.length})` },
                          { key: 'malicious', label: `Malicious (${stats.malicious || 0})` },
                          { key: 'suspicious', label: `Suspicious (${stats.suspicious || 0})` },
                          { key: 'harmless', label: `Harmless (${stats.harmless || 0})` },
                          { key: 'undetected', label: `Undetected (${stats.undetected || 0})` },
                        ].map((cat) => {
                          const isCatActive = categoryFilter === cat.key;
                          return (
                            <button
                              key={cat.key}
                              type="button"
                              onClick={() => setCategoryFilter(cat.key)}
                              className="px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-[11px]"
                              style={{
                                backgroundColor: isCatActive ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                                color: isCatActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                                border: '1px solid var(--border-primary)',
                              }}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Kotak Cari Engine */}
                      <div className="relative w-full sm:w-60">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          placeholder="Cari engine..."
                          value={engineSearch}
                          onChange={(e) => setEngineSearch(e.target.value)}
                          className="w-full h-9 pl-9 pr-3 rounded-lg text-xs outline-none"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            border: '1px solid var(--border-primary)',
                            color: 'var(--text-primary)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Grid Daftar Engine (2 Kolom di Desktop, 1 Kolom di HP) */}
                    {filteredEngines.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {displayedEngines.map((engine, idx) => {
                          const isMal = engine.category === 'malicious';
                          const isSusp = engine.category === 'suspicious';
                          const isHarm = engine.category === 'harmless';

                          const statusLabel =
                            engine.result ||
                            (isMal ? 'Malicious' : isSusp ? 'Suspicious' : isHarm ? 'Clean' : 'Undetected');

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 rounded-xl text-xs border"
                              style={{
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-secondary)',
                              }}
                            >
                              <span className="font-semibold truncate mr-2" style={{ color: 'var(--text-primary)' }}>
                                {engine.engineName}
                              </span>
                              <span
                                className="font-mono text-[11px] font-medium shrink-0 flex items-center gap-1"
                                style={{
                                  color: isMal
                                    ? 'var(--color-danger)'
                                    : isSusp
                                    ? 'var(--color-warning)'
                                    : isHarm
                                    ? 'var(--color-success)'
                                    : 'var(--text-muted)',
                                }}
                              >
                                {isMal ? (
                                  <XCircle size={13} />
                                ) : isSusp ? (
                                  <AlertTriangle size={13} />
                                ) : isHarm ? (
                                  <CheckCircle2 size={13} />
                                ) : (
                                  <Circle size={12} />
                                )}
                                <span className="truncate max-w-[160px]">{statusLabel}</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        className="p-8 text-center rounded-xl border text-xs"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--border-primary)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Tidak ada engine yang cocok dengan pencarian atau filter Anda.
                      </div>
                    )}

                    {/* Tombol Tampilkan Semua */}
                    {filteredEngines.length > 20 && (
                      <div className="flex justify-center pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAllEngines(!showAllEngines)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {showAllEngines
                            ? 'Tampilkan Lebih Sedikit (20)'
                            : `Tampilkan Semua (${filteredEngines.length} engine)`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB CONTENT: DETAILS ────────────────────────────────────── */}
                {resultTab === 'details' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div
                      className="rounded-xl border overflow-hidden text-xs divide-y"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-primary)',
                        divideColor: 'var(--border-primary)',
                      }}
                    >
                      {/* URL DETAILS */}
                      {scanResult.type === 'url' && (
                        <>
                          {details.title && (
                            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="font-semibold text-[var(--text-muted)] shrink-0">Judul Halaman</span>
                              <span className="font-medium text-[var(--text-primary)] break-all">{details.title}</span>
                            </div>
                          )}
                          {details.finalUrl && (
                            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="font-semibold text-[var(--text-muted)] shrink-0">URL Final</span>
                              <span className="font-mono text-[var(--text-secondary)] break-all">{details.finalUrl}</span>
                            </div>
                          )}
                          {details.categories && (
                            <div className="p-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <span className="font-semibold text-[var(--text-muted)] shrink-0">Kategori</span>
                              <div className="flex flex-wrap gap-1">
                                {details.categories.map((cat, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-[var(--bg-elevated)] border border-[var(--border-primary)] text-[var(--text-secondary)]">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {typeof details.reputation === 'number' && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Skor Reputasi</span>
                              <span className="font-mono font-bold text-[var(--text-primary)]">{details.reputation}</span>
                            </div>
                          )}
                          {typeof details.timesSubmitted === 'number' && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Jumlah Pengajuan</span>
                              <span className="font-mono text-[var(--text-primary)]">{details.timesSubmitted} kali</span>
                            </div>
                          )}
                          {details.firstSubmissionDate && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Pengajuan Pertama</span>
                              <span className="font-mono text-[var(--text-secondary)]">{formatDate(details.firstSubmissionDate)}</span>
                            </div>
                          )}
                        </>
                      )}

                      {/* FILE DETAILS */}
                      {scanResult.type === 'file' && (
                        <>
                          {Array.isArray(details.names) && details.names.length > 0 && (
                            <div className="p-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <span className="font-semibold text-[var(--text-muted)] shrink-0">Nama Berkas Dikenal</span>
                              <div className="flex flex-wrap gap-1 text-right">
                                {details.names.map((n, idx) => (
                                  <span key={idx} className="font-mono px-2 py-0.5 rounded text-[11px] bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]">
                                    {n}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {typeof details.size === 'number' && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Ukuran Berkas</span>
                              <span className="font-mono text-[var(--text-primary)]">{formatBytes(details.size)}</span>
                            </div>
                          )}
                          {details.typeDescription && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Jenis Berkas</span>
                              <span className="font-mono text-[var(--text-primary)]">{details.typeDescription}</span>
                            </div>
                          )}
                          {details.sha256 && (
                            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="font-semibold text-[var(--text-muted)] shrink-0">SHA-256</span>
                              <span className="font-mono text-[11px] text-[var(--text-secondary)] break-all select-all">{details.sha256}</span>
                            </div>
                          )}
                          {details.sha1 && (
                            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="font-semibold text-[var(--text-muted)] shrink-0">SHA-1</span>
                              <span className="font-mono text-[11px] text-[var(--text-secondary)] break-all select-all">{details.sha1}</span>
                            </div>
                          )}
                          {details.md5 && (
                            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="font-semibold text-[var(--text-muted)] shrink-0">MD5</span>
                              <span className="font-mono text-[11px] text-[var(--text-secondary)] break-all select-all">{details.md5}</span>
                            </div>
                          )}
                          {details.firstSubmissionDate && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Pengajuan Pertama</span>
                              <span className="font-mono text-[var(--text-secondary)]">{formatDate(details.firstSubmissionDate)}</span>
                            </div>
                          )}
                          {details.lastSubmissionDate && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Pengajuan Terakhir</span>
                              <span className="font-mono text-[var(--text-secondary)]">{formatDate(details.lastSubmissionDate)}</span>
                            </div>
                          )}
                        </>
                      )}

                      {/* DOMAIN DETAILS */}
                      {scanResult.type === 'domain' && (
                        <>
                          {details.registrar && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Registrar</span>
                              <span className="font-medium text-[var(--text-primary)]">{details.registrar}</span>
                            </div>
                          )}
                          {details.creationDate && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Tanggal Pembuatan</span>
                              <span className="font-mono text-[var(--text-secondary)]">{formatDate(details.creationDate)}</span>
                            </div>
                          )}
                          {details.tld && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">TLD</span>
                              <span className="font-mono text-[var(--text-primary)]">.{details.tld}</span>
                            </div>
                          )}
                          {typeof details.reputation === 'number' && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Reputasi</span>
                              <span className="font-mono font-bold text-[var(--text-primary)]">{details.reputation}</span>
                            </div>
                          )}
                          {details.categories && (
                            <div className="p-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <span className="font-semibold text-[var(--text-muted)] shrink-0">Kategori</span>
                              <div className="flex flex-wrap gap-1">
                                {details.categories.map((cat, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-[var(--bg-elevated)] border border-[var(--border-primary)] text-[var(--text-secondary)]">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* IP DETAILS */}
                      {scanResult.type === 'ip' && (
                        <>
                          {details.country && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Negara</span>
                              <span className="font-medium text-[var(--text-primary)]">{details.country}</span>
                            </div>
                          )}
                          {details.asOwner && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Pemilik Autonomous System (AS)</span>
                              <span className="font-medium text-[var(--text-primary)]">{details.asOwner}</span>
                            </div>
                          )}
                          {details.asn && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Nomor ASN</span>
                              <span className="font-mono text-[var(--text-primary)]">AS{details.asn}</span>
                            </div>
                          )}
                          {details.network && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Subnet / Jaringan</span>
                              <span className="font-mono text-[var(--text-primary)]">{details.network}</span>
                            </div>
                          )}
                          {typeof details.reputation === 'number' && (
                            <div className="p-3.5 flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-muted)]">Reputasi</span>
                              <span className="font-mono font-bold text-[var(--text-primary)]">{details.reputation}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* BAGIAN DAFTAR PANJANG (ACCORDION / FOLDABLE) */}
                    {/* Rantai Pengalihan (Teks Biasa, bukan Link yang bisa diklik) */}
                    {Array.isArray(details.redirectionChain) && details.redirectionChain.length > 0 && (
                      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
                        <button
                          type="button"
                          onClick={() => toggleSection('redirections')}
                          className="w-full p-3.5 flex items-center justify-between text-xs font-semibold cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                        >
                          <span>Rantai Pengalihan (Redirection Chain - {details.redirectionChain.length})</span>
                          {openSections.redirections ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openSections.redirections && (
                          <div className="p-3.5 border-t space-y-1.5 text-xs font-mono border-[var(--border-primary)] bg-[var(--bg-elevated)]">
                            {details.redirectionChain.map((urlStr, idx) => (
                              <div key={idx} className="break-all select-all text-[var(--text-secondary)]">
                                {idx + 1}. {urlStr}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Header Respons HTTP */}
                    {Array.isArray(details.httpResponseHeaders) && details.httpResponseHeaders.length > 0 && (
                      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
                        <button
                          type="button"
                          onClick={() => toggleSection('headers')}
                          className="w-full p-3.5 flex items-center justify-between text-xs font-semibold cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                        >
                          <span>Header Respons HTTP ({details.httpResponseHeaders.length})</span>
                          {openSections.headers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openSections.headers && (
                          <div className="p-3.5 border-t text-xs font-mono border-[var(--border-primary)] bg-[var(--bg-elevated)] divide-y divide-[var(--border-secondary)]">
                            {details.httpResponseHeaders.map((hdr, idx) => (
                              <div key={idx} className="py-1.5 flex flex-col sm:flex-row justify-between gap-1">
                                <span className="font-bold text-[var(--text-muted)] select-all">{hdr.name}:</span>
                                <span className="text-[var(--text-secondary)] break-all select-all">{hdr.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tautan Keluar (Teks Biasa, bukan Link yang bisa diklik) */}
                    {Array.isArray(details.outgoingLinks) && details.outgoingLinks.length > 0 && (
                      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
                        <button
                          type="button"
                          onClick={() => toggleSection('links')}
                          className="w-full p-3.5 flex items-center justify-between text-xs font-semibold cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                        >
                          <span>Tautan Keluar (Outgoing Links - {details.outgoingLinks.length})</span>
                          {openSections.links ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openSections.links && (
                          <div className="p-3.5 border-t space-y-1 text-xs font-mono border-[var(--border-primary)] bg-[var(--bg-elevated)] max-h-48 overflow-y-auto">
                            {details.outgoingLinks.map((linkStr, idx) => (
                              <div key={idx} className="break-all select-all text-[var(--text-secondary)]">
                                • {linkStr}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* DNS Records */}
                    {Array.isArray(details.lastDnsRecords) && details.lastDnsRecords.length > 0 && (
                      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
                        <button
                          type="button"
                          onClick={() => toggleSection('dns')}
                          className="w-full p-3.5 flex items-center justify-between text-xs font-semibold cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                        >
                          <span>Catatan DNS Terakhir ({details.lastDnsRecords.length})</span>
                          {openSections.dns ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openSections.dns && (
                          <div className="p-3.5 border-t text-xs font-mono border-[var(--border-primary)] bg-[var(--bg-elevated)] divide-y divide-[var(--border-secondary)]">
                            {details.lastDnsRecords.map((dns, idx) => (
                              <div key={idx} className="py-1.5 flex items-center justify-between gap-2">
                                <span className="font-bold text-[var(--accent-light)]">{dns.type}</span>
                                <span className="text-[var(--text-secondary)] break-all select-all">{dns.value}</span>
                                {typeof dns.ttl === 'number' && (
                                  <span className="text-[10px] text-[var(--text-muted)]">TTL {dns.ttl}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
