import React from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Bell,
  Shield,
  Mail,
  Calendar,
  AlertCircle,
} from "lucide-react";

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/signin");
    }
  };

  return (
    <MainLayout>
      <h1 className="mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Account Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-[#2563EB]" />
            <h2>Account Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[#475569] text-[14px] mb-1">Username</div>
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
                <div className="text-[#475569] text-[14px] mb-1">Name</div>
                <div className="text-[#0F172A] font-medium">{user.name}</div>
              </div>
            )}
            <div>
              <div className="text-[#475569] text-[14px] mb-1">Role</div>
              <Badge variant="info" className="mt-1">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "N/A"}
              </Badge>
            </div>
            {user?.id && (
              <div>
                <div className="text-[#475569] text-[14px] mb-1">User ID</div>
                <div className="text-[#0F172A] font-medium">#{user.id}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Shield size={20} className="text-[#2563EB]" />
            <h2>Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[#0F172A] font-medium mb-1">
                  Change Password
                </div>
                <div className="text-[#475569] text-[14px]">
                  Update your password to keep your account secure
                </div>
              </div>
              <Button variant="outline">Change</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[#0F172A] font-medium mb-1">
                  Two-Factor Authentication
                </div>
                <div className="text-[#475569] text-[14px]">
                  Add an extra layer of security to your account
                </div>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Bell size={20} className="text-[#2563EB]" />
            <h2>Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[#0F172A] font-medium mb-1">
                  Email Notifications
                </div>
                <div className="text-[#475569] text-[14px]">
                  Receive email updates about patient alerts and tasks
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-[#E2E8F0] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2563EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[#0F172A] font-medium mb-1">
                  Push Notifications
                </div>
                <div className="text-[#475569] text-[14px]">
                  Get notified about urgent patient alerts
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-[#E2E8F0] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2563EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[#0F172A] font-medium mb-1">
                  AI Alert Notifications
                </div>
                <div className="text-[#475569] text-[14px]">
                  Receive notifications for AI-generated alerts and suggestions
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-[#E2E8F0] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2563EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle size={20} className="text-[#EF4444]" />
            <h2 className="text-[#EF4444]">Danger Zone</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#991B1B] font-medium mb-1">Logout</div>
                  <div className="text-[#DC2626] text-[14px]">
                    Sign out of your account
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-[#EF4444] text-[#EF4444] hover:bg-[#FEE2E2]"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
