import Password from "antd/es/input/Password";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const authCheckClient = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/api/auth/login") ||
      originalRequest.url.includes("/api/auth/register") ||
      originalRequest.url.includes("/api/auth/verify") ||
      originalRequest.url.includes("/api/auth/resend-otp")
    ) {
      return Promise.reject(error);
    }

    // ⛔ Ignore refresh itself
    if (originalRequest.url.includes("/api/auth/refresh")) {
      return Promise.reject(error);
    }

    // ✅ Only try refresh on 401 + first time
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await apiClient.post("/api/auth/refresh");

        if (refreshResponse.status === 200) {
          return apiClient.request(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (credentials) => apiClient.post("/api/auth/login", credentials),
  signup: (userData) => apiClient.post("/api/auth/register", userData),
  verifyOtp: (data) => apiClient.post("/api/auth/verify", data),
  resendOtp: (data) => apiClient.post("/api/auth/resend-otp", data),
  googleLogin: (data) => apiClient.post("/api/auth/google-login", data),
  appleLogin: (data) => apiClient.post("/api/auth/apple-login", data),
  getCurrentUser: () => authCheckClient.get("/api/auth/me"),
  logout: () => apiClient.post("/api/auth/logout"),
  forgetPassword: (data) => apiClient.post("/api/auth/forgot-password", data),

  verifyForgotOtp: (data) =>
    apiClient.post("/api/auth/verify-forgot-otp", data),

  resetPassword: (data) => apiClient.post("/api/auth/reset-password", data),
};

export const paymentAPI = {
  createPaymentIntent: (data) =>
    apiClient.post("/api/payment/payment-intent", data),
  confirmPayment: (intentId) =>
    apiClient.get(`/api/payment/payment/${intentId}`),
  checkPaymentStatus: (intentId) =>
    apiClient.get(`/api/payment/payment-status/${intentId}`),
  refundPayment: (intentId, amount) =>
    apiClient.post(`/api/payment/refund/${intentId}`, { amount }),
};

export default apiClient;
