import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthResponse } from "../types/user";
import authService from "../service/auth";
import { setSession, ACCESS_TOKEN } from "../jwt";

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

  // Load user from localStorage on mount and verify token
  useEffect(() => {
    const loadUser = async () => {
      const storedAuth = localStorage.getItem(STORAGE_KEY);
      const accessToken = localStorage.getItem(ACCESS_TOKEN);

      if (storedAuth && accessToken) {
        try {
          const authData = JSON.parse(storedAuth);
          // Try to fetch current user from API to verify token
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            // Update stored user data
            authData.user = currentUser;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
          } catch (error) {
            // If API call fails, use stored user
            setUser(authData.user);
          }
        } catch (error) {
          console.error("Error loading auth data:", error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Call API login
      const response: AuthResponse = await authService.login(
        username,
        password
      );

      // Extract tokens - API returns "access" and "refresh"
      const accessToken =
        response.access || response.accessToken || response.token;
      const refreshToken = response.refresh || response.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response: missing tokens");
      }

      // Save tokens using jwt setSession
      setSession({
        accessToken,
        refreshToken,
      });

      // Use user from login response (API returns user directly)
      const userData: User = {
        ...response.user,
        name: response.user.name || response.user.username, // Fallback to username if name not provided
      };

      // Store auth data in localStorage
      const authData: AuthResponse = {
        user: userData,
        access: accessToken,
        refresh: refreshToken,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear tokens
    setSession({});
    // Clear stored auth data
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
