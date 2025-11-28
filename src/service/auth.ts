import { axiosInstance } from "../jwt";
import { AuthResponse } from "../types/user";

const login = (username: string, password: string): Promise<AuthResponse> =>
  axiosInstance
    .post("/auth/login", { username, password })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Login error:", err);
      throw err;
    });

const logout = () => {
  // Clear token, etc.
  return Promise.resolve();
};

const authService = {
  login,
  logout,
};

export default authService;
