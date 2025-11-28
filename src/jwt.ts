/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "./constants";
import qs from "qs";
import { saveAs } from "file-saver";

// Simple toast replacement to avoid circular dependency
const toast = {
  warning: (message: string) => console.warn("Warning:", message),
  error: (message: string) => console.error("Error:", message),
};

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  withoutRefresh?: boolean;
}

interface CustomAxiosInstance extends AxiosInstance {
  request<T = any>(config: CustomAxiosRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: CustomAxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<T>;
  delete<T = any>(url: string, config?: CustomAxiosRequestConfig): Promise<T>;
}

// Configuration interface for base URLs
interface ApiConfig {
  https: string;
  ws?: string;
}

class ApiService {
  private static instance: ApiService;
  private _baseConfig: ApiConfig = {
    https: baseUrl.https,
  };
  private _axiosInstance: CustomAxiosInstance;

  private constructor() {
    this._axiosInstance = axios.create({
      baseURL: this._baseConfig.https,
    });
    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public get axiosInstance(): CustomAxiosInstance {
    return this._axiosInstance;
  }

  public get baseConfig(): ApiConfig {
    return this._baseConfig;
  }

  public updateBaseUrl(newBaseUrl: string) {
    this._baseConfig.https = newBaseUrl;
    this._axiosInstance.defaults.baseURL = newBaseUrl;
  }

  private setupInterceptors() {
    let isRefreshing = false;
    let failedQueue: { reject: any; resolve: any }[] = [];

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    // Request interceptor: Attach token from localStorage to every request
    this._axiosInstance.interceptors.request.use(
      (config) => {
        // If Authorization header is not already set, get it from localStorage
        if (!config.headers.Authorization) {
          const accessToken = localStorage.getItem(ACCESS_TOKEN);
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this._axiosInstance.interceptors.response.use(
      (response) => {
        if (response.data.warnings) {
          response.data.warnings.forEach((w: string) => {
            toast.warning(w);
          });
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
          if (originalRequest.withoutRefresh) {
            return window.location.replace("#/unauthorized");
          }

          // Don't try to refresh if there's no refresh token (e.g., during login)
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);
          if (!refreshToken) {
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this._axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          return new Promise((resolve, reject) => {
            this.refreshTokenFn()
              .then((response) => {
                // Extract accessToken from response (can be string or object)
                const accessToken =
                  typeof response === "string"
                    ? response
                    : (response as { accessToken: string })?.accessToken;

                if (!accessToken) {
                  throw new Error("No access token in refresh response");
                }

                this._axiosInstance.defaults.headers.common["Authorization"] =
                  "Bearer " + accessToken;
                originalRequest.headers["Authorization"] =
                  "Bearer " + accessToken;
                processQueue(null, accessToken);
                resolve(this._axiosInstance(originalRequest));
              })
              .catch((err) => {
                processQueue(err, null);
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        }

        error?.response?.data?.errors?.forEach((err: string) => {
          toast.error(err);
        });
        return Promise.reject(error);
      }
    );
  }

  public async refreshTokenFn() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (!refreshToken) {
      console.error("No refresh token found in localStorage!");
      this.setSession({});
      throw new Error("No refresh token");
    }

    try {
      const { data: response } = await axios.post<{
        accessToken: string;
        refreshToken: string;
        user?: {
          id?: string;
          fullName?: string;
          phone_number?: string;
          phoneNumber?: string;
          role?: string;
          partnerId?: string;
          limit?: number;
        };
        partner?: {
          id?: string;
          fullName?: string;
          email?: string;
          subscriptionType?: string;
          credits?: number;
          licenseSeats?: number;
          licenseExpiresAt?: string;
        };
      }>(
        `${this._baseConfig.https}auth/refresh`,
        {
          refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      const {
        accessToken,
        refreshToken: nextRefreshToken,
        user,
        partner,
      } = response;

      this.setSession({
        accessToken,
        refreshToken: nextRefreshToken,
      });
      // Return full response with user, partner, and tokens
      return {
        user,
        partner,
        accessToken,
        refreshToken: nextRefreshToken,
      };
    } catch (error) {
      console.error("Refresh token failed:", error);
      throw error;
    }
  }

  public setSession({
    refreshToken,
    accessToken,
  }: {
    refreshToken?: string;
    accessToken?: string;
  }) {
    if (refreshToken && accessToken) {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
      this._axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem(ACCESS_TOKEN);
      delete this._axiosInstance.defaults.headers.common.Authorization;
    }
  }

  public isValidToken(accessToken: string | null) {
    if (!accessToken) {
      return false;
    }
    const decoded = jwtDecode<{ exp: number }>(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  }

  public async exportExcel(
    url: string,
    params?: any,
    filename = "file.xlsx",
    headers: Record<string, string> = {}
  ) {
    const query = params ? qs.stringify(params, { arrayFormat: "repeat" }) : "";
    try {
      const response = await fetch(
        `${this._baseConfig.https}${url}${query ? `?${query}` : ""}`,
        {
          headers: {
            ...headers,
            ...Object.fromEntries(
              Object.entries(this._axiosInstance.defaults.headers.common)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)])
            ),
          },
        }
      );

      if (!response.ok) {
        throw new Error();
      }
      const blob = await response.blob();

      // Download the file
      saveAs(blob, filename);
    } catch (error) {
      console.error("Failed to download file", error);
      throw new Error();
    }
  }
}

export const REFRESH_TOKEN = "refreshToken";
export const ACCESS_TOKEN = "accessToken";

const apiService = ApiService.getInstance();
export const axiosInstance = apiService.axiosInstance;
export const isValidToken = apiService.isValidToken.bind(apiService);
export const refreshTokenFn = apiService.refreshTokenFn.bind(apiService);
export const setSession = apiService.setSession.bind(apiService);
export const updateBaseUrl = apiService.updateBaseUrl.bind(apiService);
export const exportExcel = apiService.exportExcel.bind(apiService);
