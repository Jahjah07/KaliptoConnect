// services/projects.service.ts
import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

// 🔹 Get Firebase token
async function getToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

/**
 * GET all projects assigned to logged-in contractor
 */
export async function fetchContractorProjects() {
  const token = await getToken();

  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("❌ Projects list error:", text);
    throw new Error("Failed to fetch projects");
  }

  return await res.json();
}

/**
 * GET a single project (only if contractor is assigned)
 */
export async function fetchProjectById(id: string) {
  const token = await getToken();

  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("❌ Project detail error:", text);
    throw new Error("You are not authorized to view this project");
  }

  return await res.json();
}
