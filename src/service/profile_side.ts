import { axiosInstance } from "../jwt";
import { Medication } from "../types/patient";

const getMedications = () =>
  axiosInstance
    .get("/medications")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get medications error:", err);
      throw err;
    });

interface CreateMedicationRequest {
  surgery_id: number;
  patient_id: number;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string;
}

const postMedication = (medication: CreateMedicationRequest) =>
  axiosInstance
    .post("/medications/", medication)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Post medication error:", err);
      throw err;
    });

const getDietPlans = () =>
  axiosInstance
    .get("/diet-plans")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get diet plans error:", err);
      throw err;
    });

interface SimpleName {
  id?: number;
  name: string;
  description?: string;
}

interface MealPlan {
  id?: number;
  meal_type: string;
  description: string;
  time?: string;
}

interface CreateDietPlanRequest {
  summary: string;
  diet_type: string;
  goal_calories: number;
  protein_target?: string;
  notes?: string;
  allowed_foods?: SimpleName[];
  forbidden_foods?: SimpleName[];
  meal_plan?: MealPlan[];
}

const postDietPlan = (dietPlan: CreateDietPlanRequest) =>
  axiosInstance
    .post("/diet-plans/", dietPlan)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Post diet plan error:", err);
      throw err;
    });

// Activity Plan CRUD
const getActivityPlans = () =>
  axiosInstance
    .get("/activity-plans/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get activity plans error:", err);
      throw err;
    });

interface CreateActivityRequest {
  name: string;
  description?: string;
}

interface CreateActivityPlanRequest {
  notes?: string;
  allowed?: CreateActivityRequest[];
  restricted?: CreateActivityRequest[];
}

const postActivityPlan = (activityPlan: CreateActivityPlanRequest) =>
  axiosInstance
    .post("/activity-plans/", activityPlan)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Post activity plan error:", err);
      throw err;
    });

const updateActivityPlan = (
  id: number,
  activityPlan: CreateActivityPlanRequest
) =>
  axiosInstance
    .put(`/activity-plans/${id}/`, activityPlan)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Update activity plan error:", err);
      throw err;
    });

const deleteActivityPlan = (id: number) =>
  axiosInstance
    .delete(`/activity-plans/${id}/`)
    .then(() => {})
    .catch((err) => {
      console.error("Delete activity plan error:", err);
      throw err;
    });

const profileSideService = {
  getMedications,
  postMedication,
  getDietPlans,
  postDietPlan,
  getActivityPlans,
  postActivityPlan,
  updateActivityPlan,
  deleteActivityPlan,
};

export default profileSideService;
export type {
  CreateMedicationRequest,
  CreateDietPlanRequest,
  SimpleName,
  MealPlan,
  CreateActivityRequest,
  CreateActivityPlanRequest,
};
