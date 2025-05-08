import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types/types";
import axios from "axios";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      const { data } = response;
      setUser(data.data.user);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Auth error:", error.response?.data || error.message);
        setError(error.message);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      await getUser(); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data || error.message);
        setError(error.response?.data?.message || error.message);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout error:", error.response?.data || error.message);
      }
    }
  };

  // Initial auth check
  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn("useAuth should be used with AuthContext Provider");
  }
  return context;
};
