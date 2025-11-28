import { axiosInstance } from "../jwt";
import { AuthResponse, User } from "../types/user";

const login = (username: string, password: string): Promise<AuthResponse> =>
  axiosInstance
    .post(`/auth/login/`, { username, password })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Login error:", err);
      throw err;
    });

const getCurrentUser = (): Promise<User> =>
  axiosInstance
    .get(`/auth/me/`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get current user error:", err);
      throw err;
    });

const refreshToken = (
  refreshTokenValue?: string
): Promise<{ access: string; refresh: string; user?: User }> => {
  const refreshTokenToSend =
    refreshTokenValue || localStorage.getItem("refreshToken");

  if (!refreshTokenToSend) {
    return Promise.reject(new Error("No refresh token provided"));
  }

  return axiosInstance
    .post(`/auth/refresh/`, {
      refresh: refreshTokenToSend, // API expects "refresh" in body
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Refresh token error:", err);
      throw err;
    });
};

const logout = () => {
  // Clear token, etc.
  return Promise.resolve();
};

const authService = {
  login,
  getCurrentUser,
  refreshToken,
  logout,
};

export default authService;
