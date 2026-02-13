// Company service - API calls for enterprise/company routes

import { api, ApiResponse } from './api';

// Types
export interface Employee {
  id: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  extensionInstalled: boolean;
  invitedAt: string;
  respondedAt?: string;
  installedAt?: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  employees: Employee[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  extensionInstalled: number;
}

export interface UpdateProfileData {
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}

export interface InviteEmployeeData {
  email: string;
}

export interface BulkInviteData {
  emails: string[];
}

export interface UpdateEmployeeData {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

// Company endpoints
const COMPANY_BASE = '/api/company/v1';

export const companyService = {
  /**
   * Get company profile with employees
   */
  getProfile: async (): Promise<ApiResponse<CompanyProfile>> => {
    return api.get<CompanyProfile>(`${COMPANY_BASE}/profile`);
  },

  /**
   * Update company profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<CompanyProfile>> => {
    return api.put<CompanyProfile>(`${COMPANY_BASE}/profile`, data);
  },

  /**
   * Invite a single employee
   */
  inviteEmployee: async (data: InviteEmployeeData): Promise<ApiResponse<Employee>> => {
    return api.post<Employee>(`${COMPANY_BASE}/employees/invite`, data);
  },

  /**
   * Bulk invite employees
   */
  bulkInviteEmployees: async (data: BulkInviteData): Promise<ApiResponse<{ invited: number; failed: string[] }>> => {
    return api.post(`${COMPANY_BASE}/employees/bulk-invite`, data);
  },

  /**
   * Get all employees
   */
  getEmployees: async (): Promise<ApiResponse<Employee[]>> => {
    return api.get<Employee[]>(`${COMPANY_BASE}/employees`);
  },

  /**
   * Get employee statistics
   */
  getEmployeeStats: async (): Promise<ApiResponse<EmployeeStats>> => {
    return api.get<EmployeeStats>(`${COMPANY_BASE}/employees/stats`);
  },

  /**
   * Get employees by status
   */
  getEmployeesByStatus: async (status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): Promise<ApiResponse<Employee[]>> => {
    return api.get<Employee[]>(`${COMPANY_BASE}/employees/status/${status}`);
  },

  /**
   * Update an employee
   */
  updateEmployee: async (employeeId: string, data: UpdateEmployeeData): Promise<ApiResponse<Employee>> => {
    return api.put<Employee>(`${COMPANY_BASE}/employees/${employeeId}`, data);
  },

  /**
   * Delete/remove an employee
   */
  deleteEmployee: async (employeeId: string): Promise<ApiResponse> => {
    return api.delete(`${COMPANY_BASE}/employees/${employeeId}`);
  },

  /**
   * Resend invitation to an employee
   */
  resendInvitation: async (employeeId: string): Promise<ApiResponse> => {
    return api.post(`${COMPANY_BASE}/employees/${employeeId}/resend`);
  },
};

export default companyService;
