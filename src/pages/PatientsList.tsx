import React, { useState, useMemo } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { Search, Filter, X, Edit, Trash2 } from "lucide-react";

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

interface Patient {
  id: number;
  name: string;
  phone: string;
  doctor: string;
  surgery: string;
  risk: "High" | "Medium" | "Low";
  status: string;
}

export const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>(patientsData);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientForm, setPatientForm] = useState({
    name: "",
    phone: "",
    doctor: "",
    surgery: "",
    risk: "Low" as "High" | "Medium" | "Low",
    status: "Pre-Op",
  });

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

  const filteredPatients = useMemo(() => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return patients; // Show all if search is empty

    // Remove formatting from phone for better search
    const normalizePhone = (phone: string) => phone.replace(/[^\d]/g, "");
    const searchPhone = normalizePhone(searchTerm);

    return patients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(searchLower) ||
        patient.phone.toLowerCase().includes(searchLower) ||
        normalizePhone(patient.phone).includes(searchPhone) ||
        patient.doctor.toLowerCase().includes(searchLower) ||
        patient.surgery.toLowerCase().includes(searchLower) ||
        patient.status.toLowerCase().includes(searchLower) ||
        patient.risk.toLowerCase().includes(searchLower)
      );
    });
  }, [patients, searchTerm]);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setPatientForm({
      name: "",
      phone: "",
      doctor: "",
      surgery: "",
      risk: "Low",
      status: "Pre-Op",
    });
    setShowModal(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setPatientForm({
      name: patient.name,
      phone: patient.phone,
      doctor: patient.doctor,
      surgery: patient.surgery,
      risk: patient.risk,
      status: patient.status,
    });
    setShowModal(true);
  };

  const handleDeletePatient = (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      setPatients(patients.filter((p) => p.id !== id));
    }
  };

  const handleSavePatient = () => {
    if (
      !patientForm.name.trim() ||
      !patientForm.phone.trim() ||
      !patientForm.doctor.trim() ||
      !patientForm.surgery.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingPatient) {
      // Update existing patient
      setPatients(
        patients.map((p) =>
          p.id === editingPatient.id
            ? { ...patientForm, id: editingPatient.id }
            : p
        )
      );
    } else {
      // Add new patient
      const newId = Math.max(...patients.map((p) => p.id), 0) + 1;
      setPatients([...patients, { ...patientForm, id: newId }]);
    }

    setShowModal(false);
    setEditingPatient(null);
    setPatientForm({
      name: "",
      phone: "",
      doctor: "",
      surgery: "",
      risk: "Low",
      status: "Pre-Op",
    });
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <h1>Patients</h1>
        <Button onClick={handleAddPatient}>+ New Patient</Button>
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
            {filteredPatients.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-[#475569]"
                >
                  No patients found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                  style={{ height: "64px" }}
                >
                  <td className="px-6 py-4 text-[#0F172A]">{patient.name}</td>
                  <td className="px-6 py-4 text-[#475569]">{patient.phone}</td>
                  <td className="px-6 py-4 text-[#475569]">{patient.doctor}</td>
                  <td className="px-6 py-4 text-[#0F172A]">
                    {patient.surgery}
                  </td>
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/patient/${patient.id}`)}
                        className="py-2"
                      >
                        View Profile
                      </Button>
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={20} className="text-[#2563EB]" />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={20} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            width: "100%",
          }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <Card
            padding="24px"
            className="w-[95%] min-w-[1400px] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2>{editingPatient ? "Edit Patient" : "Add New Patient"}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPatient(null);
                  setPatientForm({
                    name: "",
                    phone: "",
                    doctor: "",
                    surgery: "",
                    risk: "Low",
                    status: "Pre-Op",
                  });
                }}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Patient Name *
                  </label>
                  <Input
                    value={patientForm.name}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, name: e.target.value })
                    }
                    placeholder="e.g., John Martinez"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] mb-2">Phone *</label>
                  <Input
                    value={patientForm.phone}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, phone: e.target.value })
                    }
                    placeholder="e.g., (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Assigned Doctor *
                  </label>
                  <Input
                    value={patientForm.doctor}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, doctor: e.target.value })
                    }
                    placeholder="e.g., Dr. Sarah Johnson"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] mb-2">Surgery *</label>
                  <Input
                    value={patientForm.surgery}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        surgery: e.target.value,
                      })
                    }
                    placeholder="e.g., Knee Replacement"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Risk Level *
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setPatientForm({ ...patientForm, risk: "Low" })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        patientForm.risk === "Low"
                          ? "border-[#22C55E] bg-[#DCFCE7] text-[#166534]"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      Low
                    </button>
                    <button
                      onClick={() =>
                        setPatientForm({ ...patientForm, risk: "Medium" })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        patientForm.risk === "Medium"
                          ? "border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() =>
                        setPatientForm({ ...patientForm, risk: "High" })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        patientForm.risk === "High"
                          ? "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      High
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[#475569] mb-2">Status *</label>
                  <select
                    value={patientForm.status}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, status: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="Pre-Op">Pre-Op</option>
                    <option value="In Surgery">In Surgery</option>
                    <option value="In Recovery">In Recovery</option>
                    <option value="Stable">Stable</option>
                    <option value="Critical">Critical</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowModal(false);
                  setEditingPatient(null);
                  setPatientForm({
                    name: "",
                    phone: "",
                    doctor: "",
                    surgery: "",
                    risk: "Low",
                    status: "Pre-Op",
                  });
                }}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={handleSavePatient}>
                {editingPatient ? "Update Patient" : "Add Patient"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};
