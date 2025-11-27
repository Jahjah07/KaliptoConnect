import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

export async function getDashboardData() {
  const token = await auth.currentUser?.getIdToken();

  const res = await fetch(`${API_URL}/contractors/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load dashboard data");
  }

  return res.json();
}
