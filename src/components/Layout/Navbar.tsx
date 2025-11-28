import React from "react";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  const displayName = user?.name || user?.username || "User";

  return (
    <div
      className=" bg-white border-b border-[#E2E8F0] flex items-center justify-end px-12"
      style={{
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        height: "77px",
        position: "fixed",
        left: "260px",
        width: "calc(100% - 260px)",
        zIndex: "49",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
          <UserIcon size={20} className="text-[#2563EB]" />
        </div>
        <div className="text-right">
          <div className="text-[#0F172A]">{displayName}</div>
        </div>
      </div>
    </div>
  );
};
