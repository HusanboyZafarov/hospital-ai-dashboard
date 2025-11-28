export type Gender = "male" | "female" | "other";

export type PatientStatus = "in_recovery" | "discharged";

export type SurgeryPriorityLevel = "low" | "medium" | "high";

export interface SurgeryType {
  id: number;
  name: string;
  description?: string;
}

export interface CreateSurgeryRequest {
  name: string; // Required, maxLength: 255, minLength: 1
  type: string; // Required, maxLength: 255, minLength: 1
  priority_level: SurgeryPriorityLevel; // Required, enum
  description?: string; // Optional
}

export interface CreatePatientRequest {
  full_name: string; // Required, maxLength: 255, minLength: 1
  age: number; // Required, min: 0, max: 2147483647
  gender: Gender; // Required, enum
  phone: string; // Required, maxLength: 50, minLength: 1
  assigned_doctor: string; // Required, maxLength: 255, minLength: 1
  admitted_at: string; // Required, ISO date-time string
  status?: PatientStatus; // Optional, default: "pre_op"
  surgery_id?: number | null; // Optional, nullable
}

export interface Food {
  id: number;
  name: string;
  description?: string;
}

export interface Activity {
  id: number;
  name: string;
  description?: string;
}

export interface DietPlan {
  id: number;
  summary: string;
  diet_type: string;
  goal_calories: number;
  protein_target?: string;
  notes?: string;
  allowed_foods: Food[];
  forbidden_foods: Food[];
}

export interface ActivityPlan {
  id: number;
  notes?: string;
  allowed: Activity[];
  restricted: Activity[];
}

export interface Surgery {
  id: number;
  name: string;
  description: string;
  type: SurgeryType | string | number; // Can be object, string, or number
  priority_level: SurgeryPriorityLevel;
  diet_plan?: DietPlan | null;
  activity_plan?: ActivityPlan | null;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string;
}

export interface MedicalRecordText {
  id: number;
  text: string;
  date: string;
}

export interface MedicalRecord {
  id: number;
  record_title: string;
  record_text: MedicalRecordText;
}

export interface CarePlan {
  pre_op?: string[];
  post_op?: string[];
}

export interface DietPlanSummary {
  notes?: string;
  diet_type: string;
  goal_calories: string;
}

export interface CareBundleDietPlan {
  summary: DietPlanSummary;
  meal_plan: string[];
  allowed_foods: string[];
  forbidden_foods: string[];
}

export interface CareBundleActivities {
  allowed: string[];
  restricted: string[];
}

export interface AIInsights {
  risk_assessments: string[];
  recommended_actions: string[];
  predictive_analytics: string[];
}

export interface CareBundle {
  care_plan: CarePlan;
  diet_plan?: CareBundleDietPlan;
  activities?: CareBundleActivities;
  ai_insights: AIInsights;
  updated_at?: string;
}

export interface Patient extends CreatePatientRequest {
  id: number;
  created_at?: string;
  updated_at?: string;
  hospital?: string;
  // API response fields
  surgery?: Surgery;
  medications?: Medication[];
  medical_records?: MedicalRecord[];
  care_bundle?: CareBundle;
}
