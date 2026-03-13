import api from "@/lib/api";

export const getInProgressJobs = async () => {
  const res = await api.get("/technician/in-progress");
  return res.data;
};