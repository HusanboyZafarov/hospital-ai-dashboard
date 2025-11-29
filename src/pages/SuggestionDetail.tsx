import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  AlertCircle,
  CheckCircle,
  Loader2,
  UtensilsCrossed,
  Dumbbell,
  XCircle,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import profileSideService, {
  CreateActivityPlanRequest,
} from "../service/profile_side";
import { Activity, ActivityPlan } from "../types/patient";

const SuggestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activityPlan, setActivityPlan] = useState<ActivityPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Activity Plan Modal States
  const [showActivityPlanModal, setShowActivityPlanModal] = useState(false);
  const [isSavingActivityPlan, setIsSavingActivityPlan] = useState(false);
  const [activityPlanForm, setActivityPlanForm] =
    useState<CreateActivityPlanRequest>({
      notes: "",
      allowed: [],
      restricted: [],
    });

  // Activity form states
  const [newAllowedActivity, setNewAllowedActivity] = useState({
    name: "",
    description: "",
  });
  const [newRestrictedActivity, setNewRestrictedActivity] = useState({
    name: "",
    description: "",
  });

  // Editing states
  const [editingActivityPlanId, setEditingActivityPlanId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchActivityPlan = async () => {
      if (!id) {
        setError("Faoliyat rejasi ID si topilmadi");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch activity plan by ID
        const plans = await profileSideService.getActivityPlans();
        const plan = Array.isArray(plans)
          ? plans.find((p: ActivityPlan) => p.id === parseInt(id))
          : plans;

        if (plan) {
          setActivityPlan(plan);
        } else {
          setError("Faoliyat rejasi topilmadi");
        }
      } catch (err: any) {
        console.error("Failed to fetch activity plan:", err);
        setError("Faoliyat rejasini yuklashda xatolik yuz berdi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityPlan();
  }, [id]);

  const refreshActivityPlan = async () => {
    if (!id) return;
    try {
      const plans = await profileSideService.getActivityPlans();
      const plan = Array.isArray(plans)
        ? plans.find((p: ActivityPlan) => p.id === parseInt(id))
        : plans;
      if (plan) {
        setActivityPlan(plan);
      }
    } catch (err) {
      console.error("Failed to refresh activity plan:", err);
    }
  };

  const handleCreateActivityPlan = () => {
    setEditingActivityPlanId(null);
    setActivityPlanForm({
      notes: "",
      allowed: [],
      restricted: [],
    });
    setNewAllowedActivity({ name: "", description: "" });
    setNewRestrictedActivity({ name: "", description: "" });
    setShowActivityPlanModal(true);
  };

  const handleEditActivityPlan = () => {
    if (!activityPlan) return;
    setEditingActivityPlanId(activityPlan.id);
    setActivityPlanForm({
      notes: activityPlan.notes || "",
      allowed: activityPlan.allowed || [],
      restricted: activityPlan.restricted || [],
    });
    setNewAllowedActivity({ name: "", description: "" });
    setNewRestrictedActivity({ name: "", description: "" });
    setShowActivityPlanModal(true);
  };

  const handleSaveActivityPlan = async () => {
    try {
      setIsSavingActivityPlan(true);

      if (editingActivityPlanId) {
        // Update existing
        await profileSideService.updateActivityPlan(
          editingActivityPlanId,
          activityPlanForm
        );
      } else {
        // Create new
        await profileSideService.postActivityPlan(activityPlanForm);
      }

      await refreshActivityPlan();
      setShowActivityPlanModal(false);
      setEditingActivityPlanId(null);
    } catch (err: any) {
      console.error("Failed to save activity plan:", err);
      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Faoliyat rejasini saqlashda xatolik yuz berdi."
      );
    } finally {
      setIsSavingActivityPlan(false);
    }
  };

  const handleDeleteActivityPlan = async () => {
    if (
      !activityPlan ||
      !window.confirm("Faoliyat rejasini o'chirishni tasdiqlaysizmi?")
    )
      return;

    try {
      await profileSideService.deleteActivityPlan(activityPlan.id);
      navigate(-1);
    } catch (err: any) {
      console.error("Failed to delete activity plan:", err);
      alert("Faoliyat rejasini o'chirishda xatolik yuz berdi.");
    }
  };

  const handleRemoveAllowedActivity = (index: number) => {
    setActivityPlanForm({
      ...activityPlanForm,
      allowed: activityPlanForm.allowed?.filter((_, i) => i !== index) || [],
    });
  };

  const handleRemoveRestrictedActivity = (index: number) => {
    setActivityPlanForm({
      ...activityPlanForm,
      restricted:
        activityPlanForm.restricted?.filter((_, i) => i !== index) || [],
    });
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

  if (error || !activityPlan) {
    return (
      <MainLayout>
        <Card padding="24px">
          <div className="text-center">
            <AlertCircle className="mx-auto text-[#EF4444]" size={48} />
            <h2 className="mt-4 mb-2">Xatolik</h2>
            <p className="text-[#475569] mb-6">
              {error || "Faoliyat rejasi topilmadi"}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} className="inline mr-2" />
                Orqaga
              </Button>
              {!activityPlan && (
                <Button onClick={handleCreateActivityPlan}>
                  <Plus size={16} className="inline mr-2" />
                  Yangi faoliyat rejasi yaratish
                </Button>
              )}
            </div>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={16} className="inline mr-2" />
          Orqaga
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Faoliyat rejasi</h1>
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-[#2563EB]" />
              <span className="text-[14px] text-[#475569]">AI taklifi</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleEditActivityPlan}>
              <Edit size={16} className="inline mr-2" />
              Tahrirlash
            </Button>
            <Button variant="outline" onClick={handleDeleteActivityPlan}>
              <Trash2 size={16} className="inline mr-2" />
              O'chirish
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Activity Plan */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell size={20} className="text-[#2563EB]" />
            <h2>Faoliyat rejasi</h2>
          </div>
          <div className="space-y-6">
            {activityPlan.notes && (
              <div>
                <div className="text-[#475569] mb-2">Eslatmalar</div>
                <p className="text-[#0F172A]">{activityPlan.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {activityPlan.allowed && activityPlan.allowed.length > 0 && (
                <div>
                  <h3 className="text-[#22C55E] mb-4">
                    Ruxsat etilgan faoliyatlar
                  </h3>
                  <ul className="space-y-2">
                    {activityPlan.allowed.map((activity, index) => (
                      <li
                        key={activity.id || index}
                        className="flex items-center gap-2 text-[#475569]"
                      >
                        <CheckCircle
                          size={16}
                          className="text-[#22C55E] shrink-0"
                        />
                        <span>{activity.name}</span>
                        {activity.description && (
                          <span className="text-[12px] text-[#64748B]">
                            - {activity.description}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activityPlan.restricted &&
                activityPlan.restricted.length > 0 && (
                  <div>
                    <h3 className="text-[#EF4444] mb-4">
                      Cheklangan faoliyatlar
                    </h3>
                    <ul className="space-y-2">
                      {activityPlan.restricted.map((activity, index) => (
                        <li
                          key={activity.id || index}
                          className="flex items-center gap-2 text-[#475569]"
                        >
                          <XCircle
                            size={16}
                            className="text-[#EF4444] shrink-0"
                          />
                          <span>{activity.name}</span>
                          {activity.description && (
                            <span className="text-[12px] text-[#64748B]">
                              - {activity.description}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            {(!activityPlan.allowed || activityPlan.allowed.length === 0) &&
              (!activityPlan.restricted ||
                activityPlan.restricted.length === 0) && (
                <div className="text-[#475569] text-center py-8">
                  Faoliyatlar mavjud emas
                </div>
              )}
          </div>
        </Card>
      </div>

      {/* Activity Plan Modal */}
      {showActivityPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card
            padding="20px"
            className="w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingActivityPlanId
                  ? "Faoliyat rejasini tahrirlash"
                  : "Yangi faoliyat rejasi yaratish"}
              </h3>
              <button
                onClick={() => {
                  setShowActivityPlanModal(false);
                  setEditingActivityPlanId(null);
                }}
                className="p-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                <X size={18} className="text-[#475569]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] text-[13px] mb-1.5">
                  Eslatmalar
                </label>
                <textarea
                  value={activityPlanForm.notes}
                  onChange={(e) =>
                    setActivityPlanForm({
                      ...activityPlanForm,
                      notes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm"
                  rows={3}
                  placeholder="Faoliyat rejasi haqida eslatmalar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Allowed Activities */}
                <div>
                  <label className="block text-[#475569] text-[13px] mb-1.5">
                    Ruxsat etilgan faoliyatlar
                  </label>
                  <div className="space-y-2 mb-2">
                    <div className="flex gap-1.5">
                      <Input
                        value={newAllowedActivity.name}
                        onChange={(e) =>
                          setNewAllowedActivity({
                            ...newAllowedActivity,
                            name: e.target.value,
                          })
                        }
                        placeholder="Faoliyat nomi"
                        className="flex-1 h-8 text-sm"
                      />
                      <Button
                        onClick={() => {
                          if (newAllowedActivity.name.trim()) {
                            setActivityPlanForm({
                              ...activityPlanForm,
                              allowed: [
                                ...(activityPlanForm.allowed || []),
                                {
                                  name: newAllowedActivity.name.trim(),
                                  description:
                                    newAllowedActivity.description.trim() ||
                                    undefined,
                                },
                              ],
                            });
                            setNewAllowedActivity({
                              name: "",
                              description: "",
                            });
                          }
                        }}
                        className="h-8 px-3"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    <Input
                      value={newAllowedActivity.description}
                      onChange={(e) =>
                        setNewAllowedActivity({
                          ...newAllowedActivity,
                          description: e.target.value,
                        })
                      }
                      placeholder="Tavsif (ixtiyoriy)"
                      className="h-8 text-sm"
                    />
                  </div>
                  <ul className="space-y-1 max-h-32 overflow-y-auto">
                    {activityPlanForm.allowed?.map((activity, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between px-2 py-1 bg-[#F0FDF4] rounded text-xs"
                      >
                        <span className="text-[#166534]">
                          {activity.name}
                          {activity.description && (
                            <span className="text-[#475569] text-xs ml-1">
                              - {activity.description}
                            </span>
                          )}
                        </span>
                        <button
                          onClick={() => handleRemoveAllowedActivity(index)}
                        >
                          <X size={12} className="text-[#EF4444]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Restricted Activities */}
                <div>
                  <label className="block text-[#475569] text-[13px] mb-1.5">
                    Cheklangan faoliyatlar
                  </label>
                  <div className="space-y-2 mb-2">
                    <div className="flex gap-1.5">
                      <Input
                        value={newRestrictedActivity.name}
                        onChange={(e) =>
                          setNewRestrictedActivity({
                            ...newRestrictedActivity,
                            name: e.target.value,
                          })
                        }
                        placeholder="Faoliyat nomi"
                        className="flex-1 h-8 text-sm"
                      />
                      <Button
                        onClick={() => {
                          if (newRestrictedActivity.name.trim()) {
                            setActivityPlanForm({
                              ...activityPlanForm,
                              restricted: [
                                ...(activityPlanForm.restricted || []),
                                {
                                  name: newRestrictedActivity.name.trim(),
                                  description:
                                    newRestrictedActivity.description.trim() ||
                                    undefined,
                                },
                              ],
                            });
                            setNewRestrictedActivity({
                              name: "",
                              description: "",
                            });
                          }
                        }}
                        className="h-8 px-3"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    <Input
                      value={newRestrictedActivity.description}
                      onChange={(e) =>
                        setNewRestrictedActivity({
                          ...newRestrictedActivity,
                          description: e.target.value,
                        })
                      }
                      placeholder="Tavsif (ixtiyoriy)"
                      className="h-8 text-sm"
                    />
                  </div>
                  <ul className="space-y-1 max-h-32 overflow-y-auto">
                    {activityPlanForm.restricted?.map((activity, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between px-2 py-1 bg-[#FEF2F2] rounded text-xs"
                      >
                        <span className="text-[#991B1B]">
                          {activity.name}
                          {activity.description && (
                            <span className="text-[#475569] text-xs ml-1">
                              - {activity.description}
                            </span>
                          )}
                        </span>
                        <button
                          onClick={() => handleRemoveRestrictedActivity(index)}
                        >
                          <X size={12} className="text-[#EF4444]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setShowActivityPlanModal(false);
                    setEditingActivityPlanId(null);
                  }}
                  className="h-10"
                >
                  Bekor qilish
                </Button>
                <Button
                  fullWidth
                  onClick={handleSaveActivityPlan}
                  disabled={isSavingActivityPlan}
                  className="h-10"
                >
                  {isSavingActivityPlan ? (
                    <>
                      <Loader2 className="animate-spin inline mr-2" size={14} />
                      Saqlanmoqda...
                    </>
                  ) : editingActivityPlanId ? (
                    "Yangilash"
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

export default SuggestionDetail;
