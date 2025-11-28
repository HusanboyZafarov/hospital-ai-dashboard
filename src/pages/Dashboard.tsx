import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import dashboardService from "../service/dashboard";

interface RecentPatient {
  id: number;
  full_name: string;
  status: string;
  surgery_name: string;
  priority_level: "high" | "medium" | "low";
  admitted_at: string;
}

interface DashboardData {
  total_patients?: number;
  recovery_patients?: number;
  discharged_patients?: number;
  high_priority_patients?: number;
  recent_patients?: RecentPatient[];
}

const defaultStatsCards = [
  {
    icon: Users,
    title: "Jami bemorlar",
    value: "0",
    color: "#2563EB",
    key: "total_patients",
  },
  {
    icon: Activity,
    title: "Tiklanishda",
    value: "0",
    color: "#22C55E",
    key: "recovery_patients",
  },
  {
    icon: CheckCircle,
    title: "Chiqarilgan",
    value: "0",
    color: "#10B981",
    key: "discharged_patients",
  },
  {
    icon: AlertTriangle,
    title: "Yuqori prioritetli bemorlar",
    value: "0",
    color: "#EF4444",
    key: "high_priority_patients",
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getDashboard();
        setDashboardData(data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          "Boshqaruv paneli ma'lumotlarini yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."
        );
        // Set default data on error
        setDashboardData({
          total_patients: 0,
          recovery_patients: 0,
          discharged_patients: 0,
          high_priority_patients: 0,
          recent_patients: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Map API data to component format
  const statsCards = defaultStatsCards.map((card) => {
    const value = dashboardData?.[card.key as keyof DashboardData] ?? 0;
    return {
      ...card,
      value: value.toString(),
    };
  });

  // Helper function to get status display
  const getStatusDisplay = (status: string): string => {
    const statusMap: Record<string, string> = {
      in_recovery: "Tiklanishda",
      discharged: "Chiqarilgan",
    };
    return statusMap[status] || status;
  };

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    if (status === "discharged") return "success";
    if (status === "in_recovery") return "info";
    return "neutral";
  };

  // Helper function to get priority badge variant
  const getPriorityBadgeVariant = (
    priority: string
  ): "success" | "warning" | "error" => {
    if (priority === "high") return "error";
    if (priority === "medium") return "warning";
    return "success";
  };

  // Helper function to get priority display
  const getPriorityDisplay = (priority: string): string => {
    const priorityMap: Record<string, string> = {
      high: "Yuqori",
      medium: "O'rta",
      low: "Past",
    };
    return priorityMap[priority] || priority;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Filter recent patients to only show discharged and in_recovery
  const filteredRecentPatients = (dashboardData?.recent_patients || []).filter(
    (patient) =>
      patient.status === "discharged" || patient.status === "in_recovery"
  );

  return (
    <MainLayout>
      <h1 style={{ marginBottom: "32px" }}>Boshqaruv paneli</h1>

      {error && (
        <div className="mb-4 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-[#DC2626]">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-[#2563EB] animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} padding="24px" className="h-[140px]">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <Icon size={20} style={{ color: stat.color }} />
                      </div>
                      <div className="text-[14px] text-[#475569]">
                        {stat.title}
                      </div>
                    </div>
                    <div className="text-[32px] font-bold text-[#0F172A]">
                      {stat.value}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Recent Patients */}
          <Card padding="24px">
            <h3 className="mb-4">So'nggi bemorlar</h3>
            {filteredRecentPatients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="text-left px-6 py-4 text-[#475569]">
                        Bemor ismi
                      </th>
                      <th className="text-left px-6 py-4 text-[#475569]">
                        Jarrohlik
                      </th>
                      <th className="text-left px-6 py-4 text-[#475569]">
                        Prioritet
                      </th>
                      <th className="text-left px-6 py-4 text-[#475569]">
                        Holat
                      </th>
                      <th className="text-left px-6 py-4 text-[#475569]">
                        Qabul qilingan sana
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecentPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                      >
                        <td className="px-6 py-4 text-[#0F172A] font-medium">
                          {patient.full_name}
                        </td>
                        <td className="px-6 py-4 text-[#475569]">
                          {patient.surgery_name || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={getPriorityBadgeVariant(
                              patient.priority_level
                            )}
                          >
                            {getPriorityDisplay(patient.priority_level)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={getStatusBadgeVariant(patient.status)}
                          >
                            {getStatusDisplay(patient.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-[#475569]">
                          {formatDate(patient.admitted_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-[#475569]">
                So'nggi bemorlar mavjud emas
              </div>
            )}
          </Card>
        </>
      )}
    </MainLayout>
  );
};
