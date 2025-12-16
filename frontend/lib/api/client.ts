import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// 🔐 Request interceptor – attach JWT if present
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      // Try multiple common keys so we don't depend on one name
      const token =
        localStorage.getItem("auth_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt");

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor – return data directly
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the data property if it exists, otherwise return the full response
    return response.data;
  },
  (error) => {
    // Log detailed error information
    console.error("API Error:", {
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        responseData: error.response?.data,
        headers: error.response?.headers,
        requestData: error.config?.data, // ADDED TO SEE WHAT WAS SENT
      },
    });

    if (error.response?.status === 401) {
      console.log("🔒 401 Unauthorized - Token may be invalid");
      
      // Only redirect if we're not already on the login page and it's not a network error
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.startsWith("/auth/login");
        const isNetworkError = !error.response; // Network errors don't have response
        
        // Don't redirect if already on login page or if it's a network error
        if (!isLoginPage && !isNetworkError) {
          // Check if token exists - if not, might be a temporary issue
          const token = localStorage.getItem("auth_token");
          
          if (token) {
            // Token exists but got 401 - likely expired or invalid
            console.log("Token exists but unauthorized - clearing and redirecting");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("token");
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
            
            // Use router if available, otherwise use window.location
            // Add a small delay to prevent redirect loops
            setTimeout(() => {
              window.location.href = "/auth/login";
            }, 100);
          } else {
            // No token - might be a temporary API issue, don't redirect aggressively
            console.log("No token found - might be temporary issue, not redirecting");
          }
        }
      }
    }

    if (error.response?.status === 403) {
      console.log("Forbidden - Insufficient permissions");
    }

    // Extract error message
    let errorMessage = "An error occurred";

    if (error.response?.data) {
      const data = error.response.data;

      if (typeof data === "string") {
        errorMessage = data;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (Array.isArray(data.errors)) {
        errorMessage = data.errors.join(", ");
      } else {
        try {
          errorMessage = JSON.stringify(data);
        } catch (e) {
          errorMessage = "Error parsing response";
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Add status code if available
    if (error.response?.status) {
      errorMessage = `HTTP ${error.response.status}: ${errorMessage}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
