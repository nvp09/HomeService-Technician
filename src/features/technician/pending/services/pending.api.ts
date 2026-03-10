import api from "@/lib/api";

export const getPendingJobs = async () => {
  const res = await api.get("/technician-pending/pending");
  return res.data;
};

export const acceptJob = async (orderId: number) => {
  const res = await api.patch(`/technician-pending/accept/${orderId}`);
  return res.data;
};

export const completeJob = async (orderId: number) => {
  const res = await api.patch(`/technician-pending/complete/${orderId}`);
  return res.data;
};