import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/jwt";

const getTokens = () => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN),
  refreshToken: localStorage.getItem(REFRESH_TOKEN),
});

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};

const updateTokens = {
  accessToken: (accessToken: string) =>
    localStorage.setItem(ACCESS_TOKEN, accessToken),
  refreshToken: (refreshToken: string) =>
    localStorage.setItem(REFRESH_TOKEN, refreshToken),
};

const setTokens = {
  accessToken: (accessToken: string) =>
    localStorage.setItem(ACCESS_TOKEN, accessToken),
  refreshToken: (refreshToken: string) =>
    localStorage.setItem(REFRESH_TOKEN, refreshToken),
};

const tokenService = {
  getTokens,
  clearTokens,
  updateTokens,
  setTokens,
};

export default tokenService;
