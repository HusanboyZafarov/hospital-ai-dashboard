import React from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Shield } from "lucide-react";

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Hisobingizdan chiqishni tasdiqlaysizmi?")) {
      logout();
      navigate("/signin");
    }
  };

  return (
    <MainLayout>
      <h1 className="mb-8">Sozlamalar</h1>

      <div className="space-y-6">
        {/* Account Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-[#2563EB]" />
            <h2>Hisob ma'lumotlari</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[#475569] text-[14px] mb-1">
                Foydalanuvchi nomi
              </div>
              <div className="text-[#0F172A] font-medium">
                {user?.username || "N/A"}
              </div>
            </div>
            {user?.email && (
              <div>
                <div className="text-[#475569] text-[14px] mb-1">Email</div>
                <div className="text-[#0F172A] font-medium">{user.email}</div>
              </div>
            )}
            {user?.name && (
              <div>
                <div className="text-[#475569] text-[14px] mb-1">Ism</div>
                <div className="text-[#0F172A] font-medium">{user.name}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Shield size={20} className="text-[#2563EB]" />
            <h2>Xavfsizlik</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[#0F172A] font-medium mb-1">
                  Parolni o'zgartirish
                </div>
                <div className="text-[#475569] text-[14px]">
                  Hisobingizni xavfsiz saqlash uchun parolingizni yangilang
                </div>
              </div>
              <Button variant="outline">O'zgartirish</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2]">
              <div>
                <div className="text-[#991B1B] font-medium mb-1">Chiqish</div>
                <div className="text-[#DC2626] text-[14px]">
                  Hisobingizdan chiqish
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-[#EF4444] text-[#EF4444] hover:bg-[#FEE2E2]"
              >
                <LogOut size={16} className="inline mr-2" />
                Chiqish
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
