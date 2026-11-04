// services/virustotal.service.js
// Layanan integrasi VirusTotal v3 dengan cache in-memory dan pembatas kuota global.
// Melindungi API key agar tidak pernah bocor ke log atau respons.

import axios from 'axios';
import crypto from 'crypto';
import env from '../config/env.js';
import { VT_CONFIG, VT_LIMITS, determineVerdict } from '../constants/virustotal.js';

/**
 * Custom error untuk batas rate limit VirusTotal (429)
 */
export class RateLimitError extends Error {
  constructor(message, retryAfter) {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429;
    this.retryAfter = retryAfter;
  }
}

// ── In-Memory Cache (TTL 10 Menit) ───────────────────────────────────────────
const cache = new Map();

function getFromCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setToCache(key, data) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + VT_CONFIG.CACHE_TTL_MS,
  });
}

// ── Global Outgoing Rate Limiter (4 req/menit, 500 req/hari) ─────────────────
let minuteTimestamps = [];
let dailyCount = 0;
let currentDayStr = new Date().toISOString().slice(0, 10);

/**
 * Memeriksa dan mencatat konsumsi kuota untuk SETIAP panggilan keluar ke VirusTotal.
 * Dilempar RateLimitError jika batas tercapai.
 */
function checkAndConsumeQuota() {
  const now = Date.now();

  // Reset kuota harian jika tanggal UTC berubah
  const todayStr = new Date().toISOString().slice(0, 10);
  if (currentDayStr !== todayStr) {
    currentDayStr = todayStr;
    dailyCount = 0;
  }

  // Bersihkan timestamp yang lebih dari 60 detik lalu
  const oneMinuteAgo = now - 60000;
  minuteTimestamps = minuteTimestamps.filter((t) => t > oneMinuteAgo);

  // Cek batas per menit (4 request/menit)
  if (minuteTimestamps.length >= VT_LIMITS.REQUESTS_PER_MINUTE) {
    const oldest = minuteTimestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + 60000 - now) / 1000));
    throw new RateLimitError('Batas scan tercapai, coba lagi sebentar.', retryAfter);
  }

  // Cek batas per hari (500 request/hari)
  if (dailyCount >= VT_LIMITS.REQUESTS_PER_DAY) {
    const nextMidnight = new Date();
    nextMidnight.setUTCHours(24, 0, 0, 0);
    const retryAfter = Math.max(1, Math.ceil((nextMidnight.getTime() - now) / 1000));
    throw new RateLimitError('Kuota scan harian (500 request) telah tercapai. Coba lagi besok.', retryAfter);
  }

  // Catat konsumsi kuota
  minuteTimestamps.push(now);
  dailyCount += 1;
}

// ── Axios Client Khusus VirusTotal ───────────────────────────────────────────
const vtClient = axios.create({
  baseURL: VT_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    'x-apikey': env.VIRUSTOTAL_API_KEY,
    Accept: 'application/json',
  },
});

/**
 * Tangani error axios dengan aman tanpa membocorkan objek config/headers yang berisi API key.
 */
function handleVtError(err) {
  if (err instanceof RateLimitError) {
    throw err;
  }

  const status = err.response?.status;
  const vtMessage = err.response?.data?.error?.message;

  if (status === 401) {
    const error = new Error('Layanan scan belum terkonfigurasi dengan benar.');
    error.statusCode = 502;
    throw error;
  }
  if (status === 404) {
    const error = new Error('Target tidak ditemukan dalam basis data VirusTotal.');
    error.statusCode = 404;
    throw error;
  }
  if (status === 429) {
    const error = new RateLimitError('Batas kuota VirusTotal tercapai, coba lagi sebentar.', 60);
    throw error;
  }
  if (status >= 500) {
    const error = new Error('Layanan VirusTotal sedang mengalami kendala teknis.');
    error.statusCode = 502;
    throw error;
  }

  const error = new Error(vtMessage || 'Terjadi kesalahan saat memproses scan.');
  error.statusCode = status || 500;
  throw error;
}

/**
 * Potong string maksimal maxLen karakter untuk keamanan dan kerapian respons.
 */
function truncateStr(val, maxLen = 300) {
  if (typeof val !== 'string') return val;
  return val.length > maxLen ? val.slice(0, maxLen) + '...' : val;
}

/**
 * Format data mentah VirusTotal menjadi ringkasan rapi (Summary, Detection, Details).
 * Digunakan seragam di seluruh jalur: scan langsung, cache, lookup, dan polling completed.
 */
