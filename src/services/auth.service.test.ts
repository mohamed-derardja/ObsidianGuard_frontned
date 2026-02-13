import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authService, User, ApiError } from "./auth.service";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("authService", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockUser: User = {
    id: "123",
    email: "test@example.com",
    role: "USER",
    verified: true,
  };

  describe("register", () => {
    it("should register a new user successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Registration successful",
            data: mockUser,
          }),
      });

      const result = await authService.register({
        email: "test@example.com",
        password: "Password123!",
        role: "USER",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/register"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            password: "Password123!",
            role: "user",
          }),
        })
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it("should handle registration error for existing email", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () =>
          Promise.resolve({
            success: false,
            error: {
              status: 409,
              message: "Email is already registered",
            },
          }),
      });

      await expect(
        authService.register({
          email: "existing@example.com",
          password: "Password123!",
          role: "USER",
        })
      ).rejects.toThrow("Email is already registered");
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Login successful",
          }),
      });

      const result = await authService.login({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            password: "Password123!",
          }),
        })
      );
      expect(result.success).toBe(true);
    });

    it("should handle invalid credentials", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            success: false,
            error: {
              status: 401,
              message: "Invalid credentials",
            },
          }),
      });

      await expect(
        authService.login({
          email: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should handle unverified email", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            success: false,
            error: {
              status: 401,
              message: "Email is not verified",
            },
          }),
      });

      await expect(
        authService.login({
          email: "unverified@example.com",
          password: "Password123!",
        })
      ).rejects.toThrow("Email is not verified");
    });
  });

  describe("loginGoogle", () => {
    it("should login with Google successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Login successful",
          }),
      });

      const result = await authService.loginGoogle({
        token: "google-oauth-token",
        role: "USER",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/login-google"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            token: "google-oauth-token",
            role: "USER",
          }),
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("verifyEmail", () => {
    it("should verify email successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Email verified",
            data: { ...mockUser, verified: true },
          }),
      });

      const result = await authService.verifyEmail({
        email: "test@example.com",
        code: "123456",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/verify-email"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            code: "123456",
          }),
        })
      );
      expect(result.success).toBe(true);
    });

    it("should handle invalid verification code", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            success: false,
            error: {
              status: 400,
              message: "Invalid verification code",
            },
          }),
      });

      await expect(
        authService.verifyEmail({
          email: "test@example.com",
          code: "wrong",
        })
      ).rejects.toThrow("Invalid verification code");
    });
  });

  describe("forgotPassword", () => {
    it("should send forgot password email", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Password reset email sent",
          }),
      });

      const result = await authService.forgotPassword({
        email: "test@example.com",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/forgot-password"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "test@example.com" }),
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("verifyResetCode", () => {
    it("should verify reset code successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Reset code verified",
          }),
      });

      const result = await authService.verifyResetCode({
        email: "test@example.com",
        code: "123456",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/verify-reset-code"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            code: "123456",
          }),
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("resetPassword", () => {
    it("should reset password successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Password reset successful",
            data: mockUser,
          }),
      });

      const result = await authService.resetPassword({
        newPassword: "NewPassword123!",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/reset-password"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ newPassword: "NewPassword123!" }),
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("refreshToken", () => {
    it("should refresh token successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Token refreshed",
          }),
      });

      const result = await authService.refreshToken();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/refresh-token"),
        expect.objectContaining({ method: "POST" })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Logout successful",
          }),
      });

      const result = await authService.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/logout"),
        expect.objectContaining({ method: "POST" })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Password changed",
            data: mockUser,
          }),
      });

      const result = await authService.changePassword({
        oldPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/change-password"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            oldPassword: "OldPassword123!",
            newPassword: "NewPassword123!",
          }),
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockUser,
          }),
      });

      const result = await authService.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/v1/me"),
        expect.objectContaining({ method: "GET" })
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it("should handle unauthorized access", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            success: false,
            error: {
              status: 401,
              message: "Unauthorized",
            },
          }),
      });

      await expect(authService.getCurrentUser()).rejects.toThrow("Unauthorized");
    });
  });
});
