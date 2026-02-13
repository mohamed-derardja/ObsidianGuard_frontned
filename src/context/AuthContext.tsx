import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService, User, ApiError } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string, role: 'USER' | 'ENTERPRISE') => Promise<void>;
  register: (email: string, password: string, role: 'USER' | 'ENTERPRISE') => Promise<{ email: string }>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyResetCode: (email: string, code: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        // Store account type for routing
        localStorage.setItem('accountType', response.data.role === 'ENTERPRISE' ? 'enterprise' : 'user');
      }
    } catch {
      setUser(null);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        await refreshUser();
      } catch {
        // Try to refresh token
        try {
          await authService.refreshToken();
          await refreshUser();
        } catch {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success) {
      await refreshUser();
    }
  };

  const loginWithGoogle = async (token: string, role: 'USER' | 'ENTERPRISE') => {
    const response = await authService.loginGoogle({ token, role });
    if (response.success) {
      await refreshUser();
    }
  };

  const register = async (email: string, password: string, role: 'USER' | 'ENTERPRISE') => {
    const response = await authService.register({ email, password, role });
    if (response.success && response.data) {
      return { email: response.data.email };
    }
    throw new ApiError('Registration failed', 500);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('accountType');
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    await authService.verifyEmail({ email, code });
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword({ email });
  };

  const verifyResetCode = async (email: string, code: string) => {
    await authService.verifyResetCode({ email, code });
  };

  const resetPassword = async (newPassword: string) => {
    await authService.resetPassword({ newPassword });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
