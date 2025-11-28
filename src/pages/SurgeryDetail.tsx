import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs } from "../components/ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import surgeriesService from "../service/surgeries";
import { Surgery as APISurgery, SurgeryRiskLevel } from "../types/patient";

// Import tab components from Surgeries.tsx
// We'll need to export them from there or duplicate the logic here
// For now, let's create a simple detail page that shows the surgery info

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "diet-plan", label: "Diet Plan" },
  { id: "activities", label: "Activities" },
];

export const SurgeryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apiSurgery, setApiSurgery] = useState<APISurgery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchSurgery = async () => {
      if (!id) {
        setError("Surgery ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const surgery = await surgeriesService.getSurgery(parseInt(id));
        setApiSurgery(surgery);
      } catch (err: any) {
        console.error("Failed to fetch surgery:", err);
        setError("Failed to load surgery details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurgery();
  }, [id]);

  const getRiskBadge = (risk: SurgeryRiskLevel) => {
    if (risk === "high") return "error";
    if (risk === "medium") return "warning";
    return "success";
  };

  const getRiskDisplay = (risk: SurgeryRiskLevel) => {
    return risk.charAt(0).toUpperCase() + risk.slice(1);
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
            <h2 className="mb-2">Error</h2>
            <p className="text-[#475569] mb-6">
              {error || "Surgery not found"}
            </p>
            <Button variant="outline" onClick={() => navigate("/surgeries")}>
              <ArrowLeft size={16} className="inline mr-2" />
              Back to Surgeries
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
          Back to Surgeries
        </Button>
        <h1 className="mb-2">{apiSurgery.name}</h1>
        <div className="flex items-center gap-4 text-[#475569]">
          <span>{apiSurgery.type}</span>
          <span>•</span>
          <Badge variant={getRiskBadge(apiSurgery.risk_level)}>
            {getRiskDisplay(apiSurgery.risk_level)} Risk
          </Badge>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <Card>
          <div className="space-y-6">
            <div>
              <h2>{apiSurgery.name}</h2>
              <Badge variant="info" className="mt-2">
                {apiSurgery.type}
              </Badge>
            </div>

            {apiSurgery.description && (
              <div>
                <div className="text-[#475569] mb-2">Description</div>
                <p className="text-[#0F172A]">{apiSurgery.description}</p>
              </div>
            )}

            <div>
              <div className="text-[#475569] mb-2">Risk Level</div>
              <Badge variant={getRiskBadge(apiSurgery.risk_level)}>
                {getRiskDisplay(apiSurgery.risk_level)} Risk
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "diet-plan" && apiSurgery.diet_plan && (
        <Card>
          <h2 className="mb-4">Diet Plan</h2>
          <div className="space-y-4">
            <div>
              <div className="text-[#475569] mb-2">Diet Type</div>
              <div className="text-[#0F172A]">
                {apiSurgery.diet_plan.diet_type}
              </div>
            </div>
            <div>
              <div className="text-[#475569] mb-2">Goal Calories</div>
              <div className="text-[#0F172A]">
                {apiSurgery.diet_plan.goal_calories} kcal/day
              </div>
            </div>
            {apiSurgery.diet_plan.protein_target && (
              <div>
                <div className="text-[#475569] mb-2">Protein Target</div>
                <div className="text-[#0F172A]">
                  {apiSurgery.diet_plan.protein_target}
                </div>
              </div>
            )}
            {apiSurgery.diet_plan.notes && (
              <div>
                <div className="text-[#475569] mb-2">Notes</div>
                <p className="text-[#0F172A]">{apiSurgery.diet_plan.notes}</p>
              </div>
            )}
            {apiSurgery.diet_plan.allowed_foods &&
              apiSurgery.diet_plan.allowed_foods.length > 0 && (
                <div>
                  <div className="text-[#475569] mb-2">Allowed Foods</div>
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
                  <div className="text-[#475569] mb-2">Forbidden Foods</div>
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
        </Card>
      )}

      {activeTab === "activities" && apiSurgery.activity_plan && (
        <Card>
          <h2 className="mb-4">Activities</h2>
          <div className="grid grid-cols-2 gap-6">
            {apiSurgery.activity_plan.allowed &&
              apiSurgery.activity_plan.allowed.length > 0 && (
                <div>
                  <h3 className="text-[#22C55E] mb-4">Allowed Activities</h3>
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
                  <h3 className="text-[#EF4444] mb-4">Restricted Activities</h3>
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
              <div className="text-[#475569] mb-2">Notes</div>
              <p className="text-[#0F172A]">{apiSurgery.activity_plan.notes}</p>
            </div>
          )}
        </Card>
      )}

      {activeTab === "medical-records" && (
        <Card>
          <h2 className="mb-4">Medical Records</h2>
          <p className="text-[#475569]">
            Medical records for this surgery will be displayed here.
          </p>
        </Card>
      )}
    </MainLayout>
  );
};
