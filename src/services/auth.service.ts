// Authentication service - API calls for auth routes

import { api, ApiResponse, ApiError } from './api';

// Types
export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ENTERPRISE';
  verified: boolean;
  provider?: string;
  createdAt?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'USER' | 'ENTERPRISE';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface GoogleLoginData {
  token: string;
  role: 'USER' | 'ENTERPRISE';
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyResetCodeData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  newPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

// Auth endpoints
const AUTH_BASE = '/api/auth/v1';

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    return api.post<User>(`${AUTH_BASE}/register`, data);
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginData): Promise<ApiResponse> => {
    return api.post(`${AUTH_BASE}/login`, data);
  },

  /**
   * Login with Google OAuth token
   */
  loginGoogle: async (data: GoogleLoginData): Promise<ApiResponse> => {
    return api.post(`${AUTH_BASE}/login-google`, data);
  },

  /**
   * Verify email with code
   */
  verifyEmail: async (data: VerifyEmailData): Promise<ApiResponse<User>> => {
    return api.post<User>(`${AUTH_BASE}/verify-email`, data);
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (data: ForgotPasswordData): Promise<ApiResponse> => {
    return api.post(`${AUTH_BASE}/forgot-password`, data);
  },

  /**
   * Verify reset code
   */
  verifyResetCode: async (data: VerifyResetCodeData): Promise<ApiResponse> => {
    return api.post(`${AUTH_BASE}/verify-reset-code`, data);
  },

  /**
   * Reset password with new password
   */
  resetPassword: async (data: ResetPasswordData): Promise<ApiResponse<User>> => {
    return api.post<User>(`${AUTH_BASE}/reset-password`, data);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<ApiResponse> => {
    return api.post(`${AUTH_BASE}/refresh-token`);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse> => {
    return api.post(`${AUTH_BASE}/logout`);
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<User>> => {
    return api.post<User>(`${AUTH_BASE}/change-password`, data);
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return api.get<User>(`${AUTH_BASE}/me`);
  },
};

export { ApiError };
export default authService;
