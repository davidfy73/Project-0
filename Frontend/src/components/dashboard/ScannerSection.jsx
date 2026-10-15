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
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

const SAMPLE_DEMOS = {
  urlMalicious: {
    target: 'http://auth-secure-update-phishing.com/login',
    type: 'URL',
    score: 14,
    total: 72,
    verdict: 'malicious',
    verdictLabel: 'Malicious / Phishing',
    reputation: -68,
    analysisDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
    vendors: [
      { name: 'CrowdStrike Falcon', result: 'Phishing', status: 'malicious' },
      { name: 'Kaspersky Security', result: 'Malicious site', status: 'malicious' },
      { name: 'Google Safe Browsing', result: 'Social Engineering (Phishing)', status: 'malicious' },
      { name: 'Microsoft Defender SmartScreen', result: 'Malicious', status: 'malicious' },
      { name: 'Sophos Intercept X', result: 'Phishing', status: 'malicious' },
      { name: 'BitDefender', result: 'Clean', status: 'clean' },
      { name: 'Fortinet FortiGuard', result: 'Phishing / Fraud', status: 'malicious' },
      { name: 'Cisco Talos', result: 'Malicious URL', status: 'malicious' },
      { name: 'Avast Antivirus', result: 'Clean', status: 'clean' },
      { name: 'TrendMicro', result: 'Dangerous link', status: 'malicious' },
      { name: 'ESET NOD32', result: 'Clean', status: 'clean' },
      { name: 'Cloudflare Radar', result: 'Suspicious Domain', status: 'suspicious' },
    ],
  },
  urlClean: {
    target: 'https://github.com',
    type: 'URL',
    score: 0,
    total: 72,
    verdict: 'clean',
    verdictLabel: 'Clean / Safe',
    reputation: 98,
    analysisDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
    vendors: [
      { name: 'CrowdStrike Falcon', result: 'Clean', status: 'clean' },
      { name: 'Kaspersky Security', result: 'Clean', status: 'clean' },
      { name: 'Google Safe Browsing', result: 'Clean', status: 'clean' },
      { name: 'Microsoft Defender SmartScreen', result: 'Clean', status: 'clean' },
      { name: 'Sophos Intercept X', result: 'Clean', status: 'clean' },
      { name: 'BitDefender', result: 'Clean', status: 'clean' },
      { name: 'Fortinet FortiGuard', result: 'Clean', status: 'clean' },
      { name: 'Cisco Talos', result: 'Clean', status: 'clean' },
    ],
  },
  fileMalware: {
    target: 'invoice_march_payment.exe (SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)',
    type: 'File',
    score: 48,
    total: 70,
    verdict: 'malicious',
    verdictLabel: 'Trojan.Downloader / Ransomware',
    reputation: -92,
    analysisDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
    vendors: [
      { name: 'CrowdStrike Falcon', result: 'Win32.Trojan.Downloader', status: 'malicious' },
      { name: 'Kaspersky Security', result: 'HEUR:Trojan-Ransom.Win32', status: 'malicious' },
      { name: 'Microsoft Defender', result: 'Trojan:Win32/Wacatac.B!ml', status: 'malicious' },
      { name: 'Sophos Intercept X', result: 'Mal/Generic-S', status: 'malicious' },
      { name: 'BitDefender', result: 'Gen:Variant.Ransom.128', status: 'malicious' },
      { name: 'Symantec', result: 'Trojan.Gen.2', status: 'malicious' },
    ],
  },
};

