import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, type User } from "./api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  register(data: { name: string; email: string; phone: string; password: string }): Promise<void>;
  logout(): void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("barbe_token")) {
      setLoading(false);
      return;
    }
    api<{ user: User }>("/auth/me")
      .then((result) => setUser(result.user))
      .catch(() => localStorage.removeItem("barbe_token"))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(email, password) {
      const result = await api<{ token: string; user: User }>("/auth/login", {
        method: "POST", body: JSON.stringify({ email, password })
      });
      localStorage.setItem("barbe_token", result.token);
      setUser(result.user);
    },
    async register(data) {
      const result = await api<{ token: string; user: User }>("/auth/register", {
        method: "POST", body: JSON.stringify(data)
      });
      localStorage.setItem("barbe_token", result.token);
      setUser(result.user);
    },
    logout() {
      localStorage.removeItem("barbe_token");
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
}