function formatReport(data, type, target, extraAttributes = {}) {
  const attributes = { ...(extraAttributes || {}), ...(data?.attributes || {}) };
  const rawStats = attributes.last_analysis_stats || attributes.stats || {};

  const stats = {
    malicious: rawStats.malicious || 0,
    suspicious: rawStats.suspicious || 0,
    harmless: rawStats.harmless || 0,
    undetected: rawStats.undetected || 0,
  };
  stats.total = stats.malicious + stats.suspicious + stats.harmless + stats.undetected;

  const verdict = determineVerdict(stats);

  // ── 1. allEngines & detectionEngines ────────────────────────────────────────
  const allEngines = [];
  const detectionEngines = [];
  const results = attributes.last_analysis_results || attributes.results || {};

  for (const [engineName, res] of Object.entries(results)) {
    const item = {
      engineName: truncateStr(res.engine_name || engineName, 100),
      category: res.category || 'undetected',
      result: truncateStr(res.result || null, 300),
    };
    allEngines.push(item);
    if (res.category === 'malicious' || res.category === 'suspicious') {
      detectionEngines.push(item);
    }
  }

  // Urutkan: malicious pertama, suspicious kedua, sisanya alfabetis A-Z
  allEngines.sort((a, b) => {
    const priority = (cat) => {
      if (cat === 'malicious') return 1;
      if (cat === 'suspicious') return 2;
      return 3;
    };
    const pA = priority(a.category);
    const pB = priority(b.category);
    if (pA !== pB) return pA - pB;
    return a.engineName.localeCompare(b.engineName);
  });

  // Permalink
  let permalink = '';
  if (type === 'file') {
    const hash = attributes.sha256 || attributes.md5 || target;
    permalink = `https://www.virustotal.com/gui/file/${hash}`;
  } else if (type === 'url') {
    const urlId = data?.id || Buffer.from(target).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    permalink = `https://www.virustotal.com/gui/url/${urlId}`;
  } else if (type === 'domain') {
    permalink = `https://www.virustotal.com/gui/domain/${encodeURIComponent(target)}`;
  } else if (type === 'ip') {
    permalink = `https://www.virustotal.com/gui/ip-address/${encodeURIComponent(target)}`;
  }

  const analysisDate = attributes.last_analysis_date || attributes.date
    ? new Date((attributes.last_analysis_date || attributes.date) * 1000).toISOString()
    : new Date().toISOString();

  // ── 2. header ──────────────────────────────────────────────────────────────
  const rawTags = Array.isArray(attributes.tags) ? attributes.tags : [];
  const header = {
    score: stats.malicious,
    total: stats.total,
    tags: rawTags.slice(0, 10).map((t) => truncateStr(t, 50)),
    httpStatus: attributes.last_http_response_code ?? null,
    contentType: truncateStr(
      attributes.type_description ||
      attributes.last_http_response_headers?.['content-type'] ||
      attributes.last_http_response_headers?.['Content-Type'] ||
      null,
      100
    ),
    lastAnalysisDate: analysisDate,
    ip: truncateStr(attributes.network || attributes.ip_address || attributes.last_http_response_ip || (type === 'ip' ? target : null), 50),
  };

  // ── 3. details sesuai tipe ─────────────────────────────────────────────────
  const details = {};
  if (type === 'url') {
    if (attributes.title) details.title = truncateStr(attributes.title);
    if (attributes.last_final_url) details.finalUrl = truncateStr(attributes.last_final_url);
    if (attributes.categories && typeof attributes.categories === 'object') {
      details.categories = Object.entries(attributes.categories).slice(0, 10).map(([k, v]) => `${k}: ${truncateStr(v, 100)}`);
    }
    if (typeof attributes.reputation === 'number') details.reputation = attributes.reputation;
    if (typeof attributes.times_submitted === 'number') details.timesSubmitted = attributes.times_submitted;
    if (attributes.first_submission_date) details.firstSubmissionDate = new Date(attributes.first_submission_date * 1000).toISOString();
    if (Array.isArray(attributes.redirection_chain) && attributes.redirection_chain.length > 0) {
      details.redirectionChain = attributes.redirection_chain.slice(0, 10).map((u) => truncateStr(u));
    }
    if (attributes.last_http_response_headers && typeof attributes.last_http_response_headers === 'object') {
      details.httpResponseHeaders = Object.entries(attributes.last_http_response_headers)
        .slice(0, 20)
        .map(([k, v]) => ({ name: truncateStr(k, 100), value: truncateStr(String(v), 300) }));
    }
    if (Array.isArray(attributes.outgoing_links) && attributes.outgoing_links.length > 0) {
      details.outgoingLinks = attributes.outgoing_links.slice(0, 20).map((l) => truncateStr(l));
    }
    if (rawTags.length > 0) details.tags = rawTags.slice(0, 10).map((t) => truncateStr(t, 50));
  } else if (type === 'file') {
    if (Array.isArray(attributes.names) && attributes.names.length > 0) {
      details.names = attributes.names.slice(0, 5).map((n) => truncateStr(n, 100));
    }
    if (typeof attributes.size === 'number') details.size = attributes.size;
    if (attributes.type_description) details.typeDescription = truncateStr(attributes.type_description, 100);
    if (attributes.md5) details.md5 = truncateStr(attributes.md5, 64);
    if (attributes.sha1) details.sha1 = truncateStr(attributes.sha1, 64);
    if (attributes.sha256) details.sha256 = truncateStr(attributes.sha256, 64);
    if (rawTags.length > 0) details.tags = rawTags.slice(0, 10).map((t) => truncateStr(t, 50));
    if (attributes.first_submission_date) details.firstSubmissionDate = new Date(attributes.first_submission_date * 1000).toISOString();
    if (attributes.last_submission_date) details.lastSubmissionDate = new Date(attributes.last_submission_date * 1000).toISOString();
  } else if (type === 'domain') {
    if (attributes.registrar) details.registrar = truncateStr(attributes.registrar, 100);
    if (attributes.creation_date) details.creationDate = new Date(attributes.creation_date * 1000).toISOString();
    if (attributes.categories && typeof attributes.categories === 'object') {
      details.categories = Object.entries(attributes.categories).slice(0, 10).map(([k, v]) => `${k}: ${truncateStr(v, 100)}`);
    }
    if (typeof attributes.reputation === 'number') details.reputation = attributes.reputation;
    if (attributes.tld) details.tld = truncateStr(attributes.tld, 30);
    if (Array.isArray(attributes.last_dns_records) && attributes.last_dns_records.length > 0) {
      details.lastDnsRecords = attributes.last_dns_records.slice(0, 10).map((r) => ({
        type: truncateStr(r.type, 20),
        value: truncateStr(r.value, 150),
        ttl: r.ttl,
      }));
    }
  } else if (type === 'ip') {
    if (attributes.country) details.country = truncateStr(attributes.country, 50);
    if (attributes.as_owner) details.asOwner = truncateStr(attributes.as_owner, 100);
    if (attributes.asn) details.asn = attributes.asn;
    if (attributes.network) details.network = truncateStr(attributes.network, 100);
    if (typeof attributes.reputation === 'number') details.reputation = attributes.reputation;
  }

  return {
    target: truncateStr(target, 300),
    type,
    status: 'completed',
    stats,
    verdict,
    allEngines,
    detectionEngines,
    header,
    details,
    analysisDate,
    reputation: attributes.reputation ?? 0,
    permalink,
  };
}

