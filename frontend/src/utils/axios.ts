import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface ApiError {
  message: string;
  statusCode: number;
}

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // ⚡ DO NOT set Content-Type here → axios will auto detect it.
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: AxiosError<ApiError>): string => {
  if (error.response) {
    return error.response.data?.message || "An error occurred.";
  }
  if (error.request) {
    return "Network error. Please check your connection.";
  }
  return error.message || "An unexpected error occurred.";
};

export default axiosInstance;
