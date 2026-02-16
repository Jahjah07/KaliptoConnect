// src/services/receipts.service.ts
import { auth } from "@/lib/firebase";
import { ProjectReceiptsGroup, Receipt } from "@/types/receipt";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

/* ---------------------------------------
   🔹 SAFE TOKEN GETTER (NON-THROWING)
----------------------------------------*/
async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}

/* ---------------------------------------
   🔹 POST — Upload receipt (IMAGE ONLY)
----------------------------------------*/
export async function uploadReceipt(
  projectId: string,
  base64: string
) {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const endpoint = `${API_URL}/mobile/projects/${projectId}/receipts`;

  const res = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to upload receipt");
  }

  return res.json();
}

/* ---------------------------------------
   🔹 GET — Receipts for ONE project
----------------------------------------*/
export async function fetchProjectReceipts(
  projectId: string
): Promise<Receipt[]> {
  const token = await getToken();
  if (!token) return [];

  const endpoint = `${API_URL}/mobile/projects/${projectId}/receipts`;

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.log("⚠️ fetchProjectReceipts failed:", res.status);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/* ---------------------------------------
   🔹 GET — ALL receipts (contractor only)
----------------------------------------*/
export async function fetchAllReceipts(): Promise<ProjectReceiptsGroup[]> {
  const token = await getToken();
  if (!token) return [];

  const endpoint = `${API_URL}/mobile/receipts`;

  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.log("⚠️ fetchAllReceipts failed:", res.status);
    return [];
  }

  const data = await res.json();

  return Array.isArray(data) ? data : [];
}
