import axios from "axios";
import { getAccessToken } from "./supabase";

export const api = axios.create({
  baseURL: import.meta.env.VITE_AURA_BACKEND_URL || "http://localhost:4000",
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
