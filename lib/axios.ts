import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, APP_CONFIG } from "@/constants/config";
import { AppError } from "@/types/api";

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
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new AppError("Network error. Please check your connection.", "NETWORK_ERROR", 0)
      );
    }

    const { data, status } = error.response;
    const message = data?.message ?? "An unexpected error occurred.";
    const code = data?.code ?? "UNKNOWN_ERROR";
    const errors = data?.errors;

    return Promise.reject(new AppError(message, code, status, errors));
  }
);

export default axiosInstance;
