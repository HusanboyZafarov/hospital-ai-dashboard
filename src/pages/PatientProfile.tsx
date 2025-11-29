import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { useParams } from "react-router-dom";
import {
  Activity,
  FileText,
  Pill,
  Utensils,
  Dumbbell,
  Bot,
  Calendar,
  Heart,
  Thermometer,
  Droplet,
  Loader2,
  Plus,
  X,
  Check,
} from "lucide-react";
import patientsService from "../service/patients";
import { Patient } from "../types/patient";
import profileSideService from "../service/profile_side";

const tabs = [
  { id: "overview", label: "Umumiy ko'rinish" },
  { id: "surgery", label: "Jarrohlik" },
  { id: "admission", label: "Qabul qilish" },
  { id: "care-plan", label: "Parvarish rejasi" },
  { id: "medications", label: "Dorilar" },
  { id: "diet", label: "Dieta" },
  { id: "activities", label: "Faoliyatlar" },
  { id: "ai-insights", label: "AI tahlillari" },
];

export const PatientProfile: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection modals
  const [showMedicationSelector, setShowMedicationSelector] = useState(false);
  const [showDietSelector, setShowDietSelector] = useState(false);
  const [selectedMedicationIds, setSelectedMedicationIds] = useState<number[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);

  // Medication form for creating new medication assignment
  const [medicationForm, setMedicationForm] = useState<{
    surgery_id: number | null;
    name: string;
    dosage: string;
    frequency: string;
    start_date: string;
    end_date: string;
  }>({
    surgery_id: null,
    name: "",
    dosage: "",
    frequency: "",
    start_date: "",
    end_date: "",
  });

  // Diet plan form for creating new diet plan
  const [dietPlanForm, setDietPlanForm] = useState<{
    summary: string;
    diet_type: string;
    goal_calories: string;
    protein_target: string;
    notes: string;
    allowed_foods: Array<{ name: string; description: string }>;
    forbidden_foods: Array<{ name: string; description: string }>;
    meal_plan: Array<{ meal_type: string; description: string; time: string }>;
  }>({
    summary: "",
    diet_type: "",
    goal_calories: "",
    protein_target: "",
    notes: "",
    allowed_foods: [],
    forbidden_foods: [],
    meal_plan: [],
  });

  const [newAllowedFood, setNewAllowedFood] = useState({
    name: "",
    description: "",
  });
  const [newForbiddenFood, setNewForbiddenFood] = useState({
    name: "",
    description: "",
  });
  const [newMealPlan, setNewMealPlan] = useState({
    meal_type: "",
    description: "",
    time: "",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setError("Bemor ID si topilmadi");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const patientData = await patientsService.getPatient(parseInt(id));
        setPatient(patientData);
        // Update medication form with patient's surgery_id
        setMedicationForm((prev) => ({
          ...prev,
          surgery_id: patientData.surgery?.id || null,
        }));
      } catch (err: any) {
        console.error("Failed to fetch patient:", err);
        setError(
          "Bemor ma'lumotlarini yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const refreshPatient = async () => {
    if (!id) return;
    try {
      const patientData = await patientsService.getPatient(parseInt(id));
      setPatient(patientData);
    } catch (err) {
      console.error("Failed to refresh patient:", err);
    }
  };

  // Medication selection handlers
  const handleOpenMedicationSelector = async () => {
    // Reset form with patient's surgery_id
    setMedicationForm({
      surgery_id: patient?.surgery?.id || null,
      name: "",
      dosage: "",
      frequency: "",
      start_date: "",
      end_date: "",
    });
    setShowMedicationSelector(true);
  };

  const handleSaveMedication = async () => {
    if (!id) return;

    // Validation
    if (!medicationForm.surgery_id) {
      alert("Iltimos, jarrohlikni tanlang");
      return;
    }
    if (
      !medicationForm.name ||
      !medicationForm.dosage ||
      !medicationForm.frequency
    ) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }
    if (!medicationForm.start_date || !medicationForm.end_date) {
      alert("Iltimos, boshlanish va tugash sanalarini kiriting");
      return;
    }

    try {
      setIsSaving(true);
      const medicationData = {
        surgery_id: medicationForm.surgery_id,
        patient_id: parseInt(id),
        name: medicationForm.name,
        dosage: medicationForm.dosage,
        frequency: medicationForm.frequency,
        start_date: medicationForm.start_date,
        end_date: medicationForm.end_date,
      };

      await profileSideService.postMedication(medicationData);
      await refreshPatient();
      setShowMedicationSelector(false);
      // Reset form
      setMedicationForm({
        surgery_id: patient?.surgery?.id || null,
        name: "",
        dosage: "",
        frequency: "",
        start_date: "",
        end_date: "",
      });
    } catch (err: any) {
      console.error("Failed to save medication:", err);
      console.error("Error details:", err?.response?.data);
      const errorMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (Array.isArray(err?.response?.data)
          ? err.response.data.join(", ")
          : "") ||
        err?.message ||
        "Dorini saqlashda xatolik yuz berdi.";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMedication = async (medicationId: number) => {
    if (!id) return;
    if (!window.confirm("Dorini olib tashlashni tasdiqlaysizmi?")) return;

    try {
      await patientsService.removeMedication(parseInt(id), medicationId);
      await refreshPatient();
    } catch (err: any) {
      console.error("Failed to remove medication:", err);
      alert("Dorini olib tashlashda xatolik yuz berdi.");
    }
  };

  // Diet plan creation handlers
  const handleOpenDietSelector = () => {
    // Reset form
    setDietPlanForm({
      summary: "",
      diet_type: "",
      goal_calories: "",
      protein_target: "",
      notes: "",
      allowed_foods: [],
      forbidden_foods: [],
      meal_plan: [],
    });
    setNewAllowedFood({ name: "", description: "" });
    setNewForbiddenFood({ name: "", description: "" });
    setNewMealPlan({ meal_type: "", description: "", time: "" });
    setShowDietSelector(true);
  };

  const handleSaveDietPlan = async () => {
    if (!id) return;

    // Validation
    if (
      !dietPlanForm.summary ||
      !dietPlanForm.diet_type ||
      !dietPlanForm.goal_calories
    ) {
      alert(
        "Iltimos, barcha majburiy maydonlarni to'ldiring (Xulosa, Dieta turi, Maqsadli kaloriya)"
      );
      return;
    }

    try {
      setIsSaving(true);
      const dietPlanData = {
        summary: dietPlanForm.summary,
        diet_type: dietPlanForm.diet_type,
        goal_calories: parseInt(dietPlanForm.goal_calories),
        protein_target: dietPlanForm.protein_target || undefined,
        notes: dietPlanForm.notes || undefined,
        allowed_foods:
          dietPlanForm.allowed_foods.length > 0
            ? dietPlanForm.allowed_foods
            : undefined,
        forbidden_foods:
          dietPlanForm.forbidden_foods.length > 0
            ? dietPlanForm.forbidden_foods
            : undefined,
        meal_plan:
          dietPlanForm.meal_plan.length > 0
            ? dietPlanForm.meal_plan
            : undefined,
      };

      await profileSideService.postDietPlan(dietPlanData);
      await refreshPatient();
      setShowDietSelector(false);
      // Reset form
      setDietPlanForm({
        summary: "",
        diet_type: "",
        goal_calories: "",
        protein_target: "",
        notes: "",
        allowed_foods: [],
        forbidden_foods: [],
        meal_plan: [],
      });
    } catch (err: any) {
      console.error("Failed to save diet plan:", err);
      console.error("Error details:", err?.response?.data);
      const errorMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (Array.isArray(err?.response?.data)
          ? err.response.data.join(", ")
          : "") ||
        err?.message ||
        "Dieta rejasini saqlashda xatolik yuz berdi.";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveDietPlan = async () => {
    if (!id) return;
    if (!window.confirm("Dieta rejasini olib tashlashni tasdiqlaysizmi?"))
      return;

    try {
      await patientsService.removeDietPlan(parseInt(id));
      await refreshPatient();
    } catch (err: any) {
      console.error("Failed to remove diet plan:", err);
      alert("Dieta rejasini olib tashlashda xatolik yuz berdi.");
    }
  };

  // Map status to display format
  const getStatusDisplay = (status?: string) => {
    const statusMap: Record<string, string> = {
      pre_op: "Operatsiyadan oldin",
      in_surgery: "Operatsiya davomida",
      post_op: "Operatsiyadan keyin",
      recovery: "Tiklanishda",
      in_recovery: "Tiklanishda",
      stable: "Barqaror",
      discharged: "Bo'shatilgan",
    };
    return statusMap[status || ""] || status || "Noma'lum";
  };

  // Map risk level to badge variant
  const getPriorityBadgeVariant = (priorityLevel?: string) => {
    if (!priorityLevel) return "warning";
    const priority = priorityLevel.toLowerCase();
    if (priority === "high") return "error";
    if (priority === "medium") return "warning";
    return "success";
  };

  // Format priority level for display
  const getPriorityDisplay = (priorityLevel?: string) => {
    if (!priorityLevel) return "Noma'lum";
    const priorityMap: Record<string, string> = {
      high: "Yuqori",
      medium: "O'rta",
      low: "Past",
    };
    return (
      priorityMap[priorityLevel.toLowerCase()] ||
      priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)
    );
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const renderTabContent = () => {
    if (!patient) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewTab patient={patient} />;
      case "surgery":
        return <SurgeryTab patient={patient} />;
      case "records":
        return <MedicalRecordsTab patient={patient} />;
      case "admission":
        return <AdmissionTab patient={patient} />;
      case "care-plan":
        return <CarePlanTab patient={patient} />;
      case "medications":
        return (
          <MedicationsTab
            patient={patient}
            onOpenSelector={handleOpenMedicationSelector}
            onRemove={handleRemoveMedication}
          />
        );
      case "diet":
        return (
          <DietTab
            patient={patient}
            onOpenSelector={handleOpenDietSelector}
            onRemove={handleRemoveDietPlan}
          />
        );
      case "activities":
        return <ActivitiesTab patient={patient} />;
      case "ai-insights":
        return <AIInsightsTab patient={patient} />;
      case "appointments":
        return <AppointmentsTab />;
      default:
        return <OverviewTab patient={patient} />;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-[#2563EB] animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error || !patient) {
    return (
      <MainLayout>
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-[#DC2626]">
          {error || "Bemor topilmadi"}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="mb-2">{patient.full_name}</h1>
        <div className="flex items-center gap-4 text-[#475569]">
          <span>{patient.age} yosh</span>
          <span>•</span>
          <span>
            {patient.gender === "male"
              ? "Erkak"
              : patient.gender === "female"
              ? "Ayol"
              : "Boshqa"}
          </span>
          {patient.surgery?.priority_level && (
            <>
              <span>•</span>
              <Badge
                variant={getPriorityBadgeVariant(
                  patient.surgery.priority_level
                )}
              >
                {getPriorityDisplay(patient.surgery.priority_level)} prioritet
              </Badge>
            </>
          )}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTabContent()}

      {/* Medication Selector Modal */}
      {showMedicationSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card
            padding="24px"
            className="w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2>Dorilarni tanlash</h2>
              <button
                onClick={() => setShowMedicationSelector(false)}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Jarrohlik *
                  </label>
                  <select
                    value={medicationForm.surgery_id || ""}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        surgery_id: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="">Jarrohlikni tanlang</option>
                    {patient?.surgery && (
                      <option value={patient.surgery.id}>
                        {patient.surgery.name}
                      </option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[#475569] mb-2">
                    Dori nomi *
                  </label>
                  <Input
                    value={medicationForm.name}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Masalan, Cefazolin"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#475569] mb-2">
                      Dozasi *
                    </label>
                    <Input
                      value={medicationForm.dosage}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          dosage: e.target.value,
                        })
                      }
                      placeholder="Masalan, 1 g IV"
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] mb-2">
                      Chastotasi *
                    </label>
                    <Input
                      value={medicationForm.frequency}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          frequency: e.target.value,
                        })
                      }
                      placeholder="Masalan, every 8 hours"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#475569] mb-2">
                      Boshlanish sanasi *
                    </label>
                    <Input
                      type="date"
                      value={medicationForm.start_date}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] mb-2">
                      Tugash sanasi *
                    </label>
                    <Input
                      type="date"
                      value={medicationForm.end_date}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          end_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setShowMedicationSelector(false);
                    setMedicationForm({
                      surgery_id: patient?.surgery?.id || null,
                      name: "",
                      dosage: "",
                      frequency: "",
                      start_date: "",
                      end_date: "",
                    });
                  }}
                >
                  Bekor qilish
                </Button>
                <Button
                  fullWidth
                  onClick={handleSaveMedication}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin inline mr-2" size={16} />
                      Saqlanmoqda...
                    </>
                  ) : (
                    "Saqlash"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Diet Plan Creation Modal */}
      {showDietSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card
            padding="16px"
            className="w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Yangi dieta rejasi</h3>
              <button
                onClick={() => setShowDietSelector(false)}
                className="p-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <X size={18} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#475569] text-[13px] mb-1.5">
                  Xulosa *
                </label>
                <textarea
                  value={dietPlanForm.summary}
                  onChange={(e) =>
                    setDietPlanForm({
                      ...dietPlanForm,
                      summary: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-white"
                  rows={2}
                  placeholder="Dieta rejasi xulosasi"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] text-[13px] mb-1.5">
                    Dieta turi *
                  </label>
                  <Input
                    value={dietPlanForm.diet_type}
                    onChange={(e) =>
                      setDietPlanForm({
                        ...dietPlanForm,
                        diet_type: e.target.value,
                      })
                    }
                    placeholder="Masalan, Past natriy"
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] text-[13px] mb-1.5">
                    Maqsadli kaloriya *
                  </label>
                  <Input
                    type="number"
                    value={dietPlanForm.goal_calories}
                    onChange={(e) =>
                      setDietPlanForm({
                        ...dietPlanForm,
                        goal_calories: e.target.value,
                      })
                    }
                    placeholder="2000"
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475569] text-[13px] mb-1.5">
                  Protein maqsadi
                </label>
                <Input
                  value={dietPlanForm.protein_target}
                  onChange={(e) =>
                    setDietPlanForm({
                      ...dietPlanForm,
                      protein_target: e.target.value,
                    })
                  }
                  placeholder="Masalan, 100g/kun"
                  className="h-9 text-sm"
                />
              </div>

              <div>
                <label className="block text-[#475569] text-[13px] mb-1.5">
                  Eslatmalar
                </label>
                <textarea
                  value={dietPlanForm.notes}
                  onChange={(e) =>
                    setDietPlanForm({ ...dietPlanForm, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-white"
                  rows={2}
                  placeholder="Qo'shimcha eslatmalar"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] text-[13px] mb-1.5">
                    Ruxsat etilgan ovqatlar
                  </label>
                  <div className="flex gap-1.5 mb-1.5">
                    <Input
                      value={newAllowedFood.name}
                      onChange={(e) =>
                        setNewAllowedFood({
                          ...newAllowedFood,
                          name: e.target.value,
                        })
                      }
                      placeholder="Ovqat nomi"
                      className="flex-1 h-8 text-sm"
                    />
                    <Button
                      onClick={() => {
                        if (newAllowedFood.name.trim()) {
                          setDietPlanForm({
                            ...dietPlanForm,
                            allowed_foods: [
                              ...dietPlanForm.allowed_foods,
                              {
                                name: newAllowedFood.name.trim(),
                                description:
                                  newAllowedFood.description.trim() || "",
                              },
                            ],
                          });
                          setNewAllowedFood({ name: "", description: "" });
                        }
                      }}
                      className="h-8 px-2"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <ul className="space-y-0.5 max-h-24 overflow-y-auto text-xs">
                    {dietPlanForm.allowed_foods.map((food, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between px-2 py-1 bg-[#F0FDF4] rounded text-[#166534]"
                      >
                        <span className="truncate">{food.name}</span>
                        <button
                          onClick={() => {
                            setDietPlanForm({
                              ...dietPlanForm,
                              allowed_foods: dietPlanForm.allowed_foods.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                        >
                          <X size={12} className="text-[#EF4444]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-[#475569] text-[13px] mb-1.5">
                    Taqiqlangan ovqatlar
                  </label>
                  <div className="flex gap-1.5 mb-1.5">
                    <Input
                      value={newForbiddenFood.name}
                      onChange={(e) =>
                        setNewForbiddenFood({
                          ...newForbiddenFood,
                          name: e.target.value,
                        })
                      }
                      placeholder="Ovqat nomi"
                      className="flex-1 h-8 text-sm"
                    />
                    <Button
                      onClick={() => {
                        if (newForbiddenFood.name.trim()) {
                          setDietPlanForm({
                            ...dietPlanForm,
                            forbidden_foods: [
                              ...dietPlanForm.forbidden_foods,
                              {
                                name: newForbiddenFood.name.trim(),
                                description:
                                  newForbiddenFood.description.trim() || "",
                              },
                            ],
                          });
                          setNewForbiddenFood({ name: "", description: "" });
                        }
                      }}
                      className="h-8 px-2"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <ul className="space-y-0.5 max-h-24 overflow-y-auto text-xs">
                    {dietPlanForm.forbidden_foods.map((food, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between px-2 py-1 bg-[#FEF2F2] rounded text-[#991B1B]"
                      >
                        <span className="truncate">{food.name}</span>
                        <button
                          onClick={() => {
                            setDietPlanForm({
                              ...dietPlanForm,
                              forbidden_foods:
                                dietPlanForm.forbidden_foods.filter(
                                  (_, i) => i !== index
                                ),
                            });
                          }}
                        >
                          <X size={12} className="text-[#EF4444]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] text-[13px] mb-1.5">
                  Ovqatlanish rejasi
                </label>
                <div className="flex gap-1.5 mb-1.5">
                  <Input
                    value={newMealPlan.meal_type}
                    onChange={(e) =>
                      setNewMealPlan({
                        ...newMealPlan,
                        meal_type: e.target.value,
                      })
                    }
                    placeholder="Ovqat turi"
                    className="flex-1 h-8 text-sm"
                  />
                  <Input
                    value={newMealPlan.description}
                    onChange={(e) =>
                      setNewMealPlan({
                        ...newMealPlan,
                        description: e.target.value,
                      })
                    }
                    placeholder="Tavsif *"
                    className="flex-1 h-8 text-sm"
                  />
                  <Input
                    type="time"
                    value={newMealPlan.time}
                    onChange={(e) =>
                      setNewMealPlan({
                        ...newMealPlan,
                        time: e.target.value,
                      })
                    }
                    className="w-24 h-8 text-sm"
                  />
                  <Button
                    onClick={() => {
                      if (
                        newMealPlan.meal_type.trim() &&
                        newMealPlan.description.trim()
                      ) {
                        setDietPlanForm({
                          ...dietPlanForm,
                          meal_plan: [
                            ...dietPlanForm.meal_plan,
                            {
                              meal_type: newMealPlan.meal_type.trim(),
                              description: newMealPlan.description.trim(),
                              time: newMealPlan.time || "",
                            },
                          ],
                        });
                        setNewMealPlan({
                          meal_type: "",
                          description: "",
                          time: "",
                        });
                      }
                    }}
                    className="h-8 px-2"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <ul className="space-y-0.5 max-h-24 overflow-y-auto text-xs">
                  {dietPlanForm.meal_plan.map((meal, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between px-2 py-1 bg-[#F8FAFC] rounded border border-[#E2E8F0] text-[#0F172A]"
                    >
                      <span className="truncate">
                        <strong>{meal.meal_type}</strong> - {meal.description}
                        {meal.time && (
                          <span className="text-[#475569] ml-1">
                            ({meal.time})
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => {
                          setDietPlanForm({
                            ...dietPlanForm,
                            meal_plan: dietPlanForm.meal_plan.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                      >
                        <X size={12} className="text-[#EF4444]" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#E2E8F0]">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowDietSelector(false)}
                  className="h-9"
                >
                  Bekor qilish
                </Button>
                <Button
                  fullWidth
                  onClick={handleSaveDietPlan}
                  disabled={isSaving}
                  className="h-9"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin inline mr-2" size={14} />
                      Saqlanmoqda...
                    </>
                  ) : (
                    "Yaratish"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

const OverviewTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusDisplay = (status?: string) => {
    const statusMap: Record<string, string> = {
      pre_op: "Operatsiyadan oldin",
      in_surgery: "Operatsiya davomida",
      post_op: "Operatsiyadan keyin",
      recovery: "Tiklanishda",
      in_recovery: "Tiklanishda",
      stable: "Barqaror",
      discharged: "Bo'shatilgan",
    };
    return statusMap[status || ""] || status || "Noma'lum";
  };

  const getPriorityDisplay = (priorityLevel?: string) => {
    if (!priorityLevel) return "Noma'lum";
    const priorityMap: Record<string, string> = {
      high: "Yuqori",
      medium: "O'rta",
      low: "Past",
    };
    return (
      priorityMap[priorityLevel.toLowerCase()] ||
      priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)
    );
  };

  return (
    <div className="grid grid-cols-[40%_60%] gap-6">
      <div className="flex flex-col gap-6">
        <Card>
          <h3 className="mb-4">Bemor ma'lumotlari</h3>
          <div className="space-y-3">
            <InfoRow label="To'liq ism" value={patient.full_name} />
            <InfoRow label="Yosh" value={`${patient.age} yosh`} />
            <InfoRow
              label="Jins"
              value={
                patient.gender === "male"
                  ? "Erkak"
                  : patient.gender === "female"
                  ? "Ayol"
                  : "Boshqa"
              }
            />
            <InfoRow label="Telefon" value={patient.phone} />
            <InfoRow
              label="Tayinlangan shifokor"
              value={patient.assigned_doctor}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <h3 className="mb-4">Jarrohlik xulosa</h3>
          <div className="space-y-4">
            {patient.surgery ? (
              <>
                <div>
                  <div className="text-[#475569] mb-1">Jarrohlik nomi</div>
                  <div className="text-[#0F172A]">{patient.surgery.name}</div>
                </div>
                {patient.surgery.type && (
                  <div>
                    <div className="text-[#475569] mb-1">Turi</div>
                    <Badge variant="info">
                      {typeof patient.surgery.type === "object" &&
                      patient.surgery.type !== null
                        ? patient.surgery.type.name
                        : typeof patient.surgery.type === "number"
                        ? `Type ${patient.surgery.type}`
                        : patient.surgery.type}
                    </Badge>
                  </div>
                )}
                {patient.surgery.priority_level && (
                  <div>
                    <div className="text-[#475569] mb-1">
                      Prioritet darajasi
                    </div>
                    <Badge
                      variant={
                        patient.surgery.priority_level === "high"
                          ? "error"
                          : patient.surgery.priority_level === "medium"
                          ? "warning"
                          : "success"
                      }
                    >
                      {getPriorityDisplay(patient.surgery.priority_level)}{" "}
                      prioritet
                    </Badge>
                  </div>
                )}
                {patient.surgery.description && (
                  <div>
                    <div className="text-[#475569] mb-1">Tavsif</div>
                    <div className="text-[#0F172A]">
                      {patient.surgery.description}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-[#475569]">
                Jarrohlik ma'lumotlari mavjud emas
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4">Bugungi vazifalar</h3>
          <div className="space-y-3">
            <TaskRow
              icon={Pill}
              task="Og'riq qoldiruvchi dori berish"
              time="10:00"
              status="success"
            />
            <TaskRow
              icon={Activity}
              task="Jismoniy terapiya seansi"
              time="14:00"
              status="warning"
            />
            <TaskRow
              icon={Utensils}
              task="Past natriy tushlik"
              time="12:30"
              status="success"
            />
            <TaskRow
              icon={FileText}
              task="Tiklanish yozuvlarini yangilash"
              time="16:00"
              status="neutral"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const SurgeryTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const getStatusDisplay = (status?: string) => {
    const statusMap: Record<string, string> = {
      pre_op: "Operatsiyadan oldin",
      in_surgery: "Operatsiya davomida",
      post_op: "Operatsiyadan keyin",
      recovery: "Tiklanishda",
      in_recovery: "Tiklanishda",
      stable: "Barqaror",
      discharged: "Bo'shatilgan",
    };
    return statusMap[status || ""] || status || "Noma'lum";
  };

  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return "neutral";
    if (status === "stable" || status === "discharged") return "success";
    if (status === "in_recovery" || status === "recovery") return "warning";
    if (status === "pre_op" || status === "in_surgery") return "info";
    return "warning";
  };

  if (!patient.surgery) {
    return (
      <Card>
        <div className="text-[#475569]">Jarrohlik ma'lumotlari mavjud emas</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2>{patient.surgery.name}</h2>
          <div className="flex gap-2 mt-2">
            {patient.surgery.type && (
              <Badge variant="info">
                {typeof patient.surgery.type === "object" &&
                patient.surgery.type !== null
                  ? patient.surgery.type.name
                  : typeof patient.surgery.type === "number"
                  ? `Type ${patient.surgery.type}`
                  : patient.surgery.type}
              </Badge>
            )}
            {patient.surgery.priority_level && (
              <Badge
                variant={
                  patient.surgery.priority_level === "high"
                    ? "error"
                    : patient.surgery.priority_level === "medium"
                    ? "warning"
                    : "success"
                }
              >
                {patient.surgery.priority_level.charAt(0).toUpperCase() +
                  patient.surgery.priority_level.slice(1)}{" "}
                Priority
              </Badge>
            )}
          </div>
        </div>

        {patient.surgery.description && (
          <div>
            <div className="text-[#475569] mb-2">Description</div>
            <p className="text-[#0F172A]">{patient.surgery.description}</p>
          </div>
        )}

        <div>
          <div className="text-[#475569] mb-2">Tayinlangan shifokor</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              {patient.assigned_doctor.charAt(0).toUpperCase()}
            </div>
            <div className="text-[#0F172A]">{patient.assigned_doctor}</div>
          </div>
        </div>

        {patient.admitted_at && (
          <div>
            <div className="text-[#475569] mb-2">Qabul qilingan sana</div>
            <div className="text-[#0F172A]">
              {new Date(patient.admitted_at).toLocaleDateString("uz-UZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        )}

        {patient.status && (
          <div>
            <div className="text-[#475569] mb-2">Holat</div>
            <Badge variant={getStatusBadgeVariant(patient.status)}>
              {getStatusDisplay(patient.status)}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

const MedicalRecordsTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {patient.surgery?.description && (
        <Card>
          <h3 className="mb-4">Tashxis</h3>
          <p className="text-[#475569]">{patient.surgery.description}</p>
        </Card>
      )}

      {patient.medical_records && patient.medical_records.length > 0 && (
        <Card>
          <h3 className="mb-4">Tibbiy yozuvlar</h3>
          <div className="space-y-4">
            {patient.medical_records.map((record) => (
              <NoteItem
                key={record.id}
                date={formatDate(record.record_text.date)}
                doctor={patient.assigned_doctor}
                note={record.record_text.text}
                title={record.record_title}
              />
            ))}
          </div>
        </Card>
      )}

      {(!patient.medical_records || patient.medical_records.length === 0) && (
        <Card>
          <div className="text-[#475569] text-center py-8">
            Tibbiy yozuvlar mavjud emas
          </div>
        </Card>
      )}
    </div>
  );
};

const AdmissionTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusDisplay = (status?: string) => {
    const statusMap: Record<string, string> = {
      pre_op: "Operatsiyadan oldin",
      in_surgery: "Operatsiya davomida",
      post_op: "Operatsiyadan keyin",
      recovery: "Tiklanishda",
      in_recovery: "Tiklanishda",
      stable: "Barqaror",
      discharged: "Bo'shatilgan",
    };
    return statusMap[status || ""] || status || "Noma'lum";
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8FAFC]">
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left px-6 py-4 text-[#475569]">
                Qabul qilingan sana
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Shifokor</th>
              <th className="text-left px-6 py-4 text-[#475569]">Holat</th>
            </tr>
          </thead>
          <tbody>
            <tr
              className="border-b border-[#E2E8F0]"
              style={{ height: "64px" }}
            >
              <td className="px-6 py-4">{formatDate(patient.admitted_at)}</td>
              <td className="px-6 py-4">{patient.assigned_doctor}</td>
              <td className="px-6 py-4">
                <Badge variant="success">
                  {getStatusDisplay(patient.status)}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const CarePlanTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const carePlan = patient.care_bundle?.care_plan;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <Bot size={16} className="inline mr-2" />
          AI bilan yaratish
        </Button>
      </div>

      {carePlan?.pre_op && carePlan.pre_op.length > 0 && (
        <Card>
          <h3 className="mb-4">Operatsiyadan oldingi ko'rsatmalar</h3>
          <ul className="list-disc list-inside space-y-2 text-[#475569]">
            {carePlan.pre_op.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </Card>
      )}

      {carePlan?.post_op && carePlan.post_op.length > 0 && (
        <Card>
          <h3 className="mb-4">Operatsiyadan keyingi ko'rsatmalar</h3>
          <ul className="list-disc list-inside space-y-2 text-[#475569]">
            {carePlan.post_op.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </Card>
      )}

      {(!carePlan || (!carePlan.pre_op && !carePlan.post_op)) && (
        <Card>
          <div className="text-[#475569] text-center py-8">
            Parvarish rejasi mavjud emas
          </div>
        </Card>
      )}
    </div>
  );
};

const MedicationsTab: React.FC<{
  patient: Patient;
  onOpenSelector: () => void;
  onRemove: (id: number) => void;
}> = ({ patient, onOpenSelector, onRemove }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3>Joriy dorilar</h3>
        <Button onClick={onOpenSelector}>
          <Plus size={16} className="inline mr-2" />
          Dori qo'shish
        </Button>
      </div>
      <Card>
        {patient.medications && patient.medications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC]">
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left px-6 py-4 text-[#475569]">Dori</th>
                  <th className="text-left px-6 py-4 text-[#475569]">Dozasi</th>
                  <th className="text-left px-6 py-4 text-[#475569]">
                    Chastotasi
                  </th>
                  <th className="text-left px-6 py-4 text-[#475569]">
                    Boshlanish sanasi
                  </th>
                  <th className="text-left px-6 py-4 text-[#475569]">
                    Tugash sanasi
                  </th>
                  <th className="text-left px-6 py-4 text-[#475569]">
                    Harakat
                  </th>
                </tr>
              </thead>
              <tbody>
                {patient.medications.map((medication) => (
                  <tr key={medication.id} className="border-b border-[#E2E8F0]">
                    <td className="px-6 py-4 text-[#0F172A] font-medium">
                      {medication.name}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">
                      {medication.dosage}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">
                      {medication.frequency}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">
                      {formatDate(medication.start_date)}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">
                      {formatDate(medication.end_date)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onRemove(medication.id)}
                        className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                        title="Olib tashlash"
                      >
                        <X size={16} className="text-[#EF4444]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[#475569] text-center py-8">
            Dorilar mavjud emas
          </div>
        )}
      </Card>
    </div>
  );
};

const DietTab: React.FC<{
  patient: Patient;
  onOpenSelector: () => void;
  onRemove: () => void;
}> = ({ patient, onOpenSelector, onRemove }) => {
  const dietPlan =
    patient.care_bundle?.diet_plan ||
    (patient.surgery?.diet_plan && patient.surgery.diet_plan !== null
      ? patient.surgery.diet_plan
      : null) ||
    null;

  // Type guard: Check if it's CareBundleDietPlan (has summary property)
  const isCareBundleDietPlan = (
    plan: typeof dietPlan
  ): plan is import("../types/patient").CareBundleDietPlan => {
    return plan !== undefined && plan !== null && "summary" in plan;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>Dieta rejasi</h3>
        {dietPlan ? (
          <Button variant="outline" onClick={onRemove}>
            <X size={16} className="inline mr-2" />
            Dieta rejasini olib tashlash
          </Button>
        ) : (
          <Button onClick={onOpenSelector}>
            <Plus size={16} className="inline mr-2" />
            Dieta rejasi tanlash
          </Button>
        )}
      </div>
      {dietPlan && (
        <>
          <Card>
            <h3 className="mb-4">Dieta rejasi xulosa</h3>
            <div className="space-y-3">
              {isCareBundleDietPlan(dietPlan) ? (
                <>
                  {dietPlan.summary.diet_type && (
                    <InfoRow
                      label="Dieta turi"
                      value={dietPlan.summary.diet_type}
                    />
                  )}
                  {dietPlan.summary.goal_calories && (
                    <InfoRow
                      label="Maqsadli kaloriya"
                      value={dietPlan.summary.goal_calories}
                    />
                  )}
                  {dietPlan.summary.notes && (
                    <InfoRow
                      label="Eslatmalar"
                      value={dietPlan.summary.notes}
                    />
                  )}
                </>
              ) : (
                <>
                  {dietPlan.diet_type && (
                    <InfoRow label="Dieta turi" value={dietPlan.diet_type} />
                  )}
                  {dietPlan.goal_calories && (
                    <InfoRow
                      label="Maqsadli kaloriya"
                      value={
                        typeof dietPlan.goal_calories === "number"
                          ? `${dietPlan.goal_calories} kcal/kun`
                          : dietPlan.goal_calories
                      }
                    />
                  )}
                  {dietPlan.notes && (
                    <InfoRow label="Eslatmalar" value={dietPlan.notes} />
                  )}
                  {dietPlan.protein_target && (
                    <InfoRow
                      label="Protein maqsadi"
                      value={dietPlan.protein_target}
                    />
                  )}
                </>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            {dietPlan.allowed_foods && dietPlan.allowed_foods.length > 0 && (
              <Card>
                <h3 className="mb-4 text-[#22C55E]">Ruxsat etilgan ovqatlar</h3>
                <ul className="space-y-2">
                  {(Array.isArray(dietPlan.allowed_foods)
                    ? dietPlan.allowed_foods
                    : []
                  ).map((food, index) => (
                    <li
                      key={typeof food === "string" ? index : food.id}
                      className="flex items-center gap-2 text-[#475569]"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                      {typeof food === "string" ? food : food.name}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {dietPlan.forbidden_foods &&
              dietPlan.forbidden_foods.length > 0 && (
                <Card>
                  <h3 className="mb-4 text-[#EF4444]">Taqiqlangan ovqatlar</h3>
                  <ul className="space-y-2">
                    {(Array.isArray(dietPlan.forbidden_foods)
                      ? dietPlan.forbidden_foods
                      : []
                    ).map((food, index) => (
                      <li
                        key={typeof food === "string" ? index : food.id}
                        className="flex items-center gap-2 text-[#475569]"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                        {typeof food === "string" ? food : food.name}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
          </div>

          {patient.care_bundle?.diet_plan?.meal_plan &&
            patient.care_bundle.diet_plan.meal_plan.length > 0 && (
              <Card>
                <h3 className="mb-4">Ovqatlanish rejasi</h3>
                <div className="space-y-4">
                  {patient.care_bundle.diet_plan.meal_plan.map(
                    (meal, index) => {
                      const [mealName, ...foodParts] = meal.split(":");
                      const food = foodParts.join(":").trim();
                      return (
                        <MealRow
                          key={index}
                          meal={mealName || meal}
                          food={food || meal}
                        />
                      );
                    }
                  )}
                </div>
              </Card>
            )}
        </>
      )}

      {!dietPlan && (
        <Card>
          <div className="text-[#475569] text-center py-8">
            Dieta rejasi mavjud emas
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button>
          <Bot size={16} className="inline mr-2" />
          AI bilan dietani optimallashtirish
        </Button>
      </div>
    </div>
  );
};

const ActivitiesTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const activityPlan =
    patient.care_bundle?.activities ||
    (patient.surgery?.activity_plan && patient.surgery.activity_plan !== null
      ? patient.surgery.activity_plan
      : null) ||
    null;

  return (
    <div className="space-y-6">
      {activityPlan && (
        <div className="grid grid-cols-2 gap-6">
          {activityPlan.allowed && activityPlan.allowed.length > 0 && (
            <div>
              <h3 className="mb-4 text-[#22C55E]">
                Ruxsat etilgan faoliyatlar
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(Array.isArray(activityPlan.allowed)
                  ? activityPlan.allowed
                  : []
                ).map((activity, index) => (
                  <ActivityCard
                    key={typeof activity === "string" ? index : activity.id}
                    type="allowed"
                    activity={
                      typeof activity === "string" ? activity : activity.name
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {activityPlan.restricted && activityPlan.restricted.length > 0 && (
            <div>
              <h3 className="mb-4 text-[#EF4444]">Cheklangan faoliyatlar</h3>
              <div className="grid grid-cols-2 gap-3">
                {(Array.isArray(activityPlan.restricted)
                  ? activityPlan.restricted
                  : []
                ).map((activity, index) => (
                  <ActivityCard
                    key={typeof activity === "string" ? index : activity.id}
                    type="restricted"
                    activity={
                      typeof activity === "string" ? activity : activity.name
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {patient.surgery?.activity_plan?.notes && (
        <Card>
          <h3 className="mb-4">Faoliyat eslatmalari</h3>
          <p className="text-[#475569]">
            {patient.surgery.activity_plan.notes}
          </p>
        </Card>
      )}

      {!activityPlan && (
        <Card>
          <div className="text-[#475569] text-center py-8">
            Faoliyat rejasi mavjud emas
          </div>
        </Card>
      )}

      <Card>
        <h3 className="mb-4">AI xavfsizlik tekshiruvchisi</h3>
        <p className="text-[#475569] mb-4">
          AI dan so'rang, bu bemorning hozirgi holati uchun faoliyat xavfsizmi
          yoki yo'qmi.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Masalan, Men suzishim mumkinmi?"
            className="flex-1 px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white"
          />
          <Button>Xavfsizlikni tekshirish</Button>
        </div>
      </Card>
    </div>
  );
};

const AIInsightsTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const aiInsights = patient.care_bundle?.ai_insights;

  return (
    <div className="space-y-6">
      {aiInsights?.risk_assessments &&
        aiInsights.risk_assessments.length > 0 && (
          <Card>
            <h3 className="mb-4">Xavf baholash</h3>
            <p className="text-[#475569] mb-4">
              AI tomonidan aniqlangan potentsial xavflar:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#475569]">
              {aiInsights.risk_assessments.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </Card>
        )}

      {aiInsights?.predictive_analytics &&
        aiInsights.predictive_analytics.length > 0 && (
          <Card>
            <h3 className="mb-4">Bashoratli tahlil</h3>
            <p className="text-[#475569] mb-4">
              Hozirgi taraqqiyotga asoslanib, AI bashorat qiladi:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#475569]">
              {aiInsights.predictive_analytics.map((prediction, index) => (
                <li key={index}>{prediction}</li>
              ))}
            </ul>
          </Card>
        )}

      {aiInsights?.recommended_actions &&
        aiInsights.recommended_actions.length > 0 && (
          <Card>
            <h3 className="mb-4">Tavsiya etilgan harakatlar</h3>
            <ul className="space-y-3">
              {aiInsights.recommended_actions.map((action, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[12px] shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-[#0F172A] mb-1">{action}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}

      {!aiInsights && (
        <Card>
          <div className="text-[#475569] text-center py-8">
            AI tahlillari mavjud emas
          </div>
        </Card>
      )}
    </div>
  );
};

const AppointmentsTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-end">
      <Button>+ Schedule New Appointment</Button>
    </div>

    <Card>
      <h3 className="mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        <AppointmentRow
          date="Dec 2, 2025"
          time="10:00 AM"
          doctor="Dr. Sarah Johnson"
          type="Follow-up Consultation"
          status="confirmed"
        />
        <AppointmentRow
          date="Dec 9, 2025"
          time="2:00 PM"
          doctor="Dr. Michael Chen"
          type="Post-Op Check"
          status="confirmed"
        />
        <AppointmentRow
          date="Dec 16, 2025"
          time="11:00 AM"
          doctor="Physical Therapist"
          type="Physical Therapy"
          status="scheduled"
        />
      </div>
    </Card>

    <Card>
      <h3 className="mb-4">Past Appointments</h3>
      <div className="space-y-4">
        <AppointmentRow
          date="Nov 25, 2025"
          time="9:00 AM"
          doctor="Dr. Michael Chen"
          type="Post-Surgery Check"
          status="completed"
        />
        <AppointmentRow
          date="Nov 20, 2025"
          time="3:00 PM"
          doctor="Dr. Sarah Johnson"
          type="Wound Check"
          status="completed"
        />
      </div>
    </Card>
  </div>
);

// Helper Components
const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between py-2 border-b border-[#E2E8F0] last:border-0">
    <span className="text-[#475569]">{label}</span>
    <span className="text-[#0F172A]">{value}</span>
  </div>
);

const VitalCard: React.FC<{
  icon: any;
  label: string;
  value: string;
  status: "success" | "warning" | "error";
}> = ({ icon: Icon, label, value, status }) => {
  const colors = {
    success: "#22C55E",
    warning: "#FACC15",
    error: "#EF4444",
  };

  return (
    <div className="p-4 rounded-lg border border-[#E2E8F0]">
      <Icon size={20} style={{ color: colors[status] }} className="mb-2" />
      <div className="text-[13px] text-[#475569] mb-1">{label}</div>
      <div className="text-[#0F172A]">{value}</div>
    </div>
  );
};

const TaskRow: React.FC<{
  icon: any;
  task: string;
  time: string;
  status: "success" | "warning" | "neutral";
}> = ({ icon: Icon, task, time, status }) => {
  const getBadgeVariant = () => {
    if (status === "success") return "success";
    if (status === "warning") return "warning";
    return "neutral";
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-[#F8FAFC]">
      <Icon size={16} className="text-[#2563EB]" />
      <div className="flex-1">
        <div className="text-[#0F172A]">{task}</div>
        <div className="text-[13px] text-[#475569]">{time}</div>
      </div>
      <Badge variant={getBadgeVariant()} size="sm">
        {status === "success"
          ? "Bajarildi"
          : status === "warning"
          ? "Kutilmoqda"
          : "Rejalashtirilgan"}
      </Badge>
    </div>
  );
};

const NoteItem: React.FC<{
  date: string;
  doctor: string;
  note: string;
  title?: string;
}> = ({ date, doctor, note, title }) => (
  <div className="p-4 rounded-lg border border-[#E2E8F0]">
    <div className="flex justify-between mb-2">
      <div>
        {title && (
          <div className="text-[#0F172A] font-medium mb-1">{title}</div>
        )}
        <span className="text-[#0F172A]">{doctor}</span>
      </div>
      <span className="text-[13px] text-[#475569]">{date}</span>
    </div>
    <p className="text-[#475569]">{note}</p>
  </div>
);

const FileCard: React.FC<{ name: string; date: string }> = ({ name, date }) => (
  <div
    className="p-4 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] transition-colors cursor-pointer"
    style={{ height: "120px" }}
  >
    <FileText size={32} className="text-[#2563EB] mb-2" />
    <div className="text-[#0F172A] mb-1">{name}</div>
    <div className="text-[13px] text-[#475569]">{date}</div>
  </div>
);

const MealRow: React.FC<{ meal: string; food: string }> = ({ meal, food }) => (
  <div className="flex gap-4 p-3 rounded-lg border border-[#E2E8F0]">
    <div className="text-[#0F172A] min-w-[100px]">{meal}</div>
    <div className="text-[#475569]">{food}</div>
  </div>
);

const ActivityCard: React.FC<{
  type: "allowed" | "restricted";
  activity: string;
}> = ({ type, activity }) => (
  <div
    className={`p-4 rounded-lg border ${
      type === "allowed"
        ? "border-[#BBF7D0] bg-[#F0FDF4]"
        : "border-[#FECACA] bg-[#FEF2F2]"
    }`}
    style={{ height: "80px" }}
  >
    <div
      className={`text-[14px] ${
        type === "allowed" ? "text-[#166534]" : "text-[#991B1B]"
      }`}
    >
      {activity}
    </div>
  </div>
);

const AppointmentRow: React.FC<{
  date: string;
  time: string;
  doctor: string;
  type: string;
  status: "confirmed" | "scheduled" | "completed";
}> = ({ date, time, doctor, type, status }) => {
  const getBadge = () => {
    if (status === "completed")
      return <Badge variant="neutral">Tugallangan</Badge>;
    if (status === "confirmed")
      return <Badge variant="success">Tasdiqlangan</Badge>;
    return <Badge variant="info">Rejalashtirilgan</Badge>;
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-[#E2E8F0]">
      <Calendar size={20} className="text-[#2563EB]" />
      <div className="flex-1">
        <div className="text-[#0F172A] mb-1">{type}</div>
        <div className="text-[14px] text-[#475569]">
          {date} at {time} • {doctor}
        </div>
      </div>
      {getBadge()}
    </div>
  );
};
