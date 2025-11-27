import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

export async function createContractor(payload: {
  name: string;
  email: string;
  firebaseUid: string;
}) {
  const token = await auth.currentUser?.getIdToken(true); // 🔥 force refresh

  console.log("🔹 API_URL:", API_URL);
  console.log("🔹 Sending contractor payload:", payload);
  console.log("🔹 Firebase ID Token:", token ? "exists" : "missing");

  const res = await fetch(`${API_URL}/contractors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  console.log("🔹 API Status:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.log("🔹 API Error:", errorText);
    throw new Error(`Contractor create failed: ${res.status}`);
  }

  return res.json();
}


export async function updateContractorDocument(
  id: string,
  field: string,
  value: string | { expiry: string }
) {
  const token = await auth.currentUser?.getIdToken();

  const res = await fetch(`${API_URL}/contractors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ [field]: value }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ Document update failed:", err);
    throw new Error(err);
  }

  return res.json();
}

// 🔹 Update basic contractor profile (name, phone, trade, etc.)
export async function updateContractorProfile(id: string, data: any) {
  const token = await auth.currentUser?.getIdToken();

  const res = await fetch(`${API_URL}/contractors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data), // whole object allowed
  });

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ Profile update failed:", err);
    throw new Error(err);
  }

  return res.json();
}

export async function getContractor(uid: string) {
  const token = await auth.currentUser?.getIdToken();

  const res = await fetch(`${API_URL}/contractors/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
