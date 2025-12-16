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

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
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

// Response interceptor - returns data directly
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

    // Handle specific status codes
    if (error.response?.status === 401) {
      console.log("Unauthorized - Clearing auth tokens");
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
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
