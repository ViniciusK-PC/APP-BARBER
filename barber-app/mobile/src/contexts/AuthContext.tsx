import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedUser = await AsyncStorage.getItem('@barber:user');
      const storedToken = await AsyncStorage.getItem('@barber:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      await AsyncStorage.setItem('@barber:user', JSON.stringify(user));
      await AsyncStorage.setItem('@barber:token', token);

      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  }

  async function signUp(name: string, email: string, password: string, phone?: string) {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
      });
      const { user, token } = response.data;

      await AsyncStorage.setItem('@barber:user', JSON.stringify(user));
      await AsyncStorage.setItem('@barber:token', token);

      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao criar conta');
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@barber:user');
    await AsyncStorage.removeItem('@barber:token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
