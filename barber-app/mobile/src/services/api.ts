import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IP da sua máquina - MUDE SE NECESSÁRIO
const API_URL = 'http://10.0.0.100:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
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
