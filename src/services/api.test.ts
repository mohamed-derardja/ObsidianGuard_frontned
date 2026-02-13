import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api, apiRequest, ApiError, ApiResponse } from "./api";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("api", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("apiRequest", () => {
    it("should make a successful GET request", async () => {
      const mockResponse: ApiResponse = {
        success: true,
        data: { id: 1, name: "Test" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiRequest("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw ApiError on failed response", async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          status: 400,
          message: "Bad Request",
        },
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockErrorResponse),
      });

      await expect(apiRequest("/test")).rejects.toThrow(ApiError);
      await expect(apiRequest("/test")).rejects.toThrow("Bad Request");
    });

    it("should throw ApiError when success is false", async () => {
      const mockErrorResponse = {
        success: false,
        message: "Operation failed",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockErrorResponse),
      });

      await expect(apiRequest("/test")).rejects.toThrow("Operation failed");
    });

    it("should include custom headers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await apiRequest("/test", {
        headers: { "X-Custom-Header": "custom-value" },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": "custom-value",
          },
        })
      );
    });
  });

  describe("api.get", () => {
    it("should make GET request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      await api.get("/users");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users"),
        expect.objectContaining({ method: "GET" })
      );
    });
  });

  describe("api.post", () => {
    it("should make POST request with body", async () => {
      const body = { email: "test@example.com", password: "password123" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await api.post("/login", body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
        })
      );
    });

    it("should make POST request without body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await api.post("/logout");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/logout"),
        expect.objectContaining({
          method: "POST",
          body: undefined,
        })
      );
    });
  });

  describe("api.put", () => {
    it("should make PUT request with body", async () => {
      const body = { name: "Updated Name" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await api.put("/users/1", body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe("api.patch", () => {
    it("should make PATCH request with body", async () => {
      const body = { status: "active" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await api.patch("/users/1", body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/1"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe("api.delete", () => {
    it("should make DELETE request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await api.delete("/users/1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/1"),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  describe("ApiError", () => {
    it("should create error with message and status", () => {
      const error = new ApiError("Not Found", 404);

      expect(error.message).toBe("Not Found");
      expect(error.status).toBe(404);
      expect(error.name).toBe("ApiError");
      expect(error instanceof Error).toBe(true);
    });
  });
});
