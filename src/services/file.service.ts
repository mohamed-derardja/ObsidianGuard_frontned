// File Analysis Service – VirusTotal file scanning
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const FILE_BASE = '/api/file/v1';

// ----- Types -----

export interface FileDetection {
  engine: string;
  category: string; // "malicious" | "suspicious"
  result: string;
}

export interface FileThreat {
  level: string; // "CLEAN" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  label: string;
  score: number;
}

export interface FileScanResult {
  scanId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  sha256: string;
  md5: string;
  fileType: string | null;
  threat: FileThreat;
  detectionStats: Record<string, number>;
  totalEngines: number;
  maliciousCount: number;
  suspiciousCount: number;
  harmlessCount: number;
  undetectedCount: number;
  detections: FileDetection[];
  tags: string[];
  fromCache: boolean;
  analysisTime: string;
  analysisStatus: string;
}

export interface FileScanSummary {
  id: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  sha256: string;
  threatLevel: string;
  threatLabel: string;
  threatScore: number;
  maliciousCount: number;
  suspiciousCount: number;
  totalEngines: number;
  analysisTime: string | null;
  fromCache: boolean;
  scannedAt: string;
}

// ----- Helpers -----

function getAuthCookie(): string {
  // credentials: 'include' sends the httpOnly cookie automatically
  return '';
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || 'Request failed');
  }
  return data.data as T;
}

// ----- API calls -----

/**
 * Upload and scan a file with VirusTotal
 * Uses FormData (not JSON) for multipart file upload
 */
export const scanFile = async (file: File): Promise<FileScanResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}${FILE_BASE}/scan`, {
    method: 'POST',
    credentials: 'include',
    // Do NOT set Content-Type header — browser sets the boundary automatically for FormData
    body: formData,
  });

  return handleResponse<FileScanResult>(response);
};

/**
 * Get VirusTotal report by SHA-256 hash
 */
export const getReport = async (sha256: string): Promise<FileScanResult | null> => {
  const response = await fetch(`${API_BASE_URL}${FILE_BASE}/report/${sha256}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 404) return null;
  return handleResponse<FileScanResult>(response);
};

/**
 * Get all file scan history for current user
 */
export const getScans = async (): Promise<FileScanSummary[]> => {
  const response = await fetch(`${API_BASE_URL}${FILE_BASE}/scans`, {
    method: 'GET',
    credentials: 'include',
  });

  return handleResponse<FileScanSummary[]>(response);
};

/**
 * Get a specific scan detail
 */
export const getScan = async (id: number): Promise<FileScanResult | null> => {
  const response = await fetch(`${API_BASE_URL}${FILE_BASE}/scans/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 404) return null;
  return handleResponse<FileScanResult>(response);
};

/**
 * Delete a file scan record
 */
export const deleteScan = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}${FILE_BASE}/scans/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await response.json();
  return data.success === true;
};

// Default export
const fileService = { scanFile, getReport, getScans, getScan, deleteScan };
export default fileService;
