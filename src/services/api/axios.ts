
import { BASE_URL } from "@/utils/constant/constant";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenManager } from "@/lib/tokenManager";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedRequestsQueue = [];
};

// Updated Redirect Function with Reset Password Exception
const handleUnauthorizedRedirect = () => {
  // Check if current path is for Reset Password (/rp/:uid/:token)
  const isResetPasswordPath = window.location.pathname.startsWith("/rp/");

  if (isResetPasswordPath) {
    console.log("Reset password path detected. Skipping 401 redirect.");
    return;
  }

  tokenManager.clearAccessToken();
  window.dispatchEvent(new Event("auth:logout"));

  const loginPath = "/";

  if (window.location.pathname !== loginPath) {
    console.log("Redirecting to:", loginPath);
    window.location.href = loginPath;
  }
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      originalRequest.url?.includes("/api/users/token/refresh/") &&
      error.response?.status === 401
    ) {
      handleUnauthorizedRedirect();
      return Promise.reject(error);
    }

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Direct call to avoid interceptor loop
      const response = await axios.post(
        `${BASE_URL}/api/users/token/refresh/`,
        {},
        { withCredentials: true }
      );
      const newAccessToken = response.data.access;

      tokenManager.setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError, null);
      handleUnauthorizedRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
