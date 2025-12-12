// lib/api/client.ts - UPDATED WITH BETTER LOGGING
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// CHANGED - Fixed port to match backend (5000)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// CHANGED - Debug: Log the API base URL on load
console.log("🔧 API_BASE_URL configured as:", API_BASE_URL);

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
    console.log('✅ API Response data:', response.data);

    // Return the data property if it exists, otherwise return the full response
    return response.data;
  },
  (error) => {
    // CHANGED - Suppress console errors for expected 404s (e.g., offer not found)
    // 404 errors are often expected in this app (e.g., checking if offer exists)
    const is404 = error.response?.status === 404;
    const isExpected404 = error.config?.url?.includes('/offer/application/') || 
                          error.config?.url?.includes('/onboarding/employee/');
    
    // Only log errors that aren't expected 404s
    if (!is404 || !isExpected404) {
      // CHANGED - Enhanced error logging for debugging
      const errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        responseData: error.response?.data,
        requestData: error.config?.data,
        requestUrl: error.config?.url,
        requestMethod: error.config?.method,
        headers: error.response?.headers,
        // CHANGED - Additional debug info
        fullURL: error.config?.baseURL + error.config?.url,
        errorCode: error.code,
        errorName: error.name,
        isAxiosError: error.isAxiosError,
        hasResponse: !!error.response,
      };
      
      console.error(
        `❌ API Error [${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }]:`,
        errorDetails
      );
      
      // CHANGED - Log the full error object for debugging
      if (!error.response) {
        console.error('⚠️ No response received - possible network error:', error);
      } else {
        console.error('📋 Full error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
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
      console.log("🚫 403 Forbidden - Insufficient permissions");
      console.log("Endpoint:", error.config?.url);
      console.log("User role may not have access to this endpoint");
    }

    // CHANGED - Extract error message with better handling for validation errors
    let errorMessage = "An error occurred";
    
    const responseData = error.response?.data;
    if (responseData) {
      // Handle NestJS validation errors (array of messages)
      if (Array.isArray(responseData.message)) {
        errorMessage = responseData.message.join(", ");
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else {
        errorMessage = JSON.stringify(responseData);
      }
    } else if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = `HTTP ${error.response?.status || "Unknown"} error`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
