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

  const emulatedRole = localStorage.getItem("aura-demo-emulated-role");
  if (emulatedRole) {
    config.headers["X-Demo-Override-Role"] = emulatedRole;
  }

  return config;
});

api.interceptors.response.use((response) => {
  if (response.data) {
    const normalize = (obj: any) => {
      if (!obj || typeof obj !== "object") return;
      if (obj.role === "WORKER") {
        obj.role = "EMPLOYEE";
      }
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          normalize(obj[key]);
        }
      }
    };
    normalize(response.data);
  }
  return response;
});
