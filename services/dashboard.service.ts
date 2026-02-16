import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

/* ---------------------------------------
   🔹 SAFE TOKEN GETTER (NON-THROWING)
----------------------------------------*/
async function getToken(): Promise<string | null> {
  const user = auth.currentUser;

  // 🔑 Auth not ready yet — do nothing
  if (!user) {
    return null;
  }

  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}
  
export async function fetchDashboardStats() {
  const token = await getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const endpoint = `${API_URL}/mobile/dashboard/stats`;

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return res.json();
}
