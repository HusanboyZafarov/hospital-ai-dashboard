import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Plus, X, Loader2, Edit, Trash2 } from "lucide-react";
import surgeriesService from "../service/surgeries";
import { Surgery as APISurgery, SurgeryPriorityLevel } from "../types/patient";

// Component's internal Surgery interface (for display purposes)
interface Surgery {
  id: number;
  name: string;
  category: string;
  patientName: string;
  surgeon: string;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  priority_level: SurgeryPriorityLevel;
  description: string;
  expectedDuration: string;
}

// Map API surgery to component format
const mapAPISurgeryToComponent = (apiSurgery: APISurgery): Surgery => {
  // Extract type name from object or use string/number directly
  let category = "General";
  if (typeof apiSurgery.type === "object" && apiSurgery.type !== null) {
    category = apiSurgery.type.name || "General";
  } else if (typeof apiSurgery.type === "string") {
    category = apiSurgery.type;
  } else if (typeof apiSurgery.type === "number") {
    category = `Type ${apiSurgery.type}`;
  }

  return {
    id: apiSurgery.id,
    name: apiSurgery.name,
    category,
    patientName: "N/A", // Not in API
    surgeon: "N/A", // Not in API
    date: "N/A", // Not in API
    status: "Scheduled", // Not in API, default
    priority_level: apiSurgery.priority_level || "medium",
    description: apiSurgery.description || "",
    expectedDuration: "N/A", // Not in API
  };
};

// Map component surgery to API format
const mapComponentToAPISurgery = (
  surgery: Omit<Surgery, "id">
): {
  name: string;
  type: string;
  priority_level: SurgeryPriorityLevel;
  description?: string;
} => {
  // When creating/updating, send the category as the type string
  // The backend will handle mapping it to the appropriate type object
  return {
    name: surgery.name,
    type: surgery.category,
    priority_level: surgery.priority_level || "medium",
    description: surgery.description || undefined,
  };
};

