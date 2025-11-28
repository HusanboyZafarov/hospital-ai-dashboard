import React from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Users,
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const statsCards = [
  { icon: Users, title: "Total Patients", value: "247", color: "#2563EB" },
  { icon: Activity, title: "Surgeries Today", value: "12", color: "#0EA5E9" },
  {
    icon: AlertTriangle,
    title: "High-Risk Patients",
    value: "8",
    color: "#EF4444",
  },
];

const aiAlerts = [
  {
    patient: "John Martinez",
    issue: "Blood pressure elevated - requires immediate attention",
    risk: "error" as const,
    color: "#EF4444",
  },
  {
    patient: "Emma Williams",
    issue: "Post-op recovery slower than expected",
    risk: "warning" as const,
    color: "#FACC15",
  },
  {
    patient: "Michael Chen",
    issue: "Medication interaction detected",
    risk: "error" as const,
    color: "#EF4444",
  },
  {
    patient: "Sarah Johnson",
    issue: "Diet compliance needs monitoring",
    risk: "warning" as const,
    color: "#FACC15",
  },
];

const careTasks = [
  {
    icon: CheckCircle,
    task: "Administer medication to Ward A patients",
    status: "success" as const,
  },
  {
    icon: Clock,
    task: "Post-surgery check for Emma Williams",
    status: "warning" as const,
  },
  {
    icon: Activity,
    task: "Vitals monitoring for high-risk patients",
    status: "info" as const,
  },
  {
    icon: XCircle,
    task: "Missing diet log for John Martinez",
    status: "error" as const,
  },
  {
    icon: CheckCircle,
    task: "Physical therapy session completed",
    status: "success" as const,
  },
  {
    icon: Clock,
    task: "Wound dressing change scheduled",
    status: "warning" as const,
  },
];

export const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <h1 style={{ marginBottom: "32px" }}>Dashboard</h1>

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
                  <div className="text-[14px] text-[#475569]">{stat.title}</div>
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
      <Card padding="16px" className="mb-8" style={{ height: "220px" }}>
        <h3 className="mb-4 px-2" style={{ marginBottom: "20px" }}>
          AI Alerts
        </h3>
        <div className="flex flex-col gap-2">
          {aiAlerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors border-l-4"
              style={{ borderLeftColor: alert.color }}
            >
              <div className="flex-1">
                <div className="text-[#0F172A] mb-1">{alert.patient}</div>
                <div className="text-[14px] text-[#475569]">{alert.issue}</div>
              </div>
              <Badge variant={alert.risk} size="sm">
                {alert.risk === "error" ? "High Risk" : "Monitor"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Today's Care Tasks */}
      <Card padding="24px">
        <h3 className="mb-4">Today's Care Tasks</h3>
        <div className="grid grid-cols-2 gap-4">
          {careTasks.map((task, index) => {
            const Icon = task.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <Icon size={20} className="text-[#2563EB] flex-shrink-0" />
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
      </Card>
    </MainLayout>
  );
};
