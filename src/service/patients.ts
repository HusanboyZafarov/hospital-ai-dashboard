import { axiosInstance } from "../jwt";
import { CreatePatientRequest, Patient, Medication, DietPlan } from "../types/patient";

const getPatients = (): Promise<Patient[]> =>
  axiosInstance
    .get("/patients/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get patients error:", err);
      throw err;
    });

const getPatient = (id: number): Promise<Patient> =>
  axiosInstance
    .get(`/patients/${id}/`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get patient error:", err);
      throw err;
    });

const postPatient = (patient: CreatePatientRequest): Promise<Patient> =>
  axiosInstance
    .post("/patients/", patient)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Create patient error:", err);
      throw err;
    });

const updatePatient = (
  id: number,
  patient: Partial<CreatePatientRequest>
): Promise<Patient> =>
  axiosInstance
    .put(`/patients/${id}/`, patient)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Update patient error:", err);
      throw err;
    });

const deletePatient = (id: number): Promise<void> =>
  axiosInstance
    .delete(`/patients/${id}/`)
    .then(() => {
      // Successfully deleted
    })
    .catch((err) => {
      console.error("Delete patient error:", err);
      throw err;
    });

// Get available medications (from surgeries or global list)
const getAvailableMedications = (): Promise<Medication[]> =>
  axiosInstance
    .get("/medications/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get available medications error:", err);
      throw err;
    });

// Get available diet plans (from surgeries or global list)
const getAvailableDietPlans = (): Promise<DietPlan[]> =>
  axiosInstance
    .get("/diet-plans/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Get available diet plans error:", err);
      throw err;
    });

// Assign medications to patient
// Try different formats: medication_ids, medications, or direct array
const assignMedications = async (patientId: number, medicationIds: number[]): Promise<Patient> => {
  // Try different field names and HTTP methods
  const formats = [
    { medication_ids: medicationIds },
    { medications: medicationIds },
    medicationIds, // Direct array
  ];

  const methods = [
    { method: 'post', url: `/patients/${patientId}/medications/` },
    { method: 'put', url: `/patients/${patientId}/medications/` },
    { method: 'patch', url: `/patients/${patientId}/medications/` },
    { method: 'put', url: `/patients/${patientId}/` }, // Update patient directly
    { method: 'patch', url: `/patients/${patientId}/` }, // Update patient directly
  ];

  let lastError: any = null;

  for (const format of formats) {
    for (const { method, url } of methods) {
      try {
        let response;
        if (method === 'post') {
          response = await axiosInstance.post(url, format);
        } else if (method === 'put') {
          response = await axiosInstance.put(url, url.includes('/medications/') ? format : { medications: medicationIds });
        } else {
          response = await axiosInstance.patch(url, url.includes('/medications/') ? format : { medications: medicationIds });
        }
        return response.data;
      } catch (err: any) {
        // Only log and continue if it's a 400/404/405 error
        if (err?.response?.status === 400 || err?.response?.status === 404 || err?.response?.status === 405) {
          lastError = err;
          continue;
        } else {
          // For other errors (like 500), throw immediately
          throw err;
        }
      }
    }
  }
  
  // If all formats failed, throw the last error
  console.error("Assign medications error - tried all formats:", lastError);
  throw lastError || new Error("Failed to assign medications with all formats");
};

// Remove medication from patient
const removeMedication = (patientId: number, medicationId: number): Promise<void> =>
  axiosInstance
    .delete(`/patients/${patientId}/medications/${medicationId}/`)
    .then(() => {})
    .catch((err) => {
      console.error("Remove medication error:", err);
      throw err;
    });

// Assign diet plan to patient
const assignDietPlan = async (patientId: number, dietPlanId: number): Promise<Patient> => {
  const formats = [
    { diet_plan_id: dietPlanId },
    { diet_plan: dietPlanId },
    { dietPlanId },
  ];

  const methods = [
    { method: 'post', url: `/patients/${patientId}/diet-plan/` },
    { method: 'put', url: `/patients/${patientId}/diet-plan/` },
    { method: 'patch', url: `/patients/${patientId}/diet-plan/` },
    { method: 'put', url: `/patients/${patientId}/` }, // Update patient directly
    { method: 'patch', url: `/patients/${patientId}/` }, // Update patient directly
  ];

  let lastError: any = null;

  for (const format of formats) {
    for (const { method, url } of methods) {
      try {
        let response;
        if (method === 'post') {
          response = await axiosInstance.post(url, format);
        } else if (method === 'put') {
          response = await axiosInstance.put(url, url.includes('/diet-plan/') ? format : { diet_plan_id: dietPlanId });
        } else {
          response = await axiosInstance.patch(url, url.includes('/diet-plan/') ? format : { diet_plan_id: dietPlanId });
        }
        return response.data;
      } catch (err: any) {
        // Only log and continue if it's a 400/404/405 error
        if (err?.response?.status === 400 || err?.response?.status === 404 || err?.response?.status === 405) {
          lastError = err;
          continue;
        } else {
          // For other errors (like 500), throw immediately
          throw err;
        }
      }
    }
  }
  
  // If all formats failed, throw the last error
  console.error("Assign diet plan error - tried all formats:", lastError);
  throw lastError || new Error("Failed to assign diet plan with all formats");
};

// Remove diet plan from patient
const removeDietPlan = (patientId: number): Promise<void> =>
  axiosInstance
    .put(`/patients/${patientId}/diet-plan/`, { diet_plan: null })
    .then(() => {})
    .catch((err) => {
      console.error("Remove diet plan error:", err);
      throw err;
    });

const patientsService = {
  getPatients,
  getPatient,
  postPatient,
  updatePatient,
  deletePatient,
  getAvailableMedications,
  getAvailableDietPlans,
  assignMedications,
  removeMedication,
  assignDietPlan,
  removeDietPlan,
};

export default patientsService;
