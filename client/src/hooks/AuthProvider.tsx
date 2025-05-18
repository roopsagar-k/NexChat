import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types/types";
import axios from "axios";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>; // Added this function
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {}, // Added this function
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

      // Log the user data for debugging
      console.log("Fetched user data:", data.data.user);

      if (data.data.user) {
        setUser(data.data.user);
        setError(null);
      } else {
        console.warn("No user data returned from /api/auth/me");
        setUser(null);
      }
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

  // Public method to refresh user data
  const refreshUser = async () => {
    return getUser();
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);

      // Fetch the user data after successful login
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
    console.log("Performing initial auth check...");
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
