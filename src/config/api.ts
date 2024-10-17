import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Chỉnh sửa URL này cho phù hợp với backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để thêm token vào mỗi yêu cầu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
