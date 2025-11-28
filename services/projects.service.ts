// services/projects.service.ts
import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

export type Project = {
  _id: string;
  name: string;
  location?: string;
  status: string;
};

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

/* ---------------------------------------
   🔹 Secure Token Getter
----------------------------------------*/
async function getToken(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Not authenticated");
  }

  return await user.getIdToken();
}

/* ---------------------------------------
   🔹 GET — Projects assigned to contractor
----------------------------------------*/
export async function fetchContractorProjects(): Promise<Project[]> {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/mobile/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("❌ Projects list error:", text);
    throw new Error("Failed to fetch projects");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/* ---------------------------------------
   🔹 GET — Single project by ID
----------------------------------------*/
export async function fetchProjectById(id: string) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/mobile/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("❌ Project detail error:", text);
    throw new Error("Not authorized to view this project");
  }

  return (await res.json()) as unknown;
}
