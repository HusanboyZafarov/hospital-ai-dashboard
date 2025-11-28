import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs } from "../components/ui/tabs";
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
} from "lucide-react";
import patientsService from "../service/patients";
import { Patient } from "../types/patient";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "surgery", label: "Surgery" },
  { id: "records", label: "Medical Records" },
  { id: "admission", label: "Admission" },
  { id: "care-plan", label: "Care Plan" },
  { id: "medications", label: "Medications" },
  { id: "diet", label: "Diet" },
  { id: "activities", label: "Activities" },
  { id: "ai-insights", label: "AI Insights" },
];

export const PatientProfile: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setError("Patient ID is missing");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const patientData = await patientsService.getPatient(parseInt(id));
        setPatient(patientData);
      } catch (err: any) {
        console.error("Failed to fetch patient:", err);
        setError("Failed to load patient data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // Map status to display format
  const getStatusDisplay = (status?: string) => {
    const statusMap: Record<string, string> = {
      pre_op: "Pre-Op",
      in_surgery: "In Surgery",
      post_op: "Post-Op",
      recovery: "In Recovery",
      in_recovery: "In Recovery",
      stable: "Stable",
      discharged: "Discharged",
    };
    return statusMap[status || ""] || status || "Unknown";
  };

  // Map risk level to badge variant
  const getRiskBadgeVariant = (riskLevel?: string) => {
    if (!riskLevel) return "warning";
    const risk = riskLevel.toLowerCase();
    if (risk === "high") return "error";
    if (risk === "medium") return "warning";
    return "success";
  };

  // Format risk level for display
  const getRiskDisplay = (riskLevel?: string) => {
    if (!riskLevel) return "Unknown";
    return riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
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
        return <MedicationsTab patient={patient} />;
      case "diet":
        return <DietTab patient={patient} />;
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
          {error || "Patient not found"}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="mb-2">{patient.full_name}</h1>
        <div className="flex items-center gap-4 text-[#475569]">
          <span>{patient.age} years old</span>
          <span>•</span>
          <span>
            {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
          </span>
          {patient.surgery?.risk_level && (
            <>
              <span>•</span>
              <Badge variant={getRiskBadgeVariant(patient.surgery.risk_level)}>
                {getRiskDisplay(patient.surgery.risk_level)} Risk
              </Badge>
            </>
          )}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTabContent()}
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
      pre_op: "Pre-Op",
      in_surgery: "In Surgery",
      post_op: "Post-Op",
      recovery: "In Recovery",
      in_recovery: "In Recovery",
      stable: "Stable",
      discharged: "Discharged",
    };
    return statusMap[status || ""] || status || "Unknown";
  };

  return (
    <div className="grid grid-cols-[40%_60%] gap-6">
      <div className="flex flex-col gap-6">
        <Card>
          <h3 className="mb-4">Patient Information</h3>
          <div className="space-y-3">
            <InfoRow label="Full Name" value={patient.full_name} />
            <InfoRow label="Age" value={`${patient.age} years`} />
            <InfoRow label="Gender" value={patient.gender} />
            <InfoRow label="Phone" value={patient.phone} />
            <InfoRow label="Assigned Doctor" value={patient.assigned_doctor} />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4">Admission Summary</h3>
          <div className="space-y-3">
            <InfoRow
              label="Admitted At"
              value={formatDate(patient.admitted_at)}
            />
            <InfoRow label="Ward" value={patient.ward} />
            <InfoRow label="Status" value={getStatusDisplay(patient.status)} />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <h3 className="mb-4">Surgery Summary</h3>
          <div className="space-y-4">
            {patient.surgery ? (
              <>
                <div>
                  <div className="text-[#475569] mb-1">Surgery Name</div>
                  <div className="text-[#0F172A]">{patient.surgery.name}</div>
                </div>
                {patient.surgery.type && (
                  <div>
                    <div className="text-[#475569] mb-1">Type</div>
                    <Badge variant="info">{patient.surgery.type}</Badge>
                  </div>
                )}
                {patient.surgery.risk_level && (
                  <div>
                    <div className="text-[#475569] mb-1">Risk Level</div>
                    <Badge
                      variant={
                        patient.surgery.risk_level === "high"
                          ? "error"
                          : patient.surgery.risk_level === "medium"
                          ? "warning"
                          : "success"
                      }
                    >
                      {patient.surgery.risk_level.charAt(0).toUpperCase() +
                        patient.surgery.risk_level.slice(1)}{" "}
                      Risk
                    </Badge>
                  </div>
                )}
                {patient.surgery.description && (
                  <div>
                    <div className="text-[#475569] mb-1">Description</div>
                    <div className="text-[#0F172A]">
                      {patient.surgery.description}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-[#475569]">
                No surgery information available
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4">Current Vitals</h3>
          <div className="grid grid-cols-3 gap-4">
            <VitalCard
              icon={Heart}
              label="Heart Rate"
              value="78 bpm"
              status="success"
            />
            <VitalCard
              icon={Droplet}
              label="Blood Pressure"
              value="145/92"
              status="warning"
            />
            <VitalCard
              icon={Thermometer}
              label="Temperature"
              value="37.2°C"
              status="success"
            />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            <TaskRow
              icon={Pill}
              task="Administer pain medication"
              time="10:00 AM"
              status="success"
            />
            <TaskRow
              icon={Activity}
              task="Physical therapy session"
              time="2:00 PM"
              status="warning"
            />
            <TaskRow
              icon={Utensils}
              task="Low-sodium lunch"
              time="12:30 PM"
              status="success"
            />
            <TaskRow
              icon={FileText}
              task="Update recovery notes"
              time="4:00 PM"
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
      pre_op: "Pre-Op",
      in_surgery: "In Surgery",
      post_op: "Post-Op",
      recovery: "In Recovery",
      in_recovery: "In Recovery",
      stable: "Stable",
      discharged: "Discharged",
    };
    return statusMap[status || ""] || status || "Unknown";
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
        <div className="text-[#475569]">No surgery information available</div>
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
              <Badge variant="info">{patient.surgery.type}</Badge>
            )}
            {patient.surgery.risk_level && (
              <Badge
                variant={
                  patient.surgery.risk_level === "high"
                    ? "error"
                    : patient.surgery.risk_level === "medium"
                    ? "warning"
                    : "success"
                }
              >
                {patient.surgery.risk_level.charAt(0).toUpperCase() +
                  patient.surgery.risk_level.slice(1)}{" "}
                Risk
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
          <div className="text-[#475569] mb-2">Assigned Doctor</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              {patient.assigned_doctor.charAt(0).toUpperCase()}
            </div>
            <div className="text-[#0F172A]">{patient.assigned_doctor}</div>
          </div>
        </div>

        {patient.admitted_at && (
          <div>
            <div className="text-[#475569] mb-2">Admission Date</div>
            <div className="text-[#0F172A]">
              {new Date(patient.admitted_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        )}

        {patient.status && (
          <div>
            <div className="text-[#475569] mb-2">Status</div>
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
          <h3 className="mb-4">Diagnosis</h3>
          <p className="text-[#475569]">{patient.surgery.description}</p>
        </Card>
      )}

      {patient.medical_records && patient.medical_records.length > 0 && (
        <Card>
          <h3 className="mb-4">Medical Records</h3>
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
            No medical records available
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
      pre_op: "Pre-Op",
      in_surgery: "In Surgery",
      post_op: "Post-Op",
      recovery: "In Recovery",
      in_recovery: "In Recovery",
      stable: "Stable",
      discharged: "Discharged",
    };
    return statusMap[status || ""] || status || "Unknown";
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8FAFC]">
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left px-6 py-4 text-[#475569]">
                Admission Date
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Ward</th>
              <th className="text-left px-6 py-4 text-[#475569]">
                Attending Doctor
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              className="border-b border-[#E2E8F0]"
              style={{ height: "64px" }}
            >
              <td className="px-6 py-4">{formatDate(patient.admitted_at)}</td>
              <td className="px-6 py-4">{patient.ward}</td>
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
          Generate with AI
        </Button>
      </div>

      {carePlan?.pre_op && carePlan.pre_op.length > 0 && (
        <Card>
          <h3 className="mb-4">Pre-Operative Instructions</h3>
          <ul className="list-disc list-inside space-y-2 text-[#475569]">
            {carePlan.pre_op.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </Card>
      )}

      {carePlan?.post_op && carePlan.post_op.length > 0 && (
        <Card>
          <h3 className="mb-4">Post-Operative Instructions</h3>
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
            No care plan available
          </div>
        </Card>
      )}
    </div>
  );
};

const MedicationsTab: React.FC<{ patient: Patient }> = ({ patient }) => {
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
    <Card>
      <h3 className="mb-4">Current Medications</h3>
      {patient.medications && patient.medications.length > 0 ? (
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
                <th className="text-left px-6 py-4 text-[#475569]">
                  Start Date
                </th>
                <th className="text-left px-6 py-4 text-[#475569]">End Date</th>
              </tr>
            </thead>
            <tbody>
              {patient.medications.map((medication) => (
                <tr
                  key={medication.id}
                  className="border-b border-[#E2E8F0]"
                  style={{ height: "64px" }}
                >
                  <td className="px-6 py-4">{medication.name}</td>
                  <td className="px-6 py-4">{medication.dosage}</td>
                  <td className="px-6 py-4">{medication.frequency}</td>
                  <td className="px-6 py-4">
                    {formatDate(medication.start_date)}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(medication.end_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-[#475569] text-center py-8">
          No medications available
        </div>
      )}
    </Card>
  );
};

const DietTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const dietPlan = patient.care_bundle?.diet_plan || patient.surgery?.diet_plan;

  return (
    <div className="space-y-6">
      {dietPlan && (
        <>
          <Card>
            <h3 className="mb-4">Diet Plan Summary</h3>
            <div className="space-y-3">
              {dietPlan.diet_type && (
                <InfoRow label="Diet Type" value={dietPlan.diet_type} />
              )}
              {dietPlan.goal_calories && (
                <InfoRow
                  label="Goal Calories"
                  value={
                    typeof dietPlan.goal_calories === "number"
                      ? `${dietPlan.goal_calories} kcal/day`
                      : dietPlan.goal_calories
                  }
                />
              )}
              {dietPlan.notes && (
                <InfoRow label="Notes" value={dietPlan.notes} />
              )}
              {dietPlan.protein_target && (
                <InfoRow
                  label="Protein Target"
                  value={dietPlan.protein_target}
                />
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            {dietPlan.allowed_foods && dietPlan.allowed_foods.length > 0 && (
              <Card>
                <h3 className="mb-4 text-[#22C55E]">Allowed Foods</h3>
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
                  <h3 className="mb-4 text-[#EF4444]">Forbidden Foods</h3>
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
                <h3 className="mb-4">Meal Plan</h3>
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
            No diet plan available
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button>
          <Bot size={16} className="inline mr-2" />
          Optimize Diet with AI
        </Button>
      </div>
    </div>
  );
};

const ActivitiesTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const activityPlan =
    patient.care_bundle?.activities || patient.surgery?.activity_plan;

  return (
    <div className="space-y-6">
      {activityPlan && (
        <div className="grid grid-cols-2 gap-6">
          {activityPlan.allowed && activityPlan.allowed.length > 0 && (
            <div>
              <h3 className="mb-4 text-[#22C55E]">Allowed Activities</h3>
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
              <h3 className="mb-4 text-[#EF4444]">Restricted Activities</h3>
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
          <h3 className="mb-4">Activity Notes</h3>
          <p className="text-[#475569]">
            {patient.surgery.activity_plan.notes}
          </p>
        </Card>
      )}

      {!activityPlan && (
        <Card>
          <div className="text-[#475569] text-center py-8">
            No activity plan available
          </div>
        </Card>
      )}

      <Card>
        <h3 className="mb-4">AI Safety Checker</h3>
        <p className="text-[#475569] mb-4">
          Ask AI if an activity is safe for this patient's current condition.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="E.g., Can I swim?"
            className="flex-1 px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white"
          />
          <Button>Check Safety</Button>
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
            <h3 className="mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              {aiInsights.risk_assessments.map((assessment, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-[#FEE2E2] border border-[#FECACA]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="error">High Risk</Badge>
                    <span className="text-[#991B1B]">AI Alert</span>
                  </div>
                  <p className="text-[#991B1B] text-[14px]">{assessment}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

      {aiInsights?.predictive_analytics &&
        aiInsights.predictive_analytics.length > 0 && (
          <Card>
            <h3 className="mb-4">Predictive Analytics</h3>
            <p className="text-[#475569] mb-4">
              Based on current progress, AI predicts:
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
            <h3 className="mb-4">Recommended Actions</h3>
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
            No AI insights available
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
          ? "Done"
          : status === "warning"
          ? "Pending"
          : "Scheduled"}
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
      return <Badge variant="neutral">Completed</Badge>;
    if (status === "confirmed")
      return <Badge variant="success">Confirmed</Badge>;
    return <Badge variant="info">Scheduled</Badge>;
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
