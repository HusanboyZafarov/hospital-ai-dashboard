import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Sparkles,
  UtensilsCrossed,
  Dumbbell,
  XCircle,
} from "lucide-react";
import surgeriesService from "../service/surgeries";

interface Food {
  id: number;
  name: string;
  description?: string;
}

interface Activity {
  id: number;
  name: string;
  description?: string;
}

interface DietPlan {
  id: number;
  summary: string;
  diet_type: string;
  goal_calories: number;
  protein_target: string;
  notes: string;
  allowed_foods: Food[];
  forbidden_foods: Food[];
}

interface ActivityPlan {
  id: number;
  notes: string;
  allowed: Activity[];
  restricted: Activity[];
}

interface Suggestion {
  id: number;
  name: string;
  description: string;
  type: string;
  risk_level: "low" | "medium" | "high";
  diet_plan?: DietPlan;
  activity_plan?: ActivityPlan;
}

const SuggestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!id) {
        setError("Suggestion ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch surgery details (suggestions are related to surgeries)
        const surgeryData = await surgeriesService.getSurgery(parseInt(id));
        setSuggestion(surgeryData);
      } catch (err: any) {
        console.error("Failed to fetch suggestion:", err);
        setError("Failed to load suggestion details. Please try again.");
        setIsLoading(false);
      }
    };

    fetchSuggestion();
  }, [id]);

  const getRiskBadge = (risk: string) => {
    if (risk === "high") return "error";
    if (risk === "medium") return "warning";
    return "success";
  };

  const getRiskDisplay = (risk: string) => {
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

  if (error || !suggestion) {
    return (
      <MainLayout>
        <Card padding="24px">
          <div className="text-center">
            <AlertCircle className="mx-auto text-[#EF4444]" size={48} />
            <h2 className="mt-4 mb-2">Error</h2>
            <p className="text-[#475569] mb-6">
              {error || "Suggestion not found"}
            </p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} className="inline mr-2" />
              Go Back
            </Button>
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
          Back
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">{suggestion.name}</h1>
            <div className="flex items-center gap-4 text-[#475569]">
              <Badge variant="info">{suggestion.type}</Badge>
              <Badge variant={getRiskBadge(suggestion.risk_level)}>
                {getRiskDisplay(suggestion.risk_level)} Risk
              </Badge>
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-[#2563EB]" />
                <span className="text-[14px]">AI Suggestion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Description */}
        <Card>
          <h2 className="mb-4">Description</h2>
          <p className="text-[#475569] leading-relaxed">
            {suggestion.description}
          </p>
        </Card>

        {/* Diet Plan */}
        {suggestion.diet_plan && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed size={20} className="text-[#2563EB]" />
              <h2>Diet Plan</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-[#475569] mb-2">Summary</div>
                <p className="text-[#0F172A]">{suggestion.diet_plan.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[#475569] text-[14px] mb-1">
                    Diet Type
                  </div>
                  <div className="text-[#0F172A] font-medium">
                    {suggestion.diet_plan.diet_type}
                  </div>
                </div>
                <div>
                  <div className="text-[#475569] text-[14px] mb-1">
                    Goal Calories
                  </div>
                  <div className="text-[#0F172A] font-medium">
                    {suggestion.diet_plan.goal_calories} kcal/day
                  </div>
                </div>
                <div>
                  <div className="text-[#475569] text-[14px] mb-1">
                    Protein Target
                  </div>
                  <div className="text-[#0F172A] font-medium">
                    {suggestion.diet_plan.protein_target}
                  </div>
                </div>
              </div>

              {suggestion.diet_plan.notes && (
                <div>
                  <div className="text-[#475569] mb-2">Notes</div>
                  <p className="text-[#0F172A]">{suggestion.diet_plan.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {suggestion.diet_plan.allowed_foods &&
                  suggestion.diet_plan.allowed_foods.length > 0 && (
                    <div>
                      <h3 className="text-[#22C55E] mb-4">Allowed Foods</h3>
                      <ul className="space-y-2">
                        {suggestion.diet_plan.allowed_foods.map((food) => (
                          <li
                            key={food.id}
                            className="flex items-center gap-2 text-[#475569]"
                          >
                            <CheckCircle
                              size={16}
                              className="text-[#22C55E] shrink-0"
                            />
                            <span>{food.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {suggestion.diet_plan.forbidden_foods &&
                  suggestion.diet_plan.forbidden_foods.length > 0 && (
                    <div>
                      <h3 className="text-[#EF4444] mb-4">Forbidden Foods</h3>
                      <ul className="space-y-2">
                        {suggestion.diet_plan.forbidden_foods.map((food) => (
                          <li
                            key={food.id}
                            className="flex items-center gap-2 text-[#475569]"
                          >
                            <XCircle
                              size={16}
                              className="text-[#EF4444] shrink-0"
                            />
                            <span>{food.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </Card>
        )}

        {/* Activity Plan */}
        {suggestion.activity_plan && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell size={20} className="text-[#2563EB]" />
              <h2>Activity Plan</h2>
            </div>
            <div className="space-y-6">
              {suggestion.activity_plan.notes && (
                <div>
                  <div className="text-[#475569] mb-2">Notes</div>
                  <p className="text-[#0F172A]">
                    {suggestion.activity_plan.notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {suggestion.activity_plan.allowed &&
                  suggestion.activity_plan.allowed.length > 0 && (
                    <div>
                      <h3 className="text-[#22C55E] mb-4">
                        Allowed Activities
                      </h3>
                      <ul className="space-y-2">
                        {suggestion.activity_plan.allowed.map((activity) => (
                          <li
                            key={activity.id}
                            className="flex items-center gap-2 text-[#475569]"
                          >
                            <CheckCircle
                              size={16}
                              className="text-[#22C55E] shrink-0"
                            />
                            <span>{activity.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {suggestion.activity_plan.restricted &&
                  suggestion.activity_plan.restricted.length > 0 && (
                    <div>
                      <h3 className="text-[#EF4444] mb-4">
                        Restricted Activities
                      </h3>
                      <ul className="space-y-2">
                        {suggestion.activity_plan.restricted.map((activity) => (
                          <li
                            key={activity.id}
                            className="flex items-center gap-2 text-[#475569]"
                          >
                            <XCircle
                              size={16}
                              className="text-[#EF4444] shrink-0"
                            />
                            <span>{activity.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default SuggestionDetail;
