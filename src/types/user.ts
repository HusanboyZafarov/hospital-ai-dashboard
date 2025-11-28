export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string; // Optional, may not be in API response
  role: string; // API returns "hospital" or other roles
  avatar?: string;
  department?: string;
  permissions?: string[];
}

export interface AuthResponse {
  user: User;
  access: string; // API returns "access" token
  refresh: string; // API returns "refresh" token
  // Legacy support
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}
