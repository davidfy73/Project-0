// constants/slugs.js
// Daftar resmi slug materi edukasi PHISHYEARN.
// 100% cocok dengan data dan routing di Frontend/src.

export const MODULE_SLUGS = [
  'phishing',
  'malware',
  'ransomware',
  'mitm',
  'social-engineering',
  'clickjacking',
];

export const PREVENTIVE_SLUGS = [
  'use-strong-password',
  'check-url',
  'use-antivirus',
  'backup-data',
  'use-vpn',
  'verify-identity',
  'update-patch',
];

export const ALL_SLUGS = [...MODULE_SLUGS, ...PREVENTIVE_SLUGS];

export function isValidSlug(slug) {
  return typeof slug === 'string' && ALL_SLUGS.includes(slug);
}
