import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Bot,
  User,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import surgeriesService from "../service/surgeries";
import { Surgery as APISurgery, SurgeryRiskLevel } from "../types/patient";

// Component's internal Surgery interface (for display purposes)
interface Surgery {
  id: number;
  name: string;
  category: string;
  patientName: string;
  surgeon: string;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  riskLevel: "Low" | "Medium" | "High";
  description: string;
  expectedDuration: string;
}

// Map API surgery to component format
const mapAPISurgeryToComponent = (apiSurgery: APISurgery): Surgery => {
  const riskLevelMap: Record<SurgeryRiskLevel, "Low" | "Medium" | "High"> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return {
    id: apiSurgery.id,
    name: apiSurgery.name,
    category: apiSurgery.type || "General",
    patientName: "N/A", // Not in API
    surgeon: "N/A", // Not in API
    date: "N/A", // Not in API
    status: "Scheduled", // Not in API, default
    riskLevel: riskLevelMap[apiSurgery.risk_level] || "Medium",
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
  risk_level: SurgeryRiskLevel;
  description?: string;
} => {
  const riskLevelMap: Record<"Low" | "Medium" | "High", SurgeryRiskLevel> = {
    Low: "low",
    Medium: "medium",
    High: "high",
  };

  return {
    name: surgery.name,
    type: surgery.category,
    risk_level: riskLevelMap[surgery.riskLevel] || "medium",
    description: surgery.description || undefined,
  };
};

const allowedFoods = [
  "Lean chicken and turkey",
  "Fish (salmon, cod, tuna)",
  "Fresh vegetables (broccoli, spinach, carrots)",
  "Whole grains (brown rice, quinoa, oats)",
  "Low-fat dairy products",
  "Eggs",
  "Legumes and beans",
  "Fresh fruits (berries, apples, oranges)",
  "Nuts and seeds (almonds, walnuts)",
  "Olive oil and avocado",
];

const forbiddenFoods = [
  "Processed meats (bacon, sausage, deli meats)",
  "High-sodium snacks (chips, crackers)",
  "Fried foods",
  "Fast food",
  "Sugary desserts and pastries",
  "Alcohol",
  "Carbonated beverages",
  "High-sodium canned foods",
  "Fatty red meats",
  "Full-fat dairy products",
];

const meals = [
  {
    name: "Breakfast",
    time: "8:00 AM",
    items: [
      "Oatmeal with mixed berries",
      "Scrambled eggs (2 eggs)",
      "Whole wheat toast",
      "Herbal tea",
    ],
  },
  {
    name: "Lunch",
    time: "12:30 PM",
    items: [
      "Grilled chicken salad",
      "Olive oil dressing",
      "Whole grain roll",
      "Fresh fruit",
    ],
  },
  {
    name: "Dinner",
    time: "6:00 PM",
    items: ["Baked salmon", "Steamed vegetables", "Quinoa", "Side salad"],
  },
  {
    name: "Snacks",
    time: "Throughout day",
    items: [
      "Greek yogurt",
      "Almonds (small handful)",
      "Apple slices",
      "Carrot sticks with hummus",
    ],
  },
];

const allowedActivities = [
  "Gentle walking (10-15 minutes)",
  "Seated exercises",
  "Upper body stretches",
  "Reading and mental activities",
  "Light household tasks (seated)",
  "Physical therapy exercises",
  "Breathing exercises",
  "Ankle pumps and rotations",
  "Arm circles",
  "Meditation and relaxation",
  "Using assistive devices",
  "Short distance ambulation",
];

const restrictedActivities = [
  "Running or jogging",
  "Heavy lifting (>10 lbs)",
  "Jumping or hopping",
  "Climbing stairs independently",
  "Contact sports",
  "Driving (first 6 weeks)",
  "Kneeling or squatting",
  "High-impact exercises",
  "Swimming (until wound healed)",
  "Bending at waist deeply",
  "Twisting motions",
  "Standing for long periods",
];

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "diet-plan", label: "Diet Plan" },
  { id: "activities", label: "Activities" },
  { id: "medical-records", label: "Medical Records" },
];