export const Surgeries: React.FC = () => {
  const navigate = useNavigate();
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewSurgeryModal, setShowNewSurgeryModal] = useState(false);
  const [editingSurgeryId, setEditingSurgeryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [surgeryForm, setSurgeryForm] = useState<Omit<Surgery, "id">>({
    name: "",
    category: "",
    patientName: "",
    surgeon: "",
    date: "",
    status: "Scheduled",
    priority_level: "medium",
    description: "",
    expectedDuration: "",
  });

  // Fetch surgeries from API
  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        setIsLoading(true);
        const apiSurgeries = await surgeriesService.getSurgeries();
        const mappedSurgeries = apiSurgeries.map(mapAPISurgeryToComponent);
        setSurgeries(mappedSurgeries);
      } catch (error) {
        console.error("Failed to fetch surgeries:", error);
        // Fallback to empty array on error
        setSurgeries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurgeries();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === "Completed") return "success";
    if (status === "In Progress") return "warning";
    if (status === "Scheduled") return "info";
    return "error";
  };

  const getPriorityBadgeVariant = (priorityLevel: SurgeryPriorityLevel) => {
    if (priorityLevel === "high") return "error";
    if (priorityLevel === "medium") return "warning";
    return "success";
  };

  const filteredSurgeries = surgeries.filter(
    (surgery) =>
      surgery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSurgery = () => {
    setEditingSurgeryId(null);
    setSurgeryForm({
      name: "",
      category: "",
      patientName: "",
      surgeon: "",
      date: "",
      status: "Scheduled",
      priority_level: "medium",
      description: "",
      expectedDuration: "",
    });
    setShowNewSurgeryModal(true);
  };

  const handleEditSurgery = (surgery: Surgery) => {
    setEditingSurgeryId(surgery.id);
    // Find the original API surgery to get the type object
    const apiSurgery = surgeries.find((s) => s.id === surgery.id);
    setSurgeryForm({
      name: surgery.name,
      category: surgery.category, // Already mapped to type name
      patientName: surgery.patientName,
      surgeon: surgery.surgeon,
      date: surgery.date,
      status: surgery.status,
      priority_level: surgery.priority_level,
      description: surgery.description,
      expectedDuration: surgery.expectedDuration,
    });
    setShowNewSurgeryModal(true);
  };

  const handleDeleteSurgery = async (id: number) => {
    if (!window.confirm("Jarrohlikni o'chirishni tasdiqlaysizmi?")) {
      return;
    }

    try {
      await surgeriesService.deleteSurgery(id);
      setSurgeries(surgeries.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete surgery:", error);
      alert(
        "Jarrohlikni o'chirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      );
    }
  };

  const handleSaveSurgery = async () => {
    if (!surgeryForm.name.trim() || !surgeryForm.category.trim()) {
      alert("Iltimos, nom va kategoriyani to'ldiring");
      return;
    }

    try {
      setIsSaving(true);
      const apiSurgery = mapComponentToAPISurgery(surgeryForm);

      if (editingSurgeryId) {
        // Update existing surgery
        const updatedSurgery = await surgeriesService.updateSurgery(
          editingSurgeryId,
          apiSurgery
        );
        const mappedSurgery = mapAPISurgeryToComponent(updatedSurgery);
        setSurgeries(
          surgeries.map((s) => (s.id === editingSurgeryId ? mappedSurgery : s))
        );
      } else {
        // Create new surgery
        const createdSurgery = await surgeriesService.postSurgery(apiSurgery);
        const mappedSurgery = mapAPISurgeryToComponent(createdSurgery);
        setSurgeries([...surgeries, mappedSurgery]);
      }

      setShowNewSurgeryModal(false);
      setEditingSurgeryId(null);
      setSurgeryForm({
        name: "",
        category: "",
        patientName: "",
        surgeon: "",
        date: "",
        status: "Scheduled",
        priority_level: "medium",
        description: "",
        expectedDuration: "",
      });
    } catch (error) {
      console.error("Failed to save surgery:", error);
      alert(
        editingSurgeryId
          ? "Jarrohlikni yangilashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
          : "Jarrohlik yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDetails = (surgery: Surgery) => {
    navigate(`/surgeries/${surgery.id}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#2563EB]" size={32} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <h1>Jarrohliklar</h1>
        <Button onClick={handleAddSurgery} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="animate-spin inline mr-2" size={16} />
              Saqlanmoqda...
            </>
          ) : (
            "+ Yangi jarrohlik"
          )}
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative" style={{ maxWidth: "400px" }}>
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#475569]"
            size={20}
          />
          <Input
            placeholder="Jarrohliklarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
                Jarrohlik nomi
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Kategoriya</th>
              <th className="text-left px-6 py-4 text-[#475569]">
                Prioritet darajasi
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Harakat</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurgeries.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-[#475569]"
                >
                  Jarrohliklar topilmadi. Qo'shish uchun "+ Yangi jarrohlik"
                  tugmasini bosing.
                </td>
              </tr>
            ) : (
              filteredSurgeries.map((surgery) => (
                <tr
                  key={surgery.id}
                  className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                  style={{ height: "64px" }}
                >
                  <td className="px-6 py-4 text-[#0F172A] font-medium">
                    {surgery.name}
                  </td>
                  <td className="px-6 py-4 text-[#475569]">
                    {surgery.category}
                  </td>

                  <td className="px-6 py-4">
                    <Badge
                      variant={getPriorityBadgeVariant(surgery.priority_level)}
                    >
                      {surgery.priority_level === "high"
                        ? "Yuqori"
                        : surgery.priority_level === "medium"
                        ? "O'rta"
                        : "Past"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        onClick={() => handleViewDetails(surgery)}
                        className="py-2"
                      >
                        Tafsilotlarni ko'rish
                      </Button>
                      <button
                        onClick={() => handleEditSurgery(surgery)}
                        className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                        title="Tahrirlash"
                      >
                        <Edit size={18} className="text-[#2563EB]" />
                      </button>
                      <button
                        onClick={() => handleDeleteSurgery(surgery.id)}
                        className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 size={18} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Surgery Modal */}
      {showNewSurgeryModal && (
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
              <h2>
                {editingSurgeryId
                  ? "Jarrohlikni tahrirlash"
                  : "Yangi jarrohlik qo'shish"}
              </h2>
              <button
                onClick={() => {
                  setShowNewSurgeryModal(false);
                  setEditingSurgeryId(null);
                  setSurgeryForm({
                    name: "",
                    category: "",
                    patientName: "",
                    surgeon: "",
                    date: "",
                    status: "Scheduled",
                    priority_level: "medium",
                    description: "",
                    expectedDuration: "",
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
                    Jarrohlik nomi *
                  </label>
                  <Input
                    value={surgeryForm.name}
                    onChange={(e) =>
                      setSurgeryForm({ ...surgeryForm, name: e.target.value })
                    }
                    placeholder="Masalan, Tizza protezi"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] mb-2">
                    Kategoriya *
                  </label>
                  <Input
                    value={surgeryForm.category}
                    onChange={(e) =>
                      setSurgeryForm({
                        ...surgeryForm,
                        category: e.target.value,
                      })
                    }
                    placeholder="Masalan, Ortopediya"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Prioritet darajasi *
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setSurgeryForm({
                          ...surgeryForm,
                          priority_level: "low",
                        })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        surgeryForm.priority_level === "low"
                          ? "border-[#22C55E] bg-[#DCFCE7] text-[#166534]"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      Past
                    </button>
                    <button
                      onClick={() =>
                        setSurgeryForm({
                          ...surgeryForm,
                          priority_level: "medium",
                        })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors font-medium ${
                        surgeryForm.priority_level === "medium"
                          ? "border-orange-500 bg-orange-100 text-orange-900"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      O'rta
                    </button>
                    <button
                      onClick={() =>
                        setSurgeryForm({
                          ...surgeryForm,
                          priority_level: "high",
                        })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        surgeryForm.priority_level === "high"
                          ? "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      Yuqori
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Tavsif</label>
                <textarea
                  value={surgeryForm.description}
                  onChange={(e) =>
                    setSurgeryForm({
                      ...surgeryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Masalan, Zararlangan tizza bo'g'imini protez implant bilan to'liq almashtirish..."
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowNewSurgeryModal(false);
                  setEditingSurgeryId(null);
                  setSurgeryForm({
                    name: "",
                    category: "",
                    patientName: "",
                    surgeon: "",
                    date: "",
                    status: "Scheduled",
                    priority_level: "medium",
                    description: "",
                    expectedDuration: "",
                  });
                }}
              >
                Bekor qilish
              </Button>
              <Button fullWidth onClick={handleSaveSurgery} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin inline mr-2" size={16} />
                    Saqlanmoqda...
                  </>
                ) : editingSurgeryId ? (
                  "Yangilash"
                ) : (
                  "Jarrohlik qo'shish"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};
