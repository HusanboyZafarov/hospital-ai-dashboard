import React, { useState, useMemo, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  Loader2,
  XCircle,
} from "lucide-react";
import patientsService from "../service/patients";
import surgeriesService from "../service/surgeries";
import {
  Patient as APIPatient,
  CreatePatientRequest,
  Gender,
  PatientStatus,
  Surgery,
} from "../types/patient";

// API response structure for list endpoint (simplified)
interface PatientListItem {
  id: number;
  full_name: string;
  phone: string;
  assigned_doctor: string;
  surgery_name?: string;
  surgery_risk_level?: string;
  status: string;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  doctor: string;
  surgery: string;
  priority: "High" | "Medium" | "Low";
  status: string;
}

// Map API patient to component format
const mapAPIPatientToComponent = (
  apiPatient: PatientListItem | APIPatient
): Patient => {
  // Map status to display format
  const statusMap: Record<string, string> = {
    in_recovery: "In Recovery",
    discharged: "Discharged",
  };

  // Map risk level from API - handle both list and detail endpoint structures
  const priorityLevelMap: Record<string, "High" | "Medium" | "Low"> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  // Check if it's a list item (has surgery_risk_level) or detail (has surgery.risk_level)
  const priorityLevel =
    "surgery_risk_level" in apiPatient
      ? (apiPatient as PatientListItem).surgery_risk_level
      : (apiPatient as APIPatient).surgery?.risk_level;

  const priority =
    priorityLevelMap[(priorityLevel || "").toLowerCase()] || "Medium";

  // Get surgery name from either structure
  const surgeryName =
    "surgery_name" in apiPatient
      ? (apiPatient as PatientListItem).surgery_name
      : (apiPatient as APIPatient).surgery?.name;

  return {
    id: apiPatient.id,
    name: apiPatient.full_name,
    phone: apiPatient.phone,
    doctor: apiPatient.assigned_doctor,
    surgery: surgeryName || "N/A",
    priority,
    status:
      statusMap[apiPatient.status || "pre_op"] || apiPatient.status || "Pre-Op",
  };
};

