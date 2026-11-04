// constants/virustotal.js
// Konstanta konfigurasi dan batas kuota untuk layanan VirusTotal v3.

export const VT_CONFIG = {
  BASE_URL: 'https://www.virustotal.com/api/v3',
  CACHE_TTL_MS: 10 * 60 * 1000, // 10 menit
  MAX_FILE_SIZE_BYTES: 32 * 1024 * 1024, // 32 MB
  MAX_URL_LENGTH: 2048,
};

// Batas kuota akun publik / gratis VirusTotal
export const VT_LIMITS = {
  REQUESTS_PER_MINUTE: 4,
  REQUESTS_PER_DAY: 500,
};

// Label verdict hasil analisis
export const VERDICT = {
  DANGEROUS: 'berbahaya',
  SUSPICIOUS: 'mencurigakan',
  CLEAN: 'aman',
};

/**
 * Menentukan verdict berdasarkan ambang batas:
 * - Malicious >= 3 -> berbahaya
 * - Malicious 1 - 2 atau Suspicious > 0 -> mencurigakan
 * - Selain itu -> aman
 */
export function determineVerdict(stats) {
  const malicious = stats?.malicious || 0;
  const suspicious = stats?.suspicious || 0;

  if (malicious >= 3) {
    return VERDICT.DANGEROUS;
  }
  if (malicious >= 1 || suspicious > 0) {
    return VERDICT.SUSPICIOUS;
  }
  return VERDICT.CLEAN;
}
