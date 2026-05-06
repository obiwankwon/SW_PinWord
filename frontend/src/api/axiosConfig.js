// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 기본 주소
});

// 편지를 보내기 전에 항상 금고(localStorage)를 뒤져서 방문증(토큰)이 있으면 붙여서 보내는 마법의 설정!
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;