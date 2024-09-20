import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Chỉnh sửa URL này cho phù hợp với backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
