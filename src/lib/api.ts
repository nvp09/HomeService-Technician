import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const apiBaseUrlRaw = process.env.NEXT_PUBLIC_API_URL as string;
const apiBaseUrl = apiBaseUrlRaw.endsWith("/")
  ? apiBaseUrlRaw.slice(0, -1)
  : apiBaseUrlRaw;

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
});

api.interceptors.request.use(async (config) => {
  const { data, error } = await supabase.auth.getSession();
  if (!error && data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;