// services/projects.service.ts
import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

export type Project = {
  _id: string;
  name: string;
  location?: string;
  status: string;
  createdAt: string;
};

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

/* ---------------------------------------
   🔹 GET — Projects assigned to contractor
----------------------------------------*/
export async function fetchContractorProjects(): Promise<Project[]> {
  const token = await getToken();

  // 🔑 IMPORTANT: silently skip if not authenticated yet
  if (!token) {
    return [];
  }

  const endpoint = `${API_URL}/mobile/projects`;

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.log("⚠️ fetchContractorProjects failed:", res.status);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/* ---------------------------------------
   🔹 GET — Single project by ID
----------------------------------------*/
export async function fetchProjectById(id: string) {
  const token = await getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const endpoint = `${API_URL}/mobile/projects/${id}`;

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Not authorized to view this project");
  }

  return res.json();
}

/* ---------------------------------------
   🔹 GET — Project Stats (Photos & Receipts Count)
----------------------------------------*/
export async function fetchProjectStats(
  id: string
): Promise<{ photos: number; receipts: number }> {
  const token = await getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const endpoint = `${API_URL}/mobile/projects/${id}/stats`;

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project stats");
  }

  return res.json();
}