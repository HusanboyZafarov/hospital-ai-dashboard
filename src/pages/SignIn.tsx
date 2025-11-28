import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err: any) {
      // Handle different error types
      if (err?.response) {
        // API error response
        const status = err.response.status;
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          err.response.data?.detail;

        if (status === 401) {
          setError("Invalid username or password. Please try again.");
        } else if (status === 400) {
          setError(
            errorMessage || "Invalid request. Please check your credentials."
          );
        } else if (status === 403) {
          setError("Access denied. Please contact your administrator.");
        } else if (status === 404) {
          setError("Service not found. Please try again later.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(errorMessage || "Login failed. Please try again.");
        }
      } else if (err?.request) {
        // Network error - request was made but no response received
        setError("Network error. Please check your connection and try again.");
      } else if (err?.message) {
        // Other error with message
        setError(err.message);
      } else {
        // Unknown error
        setError("An unexpected error occurred. Please try again.");
      }

      console.error("Login error:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"
      style={{ width: "1440px", height: "900px", margin: "0 auto" }}
    >
      <div className="w-full max-w-[420px]">
        <Card padding="32px">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h1 className="text-center text-[#0F172A]">
              Sign in to Hospital AI Dashboard
            </h1>

            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="text-[#EF4444] text-[14px] text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              style={{ height: "48px" }}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-8 text-[#475569] text-[13px]">
          © Hospital AI System
        </div>
      </div>
    </div>
  );
};
