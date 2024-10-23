import axios from "axios";
import eventBus from "../utils/eventBus"; // Import Event Bus

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request: Thêm token vào mỗi yêu cầu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response: Tự động logout nếu gặp lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      eventBus.emit("logout"); // Kích hoạt sự kiện logout qua Event Bus

      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

      // Chuyển hướng người dùng về trang đăng nhập
      window.location.href = "/login"; // Dùng window.location để điều hướng
    }
    return Promise.reject(error); // Trả về lỗi nếu không phải 401
  }
);

export default api;
