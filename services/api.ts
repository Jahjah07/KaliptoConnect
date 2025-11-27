// src/services/api.ts
import { auth } from "@/lib/firebase"; // your firebase web SDK config (client)
import { Platform } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://crm-system-gray.vercel.app/api"; // set this in env

async function getToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    // expires => refreshes automatically
    return await user.getIdToken();
  } catch (err) {
    console.warn("Unable to get token", err);
    return null;
  }
}

async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(typeof input === "string" ? input : input, {
    ...(init || {}),
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  return null;
}

/* -------------------------
   Projects
   ------------------------- */

export type ProjectCreateInput = {
  name: string;
  address?: string;
  description?: string;
};

export async function getProjects() {
  return await fetchWithAuth(`${API_URL}/projects`);
}

export async function createProject(payload: ProjectCreateInput) {
  return await fetchWithAuth(`${API_URL}/projects`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getProjectById(id: string) {
  return await fetchWithAuth(`${API_URL}/projects/${id}`);
}

export async function deleteProject(id: string) {
  return await fetchWithAuth(`${API_URL}/projects/${id}`, {
    method: "DELETE",
  });
}

/* -------------------------
   Photos & Receipts (metadata)
   ------------------------- */

export type PhotoPayload = {
  fileName: string;
  url?: string; // if you uploaded to storage (S3/GCS) return URL
  caption?: string;
};

export async function addPhoto(projectId: string, payload: PhotoPayload) {
  return await fetchWithAuth(`${API_URL}/projects/${projectId}/photos`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type ReceiptPayload = {
  fileName: string;
  url?: string;
  amount?: number;
  note?: string;
};

export async function addReceipt(projectId: string, payload: ReceiptPayload) {
  return await fetchWithAuth(`${API_URL}/projects/${projectId}/receipts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* -------------------------
   User
   ------------------------- */

export async function getCurrentUser() {
  return await fetchWithAuth(`${API_URL}/user`);
}

export async function updateProfile(payload: Record<string, any>) {
  return await fetchWithAuth(`${API_URL}/user/update`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