// ── Exported Services ────────────────────────────────────────────────────────

/**
 * Lookup Hash (MD5/SHA1/SHA256), Domain, atau IP.
 */
export async function lookupTarget(query, type) {
  const target = query.trim().toLowerCase();
  const cacheKey = `${type}:${target}`;

  // 1. Cek cache in-memory (tanpa memakai kuota VT)
  const cached = getFromCache(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  // 2. Periksa batas kuota sebelum request keluar
  checkAndConsumeQuota();

  try {
    let endpoint = '';
    if (type === 'hash') {
      endpoint = `/files/${encodeURIComponent(target)}`;
    } else if (type === 'ip') {
      endpoint = `/ip_addresses/${encodeURIComponent(target)}`;
    } else if (type === 'domain') {
      endpoint = `/domains/${encodeURIComponent(target)}`;
    } else {
      throw new Error('Tipe pencarian tidak didukung.');
    }

    const res = await vtClient.get(endpoint);
    const report = formatReport(res.data?.data, type === 'hash' ? 'file' : type, target);

    setToCache(cacheKey, report);
    return report;
  } catch (err) {
    handleVtError(err);
  }
}

/**
 * Scan URL.
 * Menguji apakah URL sudah pernah dianalisis via base64url identifier.
 * Jika sudah ada, langsung kembalikan laporan lengkap beserta detailnya.
 * Jika belum, kirim ke POST /urls untuk dianalisis.
 */
export async function scanUrl(rawUrl) {
  const target = rawUrl.trim();
  const cacheKey = `url:${target.toLowerCase()}`;

  // Cek cache
  const cached = getFromCache(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  // ID URL di VT v3 adalah Base64URL dari string URL tanpa padding '='
  const urlId = Buffer.from(target).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  // Coba ambil laporan yang sudah ada di VT
  checkAndConsumeQuota();
  try {
    const res = await vtClient.get(`/urls/${urlId}`);
    const report = formatReport(res.data?.data, 'url', target);
    setToCache(cacheKey, report);
    return report;
  } catch (err) {
    // Jika 404 (belum ada di VT), kirimkan URL untuk dianalisis baru
    if (err.response?.status === 404) {
      checkAndConsumeQuota();
      try {
        const postRes = await vtClient.post(
          '/urls',
          new URLSearchParams({ url: target }).toString(),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        );
        const analysisId = postRes.data?.data?.id;
        return {
          status: 'queued',
          analysisId,
          target,
          type: 'url',
          message: 'URL berhasil dikirim ke VirusTotal untuk dianalisis.',
        };
      } catch (postErr) {
        handleVtError(postErr);
      }
    } else {
      handleVtError(err);
    }
  }
}

/**
 * Scan File.
 * 1. Hitung SHA256 file di memori.
 * 2. Cek cache lokal.
 * 3. Lookup hash di VT — jika sudah dikenal, gunakan laporan yang ada tanpa upload.
 * 4. Jika belum ada, upload buffer file ke VT.
 */
export async function scanFile(fileBuffer, originalName) {
  const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const cacheKey = `file:${sha256}`;

  // 1. Cek cache lokal
  const cached = getFromCache(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  // 2. Lookup hash di VT terlebih dahulu (hemat kuota & bandwidth)
  checkAndConsumeQuota();
  try {
    const res = await vtClient.get(`/files/${encodeURIComponent(sha256)}`);
    const report = formatReport(res.data?.data, 'file', originalName || sha256);
    setToCache(cacheKey, report);
    return report;
  } catch (err) {
    // Jika 404, file belum dikenal oleh VT -> Upload file
    if (err.response?.status === 404) {
      checkAndConsumeQuota();
      try {
        const formData = new FormData();
        const blob = new Blob([fileBuffer]);
        formData.append('file', blob, originalName || 'file');

        const uploadRes = await vtClient.post('/files', formData);
        const analysisId = uploadRes.data?.data?.id;

        return {
          status: 'queued',
          analysisId,
          target: originalName || sha256,
          type: 'file',
          sha256,
          message: 'File berhasil dikirim ke VirusTotal untuk dianalisis.',
        };
      } catch (uploadErr) {
        handleVtError(uploadErr);
      }
    } else {
      handleVtError(err);
    }
  }
}

/**
 * Ambil status analisis polling via ID analisis.
 * Saat completed, jika tipe URL atau File, ambil objek lengkapnya (/urls/{id} atau /files/{sha256})
 * agar field header dan details terisi lengkap.
 */
export async function getAnalysis(analysisId) {
  checkAndConsumeQuota();
  try {
    const res = await vtClient.get(`/analyses/${encodeURIComponent(analysisId)}`);
    const data = res.data?.data;
    const attributes = data?.attributes || {};
    const status = attributes.status || 'queued';

    if (status === 'completed') {
      const target = attributes.meta?.file_info?.sha256 || attributes.meta?.url_info?.url || analysisId;
      const type = attributes.meta?.file_info ? 'file' : attributes.meta?.url_info ? 'url' : 'analysis';

      let fullAttributes = {};

      // Jika URL, ambil detail objek /urls/{urlId}
      if (type === 'url' && attributes.meta?.url_info?.url) {
        const rawUrl = attributes.meta.url_info.url;
        const urlId = Buffer.from(rawUrl).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        try {
          checkAndConsumeQuota();
          const urlRes = await vtClient.get(`/urls/${urlId}`);
          fullAttributes = urlRes.data?.data?.attributes || {};
        } catch {
          // Tetap lanjutkan meski request detail gagal
        }
      } else if (type === 'file' && attributes.meta?.file_info?.sha256) {
        const sha256 = attributes.meta.file_info.sha256;
        try {
          checkAndConsumeQuota();
          const fileRes = await vtClient.get(`/files/${encodeURIComponent(sha256)}`);
          fullAttributes = fileRes.data?.data?.attributes || {};
        } catch {
          // Tetap lanjutkan
        }
      }

      const report = formatReport(data, type, target, fullAttributes);

      // Simpan ke cache jika target valid
      if (type === 'url' && attributes.meta?.url_info?.url) {
        setToCache(`url:${attributes.meta.url_info.url.toLowerCase()}`, report);
      } else if (type === 'file' && attributes.meta?.file_info?.sha256) {
        setToCache(`file:${attributes.meta.file_info.sha256.toLowerCase()}`, report);
      }

      return report;
    }

    return {
      status, // 'queued' atau 'in_progress'
      analysisId,
      message: 'Analisis sedang diproses oleh VirusTotal.',
    };
  } catch (err) {
    handleVtError(err);
  }
}
