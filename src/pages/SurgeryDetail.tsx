import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Edit, Trash2, X } from "lucide-react";
import surgeriesService from "../service/surgeries";
import {
  Surgery as APISurgery,
  SurgeryPriorityLevel,
  DietPlan,
  Medication,
  Food,
} from "../types/patient";

const tabs = [
  { id: "overview", label: "Umumiy ko'rinish" },
  { id: "diet-plan", label: "Dieta rejasi" },
  { id: "medications", label: "Dorilar" },
  { id: "activities", label: "Faoliyatlar" },
];

export const SurgeryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apiSurgery, setApiSurgery] = useState<APISurgery | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Diet Plan Modal States
  const [showDietPlanModal, setShowDietPlanModal] = useState(false);
  const [isSavingDietPlan, setIsSavingDietPlan] = useState(false);
  const [dietPlanForm, setDietPlanForm] = useState({
    summary: "",
    diet_type: "",
    goal_calories: "",
    protein_target: "",
    notes: "",
    allowed_foods: [] as string[],
    forbidden_foods: [] as string[],
  });
  const [newAllowedFood, setNewAllowedFood] = useState("");
  const [newForbiddenFood, setNewForbiddenFood] = useState("");

  // Medication Modal States
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState<number | null>(
    null
  );
  const [isSavingMedication, setIsSavingMedication] = useState(false);
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    start_date: "",
    end_date: "",
  });

  const surgeryId = id ? parseInt(id) : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!surgeryId) {
        setError("Jarrohlik ID si topilmadi");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [surgery, meds] = await Promise.all([
          surgeriesService.getSurgery(surgeryId),
          surgeriesService.getMedications(surgeryId).catch(() => []),
        ]);
        setApiSurgery(surgery);
        setMedications(meds);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [surgeryId]);

  const refreshSurgery = async () => {
    if (!surgeryId) return;
    try {
      const surgery = await surgeriesService.getSurgery(surgeryId);
      setApiSurgery(surgery);
    } catch (err) {
      console.error("Failed to refresh surgery:", err);
    }
  };

  const refreshMedications = async () => {
    if (!surgeryId) return;
    try {
      const meds = await surgeriesService.getMedications(surgeryId);
      setMedications(meds);
    } catch (err) {
      console.error("Failed to refresh medications:", err);
    }
  };

  // Diet Plan CRUD
  const handleCreateDietPlan = () => {
    setDietPlanForm({
      summary: "",
      diet_type: "",
      goal_calories: "",
      protein_target: "",
      notes: "",
      allowed_foods: [],
      forbidden_foods: [],
    });
    setShowDietPlanModal(true);
  };

  const handleEditDietPlan = () => {
    if (!apiSurgery?.diet_plan) return;
    const plan = apiSurgery.diet_plan;
    setDietPlanForm({
      summary: plan.summary || "",
      diet_type: plan.diet_type || "",
      goal_calories: plan.goal_calories?.toString() || "",
      protein_target: plan.protein_target || "",
      notes: plan.notes || "",
      allowed_foods: plan.allowed_foods?.map((f) => f.name) || [],
      forbidden_foods: plan.forbidden_foods?.map((f) => f.name) || [],
    });
    setShowDietPlanModal(true);
  };

  const handleSaveDietPlan = async () => {
    if (!surgeryId || !dietPlanForm.diet_type || !dietPlanForm.goal_calories) {
      alert("Iltimos, dieta turi va maqsadli kaloriyani to'ldiring");
      return;
    }

    try {
      setIsSavingDietPlan(true);
      const dietPlanData: {
        summary?: string;
        diet_type: string;
        goal_calories: number;
        protein_target?: string;
        notes?: string;
        allowed_foods?: Array<{ name: string }>;
        forbidden_foods?: Array<{ name: string }>;
      } = {
        summary: dietPlanForm.summary || undefined,
        diet_type: dietPlanForm.diet_type,
        goal_calories: parseInt(dietPlanForm.goal_calories),
        protein_target: dietPlanForm.protein_target || undefined,
        notes: dietPlanForm.notes || undefined,
        allowed_foods:
          dietPlanForm.allowed_foods.length > 0
            ? dietPlanForm.allowed_foods.map((name) => ({ name }))
            : undefined,
        forbidden_foods:
          dietPlanForm.forbidden_foods.length > 0
            ? dietPlanForm.forbidden_foods.map((name) => ({ name }))
            : undefined,
      };

      if (apiSurgery?.diet_plan) {
        await surgeriesService.updateDietPlan(surgeryId, dietPlanData);
      } else {
        await surgeriesService.createDietPlan(surgeryId, dietPlanData);
      }

      await refreshSurgery();
      setShowDietPlanModal(false);
    } catch (err: any) {
      console.error("Failed to save diet plan:", err);
      alert("Dieta rejasini saqlashda xatolik yuz berdi.");
    } finally {
      setIsSavingDietPlan(false);
    }
  };

  const handleDeleteDietPlan = async () => {
    if (!surgeryId || !apiSurgery?.diet_plan) return;
    if (!window.confirm("Dieta rejasini o'chirishni tasdiqlaysizmi?")) return;

    try {
      await surgeriesService.deleteDietPlan(surgeryId);
      await refreshSurgery();
    } catch (err: any) {
      console.error("Failed to delete diet plan:", err);
      alert("Dieta rejasini o'chirishda xatolik yuz berdi.");
    }
  };

  // Medication CRUD
  const handleCreateMedication = () => {
    setMedicationForm({
      name: "",
      dosage: "",
      frequency: "",
      start_date: "",
      end_date: "",
    });
    setEditingMedicationId(null);
    setShowMedicationModal(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setMedicationForm({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      start_date: medication.start_date.split("T")[0],
      end_date: medication.end_date.split("T")[0],
    });
    setEditingMedicationId(medication.id);
    setShowMedicationModal(true);
  };

  const handleSaveMedication = async () => {
    if (
      !surgeryId ||
      !medicationForm.name ||
      !medicationForm.dosage ||
      !medicationForm.frequency
    ) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    try {
      setIsSavingMedication(true);
      const medicationData = {
        name: medicationForm.name,
        dosage: medicationForm.dosage,
        frequency: medicationForm.frequency,
        start_date: medicationForm.start_date
          ? `${medicationForm.start_date}T00:00:00Z`
          : undefined,
        end_date: medicationForm.end_date
          ? `${medicationForm.end_date}T00:00:00Z`
          : undefined,
      };

      if (editingMedicationId) {
        await surgeriesService.updateMedication(
          surgeryId,
          editingMedicationId,
          medicationData
        );
      } else {
        await surgeriesService.createMedication(surgeryId, medicationData);
      }

      await refreshMedications();
      setShowMedicationModal(false);
      setEditingMedicationId(null);
    } catch (err: any) {
      console.error("Failed to save medication:", err);
      alert("Dorini saqlashda xatolik yuz berdi.");
    } finally {
      setIsSavingMedication(false);
    }
  };

  const handleDeleteMedication = async (medicationId: number) => {
    if (!surgeryId) return;
    if (!window.confirm("Dorini o'chirishni tasdiqlaysizmi?")) return;

    try {
      await surgeriesService.deleteMedication(surgeryId, medicationId);
      await refreshMedications();
    } catch (err: any) {
      console.error("Failed to delete medication:", err);
      alert("Dorini o'chirishda xatolik yuz berdi.");
    }
  };

  const getPriorityBadgeVariant = (priority: SurgeryPriorityLevel) => {
    if (priority === "high") return "error";
    if (priority === "medium") return "warning";
    return "success";
  };

  const getPriorityDisplay = (priority: SurgeryPriorityLevel) => {
    const priorityMap: Record<string, string> = {
      high: "Yuqori",
      medium: "O'rta",
      low: "Past",
    };
    return priorityMap[priority] || priority;
  };

  const getTypeDisplay = (type: APISurgery["type"]) => {
    if (typeof type === "object" && type !== null) {
      return type.name;
    } else if (typeof type === "string") {
      return type;
    } else if (typeof type === "number") {
      return `Type ${type}`;
    }
    return "N/A";
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

  if (error || !apiSurgery) {
    return (
      <MainLayout>
        <Card padding="24px">
          <div className="text-center">
            <h2 className="mb-2">Xatolik</h2>
            <p className="text-[#475569] mb-6">
              {error || "Jarrohlik topilmadi"}
            </p>
            <Button variant="outline" onClick={() => navigate("/surgeries")}>
              <ArrowLeft size={16} className="inline mr-2" />
              Jarrohliklar ro'yxatiga qaytish
            </Button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/surgeries")}
          className="mb-4"
        >
          <ArrowLeft size={16} className="inline mr-2" />
          Jarrohliklar ro'yxatiga qaytish
        </Button>
        <h1 className="mb-2">{apiSurgery.name}</h1>
        <div className="flex items-center gap-4 text-[#475569]">
          <Badge variant="info">{getTypeDisplay(apiSurgery.type)}</Badge>
          <span>•</span>
          <Badge variant={getPriorityBadgeVariant(apiSurgery.priority_level)}>
            {getPriorityDisplay(apiSurgery.priority_level)} prioritet
          </Badge>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <Card>
          <div className="space-y-6">
            <div>
              <h2>{apiSurgery.name}</h2>
              <div className="flex gap-2 mt-2">
                <Badge variant="info">{getTypeDisplay(apiSurgery.type)}</Badge>
                <Badge
                  variant={getPriorityBadgeVariant(apiSurgery.priority_level)}
                >
                  {getPriorityDisplay(apiSurgery.priority_level)} prioritet
                </Badge>
              </div>
            </div>
            {apiSurgery.description && (
              <div>
                <div className="text-[#475569] mb-2">Tavsif</div>
                <p className="text-[#0F172A]">{apiSurgery.description}</p>
              </div>
            )}
            {!apiSurgery.description && (
              <div className="text-[#475569]">Tavsif mavjud emas</div>
            )}
          </div>
        </Card>
      )}

      {activeTab === "diet-plan" && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2>Dieta rejasi</h2>
            <div className="flex gap-2">
              {apiSurgery.diet_plan && (
                <>
                  <Button variant="outline" onClick={handleEditDietPlan}>
                    <Edit size={16} className="inline mr-2" />
                    Tahrirlash
                  </Button>
                  <Button variant="outline" onClick={handleDeleteDietPlan}>
                    <Trash2 size={16} className="inline mr-2" />
                    O'chirish
                  </Button>
                </>
              )}
              {!apiSurgery.diet_plan && (
                <Button onClick={handleCreateDietPlan}>
                  <Plus size={16} className="inline mr-2" />
                  Dieta rejasi qo'shish
                </Button>
              )}
            </div>
          </div>
          {apiSurgery.diet_plan ? (
            <div className="space-y-4">
              <div>
                <div className="text-[#475569] mb-2">Dieta turi</div>
                <div className="text-[#0F172A]">
                  {apiSurgery.diet_plan.diet_type}
                </div>
              </div>
              <div>
                <div className="text-[#475569] mb-2">Maqsadli kaloriya</div>
                <div className="text-[#0F172A]">
                  {apiSurgery.diet_plan.goal_calories} kcal/kun
                </div>
              </div>
              {apiSurgery.diet_plan.protein_target && (
                <div>
                  <div className="text-[#475569] mb-2">Protein maqsadi</div>
                  <div className="text-[#0F172A]">
                    {apiSurgery.diet_plan.protein_target}
                  </div>
                </div>
              )}
              {apiSurgery.diet_plan.notes && (
                <div>
                  <div className="text-[#475569] mb-2">Eslatmalar</div>
                  <p className="text-[#0F172A]">{apiSurgery.diet_plan.notes}</p>
                </div>
              )}
              {apiSurgery.diet_plan.allowed_foods &&
                apiSurgery.diet_plan.allowed_foods.length > 0 && (
                  <div>
                    <div className="text-[#475569] mb-2">
                      Ruxsat etilgan ovqatlar
                    </div>
                    <ul className="space-y-2">
                      {apiSurgery.diet_plan.allowed_foods.map((food) => (
                        <li
                          key={food.id}
                          className="flex items-center gap-2 text-[#475569]"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                          {food.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {apiSurgery.diet_plan.forbidden_foods &&
                apiSurgery.diet_plan.forbidden_foods.length > 0 && (
                  <div>
                    <div className="text-[#475569] mb-2">
                      Taqiqlangan ovqatlar
                    </div>
                    <ul className="space-y-2">
                      {apiSurgery.diet_plan.forbidden_foods.map((food) => (
                        <li
                          key={food.id}
                          className="flex items-center gap-2 text-[#475569]"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                          {food.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ) : (
            <div className="text-[#475569] text-center py-8">
              Dieta rejasi mavjud emas
            </div>
          )}
        </Card>
      )}

      {activeTab === "medications" && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2>Dorilar</h2>
            <Button onClick={handleCreateMedication}>
              <Plus size={16} className="inline mr-2" />
              Dori qo'shish
            </Button>
          </div>
          {medications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="text-left px-6 py-4 text-[#475569]">Dori</th>
                    <th className="text-left px-6 py-4 text-[#475569]">
                      Dozasi
                    </th>
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
                  {medications.map((medication) => (
                    <tr
                      key={medication.id}
                      className="border-b border-[#E2E8F0]"
                    >
                      <td className="px-6 py-4 text-[#0F172A]">
                        {medication.name}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {medication.dosage}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {medication.frequency}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {new Date(medication.start_date).toLocaleDateString(
                          "uz-UZ"
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#475569]">
                        {new Date(medication.end_date).toLocaleDateString(
                          "uz-UZ"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMedication(medication)}
                            className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                          >
                            <Edit size={16} className="text-[#2563EB]" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteMedication(medication.id)
                            }
                            className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                          >
                            <Trash2 size={16} className="text-[#EF4444]" />
                          </button>
                        </div>
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
      )}

      {activeTab === "activities" && (
        <Card>
          <h2 className="mb-4">Faoliyatlar</h2>
          {apiSurgery.activity_plan ? (
            <>
              <div className="grid grid-cols-2 gap-6">
                {apiSurgery.activity_plan.allowed &&
                  apiSurgery.activity_plan.allowed.length > 0 && (
                    <div>
                      <h3 className="text-[#22C55E] mb-4">
                        Ruxsat etilgan faoliyatlar
                      </h3>
                      <ul className="space-y-2">
                        {apiSurgery.activity_plan.allowed.map((activity) => (
                          <li
                            key={activity.id}
                            className="flex items-center gap-2 text-[#475569]"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                            {activity.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                {apiSurgery.activity_plan.restricted &&
                  apiSurgery.activity_plan.restricted.length > 0 && (
                    <div>
                      <h3 className="text-[#EF4444] mb-4">
                        Cheklangan faoliyatlar
                      </h3>
                      <ul className="space-y-2">
                        {apiSurgery.activity_plan.restricted.map((activity) => (
                          <li
                            key={activity.id}
                            className="flex items-center gap-2 text-[#475569]"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                            {activity.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
              {apiSurgery.activity_plan.notes && (
                <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                  <div className="text-[#475569] mb-2">Eslatmalar</div>
                  <p className="text-[#0F172A]">
                    {apiSurgery.activity_plan.notes}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-[#475569] text-center py-8">
              Faoliyat rejasi mavjud emas
            </div>
          )}
        </Card>
      )}

      {/* Diet Plan Modal */}
      {showDietPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card
            padding="24px"
            className="w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2>
                {apiSurgery?.diet_plan
                  ? "Dieta rejasini tahrirlash"
                  : "Dieta rejasi qo'shish"}
              </h2>
              <button
                onClick={() => setShowDietPlanModal(false)}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">
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
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-2">
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
                  placeholder="Masalan, 2000"
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-2">
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
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-2">Xulosa</label>
                <textarea
                  value={dietPlanForm.summary}
                  onChange={(e) =>
                    setDietPlanForm({
                      ...dietPlanForm,
                      summary: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-[#475569] mb-2">Eslatmalar</label>
                <textarea
                  value={dietPlanForm.notes}
                  onChange={(e) =>
                    setDietPlanForm({ ...dietPlanForm, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Ruxsat etilgan ovqatlar
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newAllowedFood}
                      onChange={(e) => setNewAllowedFood(e.target.value)}
                      placeholder="Ovqat nomi"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newAllowedFood.trim()) {
                          setDietPlanForm({
                            ...dietPlanForm,
                            allowed_foods: [
                              ...dietPlanForm.allowed_foods,
                              newAllowedFood.trim(),
                            ],
                          });
                          setNewAllowedFood("");
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (newAllowedFood.trim()) {
                          setDietPlanForm({
                            ...dietPlanForm,
                            allowed_foods: [
                              ...dietPlanForm.allowed_foods,
                              newAllowedFood.trim(),
                            ],
                          });
                          setNewAllowedFood("");
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <ul className="space-y-1">
                    {dietPlanForm.allowed_foods.map((food, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-[#F0FDF4] rounded"
                      >
                        <span className="text-[#166534]">{food}</span>
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
                          <X size={16} className="text-[#EF4444]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-[#475569] mb-2">
                    Taqiqlangan ovqatlar
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newForbiddenFood}
                      onChange={(e) => setNewForbiddenFood(e.target.value)}
                      placeholder="Ovqat nomi"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newForbiddenFood.trim()) {
                          setDietPlanForm({
                            ...dietPlanForm,
                            forbidden_foods: [
                              ...dietPlanForm.forbidden_foods,
                              newForbiddenFood.trim(),
                            ],
                          });
                          setNewForbiddenFood("");
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (newForbiddenFood.trim()) {
                          setDietPlanForm({
                            ...dietPlanForm,
                            forbidden_foods: [
                              ...dietPlanForm.forbidden_foods,
                              newForbiddenFood.trim(),
                            ],
                          });
                          setNewForbiddenFood("");
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <ul className="space-y-1">
                    {dietPlanForm.forbidden_foods.map((food, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-[#FEF2F2] rounded"
                      >
                        <span className="text-[#991B1B]">{food}</span>
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
                          <X size={16} className="text-[#EF4444]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDietPlanModal(false)}
              >
                Bekor qilish
              </Button>
              <Button
                fullWidth
                onClick={handleSaveDietPlan}
                disabled={isSavingDietPlan}
              >
                {isSavingDietPlan ? (
                  <>
                    <Loader2 className="animate-spin inline mr-2" size={16} />
                    Saqlanmoqda...
                  </>
                ) : (
                  "Saqlash"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Medication Modal */}
      {showMedicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card padding="24px" className="w-[90%] max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2>
                {editingMedicationId
                  ? "Dorini tahrirlash"
                  : "Yangi dori qo'shish"}
              </h2>
              <button
                onClick={() => {
                  setShowMedicationModal(false);
                  setEditingMedicationId(null);
                }}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">Dori nomi *</label>
                <Input
                  value={medicationForm.name}
                  onChange={(e) =>
                    setMedicationForm({
                      ...medicationForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Masalan, Aspirin"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">Dozasi *</label>
                  <Input
                    value={medicationForm.dosage}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        dosage: e.target.value,
                      })
                    }
                    placeholder="Masalan, 100mg"
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
                    placeholder="Masalan, Kuniga 3 marta"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Boshlanish sanasi
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
                    Tugash sanasi
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

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowMedicationModal(false);
                  setEditingMedicationId(null);
                }}
              >
                Bekor qilish
              </Button>
              <Button
                fullWidth
                onClick={handleSaveMedication}
                disabled={isSavingMedication}
              >
                {isSavingMedication ? (
                  <>
                    <Loader2 className="animate-spin inline mr-2" size={16} />
                    Saqlanmoqda...
                  </>
                ) : editingMedicationId ? (
                  "Yangilash"
                ) : (
                  "Qo'shish"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};
