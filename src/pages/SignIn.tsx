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
      setError("Iltimos, foydalanuvchi nomi va parolni kiriting");
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
          setError(
            "Noto'g'ri foydalanuvchi nomi yoki parol. Iltimos, qayta urinib ko'ring."
          );
        } else if (status === 400) {
          setError(
            errorMessage ||
              "Noto'g'ri so'rov. Iltimos, ma'lumotlaringizni tekshiring."
          );
        } else if (status === 403) {
          setError(
            "Kirish rad etildi. Iltimos, administratoringizga murojaat qiling."
          );
        } else if (status === 404) {
          setError("Xizmat topilmadi. Iltimos, keyinroq qayta urinib ko'ring.");
        } else if (status >= 500) {
          setError("Server xatosi. Iltimos, keyinroq qayta urinib ko'ring.");
        } else {
          setError(
            errorMessage ||
              "Kirish muvaffaqiyatsiz. Iltimos, qayta urinib ko'ring."
          );
        }
      } else if (err?.request) {
        // Network error - request was made but no response received
        setError(
          "Tarmoq xatosi. Iltimos, ulanishni tekshiring va qayta urinib ko'ring."
        );
      } else if (err?.message) {
        // Other error with message
        setError(err.message);
      } else {
        // Unknown error
        setError(
          "Kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
        );
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
              Hospital AI Dashboard'ga kirish
            </h1>

            <Input
              label="Foydalanuvchi nomi"
              type="text"
              placeholder="Foydalanuvchi nomingizni kiriting"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              label="Parol"
              type="password"
              placeholder="Parolingizni kiriting"
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
              {isLoading ? "Kirilmoqda..." : "Kirish"}
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
