import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
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

            <Button type="submit" fullWidth style={{ height: "48px" }}>
              Sign In
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
