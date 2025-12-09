import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

/* ----------------------------------------
🔒 WAIT FOR AUTH RESTORE
----------------------------------------- */
function waitForAuth(): Promise<any> {
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        unsub();
        resolve(user);
      }
    });
  });
}

/* ----------------------------------------
🔒 GET FRESH TOKEN SAFE
----------------------------------------- */
async function getValidToken() {
  let user = auth.currentUser;

  // If no user yet, wait for Firebase to restore session
  if (!user) {
    user = await waitForAuth();
  }

  // Get fresh token
  const token = await user!.getIdToken(true);

  if (!token) throw new Error("Unable to get Firebase token");
  return token;
}

/* ----------------------------------------
🔒 ALWAYS SEND VALID HEADERS
----------------------------------------- */
async function authHeaders() {
  const token = await getValidToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/* ----------------------------------------
🔁 UNIVERSAL FETCH WRAPPER WITH RETRY
----------------------------------------- */
async function secureFetch(url: string, options: any = {}, retry = true) {
  let res = await fetch(url, options);

  // If token expired or invalid → REFRESH once then retry automatically
  if (res.status === 401 && retry) {
    console.log("🔄 Retrying API call with new token...");
    const newHeaders = await authHeaders();
    res = await fetch(url, { ...options, headers: newHeaders });
  }

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ API Error:", err);
    throw new Error(err);
  }

  return res.json();
}

/* ----------------------------------------
1. CREATE CONTRACTOR
----------------------------------------- */
export async function createContractor(payload: { name: string; email: string }) {
  return secureFetch(`${API_URL}/mobile/contractor`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });
}

/* ----------------------------------------
2. GET CONTRACTOR
----------------------------------------- */
export async function getContractor() {
  return secureFetch(`${API_URL}/mobile/contractor`, {
    headers: await authHeaders(),
  });
}

/* ----------------------------------------
3. UPDATE PROFILE
----------------------------------------- */
export async function updateContractorProfile(updates: Record<string, any>) {
  return secureFetch(`${API_URL}/mobile/contractor/update`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(updates),
  });
}

/* ----------------------------------------
4. UPDATE DOCUMENT
----------------------------------------- */
export async function updateContractorDocument(
  field: string,
  fileUrl: string,
  expiry?: string
) {
  return secureFetch(`${API_URL}/mobile/contractor/documents`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify({ field, fileUrl, expiry }),
  });
}

/* ----------------------------------------
5. DELETE ACCOUNT
----------------------------------------- */
export async function deleteContractor() {
  return secureFetch(`${API_URL}/mobile/contractor/delete`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
}
