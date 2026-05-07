
import axios from 'axios';
const DEPLOYED = 'https://pear-poised-hen.cyclic.app/';
const LOCALHOST = 'http://localhost:5454';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || LOCALHOST;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.defaults.headers.post['Content-Type'] = 'application/json';

export default api;
