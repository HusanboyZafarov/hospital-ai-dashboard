import { axiosInstance } from "../jwt";

const getDashboard = () =>
  axiosInstance
    .get("/dashboard/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Dashboard fetch error:", err);
      throw err;
    });

const dashboardService = {
  getDashboard,
};

export default dashboardService;