export const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [isLoadingSurgeries, setIsLoadingSurgeries] = useState(false);
  const [filterSurgery, setFilterSurgery] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterDoctor, setFilterDoctor] = useState<string>("");
  const [patientForm, setPatientForm] = useState<CreatePatientRequest>({
    full_name: "",
    age: 0,
    gender: "male",
    phone: "",
    assigned_doctor: "",
    admitted_at: new Date().toISOString().split("T")[0],
    status: "in_recovery",
    surgery_id: null,
  });

  // Fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiPatients = await patientsService.getPatients();
        const mappedPatients = apiPatients.map(mapAPIPatientToComponent);
        setPatients(mappedPatients);
      } catch (err: any) {
        console.error("Failed to fetch patients:", err);
        setError("Failed to load patients. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Fetch surgeries on mount for filters
  useEffect(() => {
    const fetchSurgeries = async () => {
      setIsLoadingSurgeries(true);
      try {
        const apiSurgeries = await surgeriesService.getSurgeries();
        setSurgeries(apiSurgeries);
      } catch (err: any) {
        console.error("Failed to fetch surgeries:", err);
        setSurgeries([]);
      } finally {
        setIsLoadingSurgeries(false);
      }
    };

    fetchSurgeries();
  }, []);

  // Fetch surgeries when modal opens
  useEffect(() => {
    const fetchSurgeries = async () => {
      if (showModal && surgeries.length === 0) {
        setIsLoadingSurgeries(true);
        try {
          const apiSurgeries = await surgeriesService.getSurgeries();
          setSurgeries(apiSurgeries);
        } catch (err: any) {
          console.error("Failed to fetch surgeries:", err);
          setSurgeries([]);
        } finally {
          setIsLoadingSurgeries(false);
        }
      }
    };

    fetchSurgeries();
  }, [showModal, surgeries.length]);

  const getPriorityBadge = (priority: string) => {
    if (priority === "High") return "error";
    if (priority === "Medium") return "warning";
    return "success";
  };

  const getStatusBadge = (status: string) => {
    if (status === "Critical") return "error";
    if (status === "In Surgery" || status === "In Recovery") return "warning";
    if (status === "Stable" || status === "Discharged") return "success";
    return "neutral";
  };

  // Get unique values for filters
  const uniqueSurgeries = useMemo(() => {
    const surgerySet = new Set(patients.map((p) => p.surgery).filter(Boolean));
    return Array.from(surgerySet).sort();
  }, [patients]);

  const uniqueDoctors = useMemo(() => {
    const doctorSet = new Set(patients.map((p) => p.doctor).filter(Boolean));
    return Array.from(doctorSet).sort();
  }, [patients]);

  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    // Apply search filter first
    const searchLower = searchTerm.toLowerCase().trim();
    if (searchLower) {
      const normalizePhone = (phone: string) => phone.replace(/[^\d]/g, "");
      const searchPhone = normalizePhone(searchTerm);

      filtered = filtered.filter((patient) => {
        const nameMatch =
          patient.name?.toLowerCase().includes(searchLower) || false;
        const phoneMatch =
          patient.phone?.toLowerCase().includes(searchLower) || false;
        const phoneNormalizedMatch = normalizePhone(
          patient.phone || ""
        ).includes(searchPhone);
        const doctorMatch =
          patient.doctor?.toLowerCase().includes(searchLower) || false;
        const surgeryMatch =
          patient.surgery?.toLowerCase().includes(searchLower) || false;
        const statusMatch =
          patient.status?.toLowerCase().includes(searchLower) || false;
        const priorityMatch =
          patient.priority?.toLowerCase().includes(searchLower) || false;

        return (
          nameMatch ||
          phoneMatch ||
          phoneNormalizedMatch ||
          doctorMatch ||
          surgeryMatch ||
          statusMatch ||
          priorityMatch
        );
      });
    }

    // Apply surgery filter
    if (filterSurgery) {
      filtered = filtered.filter(
        (patient) => patient.surgery === filterSurgery
      );
    }

    // Apply priority filter
    if (filterPriority) {
      filtered = filtered.filter(
        (patient) => patient.priority === filterPriority
      );
    }

    // Apply doctor filter
    if (filterDoctor) {
      filtered = filtered.filter((patient) => patient.doctor === filterDoctor);
    }

    return filtered;
  }, [patients, searchTerm, filterSurgery, filterPriority, filterDoctor]);

  const clearFilters = () => {
    setFilterSurgery("");
    setFilterPriority("");
    setFilterDoctor("");
    setSearchTerm("");
  };

  const hasActiveFilters =
    filterSurgery || filterPriority || filterDoctor || searchTerm;

  const handleAddPatient = () => {
    setEditingPatient(null);
    setPatientForm({
      full_name: "",
      age: 0,
      gender: "male",
      phone: "",
      assigned_doctor: "",
      admitted_at: new Date().toISOString().split("T")[0],
      status: "in_recovery",
      surgery_id: null,
    });
    setShowModal(true);
  };

  const handleEditPatient = async (patient: Patient) => {
    try {
      // Fetch full patient data from API
      const apiPatient = await patientsService.getPatient(patient.id);
      setEditingPatient(patient);
      setPatientForm({
        full_name: apiPatient.full_name,
        age: apiPatient.age,
        gender: apiPatient.gender,
        phone: apiPatient.phone,
        assigned_doctor: apiPatient.assigned_doctor,
        admitted_at: apiPatient.admitted_at
          ? new Date(apiPatient.admitted_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: apiPatient.status || "in_recovery",
        surgery_id: apiPatient.surgery_id || null,
      });
      setShowModal(true);
    } catch (err: any) {
      console.error("Failed to fetch patient details:", err);
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await patientsService.deletePatient(id);
        setPatients(patients.filter((p) => p.id !== id));
      } catch (err: any) {
        console.error("Failed to delete patient:", err);
      }
    }
  };

  const handleSavePatient = async () => {
    if (
      !patientForm.full_name.trim() ||
      !patientForm.phone.trim() ||
      !patientForm.assigned_doctor.trim() ||
      patientForm.age <= 0
    ) {
      return;
    }

    setIsSaving(true);
    try {
      // Prepare data for API - ensure surgery_id is null if empty/invalid
      const patientData: CreatePatientRequest = {
        ...patientForm,
        surgery_id:
          patientForm.surgery_id && patientForm.surgery_id > 0
            ? patientForm.surgery_id
            : null,
      };

      if (editingPatient) {
        // Update existing patient
        const updatedPatient = await patientsService.updatePatient(
          editingPatient.id,
          patientData
        );
        const mappedPatient = mapAPIPatientToComponent(updatedPatient);
        setPatients(
          patients.map((p) => (p.id === editingPatient.id ? mappedPatient : p))
        );
      } else {
        // Add new patient
        const newPatient = await patientsService.postPatient(patientData);
        const mappedPatient = mapAPIPatientToComponent(newPatient);
        setPatients([...patients, mappedPatient]);
      }

      setShowModal(false);
      setEditingPatient(null);
      setPatientForm({
        full_name: "",
        age: 0,
        gender: "male",
        phone: "",
        assigned_doctor: "",
        admitted_at: new Date().toISOString().split("T")[0],
        status: "in_recovery",
        surgery_id: null,
      });
    } catch (err: any) {
      console.error("Failed to save patient:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <h1>Patients</h1>
        <Button onClick={handleAddPatient}>+ New Patient</Button>
      </div>

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
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6 ">
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
            <div className="relative">
              <select
                value={filterSurgery}
                onChange={(e) => setFilterSurgery(e.target.value)}
                className="px-4 py-2 pr-8 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent appearance-none cursor-pointer"
                style={{ minWidth: "180px", minHeight: "48px" }}
              >
                <option value="">All Surgeries</option>
                {uniqueSurgeries.map((surgery) => (
                  <option key={surgery} value={surgery}>
                    {surgery}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 pr-8 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent appearance-none cursor-pointer"
                style={{ minWidth: "180px", minHeight: "48px" }}
              >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="px-4 py-2 pr-8 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent appearance-none cursor-pointer"
                style={{ minWidth: "180px", minHeight: "48px" }}
              >
                <option value="">All Doctors</option>
                {uniqueDoctors.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <XCircle size={16} className="inline mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Table */}
          <div
            className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-x-auto"
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
                  <th className="text-left px-6 py-4 text-[#475569]">
                    Surgery
                  </th>
                  <th className="text-left px-6 py-4 text-[#475569]">
                    Priority Level
                  </th>
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
                      {hasActiveFilters
                        ? `No patients found matching your filters${
                            searchTerm ? ` "${searchTerm}"` : ""
                          }`
                        : "No patients available"}
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                      style={{ height: "64px" }}
                    >
                      <td className="px-6 py-4 text-[#0F172A]">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {patient.doctor}
                      </td>
                      <td className="px-6 py-4 text-[#0F172A]">
                        {patient.surgery}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getPriorityBadge(patient.priority)}>
                          {patient.priority}
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
                            variant="primary"
                            onClick={() => navigate(`/patient/${patient.id}`)}
                            className="py-2"
                          >
                            View Profile
                          </Button>
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#ffb703] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit size={20} className="text-[#ffb703]" />
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
                        full_name: "",
                        age: 0,
                        gender: "male",
                        phone: "",
                        assigned_doctor: "",
                        admitted_at: new Date().toISOString().split("T")[0],
                        status: "in_recovery",
                        surgery_id: null,
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
                        Full Name *
                      </label>
                      <Input
                        value={patientForm.full_name}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            full_name: e.target.value,
                          })
                        }
                        placeholder="e.g., John Martinez"
                      />
                    </div>
                    <div>
                      <label className="block text-[#475569] mb-2">
                        Phone *
                      </label>
                      <Input
                        value={patientForm.phone}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="e.g., (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#475569] mb-2">Age *</label>
                      <Input
                        type="number"
                        value={patientForm.age || ""}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            age: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="e.g., 45"
                      />
                    </div>
                    <div>
                      <label className="block text-[#475569] mb-2">
                        Gender *
                      </label>
                      <select
                        value={patientForm.gender}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            gender: e.target.value as Gender,
                          })
                        }
                        className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#475569] mb-2">
                        Assigned Doctor *
                      </label>
                      <Input
                        value={patientForm.assigned_doctor}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            assigned_doctor: e.target.value,
                          })
                        }
                        placeholder="e.g., Dr. Sarah Johnson"
                      />
                    </div>
                    <div>
                      <label className="block text-[#475569] mb-2">
                        Admitted At *
                      </label>
                      <Input
                        type="date"
                        value={patientForm.admitted_at}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            admitted_at: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#475569] mb-2">
                      Status *
                    </label>
                    <select
                      value={patientForm.status}
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          status: e.target.value as PatientStatus,
                        })
                      }
                      className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                      <option value="in_recovery">In Recovery</option>
                      <option value="discharged">Discharged</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#475569] mb-2">
                      Surgery (Optional)
                    </label>
                    {isLoadingSurgeries ? (
                      <div className="flex items-center gap-2 py-3">
                        <Loader2
                          size={16}
                          className="animate-spin text-[#2563EB]"
                        />
                        <span className="text-[#475569] text-[14px]">
                          Loading surgeries...
                        </span>
                      </div>
                    ) : (
                      <select
                        value={patientForm.surgery_id || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPatientForm({
                            ...patientForm,
                            surgery_id:
                              value && value !== "" ? parseInt(value) : null,
                          });
                        }}
                        className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      >
                        <option value="">No surgery assigned</option>
                        {surgeries.map((surgery) => (
                          <option key={surgery.id} value={surgery.id}>
                            {surgery.name} ({surgery.type}) -{" "}
                            {surgery.risk_level.charAt(0).toUpperCase() +
                              surgery.risk_level.slice(1)}{" "}
                            Priority
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-[12px] text-[#475569] mt-1">
                      Select a surgery from the list or leave empty if no
                      surgery assigned.
                    </p>
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
                        full_name: "",
                        age: 0,
                        gender: "male",
                        phone: "",
                        assigned_doctor: "",
                        admitted_at: new Date().toISOString().split("T")[0],
                        status: "in_recovery",
                        surgery_id: null,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    onClick={handleSavePatient}
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Saving..."
                      : editingPatient
                      ? "Update Patient"
                      : "Add Patient"}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};
