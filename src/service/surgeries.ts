import { axiosInstance } from "../jwt";
import { CreateSurgeryRequest, Surgery } from "../types/patient";

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

const surgeriesService = {
  getSurgeries,
  getSurgery,
  postSurgery,
  updateSurgery,
  deleteSurgery,
};

export default surgeriesService;
