import { axiosInstance } from "../jwt";
import {
  CreateSurgeryRequest,
  Surgery,
  DietPlan,
  Medication,
} from "../types/patient";

const getSurgeries = (): Promise<Surgery[]> =>
  axiosInstance
    .get("/surgeries/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get surgeries error:", err);
      throw err;
    });

const getSurgery = (id: number): Promise<Surgery> =>
  axiosInstance
    .get(`/surgeries/${id}/`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get surgery error:", err);
      throw err;
    });

const postSurgery = (surgery: CreateSurgeryRequest): Promise<Surgery> =>
  axiosInstance
    .post("/surgeries/", surgery)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Create surgery error:", err);
      throw err;
    });

const updateSurgery = (
  id: number,
  surgery: Partial<CreateSurgeryRequest>
): Promise<Surgery> =>
  axiosInstance
    .put(`/surgeries/${id}/`, surgery)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Update surgery error:", err);
      throw err;
    });

const deleteSurgery = (id: number): Promise<void> =>
  axiosInstance
    .delete(`/surgeries/${id}/`)
    .then(() => {
      // Successfully deleted
    })
    .catch((err) => {
      console.error("Delete surgery error:", err);
      throw err;
    });

// Diet Plan CRUD
interface CreateDietPlanRequest {
  summary?: string;
  diet_type: string;
  goal_calories: number;
  protein_target?: string;
  notes?: string;
  allowed_foods?: Array<{ name: string; description?: string }>;
  forbidden_foods?: Array<{ name: string; description?: string }>;
}

const createDietPlan = (
  surgeryId: number,
  dietPlan: CreateDietPlanRequest
): Promise<DietPlan> =>
  axiosInstance
    .post(`/surgeries/${surgeryId}/diet-plan/`, dietPlan)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Create diet plan error:", err);
      throw err;
    });

const updateDietPlan = (
  surgeryId: number,
  dietPlan: CreateDietPlanRequest
): Promise<DietPlan> =>
  axiosInstance
    .put(`/surgeries/${surgeryId}/diet-plan/`, dietPlan)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Update diet plan error:", err);
      throw err;
    });

const deleteDietPlan = (surgeryId: number): Promise<void> =>
  axiosInstance
    .delete(`/surgeries/${surgeryId}/diet-plan/`)
    .then(() => {})
    .catch((err) => {
      console.error("Delete diet plan error:", err);
      throw err;
    });

// Medication CRUD
const getMedications = (surgeryId: number): Promise<Medication[]> =>
  axiosInstance
    .get(`/surgeries/${surgeryId}/medications/`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get medications error:", err);
      throw err;
    });

const createMedication = (
  surgeryId: number,
  medication: Partial<Medication>
): Promise<Medication> =>
  axiosInstance
    .post(`/surgeries/${surgeryId}/medications/`, medication)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Create medication error:", err);
      throw err;
    });

const updateMedication = (
  surgeryId: number,
  medicationId: number,
  medication: Partial<Medication>
): Promise<Medication> =>
  axiosInstance
    .put(`/surgeries/${surgeryId}/medications/${medicationId}/`, medication)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Update medication error:", err);
      throw err;
    });

const deleteMedication = (
  surgeryId: number,
  medicationId: number
): Promise<void> =>
  axiosInstance
    .delete(`/surgeries/${surgeryId}/medications/${medicationId}/`)
    .then(() => {})
    .catch((err) => {
      console.error("Delete medication error:", err);
      throw err;
    });

const surgeriesService = {
  getSurgeries,
  getSurgery,
  postSurgery,
  updateSurgery,
  deleteSurgery,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
};

export default surgeriesService;
