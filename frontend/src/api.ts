// src/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://job-tracker-production-94bb.up.railway.app/docs',
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
