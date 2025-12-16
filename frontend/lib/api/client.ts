// lib/api/client.ts - UPDATED WITH BETTER LOGGING
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";


// Backend API runs on port 5000 by default (can be overridden with PORT env var or NEXT_PUBLIC_API_URL)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Increased timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          `🔑 API Request [${config.method?.toUpperCase()} ${
            config.url
          }]: Token attached`
        );
      } else {
        console.warn(
          `⚠️ API Request [${config.method?.toUpperCase()} ${
            config.url
          }]: No auth token`
        );
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - returns data directly
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ API Success [${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}]`
    );

    // Return the data property if it exists, otherwise return the full response
    return response.data;
  },
  (error) => {
    const status = error.response?.status || error.status;
    const url = error.config?.url || error.request?.responseURL || '';
    
    // Suppress 404 errors for backup endpoints (not yet implemented)
    // Browser network layer will still show these, but we won't log them as application errors
    const isBackup404 = status === 404 && (url.includes('/backups') || url.includes('backup'));
    
    // Suppress 403 errors for optional endpoints (employee-profile and payroll/runs with query params)
    const isOptionalEmployeeProfile = status === 403 && url.includes('/employee-profile') && 
      (url.includes('limit') || url.includes('?'));
    const isOptionalPayrollRuns = status === 403 && url.includes('/payroll/runs') && 
      (url.includes('limit') || url.includes('?'));
    
    if (isBackup404 || isOptionalEmployeeProfile || isOptionalPayrollRuns) {
      // Silently handle these errors - they're expected for optional features or unimplemented endpoints
      // Browser console will show the network error, but we don't treat it as an app error
      // Return a clean error that can be caught and handled gracefully
    } else {
      // Log other errors normally
      console.error(
        `❌ API Error [${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }]:`,
        {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          responseData: error.response?.data,
          headers: error.response?.headers,
        }
      );
    }

    // Handle errors
    if (error.response?.status === 401) {
      console.log("🔒 401 Unauthorized - Clearing auth tokens");
      // Clear token and redirect to login (client side only)
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }

    if (error.response?.status === 403) {
      // Check if this is an optional endpoint (already checked above, but check again for redirect logic)
      const isOptionalEndpoint = isOptionalEmployeeProfile || isOptionalPayrollRuns;
      
      if (!isOptionalEndpoint) {
        console.log("🚫 403 Forbidden - Insufficient permissions");
        console.log("Endpoint:", url);
        console.log("User role may not have access to this endpoint");
      }
      
      // Redirect to forbidden page instead of login
      // But only if we're not on a dashboard page (to avoid breaking dashboard functionality)
      // Don't redirect for optional endpoints - let the page handle it gracefully
      if (typeof window !== "undefined" && !isOptionalEndpoint) {
        const currentPath = window.location.pathname;
        // Only redirect if we're not already on the forbidden page or a dashboard page
        // Dashboard pages should handle 403 errors gracefully without redirecting
        if (!currentPath.includes("/forbidden") && !currentPath.includes("/dashboard")) {
          window.location.href = "/forbidden";
        }
      }
    }

    // Extract error message
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      `HTTP ${error.response?.status || "Unknown"} error`;

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
