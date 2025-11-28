import React, { useState } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";

const patientsData = [
  {
    id: 1,
    name: "John Martinez",
    phone: "(555) 123-4567",
    doctor: "Dr. Sarah Johnson",
    surgery: "Knee Replacement",
    risk: "High",
    status: "In Recovery",
  },
  {
    id: 2,
    name: "Emma Williams",
    phone: "(555) 234-5678",
    doctor: "Dr. Michael Chen",
    surgery: "Appendectomy",
    risk: "Medium",
    status: "Stable",
  },
  {
    id: 3,
    name: "Michael Chen",
    phone: "(555) 345-6789",
    doctor: "Dr. Sarah Johnson",
    surgery: "Cardiac Bypass",
    risk: "High",
    status: "Critical",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    phone: "(555) 456-7890",
    doctor: "Dr. Emily Brown",
    surgery: "Hip Replacement",
    risk: "Low",
    status: "Stable",
  },
  {
    id: 5,
    name: "David Smith",
    phone: "(555) 567-8901",
    doctor: "Dr. Michael Chen",
    surgery: "Gallbladder Removal",
    risk: "Low",
    status: "Discharged",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    phone: "(555) 678-9012",
    doctor: "Dr. Sarah Johnson",
    surgery: "Spinal Fusion",
    risk: "Medium",
    status: "In Surgery",
  },
  {
    id: 7,
    name: "Robert Taylor",
    phone: "(555) 789-0123",
    doctor: "Dr. Emily Brown",
    surgery: "Hernia Repair",
    risk: "Low",
    status: "Pre-Op",
  },
  {
    id: 8,
    name: "Jennifer White",
    phone: "(555) 890-1234",
    doctor: "Dr. Michael Chen",
    surgery: "Thyroidectomy",
    risk: "Medium",
    status: "Stable",
  },
];

export const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const getRiskBadge = (risk: string) => {
    if (risk === "High") return "error";
    if (risk === "Medium") return "warning";
    return "success";
  };

  const getStatusBadge = (status: string) => {
    if (status === "Critical") return "error";
    if (status === "In Surgery" || status === "In Recovery") return "warning";
    if (status === "Stable" || status === "Discharged") return "success";
    return "neutral";
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <h1>Patients</h1>
        <Button>+ New Patient</Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1" style={{ maxWidth: "400px" }}>
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#475569]"
            size={20}
          />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter size={16} className="inline mr-2" />
          Surgery
        </Button>
        <Button variant="outline">
          <Filter size={16} className="inline mr-2" />
          Risk Level
        </Button>
        <Button variant="outline">
          <Filter size={16} className="inline mr-2" />
          Doctor
        </Button>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        <table className="w-full">
          <thead className="bg-[#F8FAFC]">
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left px-6 py-4 text-[#475569]">
                Patient Name
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Phone</th>
              <th className="text-left px-6 py-4 text-[#475569]">
                Assigned Doctor
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Surgery</th>
              <th className="text-left px-6 py-4 text-[#475569]">Risk Level</th>
              <th className="text-left px-6 py-4 text-[#475569]">Status</th>
              <th className="text-left px-6 py-4 text-[#475569]">Action</th>
            </tr>
          </thead>
          <tbody>
            {patientsData.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                style={{ height: "64px" }}
              >
                <td className="px-6 py-4 text-[#0F172A]">{patient.name}</td>
                <td className="px-6 py-4 text-[#475569]">{patient.phone}</td>
                <td className="px-6 py-4 text-[#475569]">{patient.doctor}</td>
                <td className="px-6 py-4 text-[#0F172A]">{patient.surgery}</td>
                <td className="px-6 py-4">
                  <Badge variant={getRiskBadge(patient.risk)}>
                    {patient.risk}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusBadge(patient.status)}>
                    {patient.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/patient/${patient.id}`)}
                    className="py-2"
                  >
                    View Profile
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};
