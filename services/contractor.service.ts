import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

/**
 * Helper to always send Firebase ID token
 */
async function authHeaders() {
  const token = await auth.currentUser?.getIdToken(true); // force refresh
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/* ----------------------------------------
🔹 1. CREATE CONTRACTOR (POST)
----------------------------------------- */
export async function createContractor(payload: {
  name: string;
  email: string;
}) {
  const res = await fetch(`${API_URL}/mobile/contractor`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ Create contractor:", err);
    throw new Error(err);
  }

  return res.json();
}

/* ----------------------------------------
🔹 2. GET CONTRACTOR PROFILE (GET)
----------------------------------------- */
export async function getContractor() {
  const res = await fetch(`${API_URL}/mobile/contractor`, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ Get contractor:", err);
    throw new Error(err);
  }

  return res.json();
}

/* ----------------------------------------
🔹 3. UPDATE PROFILE (PUT)
----------------------------------------- */
export async function updateContractorProfile(
  updates: Record<string, any>
) {
  const res = await fetch(`${API_URL}/mobile/contractor/update`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ Update profile:", err);
    throw new Error(err);
  }

  return res.json();
}

/* ----------------------------------------
🔹 4. UPDATE DOCUMENT (PUT)
----------------------------------------- */
export async function updateContractorDocument(
  field: string,
  fileUrl: string,
  expiry?: string
) {
  const res = await fetch(`${API_URL}/mobile/contractor/documents`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify({ field, fileUrl, expiry }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ Update document:", err);
    throw new Error(err);
  }

  return res.json();
}

/* ----------------------------------------
🔹 5. DELETE ACCOUNT (DELETE)
----------------------------------------- */
export async function deleteContractor() {
  const res = await fetch(`${API_URL}/mobile/contractor/delete`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ Delete contractor:", err);
    throw new Error(err);
  }

  return res.json();
}
