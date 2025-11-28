import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthResponse } from "../types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "hospital_ai_auth";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
      } catch (error) {
        console.error("Error loading auth data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - replace with actual API call later
      // For now, create a mock user based on username
      const mockUser: User = {
        id: `user_${Date.now()}`,
        username: username,
        email: `${username}@hospital.com`,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: username === "admin" ? "admin" : "doctor",
        department: "General Medicine",
        permissions: username === "admin" ? ["all"] : ["read", "write"],
      };

      const authData: AuthResponse = {
        user: mockUser,
        token: `mock_token_${Date.now()}`,
      };

      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      setUser(mockUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      const storedAuth = localStorage.getItem(STORAGE_KEY);
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          authData.user = updatedUser;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
        } catch (error) {
          console.error("Error updating auth data:", error);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
