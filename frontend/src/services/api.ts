import axios from "axios";

// Clean base URL sanitization without regex syntax bugs
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const cleanBaseUrl = rawBaseUrl.replace(/\/+\(/, "").replace(/\/api\/v1\/?\)/, "");

export const api = axios.create({
  baseURL: `${cleanBaseUrl}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Direct network failure ya server unavailable (ERR_CONNECTION_REFUSED)
    if (!error.response) {
      const message =
        error.message === "Network Error"
          ? "Server inaccessible or connection refused"
          : error.message;
      const customError = new Error(message) as any;
      customError.status = 503;
      return Promise.reject(customError);
    }

    // Refresh, Login, Register, Logout routes par 401 retry skip karein
    const isAuthRoute =
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/logout");

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Explicitly pass credentials to ensure cookie is attached
        await api.post("/auth/refresh", {}, { withCredentials: true });
        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login")
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Backend error payload aur status code preserve karein
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    const customError = new Error(message) as any;
    customError.status = error.response?.status;
    customError.response = error.response;

    return Promise.reject(customError);
  }
);

export default api;