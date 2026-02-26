import { apiFetch } from "@/services/api";

export function fetchDashboardStats() {
  return apiFetch("/mobile/dashboard/stats");
}