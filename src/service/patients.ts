import { axiosInstance } from "../jwt";
import { CreatePatientRequest, Patient } from "../types/patient";

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

const patientsService = {
  getPatients,
  getPatient,
  postPatient,
  updatePatient,
  deletePatient,
};

export default patientsService;
