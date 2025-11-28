export interface User {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: "admin" | "doctor" | "nurse" | "staff";
  avatar?: string;
  department?: string;
  permissions?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
