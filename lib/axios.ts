import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, APP_CONFIG } from "@/constants/config";
import { AppError } from "@/types/api";

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((entry) =>
    error ? entry.reject(error) : entry.resolve(token!)
  );
  failedQueue = [];
};

const clearAuthAndRedirect = () => {
  Cookies.remove(APP_CONFIG.accessTokenCookieName);
  Cookies.remove(APP_CONFIG.refreshTokenCookieName);
  if (typeof window !== "undefined") {
    window.location.href = "/auth/sign-in";
  }
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get(APP_CONFIG.accessTokenCookieName);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest;
    const status = error.response?.status;

    // Don't retry refresh or auth endpoints
    const isAuthEndpoint = originalRequest?.url?.match(/auth\/(signin|register|refresh-token|logout)/);

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = Cookies.get(APP_CONFIG.refreshTokenCookieName);

      if (!storedRefreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refresh_token: storedRefreshToken }
        );
        const { access_token, refresh_token: newRefreshToken } = data.data;

        Cookies.set(APP_CONFIG.accessTokenCookieName, access_token, { sameSite: "lax" });
        Cookies.set(APP_CONFIG.refreshTokenCookieName, newRefreshToken, { sameSite: "lax" });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response) {
      return Promise.reject(
        new AppError("Network error. Please check your connection.", "NETWORK_ERROR", 0)
      );
    }

    const { data, status: errStatus } = error.response;
    const message = data?.message ?? "An unexpected error occurred.";
    const code = data?.code ?? "UNKNOWN_ERROR";
    const errors = data?.errors;

    return Promise.reject(new AppError(message, code, errStatus, errors));
  }
);

export default axiosInstance;
