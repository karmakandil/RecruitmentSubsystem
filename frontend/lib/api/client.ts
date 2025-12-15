// lib/api/client.ts
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
        console.log(
          `🔑 API Request [${config.method?.toUpperCase()} ${
            config.url
          }]: Token attached`,
        );
      } else {
        console.warn(
          `⚠️ API Request [${config.method?.toUpperCase()} ${
            config.url
          }]: No auth token`,
        );
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// ✅ Response interceptor – return data directly
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ API Success [${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}]`,
    );

    // Always return the `data` part
    return response.data;
  },
  (error) => {
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
      },
    );

    if (error.response?.status === 401) {
      console.log("🔒 401 Unauthorized - Clearing auth tokens");
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }

    if (error.response?.status === 403) {
      console.log("🚫 403 Forbidden - Insufficient permissions");
      console.log("Endpoint:", error.config?.url);
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      `HTTP ${error.response?.status || "Unknown"} error`;

    return Promise.reject(new Error(errorMessage));
  },
);

export default api;
