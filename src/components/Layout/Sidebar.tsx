import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Activity, Bot, Settings } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Boshqaruv paneli", path: "/dashboard" },
  { icon: Users, label: "Bemorlar", path: "/patients" },
  { icon: Activity, label: "Jarrohlik", path: "/surgeries" },
  { icon: Bot, label: "AI Yordamchisi", path: "/ai-assistant" },
  { icon: Settings, label: "Sozlamalar", path: "/settings" },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-[#E2E8F0] flex flex-col">
      <div className="p-6 border-b border-[#E2E8F0]">
        <h2 className="text-[#2563EB]">Hospital AI</h2>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-left border-none cursor-pointer ${
                isActive
                  ? "bg-[#EFF6FF] text-[#2563EB] border-r-2 border-[#2563EB]"
                  : "text-[#475569] hover:bg-[#F8FAFC]"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
