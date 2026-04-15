import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

export const historyAxios = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL as string).replace(/\/$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request (axios.create() does NOT inherit global interceptors)
historyAxios.interceptors.request.use(async (config) => {
  const { data, error } = await supabase.auth.getSession();
  if (!error && data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});