export const Surgeries: React.FC = () => {
  const navigate = useNavigate();
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewSurgeryModal, setShowNewSurgeryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [surgeryForm, setSurgeryForm] = useState<Omit<Surgery, "id">>({
    name: "",
    category: "",
    patientName: "",
    surgeon: "",
    date: "",
    status: "Scheduled",
    riskLevel: "Low",
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

  const getRiskBadge = (risk: string) => {
    if (risk === "High") return "error";
    if (risk === "Medium") return "warning";
    return "success";
  };

  const filteredSurgeries = surgeries.filter(
    (surgery) =>
      surgery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSurgery = () => {
    setSurgeryForm({
      name: "",
      category: "",
      patientName: "",
      surgeon: "",
      date: "",
      status: "Scheduled",
      riskLevel: "Low",
      description: "",
      expectedDuration: "",
    });
    setShowNewSurgeryModal(true);
  };

  const handleSaveSurgery = async () => {
    if (!surgeryForm.name.trim() || !surgeryForm.category.trim()) {
      alert("Please fill in name and category");
      return;
    }

    try {
      setIsSaving(true);
      const apiSurgery = mapComponentToAPISurgery(surgeryForm);
      const createdSurgery = await surgeriesService.postSurgery(apiSurgery);
      const mappedSurgery = mapAPISurgeryToComponent(createdSurgery);
      setSurgeries([...surgeries, mappedSurgery]);
      setShowNewSurgeryModal(false);
      setSurgeryForm({
        name: "",
        category: "",
        patientName: "",
        surgeon: "",
        date: "",
        status: "Scheduled",
        riskLevel: "Low",
        description: "",
        expectedDuration: "",
      });
    } catch (error) {
      console.error("Failed to create surgery:", error);
      alert("Failed to create surgery. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDetails = (surgery: Surgery) => {
    navigate(`/surgery/${surgery.id}`);
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
        <h1>Surgeries</h1>
        <Button onClick={handleAddSurgery} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="animate-spin inline mr-2" size={16} />
              Saving...
            </>
          ) : (
            "+ New Surgery"
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
            placeholder="Search surgeries..."
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
                Surgery Name
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Category</th>
              <th className="text-left px-6 py-4 text-[#475569]">Risk Level</th>
              <th className="text-left px-6 py-4 text-[#475569]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurgeries.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-[#475569]"
                >
                  No surgeries found. Click "+ New Surgery" to add one.
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
                    <Badge variant={getRiskBadge(surgery.riskLevel)}>
                      {surgery.riskLevel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(surgery)}
                      className="py-2"
                    >
                      View Details
                    </Button>
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
              <h2>Add New Surgery</h2>
              <button
                onClick={() => {
                  setShowNewSurgeryModal(false);
                  setSurgeryForm({
                    name: "",
                    category: "",
                    patientName: "",
                    surgeon: "",
                    date: "",
                    status: "Scheduled",
                    riskLevel: "Low",
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
                    Surgery Name *
                  </label>
                  <Input
                    value={surgeryForm.name}
                    onChange={(e) =>
                      setSurgeryForm({ ...surgeryForm, name: e.target.value })
                    }
                    placeholder="e.g., Total Knee Replacement"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] mb-2">
                    Category *
                  </label>
                  <Input
                    value={surgeryForm.category}
                    onChange={(e) =>
                      setSurgeryForm({
                        ...surgeryForm,
                        category: e.target.value,
                      })
                    }
                    placeholder="e.g., Orthopedic"
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
                        setSurgeryForm({ ...surgeryForm, riskLevel: "Low" })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        surgeryForm.riskLevel === "Low"
                          ? "border-[#22C55E] bg-[#DCFCE7] text-[#166534]"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      Low
                    </button>
                    <button
                      onClick={() =>
                        setSurgeryForm({ ...surgeryForm, riskLevel: "Medium" })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        surgeryForm.riskLevel === "Medium"
                          ? "border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() =>
                        setSurgeryForm({ ...surgeryForm, riskLevel: "High" })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        surgeryForm.riskLevel === "High"
                          ? "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                          : "border-[#E2E8F0] bg-white text-[#475569]"
                      }`}
                    >
                      High
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Description</label>
                <textarea
                  value={surgeryForm.description}
                  onChange={(e) =>
                    setSurgeryForm({
                      ...surgeryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="e.g., Complete replacement of damaged knee joint with prosthetic implant..."
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
                  setSurgeryForm({
                    name: "",
                    category: "",
                    patientName: "",
                    surgeon: "",
                    date: "",
                    status: "Scheduled",
                    riskLevel: "Low",
                    description: "",
                    expectedDuration: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={handleSaveSurgery} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin inline mr-2" size={16} />
                    Saving...
                  </>
                ) : (
                  "Add Surgery"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

// Tab Components
const OverviewTab: React.FC<{
  surgery: Surgery;
  apiSurgery: APISurgery | null;
}> = ({ surgery, apiSurgery }) => {
  const displaySurgery = apiSurgery || surgery;
  const riskLevelMap: Record<SurgeryRiskLevel, "Low" | "Medium" | "High"> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  const riskLevel = apiSurgery
    ? riskLevelMap[apiSurgery.risk_level] || "Medium"
    : surgery.riskLevel;

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2>{displaySurgery.name}</h2>
          <Badge variant="info" className="mt-2">
            {apiSurgery ? apiSurgery.type : surgery.category}
          </Badge>
        </div>

        {displaySurgery.description && (
          <div>
            <div className="text-[#475569] mb-2">Description</div>
            <p className="text-[#0F172A]">{displaySurgery.description}</p>
          </div>
        )}

        <div>
          <div className="text-[#475569] mb-2">Risk Level</div>
          <Badge
            variant={
              riskLevel === "High"
                ? "error"
                : riskLevel === "Medium"
                ? "warning"
                : "success"
            }
          >
            {riskLevel} Risk
          </Badge>
        </div>
      </div>
    </Card>
  );
};

interface Food {
  id: number;
  name: string;
  type: "allowed" | "forbidden";
}

interface Meal {
  id: number;
  name: string;
  time: string;
  items: string[];
}

interface DietPlan {
  dietType: string;
  goalCalories: string;
  proteinTarget: string;
  notes: string;
}

const DietPlanTab: React.FC<{
  surgery: Surgery;
  apiSurgery: APISurgery | null;
}> = ({ surgery, apiSurgery }) => {
  // Use API diet plan if available, otherwise use defaults
  const apiDietPlan = apiSurgery?.diet_plan;

  const getInitialDietPlan = (): DietPlan => {
    if (apiDietPlan) {
      return {
        dietType: apiDietPlan.diet_type || "Low-Sodium, High-Protein",
        goalCalories: apiDietPlan.goal_calories
          ? `${apiDietPlan.goal_calories} kcal/day`
          : "2000 kcal/day",
        proteinTarget: apiDietPlan.protein_target || "100g/day",
        notes:
          apiDietPlan.notes ||
          "Focus on lean proteins and vegetables to support post-surgical recovery. Limit sodium intake to reduce swelling and support cardiovascular health. Maintain adequate hydration with at least 8 glasses of water daily.",
      };
    }
    return {
      dietType: "Low-Sodium, High-Protein",
      goalCalories: "2000 kcal/day",
      proteinTarget: "100g/day",
      notes:
        "Focus on lean proteins and vegetables to support post-surgical recovery. Limit sodium intake to reduce swelling and support cardiovascular health. Maintain adequate hydration with at least 8 glasses of water daily.",
    };
  };

  const getInitialAllowedFoods = (): Food[] => {
    if (apiDietPlan?.allowed_foods) {
      return apiDietPlan.allowed_foods.map((food) => ({
        id: food.id,
        name: food.name,
        type: "allowed" as const,
      }));
    }
    return allowedFoods.map((food, idx) => ({
      id: idx + 1,
      name: food,
      type: "allowed" as const,
    }));
  };

  const getInitialForbiddenFoods = (): Food[] => {
    if (apiDietPlan?.forbidden_foods) {
      return apiDietPlan.forbidden_foods.map((food) => ({
        id: food.id,
        name: food.name,
        type: "forbidden" as const,
      }));
    }
    return forbiddenFoods.map((food, idx) => ({
      id: idx + 100,
      name: food,
      type: "forbidden" as const,
    }));
  };

  const [dietPlan, setDietPlan] = useState<DietPlan>(getInitialDietPlan());
  const [allowedFoodsList, setAllowedFoodsList] = useState<Food[]>(
    getInitialAllowedFoods()
  );
  const [forbiddenFoodsList, setForbiddenFoodsList] = useState<Food[]>(
    getInitialForbiddenFoods()
  );
  const [mealsList, setMealsList] = useState<Meal[]>(
    meals.map((meal, idx) => ({ ...meal, id: idx + 1 }))
  );

  // Update state when API surgery data changes
  useEffect(() => {
    if (apiSurgery?.diet_plan) {
      setDietPlan(getInitialDietPlan());
      setAllowedFoodsList(getInitialAllowedFoods());
      setForbiddenFoodsList(getInitialForbiddenFoods());
    }
  }, [apiSurgery]);

  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showDietPlanModal, setShowDietPlanModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [foodForm, setFoodForm] = useState({
    name: "",
    type: "allowed" as "allowed" | "forbidden",
  });
  const [mealForm, setMealForm] = useState({
    name: "",
    time: "",
    items: "",
  });

  const handleAddFood = (type: "allowed" | "forbidden") => {
    setEditingFood(null);
    setFoodForm({ name: "", type });
    setShowFoodModal(true);
  };

  const handleEditFood = (food: Food) => {
    setEditingFood(food);
    setFoodForm({ name: food.name, type: food.type });
    setShowFoodModal(true);
  };

  const handleDeleteFood = (id: number, type: "allowed" | "forbidden") => {
    if (window.confirm("Are you sure you want to delete this food?")) {
      if (type === "allowed") {
        setAllowedFoodsList(allowedFoodsList.filter((f) => f.id !== id));
      } else {
        setForbiddenFoodsList(forbiddenFoodsList.filter((f) => f.id !== id));
      }
    }
  };

  const handleSaveFood = () => {
    if (!foodForm.name.trim()) {
      alert("Please enter a food name");
      return;
    }

    if (editingFood) {
      if (editingFood.type === "allowed") {
        setAllowedFoodsList(
          allowedFoodsList.map((f) =>
            f.id === editingFood.id ? { ...foodForm, id: editingFood.id } : f
          )
        );
      } else {
        setForbiddenFoodsList(
          forbiddenFoodsList.map((f) =>
            f.id === editingFood.id ? { ...foodForm, id: editingFood.id } : f
          )
        );
      }
    } else {
      const newId =
        Math.max(
          ...allowedFoodsList.map((f) => f.id),
          ...forbiddenFoodsList.map((f) => f.id),
          0
        ) + 1;
      if (foodForm.type === "allowed") {
        setAllowedFoodsList([...allowedFoodsList, { ...foodForm, id: newId }]);
      } else {
        setForbiddenFoodsList([
          ...forbiddenFoodsList,
          { ...foodForm, id: newId },
        ]);
      }
    }

    setShowFoodModal(false);
    setEditingFood(null);
    setFoodForm({ name: "", type: "allowed" });
  };

  const handleAddMeal = () => {
    setEditingMeal(null);
    setMealForm({ name: "", time: "", items: "" });
    setShowMealModal(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      time: meal.time,
      items: meal.items.join(", "),
    });
    setShowMealModal(true);
  };

  const handleDeleteMeal = (id: number) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      setMealsList(mealsList.filter((m) => m.id !== id));
    }
  };

  const handleSaveMeal = () => {
    if (!mealForm.name || !mealForm.time || !mealForm.items) {
      alert("Please fill in all fields");
      return;
    }

    const items = mealForm.items.split(",").map((item) => item.trim());

    if (editingMeal) {
      setMealsList(
        mealsList.map((m) =>
          m.id === editingMeal.id
            ? { ...mealForm, items, id: editingMeal.id }
            : m
        )
      );
    } else {
      const newId = Math.max(...mealsList.map((m) => m.id), 0) + 1;
      setMealsList([...mealsList, { ...mealForm, items, id: newId }]);
    }

    setShowMealModal(false);
    setEditingMeal(null);
    setMealForm({ name: "", time: "", items: "" });
  };

  const handleGenerateFromAI = () => {
    alert(
      `AI would generate diet plan based on surgery: ${surgery.name}. This would analyze nutritional requirements and recovery needs.`
    );
    // Simulate AI response
    setDietPlan({
      dietType: "Post-Surgical Recovery Diet",
      goalCalories: "2200 kcal/day",
      proteinTarget: "120g/day",
      notes:
        "AI-generated diet plan optimized for post-surgical recovery. High protein for tissue repair, adequate calories for energy, and anti-inflammatory foods.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2>Diet Plan</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateFromAI}>
            <Bot size={16} className="inline mr-2" />
            Generate from AI
          </Button>
          <Button variant="outline" onClick={() => setShowDietPlanModal(true)}>
            <Edit size={16} className="inline mr-2" />
            Edit Summary
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <h3 className="mb-4">Diet Plan Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-[#475569] mb-2">Diet Type</div>
            <div className="text-[#0F172A]">{dietPlan.dietType}</div>
          </div>
          <div>
            <div className="text-[#475569] mb-2">Goal Calories</div>
            <div className="text-[#0F172A]">{dietPlan.goalCalories}</div>
          </div>
          <div>
            <div className="text-[#475569] mb-2">Protein Target</div>
            <div className="text-[#0F172A]">{dietPlan.proteinTarget}</div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
          <div className="text-[#475569] mb-2">Notes</div>
          <p className="text-[#0F172A]">{dietPlan.notes}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#22C55E]">Allowed Foods</h3>
            <Button
              variant="outline"
              onClick={() => handleAddFood("allowed")}
              className="text-[#22C55E] border-[#22C55E] text-[12px] py-1"
            >
              <Plus size={18} className="inline mr-1" />
              Add
            </Button>
          </div>
          <ul className="space-y-3">
            {allowedFoodsList.map((food) => (
              <li
                key={food.id}
                className="flex items-start gap-3 group hover:bg-[#F8FAFC] p-2 rounded -ml-2"
              >
                <div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0"></div>
                <span className="text-[#475569] flex-1">{food.name}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => handleEditFood(food)}
                    className="p-1 rounded hover:bg-[#DCFCE7]"
                    title="Edit"
                  >
                    <Edit size={18} className="text-[#22C55E]" />
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food.id, food.type)}
                    className="p-1 rounded hover:bg-[#FEE2E2]"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-[#EF4444]" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#EF4444]">Forbidden Foods</h3>
            <Button
              variant="outline"
              onClick={() => handleAddFood("forbidden")}
              className="text-[#EF4444] border-[#EF4444] text-[12px] py-1"
            >
              <Plus size={18} className="inline mr-1" />
              Add
            </Button>
          </div>
          <ul className="space-y-3">
            {forbiddenFoodsList.map((food) => (
              <li
                key={food.id}
                className="flex items-start gap-3 group hover:bg-[#F8FAFC] p-2 rounded -ml-2"
              >
                <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-2 shrink-0"></div>
                <span className="text-[#475569] flex-1">{food.name}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => handleEditFood(food)}
                    className="p-1 rounded hover:bg-[#FEE2E2]"
                    title="Edit"
                  >
                    <Edit size={18} className="text-[#EF4444]" />
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food.id, food.type)}
                    className="p-1 rounded hover:bg-[#FEE2E2]"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-[#EF4444]" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3>Today's Meal Plan</h3>
          <Button variant="outline" onClick={handleAddMeal}>
            <Plus size={18} className="inline mr-2" />
            Add Meal
          </Button>
        </div>
        <div className="space-y-6">
          {mealsList.map((meal) => (
            <div
              key={meal.id}
              className="p-4 rounded-lg border border-[#E2E8F0] relative group"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[#0F172A]">{meal.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-[#475569]">
                    {meal.time}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={() => handleEditMeal(meal)}
                      className="p-1 rounded hover:bg-[#F8FAFC]"
                      title="Edit"
                    >
                      <Edit size={18} className="text-[#2563EB]" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="p-1 rounded hover:bg-[#FEE2E2]"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-[#EF4444]" />
                    </button>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {meal.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-center gap-2 text-[#475569]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Food Modal */}
      {showFoodModal && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",

            width: "100%",
          }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <Card padding="24px" width="400px">
            <div className="flex items-center justify-between mb-6">
              <h2>{editingFood ? "Edit Food" : "Add New Food"}</h2>
              <button
                onClick={() => {
                  setShowFoodModal(false);
                  setEditingFood(null);
                  setFoodForm({ name: "", type: "allowed" });
                }}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">Food Type *</label>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setFoodForm({ ...foodForm, type: "allowed" })
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                      foodForm.type === "allowed"
                        ? "border-[#22C55E] bg-[#DCFCE7] text-[#166534]"
                        : "border-[#E2E8F0] bg-white text-[#475569]"
                    }`}
                  >
                    Allowed
                  </button>
                  <button
                    onClick={() =>
                      setFoodForm({ ...foodForm, type: "forbidden" })
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                      foodForm.type === "forbidden"
                        ? "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                        : "border-[#E2E8F0] bg-white text-[#475569]"
                    }`}
                  >
                    Forbidden
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Food Name *</label>
                <Input
                  value={foodForm.name}
                  onChange={(e) =>
                    setFoodForm({ ...foodForm, name: e.target.value })
                  }
                  placeholder="e.g., Lean chicken and turkey"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowFoodModal(false);
                  setEditingFood(null);
                  setFoodForm({ name: "", type: "allowed" });
                }}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={handleSaveFood}>
                {editingFood ? "Update Food" : "Add Food"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Meal Modal */}
      {showMealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card
            padding="24px"
            className="w-[95%] min-w-[1400px]"
            style={{
              minWidth: "400px",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2>{editingMeal ? "Edit Meal" : "Add New Meal"}</h2>
              <button
                onClick={() => {
                  setShowMealModal(false);
                  setEditingMeal(null);
                  setMealForm({ name: "", time: "", items: "" });
                }}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">Meal Name *</label>
                <Input
                  value={mealForm.name}
                  onChange={(e) =>
                    setMealForm({ ...mealForm, name: e.target.value })
                  }
                  placeholder="e.g., Breakfast"
                />
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Time *</label>
                <Input
                  value={mealForm.time}
                  onChange={(e) =>
                    setMealForm({ ...mealForm, time: e.target.value })
                  }
                  placeholder="e.g., 8:00 AM"
                />
              </div>

              <div>
                <label className="block text-[#475569] mb-2">
                  Items (comma-separated) *
                </label>
                <textarea
                  value={mealForm.items}
                  onChange={(e) =>
                    setMealForm({ ...mealForm, items: e.target.value })
                  }
                  placeholder="e.g., Oatmeal with mixed berries, Scrambled eggs, Whole wheat toast"
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowMealModal(false);
                  setEditingMeal(null);
                  setMealForm({ name: "", time: "", items: "" });
                }}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={handleSaveMeal}>
                {editingMeal ? "Update Meal" : "Add Meal"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Diet Plan Summary Modal */}
      {showDietPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card padding="24px" className="w-[95%] min-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
              <h2>Edit Diet Plan Summary</h2>
              <button
                onClick={() => setShowDietPlanModal(false)}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">Diet Type *</label>
                <Input
                  value={dietPlan.dietType}
                  onChange={(e) =>
                    setDietPlan({ ...dietPlan, dietType: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Goal Calories *
                  </label>
                  <Input
                    value={dietPlan.goalCalories}
                    onChange={(e) =>
                      setDietPlan({ ...dietPlan, goalCalories: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#475569] mb-2">
                    Protein Target *
                  </label>
                  <Input
                    value={dietPlan.proteinTarget}
                    onChange={(e) =>
                      setDietPlan({
                        ...dietPlan,
                        proteinTarget: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Notes *</label>
                <textarea
                  value={dietPlan.notes}
                  onChange={(e) =>
                    setDietPlan({ ...dietPlan, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDietPlanModal(false)}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={() => setShowDietPlanModal(false)}>
                Update Summary
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

interface Activity {
  id: number;
  name: string;
  type: "allowed" | "restricted";
}

const ActivitiesTab: React.FC<{
  surgery: Surgery;
  apiSurgery: APISurgery | null;
}> = ({ surgery, apiSurgery }) => {
  // Use API activity plan if available, otherwise use defaults
  const apiActivityPlan = apiSurgery?.activity_plan;

  const getInitialAllowedActivities = (): Activity[] => {
    if (apiActivityPlan?.allowed) {
      return apiActivityPlan.allowed.map((act) => ({
        id: act.id,
        name: act.name,
        type: "allowed" as const,
      }));
    }
    return allowedActivities.map((act, idx) => ({
      id: idx + 1,
      name: act,
      type: "allowed" as const,
    }));
  };

  const getInitialRestrictedActivities = (): Activity[] => {
    if (apiActivityPlan?.restricted) {
      return apiActivityPlan.restricted.map((act) => ({
        id: act.id,
        name: act.name,
        type: "restricted" as const,
      }));
    }
    return restrictedActivities.map((act, idx) => ({
      id: idx + 100,
      name: act,
      type: "restricted" as const,
    }));
  };

  const [allowedActivitiesList, setAllowedActivitiesList] = useState<
    Activity[]
  >(getInitialAllowedActivities());
  const [restrictedActivitiesList, setRestrictedActivitiesList] = useState<
    Activity[]
  >(getInitialRestrictedActivities());

  // Update state when API surgery data changes
  useEffect(() => {
    if (apiSurgery?.activity_plan) {
      setAllowedActivitiesList(getInitialAllowedActivities());
      setRestrictedActivitiesList(getInitialRestrictedActivities());
    }
  }, [apiSurgery]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityForm, setActivityForm] = useState({
    name: "",
    type: "allowed" as "allowed" | "restricted",
  });
  const [aiQuery, setAiQuery] = useState("");

  const handleAddActivity = (type: "allowed" | "restricted") => {
    setEditingActivity(null);
    setActivityForm({ name: "", type });
    setShowActivityModal(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setActivityForm({ name: activity.name, type: activity.type });
    setShowActivityModal(true);
  };

  const handleDeleteActivity = (id: number, type: "allowed" | "restricted") => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      if (type === "allowed") {
        setAllowedActivitiesList(
          allowedActivitiesList.filter((act) => act.id !== id)
        );
      } else {
        setRestrictedActivitiesList(
          restrictedActivitiesList.filter((act) => act.id !== id)
        );
      }
    }
  };

  const handleSaveActivity = () => {
    if (!activityForm.name.trim()) {
      alert("Please enter an activity name");
      return;
    }

    if (editingActivity) {
      // Update existing
      if (editingActivity.type === "allowed") {
        setAllowedActivitiesList(
          allowedActivitiesList.map((act) =>
            act.id === editingActivity.id
              ? { ...activityForm, id: editingActivity.id }
              : act
          )
        );
      } else {
        setRestrictedActivitiesList(
          restrictedActivitiesList.map((act) =>
            act.id === editingActivity.id
              ? { ...activityForm, id: editingActivity.id }
              : act
          )
        );
      }
    } else {
      // Add new
      const newId =
        Math.max(
          ...allowedActivitiesList.map((a) => a.id),
          ...restrictedActivitiesList.map((a) => a.id),
          0
        ) + 1;
      if (activityForm.type === "allowed") {
        setAllowedActivitiesList([
          ...allowedActivitiesList,
          { ...activityForm, id: newId },
        ]);
      } else {
        setRestrictedActivitiesList([
          ...restrictedActivitiesList,
          { ...activityForm, id: newId },
        ]);
      }
    }

    setShowActivityModal(false);
    setEditingActivity(null);
    setActivityForm({ name: "", type: "allowed" });
  };

  const handleGenerateFromAI = () => {
    alert(
      `AI would generate activities based on surgery: ${surgery.name}. This would analyze recovery protocols and suggest appropriate activities.`
    );
    // Simulate AI response
    const aiAllowed = [
      "Light stretching exercises",
      "Deep breathing exercises",
      "Gentle range of motion",
    ];
    const aiRestricted = [
      "Heavy lifting",
      "Strenuous exercise",
      "High-impact activities",
    ];

    const newAllowedIds = Math.max(
      ...allowedActivitiesList.map((a) => a.id),
      0
    );
    const newRestrictedIds = Math.max(
      ...restrictedActivitiesList.map((a) => a.id),
      0
    );

    setAllowedActivitiesList([
      ...allowedActivitiesList,
      ...aiAllowed.map((name, idx) => ({
        id: newAllowedIds + idx + 1,
        name,
        type: "allowed" as const,
      })),
    ]);
    setRestrictedActivitiesList([
      ...restrictedActivitiesList,
      ...aiRestricted.map((name, idx) => ({
        id: newRestrictedIds + idx + 1,
        name,
        type: "restricted" as const,
      })),
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2>Activities</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateFromAI}>
            <Bot size={16} className="inline mr-2" />
            Generate from AI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#22C55E]">Allowed Activities</h2>
            <Button
              variant="outline"
              onClick={() => handleAddActivity("allowed")}
              className="text-[#22C55E] border-[#22C55E]"
            >
              <Plus size={18} className="inline mr-2" />
              Add
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {allowedActivitiesList.map((activity) => (
              <Card
                key={activity.id}
                padding="16px"
                className=" hover:border-[#22C55E] transition-colors relative group
                
                flex items-center justify-between
                "
              >
                <div className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-[#22C55E] shrink-0 mt-1"
                  />
                  <span className="text-[14px] text-[#166534] flex-1">
                    {activity.name}
                  </span>
                </div>
                <div className=" opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => handleEditActivity(activity)}
                    className="p-1 rounded hover:bg-[#DCFCE7] transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} className="text-[#22C55E]" />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteActivity(activity.id, activity.type)
                    }
                    className="p-1 rounded hover:bg-[#FEE2E2] transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-[#EF4444]" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#EF4444]">Restricted Activities</h2>
            <Button
              variant="outline"
              onClick={() => handleAddActivity("restricted")}
              className="text-[#EF4444] border-[#EF4444]"
            >
              <Plus size={18} className="inline mr-2" />
              Add
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {restrictedActivitiesList.map((activity) => (
              <Card
                key={activity.id}
                padding="16px"
                className="hover:border-[#EF4444] transition-colors relative group
                
                flex items-center justify-between
                "
              >
                <div className="flex items-start gap-2">
                  <XCircle size={16} className="text-[#EF4444] shrink-0 mt-1" />
                  <span className="text-[14px] text-[#991B1B] flex-1">
                    {activity.name}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => handleEditActivity(activity)}
                    className="p-1 rounded hover:bg-[#FEE2E2] transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} className="text-[#EF4444]" />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteActivity(activity.id, activity.type)
                    }
                    className="p-1 rounded hover:bg-[#FEE2E2] transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-[#EF4444]" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      {showActivityModal && (
        <div
          style={{
            background: "#0003",
          }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <Card padding="24px" className="w-[95%] min-w-[1400px]" width="400px">
            <div className="flex items-center justify-between mb-6">
              <h2>{editingActivity ? "Edit Activity" : "Add New Activity"}</h2>
              <button
                onClick={() => {
                  setShowActivityModal(false);
                  setEditingActivity(null);
                  setActivityForm({ name: "", type: "allowed" });
                }}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">
                  Activity Type *
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setActivityForm({ ...activityForm, type: "allowed" })
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                      activityForm.type === "allowed"
                        ? "border-[#22C55E] bg-[#DCFCE7] text-[#166534]"
                        : "border-[#E2E8F0] bg-white text-[#475569]"
                    }`}
                  >
                    Allowed
                  </button>
                  <button
                    onClick={() =>
                      setActivityForm({ ...activityForm, type: "restricted" })
                    }
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                      activityForm.type === "restricted"
                        ? "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                        : "border-[#E2E8F0] bg-white text-[#475569]"
                    }`}
                  >
                    Restricted
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] mb-2">
                  Activity Name *
                </label>
                <Input
                  value={activityForm.name}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, name: e.target.value })
                  }
                  placeholder="e.g., Gentle walking (10-15 minutes)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowActivityModal(false);
                  setEditingActivity(null);
                  setActivityForm({ name: "", type: "allowed" });
                }}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={handleSaveActivity}>
                {editingActivity ? "Update Activity" : "Add Activity"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  purpose: string;
}

interface DoctorNote {
  id: number;
  date: string;
  doctor: string;
  note: string;
}

interface MedicalFile {
  id: number;
  name: string;
  date: string;
}

const MedicalRecordsTab: React.FC<{
  surgery: Surgery;
  apiSurgery: APISurgery | null;
}> = ({ surgery, apiSurgery }) => {
  // Initial medications data - can be customized per surgery type
  const initialMedications: Medication[] = [
    {
      id: 1,
      name: "Oxycodone",
      dosage: "5mg",
      frequency: "Every 6 hours",
      startDate: "Nov 16, 2025",
      endDate: "Nov 30, 2025",
      purpose: "Pain management",
    },
    {
      id: 2,
      name: "Cephalexin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "Nov 16, 2025",
      endDate: "Nov 26, 2025",
      purpose: "Antibiotic - prevent infection",
    },
    {
      id: 3,
      name: "Enoxaparin",
      dosage: "40mg",
      frequency: "Once daily",
      startDate: "Nov 16, 2025",
      endDate: "Dec 1, 2025",
      purpose: "Blood thinner - prevent clots",
    },
    {
      id: 4,
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      startDate: "Nov 16, 2025",
      endDate: "Dec 10, 2025",
      purpose: "Anti-inflammatory",
    },
  ];

  const [medications, setMedications] =
    useState<Medication[]>(initialMedications);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null
  );
  const [medicationForm, setMedicationForm] = useState<Omit<Medication, "id">>({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    purpose: "",
  });

  // Doctor's Notes CRUD
  const initialNotes: DoctorNote[] = [
    {
      id: 1,
      date: "Nov 27, 2025",
      doctor: surgery.surgeon,
      note: "Post-operative check completed. Patient showing good progress. Recovery on track.",
    },
    {
      id: 2,
      date: "Nov 25, 2025",
      doctor: surgery.surgeon,
      note: "Surgery completed successfully. Patient stable. Incision healing well. No signs of infection.",
    },
    {
      id: 3,
      date: "Nov 22, 2025",
      doctor: surgery.surgeon,
      note: "Pre-operative assessment completed. Patient cleared for surgery. All tests normal.",
    },
  ];

  const [doctorNotes, setDoctorNotes] = useState<DoctorNote[]>(initialNotes);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<DoctorNote | null>(null);
  const [noteForm, setNoteForm] = useState({
    date: "",
    doctor: surgery.surgeon,
    note: "",
  });

  // Medical Files CRUD
  const initialFiles: MedicalFile[] = [
    { id: 1, name: "Pre-Op Assessment", date: "Nov 14, 2025" },
    { id: 2, name: "Blood Test", date: "Nov 14, 2025" },
    { id: 3, name: "X-Ray Results", date: "Nov 10, 2025" },
    { id: 4, name: "Surgery Report", date: "Nov 16, 2025" },
  ];

  const [medicalFiles, setMedicalFiles] = useState<MedicalFile[]>(initialFiles);

  const handleAddMedication = () => {
    setEditingMedication(null);
    setMedicationForm({
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      purpose: "",
    });
    setShowMedicationModal(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setMedicationForm({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      startDate: medication.startDate,
      endDate: medication.endDate,
      purpose: medication.purpose,
    });
    setShowMedicationModal(true);
  };

  const handleDeleteMedication = (id: number) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const handleSaveMedication = () => {
    if (
      !medicationForm.name ||
      !medicationForm.dosage ||
      !medicationForm.frequency ||
      !medicationForm.startDate ||
      !medicationForm.endDate ||
      !medicationForm.purpose
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (editingMedication) {
      // Update existing medication
      setMedications(
        medications.map((med) =>
          med.id === editingMedication.id
            ? { ...medicationForm, id: editingMedication.id }
            : med
        )
      );
    } else {
      // Add new medication
      const newId = Math.max(...medications.map((m) => m.id), 0) + 1;
      setMedications([...medications, { ...medicationForm, id: newId }]);
    }

    setShowMedicationModal(false);
    setEditingMedication(null);
    setMedicationForm({
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      purpose: "",
    });
  };

  const handleCloseModal = () => {
    setShowMedicationModal(false);
    setEditingMedication(null);
    setMedicationForm({
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      purpose: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4">Diagnosis</h3>
        <p className="text-[#475569]">
          Pre-operative assessment completed. Patient cleared for surgery. All
          pre-operative tests and evaluations completed successfully. Patient
          understands procedure risks and benefits.
        </p>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3>Prescribed Medications</h3>
          <Button onClick={handleAddMedication}>
            <Plus size={18} className="inline mr-2" />
            Add Medication
          </Button>
        </div>
        <p className="text-[#475569] mb-6 text-[14px]">
          Medications prescribed for post-operative recovery. Please follow the
          dosage instructions carefully and complete the full course as
          prescribed.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left px-6 py-4 text-[#475569]">
                  Medication
                </th>
                <th className="text-left px-6 py-4 text-[#475569]">Dosage</th>
                <th className="text-left px-6 py-4 text-[#475569]">
                  Frequency
                </th>
                <th className="text-left px-6 py-4 text-[#475569]">Purpose</th>
                <th className="text-left px-6 py-4 text-[#475569]">
                  Start Date
                </th>
                <th className="text-left px-6 py-4 text-[#475569]">End Date</th>
                <th className="text-left px-6 py-4 text-[#475569]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-[#475569]"
                  >
                    No medications added yet. Click "Add Medication" to add one.
                  </td>
                </tr>
              ) : (
                medications.map((med) => (
                  <tr
                    key={med.id}
                    className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]"
                    style={{ height: "64px" }}
                  >
                    <td className="px-6 py-4 text-[#0F172A] font-medium">
                      {med.name}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{med.dosage}</td>
                    <td className="px-6 py-4 text-[#475569]">
                      {med.frequency}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{med.purpose}</td>
                    <td className="px-6 py-4 text-[#475569]">
                      {med.startDate}
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{med.endDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditMedication(med)}
                          className="p-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={20} className="text-[#2563EB]" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedication(med.id)}
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
        <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
          <h4 className="text-[#0F172A] mb-3">Important Instructions:</h4>
          <ul className="space-y-2 text-[#475569] text-[14px]">
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-1">•</span>
              <span>Take medications exactly as prescribed by your doctor</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-1">•</span>
              <span>
                Do not skip doses or stop taking medications without consulting
                your doctor
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-1">•</span>
              <span>
                Take pain medications with food to minimize stomach upset
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-1">•</span>
              <span>
                Report any side effects or allergic reactions immediately
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] mt-1">•</span>
              <span>
                Complete the full course of antibiotics even if you feel better
              </span>
            </li>
          </ul>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3>Doctor's Notes</h3>
          <Button
            onClick={() => {
              const newNote: DoctorNote = {
                id: Math.max(...doctorNotes.map((n) => n.id), 0) + 1,
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                doctor: surgery.surgeon,
                note: "",
              };
              setEditingNote(newNote);
              setNoteForm({
                date: newNote.date,
                doctor: newNote.doctor,
                note: "",
              });
              setShowNoteModal(true);
            }}
          >
            <Plus size={18} className="inline mr-2" />
            Add Note
          </Button>
        </div>
        <div className="space-y-4">
          {doctorNotes.map((note) => (
            <div key={note.id} className="relative group">
              <NoteItem
                date={note.date}
                doctor={note.doctor}
                note={note.note}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 flex-nowrap whitespace-nowrap">
                <button
                  onClick={() => {
                    setEditingNote(note);
                    setNoteForm({
                      date: note.date,
                      doctor: note.doctor,
                      note: note.note,
                    });
                    setShowNoteModal(true);
                  }}
                  className="p-2 rounded-lg hover:bg-[#EFF6FF] transition-colors shrink-0"
                  title="Edit"
                >
                  <Edit size={18} className="text-[#2563EB]" />
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this note?"
                      )
                    ) {
                      setDoctorNotes(
                        doctorNotes.filter((n) => n.id !== note.id)
                      );
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-[#FEE2E2] transition-colors shrink-0"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-[#EF4444]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <MedicalFilesSection
        medicalFiles={medicalFiles}
        setMedicalFiles={setMedicalFiles}
      />

      {/* Medication Modal */}
      {showMedicationModal && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            width: "100%",
          }}
          className="fixed inset- flex items-center justify-center z-50"
        >
          <Card
            padding="24px"
            className="w-[95%] min-w-[1400px] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2>
                {editingMedication ? "Edit Medication" : "Add New Medication"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">
                  Medication Name *
                </label>
                <Input
                  value={medicationForm.name}
                  onChange={(e) =>
                    setMedicationForm({
                      ...medicationForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Oxycodone"
                />
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Dosage *</label>
                <Input
                  value={medicationForm.dosage}
                  onChange={(e) =>
                    setMedicationForm({
                      ...medicationForm,
                      dosage: e.target.value,
                    })
                  }
                  placeholder="e.g., 5mg"
                />
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Frequency *</label>
                <Input
                  value={medicationForm.frequency}
                  onChange={(e) =>
                    setMedicationForm({
                      ...medicationForm,
                      frequency: e.target.value,
                    })
                  }
                  placeholder="e.g., Every 6 hours"
                />
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Purpose *</label>
                <Input
                  value={medicationForm.purpose}
                  onChange={(e) =>
                    setMedicationForm({
                      ...medicationForm,
                      purpose: e.target.value,
                    })
                  }
                  placeholder="e.g., Pain management"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">
                    Start Date *
                  </label>
                  <Input
                    type="text"
                    value={medicationForm.startDate}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        startDate: e.target.value,
                      })
                    }
                    placeholder="e.g., Nov 16, 2025"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] mb-2">
                    End Date *
                  </label>
                  <Input
                    type="text"
                    value={medicationForm.endDate}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        endDate: e.target.value,
                      })
                    }
                    placeholder="e.g., Nov 30, 2025"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" fullWidth onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button fullWidth onClick={handleSaveMedication}>
                {editingMedication ? "Update Medication" : "Add Medication"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper Components
const NoteItem: React.FC<{
  date: string;
  doctor: string;
  note: string;
}> = ({ date, doctor, note }) => (
  <div className="p-4 rounded-lg border border-[#E2E8F0]">
    <div className="flex justify-between mb-2">
      <span className="text-[#0F172A]">{doctor}</span>
      <span className="text-[13px] text-[#475569]">{date}</span>
    </div>
    <p className="text-[#475569]">{note}</p>
  </div>
);

// Medical Files Section Component
const MedicalFilesSection: React.FC<{
  medicalFiles: MedicalFile[];
  setMedicalFiles: React.Dispatch<React.SetStateAction<MedicalFile[]>>;
}> = ({ medicalFiles, setMedicalFiles }) => {
  const [showFileModal, setShowFileModal] = useState(false);
  const [editingFile, setEditingFile] = useState<MedicalFile | null>(null);
  const [fileForm, setFileForm] = useState({ name: "", date: "" });

  const handleAddFile = () => {
    setEditingFile(null);
    setFileForm({ name: "", date: "" });
    setShowFileModal(true);
  };

  const handleEditFile = (file: MedicalFile) => {
    setEditingFile(file);
    setFileForm({ name: file.name, date: file.date });
    setShowFileModal(true);
  };

  const handleDeleteFile = (id: number) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setMedicalFiles(medicalFiles.filter((f) => f.id !== id));
    }
  };

  const handleSaveFile = () => {
    if (!fileForm.name.trim() || !fileForm.date.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (editingFile) {
      setMedicalFiles(
        medicalFiles.map((f) =>
          f.id === editingFile.id ? { ...fileForm, id: editingFile.id } : f
        )
      );
    } else {
      const newId = Math.max(...medicalFiles.map((f) => f.id), 0) + 1;
      setMedicalFiles([...medicalFiles, { ...fileForm, id: newId }]);
    }

    setShowFileModal(false);
    setEditingFile(null);
    setFileForm({ name: "", date: "" });
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3>Medical Files</h3>
          <Button onClick={handleAddFile}>
            <Plus size={18} className="inline mr-2" />
            Add File
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {medicalFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onEdit={() => handleEditFile(file)}
              onDelete={() => handleDeleteFile(file.id)}
            />
          ))}
        </div>
      </Card>

      {/* File Modal */}
      {showFileModal && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            width: "100%",
          }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <Card padding="24px" className="w-[95%] min-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
              <h2>{editingFile ? "Edit File" : "Add New File"}</h2>
              <button
                onClick={() => {
                  setShowFileModal(false);
                  setEditingFile(null);
                  setFileForm({ name: "", date: "" });
                }}
                className="p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">File Name *</label>
                <Input
                  value={fileForm.name}
                  onChange={(e) =>
                    setFileForm({ ...fileForm, name: e.target.value })
                  }
                  placeholder="e.g., Pre-Op Assessment"
                />
              </div>

              <div>
                <label className="block text-[#475569] mb-2">Date *</label>
                <Input
                  value={fileForm.date}
                  onChange={(e) =>
                    setFileForm({ ...fileForm, date: e.target.value })
                  }
                  placeholder="e.g., Nov 14, 2025"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowFileModal(false);
                  setEditingFile(null);
                  setFileForm({ name: "", date: "" });
                }}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={handleSaveFile}>
                {editingFile ? "Update File" : "Add File"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

const FileCard: React.FC<{
  file: MedicalFile;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ file, onEdit, onDelete }) => (
  <div className="relative group">
    <div
      className="p-4 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] transition-colors cursor-pointer"
      style={{ height: "120px" }}
    >
      <FileText size={32} className="text-[#2563EB] mb-2" />
      <div className="text-[#0F172A] mb-1">{file.name}</div>
      <div className="text-[13px] text-[#475569]">{file.date}</div>
    </div>
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 flex-nowrap whitespace-nowrap">
      <button
        onClick={onEdit}
        className="p-1 rounded bg-white border border-[#E2E8F0] hover:bg-[#EFF6FF] transition-colors shrink-0"
        title="Edit"
      >
        <Edit size={18} className="text-[#2563EB]" />
      </button>
      <button
        onClick={onDelete}
        className="p-1 rounded bg-white border border-[#E2E8F0] hover:bg-[#FEE2E2] transition-colors shrink-0"
        title="Delete"
      >
        <Trash2 size={18} className="text-[#EF4444]" />
      </button>
    </div>
  </div>
);
