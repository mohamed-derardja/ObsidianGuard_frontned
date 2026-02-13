// URL Analysis Service - Screenshot capture, visual phishing detection, URL intelligence
import api from './api';

const URL_BASE = '/api/url/v1';

// Types
export interface VisualMatch {
  site: string;
  domain: string;
  similarity: number;
  isLikelyClone: boolean;
}

export interface DnsIntel {
  aRecords: string[];
  mxRecords: { exchange: string; priority: number }[];
  nsRecords: string[];
  txtRecords: string[];
  hasSPF: boolean;
  hasDMARC: boolean;
  hasDKIM: boolean;
}

export interface UrlIntel {
  hostname: string;
  ip: string | null;
  ipInfo: {
    city: string;
    region: string;
    country: string;
    org: string;
    timezone: string;
  } | null;
  ssl: { valid: boolean; protocol: string } | null;
  headers: {
    server: string;
    poweredBy: string | null;
    contentType: string | null;
    redirected: boolean;
    finalUrl: string;
    statusCode: number;
  };
}

export interface UrlAnalysisResult {
  url: string;
  hostname: string;
  analysisTime: string;

  // Screenshot
  screenshot: string | null;
  screenshotHash: string | null;
  screenshotError: string | null;

  // Visual similarity
  visualMatches: VisualMatch[];
  topVisualMatch: VisualMatch | null;

  // Intelligence
  dns: DnsIntel | null;
  urlIntel: UrlIntel | null;

  // Risk
  riskScore: number;
  riskLevel: string;
  riskFactors: string[];
  isTrusted: boolean;

  knownSitesCount: number;
}

export interface ScreenshotResult {
  screenshot: string;
  hash: string;
  visualMatches: VisualMatch[];
}

export interface UrlScanSummary {
  id: number;
  url: string;
  hostname: string;
  riskScore: number;
  riskLevel: string;
  isTrusted: boolean;
  topMatch: string | null;
  topSimilarity: number | null;
  analysisTime: string | null;
  scannedAt: string;
}

// Full URL analysis
export const analyzeUrl = async (url: string): Promise<UrlAnalysisResult | null> => {
  const response = await api.post<UrlAnalysisResult>(`${URL_BASE}/analyze`, { url });
  return response.data || null;
};

// Screenshot only
export const takeScreenshot = async (url: string): Promise<ScreenshotResult | null> => {
  const response = await api.post<ScreenshotResult>(`${URL_BASE}/screenshot`, { url });
  return response.data || null;
};

// Refresh known site hashes
export const refreshHashes = async () => {
  const response = await api.post(`${URL_BASE}/refresh-hashes`, {});
  return response.data;
};

// Get all saved URL scans
export const getScans = async (): Promise<UrlScanSummary[]> => {
  const response = await api.get<UrlScanSummary[]>(`${URL_BASE}/scans`);
  return response.data || [];
};

// Get a specific scan
export const getScan = async (id: number): Promise<UrlAnalysisResult | null> => {
  const response = await api.get<UrlAnalysisResult>(`${URL_BASE}/scans/${id}`);
  return response.data || null;
};

// Delete a scan
export const deleteScan = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`${URL_BASE}/scans/${id}`);
    return true;
  } catch {
    return false;
  }
};

export default {
  analyzeUrl,
  takeScreenshot,
  refreshHashes,
  getScans,
  getScan,
  deleteScan,
};
