import api from "@/lib/api";

export const getTechnicianCounters = async () => {
  const res = await api.get("/technician/counters");
  return res.data;
};