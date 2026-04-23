import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL - Render
const API_URL = 'https://app-barber-jina.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos (Render pode demorar na primeira requisição)
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@barber:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
