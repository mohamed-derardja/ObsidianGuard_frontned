// Email service - Gmail integration and email analysis
import api from './api';

const EMAIL_BASE = '/api/email/v1';

// Types
export interface Email {
  id: number;
  gmailId?: string;
  threadId?: string;
  subject: string;
  sender: string;
  senderName?: string;
  recipient?: string;
  body: string;
  snippet?: string;
  isRead: boolean;
  isStarred: boolean;
  labels?: string[];
  attachments?: unknown[];
  receivedAt: string;
  isAnalyzed: boolean;
  isPhishing?: boolean;
  phishingScore?: number;
  indicators?: string[];
  analysisDetails?: Record<string, unknown>;
  analyzedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailStats {
  totalEmails: number;
  analyzedEmails: number;
  phishingEmails: number;
  safeEmails: number;
  suspiciousEmails: number;
  unreadEmails: number;
  averagePhishingScore: number;
}

export interface AnalysisResult {
  isPhishing: boolean;
  phishingScore: number;
  confidence: number;
  indicators: string[];
  reason?: string;
  recommendation?: string;
  verdict?: string;
  label?: string;
  aiAnalysis?: boolean;
  analysisDetails?: {
    senderAuthenticity?: string;
    languageRisk?: string;
    linkAnalysis?: string;
    urgencyLevel?: string;
    [key: string]: unknown;
  };
}

export interface GmailStatus {
  connected: boolean;
  email?: string;
  lastSync?: string;
}

// Gmail Integration
export const getGmailAuthUrl = async () => {
  const response = await api.get<{ authUrl: string }>(`${EMAIL_BASE}/gmail/auth`);
  return response.data?.authUrl;
};

export const getGmailStatus = async (): Promise<GmailStatus> => {
  const response = await api.get<GmailStatus>(`${EMAIL_BASE}/gmail/status`);
  return response.data || { connected: false };
};

export const disconnectGmail = async () => {
  return api.delete(`${EMAIL_BASE}/gmail/disconnect`);
};

export const syncGmailEmails = async (options?: { maxResults?: number; labelIds?: string[] }) => {
  const response = await api.post<{ synced: number; emails: Email[] }>(
    `${EMAIL_BASE}/gmail/sync`,
    options
  );
  return response.data;
};

export const fetchGmailEmailsDirect = async (options?: { maxResults?: number; query?: string }) => {
  const params = new URLSearchParams();
  if (options?.maxResults) params.set('maxResults', String(options.maxResults));
  if (options?.query) params.set('query', options.query);
  
  const response = await api.get<Email[]>(`${EMAIL_BASE}/gmail/fetch?${params}`);
  return response.data || [];
};

export const getGmailLabels = async () => {
  const response = await api.get<{ id: string; name: string; type: string }[]>(`${EMAIL_BASE}/gmail/labels`);
  return response.data || [];
};

// Email CRUD
export const getEmails = async (options?: {
  page?: number;
  limit?: number;
  isPhishing?: boolean;
  isAnalyzed?: boolean;
  isRead?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', String(options.page));
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.isPhishing !== undefined) params.set('isPhishing', String(options.isPhishing));
  if (options?.isAnalyzed !== undefined) params.set('isAnalyzed', String(options.isAnalyzed));
  if (options?.isRead !== undefined) params.set('isRead', String(options.isRead));
  if (options?.search) params.set('search', options.search);
  if (options?.sortBy) params.set('sortBy', options.sortBy);
  if (options?.sortOrder) params.set('sortOrder', options.sortOrder);
  
  const response = await api.get<{
    emails: Email[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>(`${EMAIL_BASE}/emails?${params}`);
  return response.data;
};

export const getEmailById = async (id: number) => {
  const response = await api.get<Email>(`${EMAIL_BASE}/emails/${id}`);
  return response.data;
};

export const markEmailAsRead = async (id: number, isRead: boolean) => {
  return api.patch(`${EMAIL_BASE}/emails/${id}/read`, { isRead });
};

export const starEmail = async (id: number, isStarred: boolean) => {
  return api.patch(`${EMAIL_BASE}/emails/${id}/star`, { isStarred });
};

export const deleteEmail = async (id: number) => {
  return api.delete(`${EMAIL_BASE}/emails/${id}`);
};

export const permanentDeleteEmail = async (id: number) => {
  return api.delete(`${EMAIL_BASE}/emails/${id}/permanent`);
};

export const bulkDeleteEmails = async (emailIds: number[]) => {
  return api.post(`${EMAIL_BASE}/emails/bulk-delete`, { emailIds });
};

// Analysis
export const analyzeStoredEmail = async (id: number) => {
  const response = await api.post<{ email: Email; analysis: AnalysisResult }>(
    `${EMAIL_BASE}/emails/${id}/analyze`
  );
  return response.data;
};

export const analyzeEmailContent = async (content: {
  subject?: string;
  body: string;
  sender?: string;
  content?: string;
}) => {
  const response = await api.post<AnalysisResult>(`${EMAIL_BASE}/analyze`, content);
  return response.data;
};

export const bulkAnalyzeEmails = async (emailIds: number[]) => {
  const response = await api.post<{
    analyzed: number;
    results: { id: number; isPhishing: boolean; phishingScore: number }[];
  }>(`${EMAIL_BASE}/bulk-analyze`, { emailIds });
  return response.data;
};

// Dashboard Stats
export interface DashboardStats {
  kpis: {
    totalScanned: number;
    suspiciousCount: number;
    confirmedPhishing: number;
    blockedProtected: number;
  };
  dailyStats: { day: string; total: number; threats: number; detectionRate: number }[];
  threatDistribution: { name: string; value: number }[];
  recentAlerts: { id: number; target: string; type: string; result: string; confidence: string; time: string }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>(`${EMAIL_BASE}/dashboard/stats`);
  return response.data as DashboardStats;
};

// Stats
export const getEmailStats = async () => {
  const response = await api.get<EmailStats>(`${EMAIL_BASE}/emails/stats`);
  return response.data as EmailStats;
};

export default {
  // Gmail
  getGmailAuthUrl,
  getGmailStatus,
  disconnectGmail,
  syncGmailEmails,
  fetchGmailEmailsDirect,
  getGmailLabels,
  // CRUD
  getEmails,
  getEmailById,
  markEmailAsRead,
  starEmail,
  deleteEmail,
  permanentDeleteEmail,
  bulkDeleteEmails,
  // Analysis
  analyzeStoredEmail,
  analyzeEmailContent,
  bulkAnalyzeEmails,
  // Stats
  getEmailStats,
  getDashboardStats,
};