export default function ScannerSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('URL'); // 'FILE' | 'URL' | 'SEARCH'
  const [urlInput, setUrlInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const fileInputRef = useRef(null);

  // Sync with Navbar search params if query exists
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const queryParam = searchParams.get('q');
    if (tabParam === 'search') {
      setActiveTab('SEARCH');
      if (queryParam) {
        setSearchInput(queryParam);
        // Automatically trigger search
        handleStartScan('SEARCH', queryParam);
      }
    }
  }, [searchParams]);

  const handleStartScan = (tab, customTarget = null) => {
    let target = customTarget;
    if (!target) {
      if (tab === 'URL') target = urlInput.trim();
      else if (tab === 'SEARCH') target = searchInput.trim();
      else if (tab === 'FILE') target = selectedFile ? selectedFile.name : null;
    }

    if (!target && tab !== 'FILE') return;

    setIsScanning(true);
    setScanProgress(15);
    setScanResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);

      // Determine result payload (demo/mock)
      let resultPayload;
      const lower = (target || '').toLowerCase();
      if (lower.includes('clean') || lower.includes('google') || lower.includes('github')) {
        resultPayload = {
          ...SAMPLE_DEMOS.urlClean,
          target: target || 'https://google.com',
          type: tab,
        };
      } else if (tab === 'FILE') {
        resultPayload = {
          ...SAMPLE_DEMOS.fileMalware,
          target: target || 'sample_payload.bin',
          type: 'File',
        };
      } else {
        resultPayload = {
          ...SAMPLE_DEMOS.urlMalicious,
          target: target || 'http://suspicious-portal-verification.net',
          type: tab,
        };
      }

      setScanResult(resultPayload);
      setIsScanning(false);
    }, 900);
  };

  const handleReset = () => {
    setScanResult(null);
    setUrlInput('');
    setSearchInput('');
    setSelectedFile(null);
    setSearchParams({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
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
      {/* Background subtle radial aura */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      />

      {/* Header Title (VirusTotal style) */}
      <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-3"
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
          Inspect URLs, Files, and Cyber Indicators
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Analyze suspicious files, domains, IPs, and URLs to detect phishing, malware, and breaches
          inspired by community-driven threat intelligence.
        </p>
      </div>

      {/* Tabs navigation: FILE | URL | SEARCH */}
      <div className="flex items-center justify-center border-b max-w-md mx-auto mb-6 relative z-10"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        {[
          { key: 'FILE', label: 'FILE', icon: UploadCloud },
          { key: 'URL', label: 'URL', icon: Globe },
          { key: 'SEARCH', label: 'SEARCH', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                if (scanResult) setScanResult(null);
              }}
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

      {/* Scanner Input / Results Area */}
      {!scanResult ? (
        <div className="max-w-2xl mx-auto relative z-10">
          {/* TAB 1: URL */}
          {activeTab === 'URL' && (
            <div className="space-y-4">
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
                    onKeyDown={(e) => e.key === 'Enter' && handleStartScan('URL')}
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-sm outline-none transition-all duration-200"
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
                  type="button"
                  disabled={isScanning || !urlInput.trim()}
                  onClick={() => handleStartScan('URL')}
                  className="h-12 px-6 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-on-accent)',
                  }}
                  onMouseOver={(e) => {
                    if (urlInput.trim()) e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  }}
                >
                  <Search size={16} />
                  <span>{isScanning ? 'Analyzing...' : 'Scan URL'}</span>
                </button>
              </div>

              {/* Quick sample demo pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span style={{ color: 'var(--text-muted)' }}>Quick Demos:</span>
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('http://paypal-security-alert-center.tk/verify');
                    handleStartScan('URL', 'http://paypal-security-alert-center.tk/verify');
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--color-danger)',
                  }}
                >
                  ⚡ Sample Phishing URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('https://github.com');
                    handleStartScan('URL', 'https://github.com');
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--color-success)',
                  }}
                >
                  ✓ Sample Clean URL
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FILE */}
          {activeTab === 'FILE' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: selectedFile ? 'var(--accent-primary)' : 'var(--border-secondary)',
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
                      {(selectedFile.size / 1024).toFixed(1)} KB — Ready to analyze
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Choose file or drag & drop here
                    </p>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      Max size: 32MB. Supports EXE, PDF, DOCX, APK, ZIP, etc.
                    </p>
                    <span
                      className="inline-block px-4 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        color: 'var(--text-on-accent)',
                      }}
                    >
                      Browse file
                    </span>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartScan('FILE')}
                    className="px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--text-on-accent)',
                    }}
                  >
                    <ShieldAlert size={14} />
                    <span>Upload & Analyze</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SEARCH */}
          {activeTab === 'SEARCH' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    placeholder="Domain, IP address, MD5, SHA-1, or SHA-256 hash"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStartScan('SEARCH')}
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-sm outline-none transition-all duration-200"
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
                  type="button"
                  disabled={isScanning || !searchInput.trim()}
                  onClick={() => handleStartScan('SEARCH')}
                  className="h-12 px-6 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-on-accent)',
                  }}
                  onMouseOver={(e) => {
                    if (searchInput.trim()) e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  }}
                >
                  <Search size={16} />
                  <span>{isScanning ? 'Searching...' : 'Search'}</span>
                </button>
              </div>

              {/* Preset hash or IP pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span style={{ color: 'var(--text-muted)' }}>Quick Examples:</span>
                <button
                  type="button"
                  onClick={() => {
                    const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
                    setSearchInput(hash);
                    handleStartScan('SEARCH', hash);
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--accent-light)',
                  }}
                >
                  # Ransomware SHA-256
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ip = '185.220.101.5';
                    setSearchInput(ip);
                    handleStartScan('SEARCH', ip);
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--color-warning)',
                  }}
                >
                  # Suspicious IP (185.220.101.5)
                </button>
              </div>
            </div>
          )}

          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="mt-6 space-y-2 animate-in fade-in">
              <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span>Querying security vendors & sandbox engines...</span>
                <span className="font-mono">{scanProgress}%</span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--progress-track)' }}
              >
                <div
                  className="h-full transition-all duration-200"
                  style={{
                    width: `${scanProgress}%`,
                    backgroundColor: 'var(--accent-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Disclaimer (VirusTotal style) */}
          <p
            className="text-[11px] text-center leading-relaxed mt-6"
            style={{ color: 'var(--text-muted)' }}
          >
            By submitting data above, you agree to our Terms of Service and Privacy Notice.
            Submissions are shared with threat intelligence partners for community security research.
          </p>
        </div>
      ) : (
        /* RESULTS VIEW (VirusTotal inspired) */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 relative z-10">
          {/* Top Banner & Detection Score */}
          <div
            className="rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <div className="flex items-start sm:items-center gap-4">
              {/* Score indicator ring */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    scanResult.score > 0
                      ? 'rgba(255, 91, 100, 0.15)'
                      : 'rgba(32, 201, 151, 0.15)',
                  border: `2px solid ${
                    scanResult.score > 0 ? 'var(--color-danger)' : 'var(--color-success)'
                  }`,
                }}
              >
                <span
                  className="text-xl sm:text-2xl font-black font-mono leading-none"
                  style={{
                    color:
                      scanResult.score > 0 ? 'var(--color-danger)' : 'var(--color-success)',
                  }}
                >
                  {scanResult.score}
                </span>
                <span
                  className="text-[10px] font-mono leading-tight mt-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  /{scanResult.total}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor:
                        scanResult.score > 0
                          ? 'rgba(255, 91, 100, 0.2)'
                          : 'rgba(32, 201, 151, 0.2)',
                      color:
                        scanResult.score > 0 ? 'var(--color-danger)' : 'var(--color-success)',
                      border: `1px solid ${
                        scanResult.score > 0 ? 'var(--color-danger)' : 'var(--color-success)'
                      }`,
                    }}
                  >
                    {scanResult.verdictLabel}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Type: <strong style={{ color: 'var(--text-primary)' }}>{scanResult.type}</strong>
                  </span>
                </div>
                <h3
                  className="text-sm sm:text-base font-mono font-bold break-all"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {scanResult.target}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Analysis timestamp: <span className="font-mono">{scanResult.analysisDate} UTC</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-on-accent)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
              >
                <RotateCcw size={14} />
                <span>New Analysis</span>
              </button>
            </div>
          </div>

          {/* Vendors detection grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span>Security Vendors' Analysis</span>
                <span
                  className="text-xs font-normal px-2 py-0.5 rounded"
                  style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                >
                  {scanResult.vendors.length} vendors checked
                </span>
              </h4>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 rounded-xl p-3 max-h-72 overflow-y-auto"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              {scanResult.vendors.map((vendor, idx) => {
                const isMal = vendor.status === 'malicious';
                const isSusp = vendor.status === 'suspicious';
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg transition-colors text-xs"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-secondary)',
                    }}
                  >
                    <span className="font-medium truncate mr-2" style={{ color: 'var(--text-primary)' }}>
                      {vendor.name}
                    </span>
                    <span
                      className="font-mono text-[11px] font-semibold shrink-0 flex items-center gap-1"
                      style={{
                        color: isMal
                          ? 'var(--color-danger)'
                          : isSusp
                          ? 'var(--color-warning)'
                          : 'var(--color-success)',
                      }}
                    >
                      {isMal ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                      {vendor.result}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
