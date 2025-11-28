import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import dashboardService from "../service/dashboard";

interface DashboardStats {
  total_patients?: number;
  surgeries_today?: number;
  high_risk_patients?: number;
  appointments_today?: number;
}

interface APIAlert {
  patient_id: number;
  patient_name: string;
  label: string;
  message: string;
  severity: "high" | "medium" | "low";
}

interface APITask {
  patient_id: number;
  patient_name: string;
  task: string;
  status: "pending" | "completed" | "overdue" | "in_progress";
}

interface DashboardData {
  total_patients?: number;
  surgeries_today?: number;
  high_risk_patients?: number;
  appointments_today?: number;
  alerts?: APIAlert[];
  tasks?: APITask[];
}

interface MappedAlert {
  patient: string;
  issue: string;
  risk: "error" | "warning";
  color: string;
}

interface MappedTask {
  icon: typeof CheckCircle;
  task: string;
  status: "success" | "warning" | "error" | "info";
}

const defaultStatsCards = [
  {
    icon: Users,
    title: "Total Patients",
    value: "0",
    color: "#2563EB",
    key: "total_patients",
  },
  {
    icon: Activity,
    title: "Surgeries Today",
    value: "0",
    color: "#0EA5E9",
    key: "surgeries_today",
  },
  {
    icon: AlertTriangle,
    title: "High-Risk Patients",
    value: "0",
    color: "#EF4444",
    key: "high_risk_patients",
  },
];

export const Dashboard: React.FC = () => {
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
        setError("Failed to load dashboard data. Please try again later.");
        // Set default data on error
        setDashboardData({
          total_patients: 0,
          surgeries_today: 0,
          high_risk_patients: 0,
          appointments_today: 0,
          alerts: [],
          tasks: [],
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

  // Map API alerts to component format
  const aiAlerts: MappedAlert[] = (dashboardData?.alerts || []).map((alert) => {
    const risk = alert.severity === "high" ? "error" : "warning";
    const color = alert.severity === "high" ? "#EF4444" : "#FACC15";
    return {
      patient: alert.patient_name,
      issue: alert.message,
      risk,
      color,
    };
  });

  // Map API tasks to component format
  const mappedCareTasks: MappedTask[] = (dashboardData?.tasks || []).map(
    (task) => {
      let status: "success" | "warning" | "error" | "info" = "warning";
      let Icon = Clock;

      if (task.status === "completed") {
        status = "success";
        Icon = CheckCircle;
      } else if (task.status === "overdue") {
        status = "error";
        Icon = XCircle;
      } else if (task.status === "in_progress") {
        status = "info";
        Icon = Activity;
      } else {
        // pending
        status = "warning";
        Icon = Clock;
      }

      return {
        icon: Icon,
        task: `${task.task} (${task.patient_name})`,
        status,
      };
    }
  );

  return (
    <MainLayout>
      <h1 style={{ marginBottom: "32px" }}>Dashboard</h1>

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
          <div className="grid grid-cols-3 gap-6 mb-8">
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

          {/* AI Alerts Panel */}
          <Card padding="16px" className="mb-8">
            <h3 className="mb-4 px-2" style={{ marginBottom: "20px" }}>
              AI Alerts
            </h3>
            {aiAlerts.length > 0 ? (
              <div className="flex flex-col gap-2">
                {aiAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors border-l-4"
                    style={{ borderLeftColor: alert.color }}
                  >
                    <div className="flex-1">
                      <div className="text-[#0F172A] mb-1">{alert.patient}</div>
                      <div className="text-[14px] text-[#475569]">
                        {alert.issue}
                      </div>
                    </div>
                    <Badge variant={alert.risk} size="sm">
                      {alert.risk === "error" ? "High Risk" : "Monitor"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#475569]">
                No AI alerts at this time
              </div>
            )}
          </Card>

          {/* Today's Care Tasks */}
          <Card padding="24px">
            <h3 className="mb-4">Today's Care Tasks</h3>
            {mappedCareTasks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {mappedCareTasks.map((task, index) => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors"
                    >
                      <Icon size={20} className="text-[#2563EB] shrink-0" />
                      <div className="flex-1 text-[#0F172A]">{task.task}</div>
                      <Badge variant={task.status} size="sm">
                        {task.status === "success"
                          ? "Done"
                          : task.status === "warning"
                          ? "Pending"
                          : task.status === "error"
                          ? "Overdue"
                          : "In Progress"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-[#475569]">
                No care tasks available
              </div>
            )}
          </Card>
        </>
      )}
    </MainLayout>
  );
};
