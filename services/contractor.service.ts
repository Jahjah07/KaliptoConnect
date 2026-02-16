import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

/* ----------------------------------------
   API BASE
----------------------------------------- */

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

/* ----------------------------------------
   WAIT FOR AUTH RESTORE
----------------------------------------- */

function waitForAuth(timeout = 5000): Promise<import("firebase/auth").User> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsub();
      reject(new Error("Auth timeout"));
    }, timeout);

    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        clearTimeout(timer);
        unsub();
        resolve(user);
      }
    });
  });
}

/* ----------------------------------------
   GET VALID TOKEN
----------------------------------------- */

async function getValidToken(): Promise<string> {
  let user = auth.currentUser;
  if (!user) user = await waitForAuth();

  try {
    return await user!.getIdToken(true);
  } catch {
    await auth.signOut();
    throw new Error("Session expired. Please log in again.");
  }
}

/* ----------------------------------------
   UNIVERSAL SECURE FETCH
----------------------------------------- */

async function secureFetch(
  url: string,
  options: RequestInit = {},
  retry = true
) {
  const token = await getValidToken();

  const doFetch = async (authToken: string) => {
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${authToken}`);
    headers.set("Content-Type", "application/json");

    return fetch(url, {
      ...options,
      headers,
    });
  };

  let res = await doFetch(token);

  // Retry once if token expired
  if (res.status === 401 && retry) {
    const fresh = await getValidToken();
    res = await doFetch(fresh);
  }

  if (!res.ok) {
    const text = await res.text();

    console.error("❌ API ERROR", {
      url,
      status: res.status,
      body: text,
    });

    throw new Error(
      text || `Request failed with status ${res.status}`
    );
  }

  const type = res.headers.get("content-type") || "";
  return type.includes("application/json") ? res.json() : null;
}

/* ----------------------------------------
   TYPES
----------------------------------------- */

export type AllowedDocumentField =
  | "abn"
  | "contractorLicense"
  | "validId"
  | "publicLiabilityCopy"
  | "workersInsuranceCopy";

/* ----------------------------------------
   CONTRACTOR CORE
----------------------------------------- */

export async function createContractor(payload: {
  name: string;
  email: string;
}) {
  return secureFetch(`${API_URL}/mobile/contractor`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getContractor() {
  const contractor = await secureFetch(`${API_URL}/mobile/contractor`);
  return contractor;
}

export async function updateContractorProfile(
  updates: Record<string, unknown>
) {
  return secureFetch(`${API_URL}/mobile/contractor/update`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteContractor() {
  return secureFetch(`${API_URL}/mobile/contractor/delete`, {
    method: "DELETE",
  });
}

/* ----------------------------------------
   DOCUMENTS — R2 UPLOAD
----------------------------------------- */

/**
 * Uploads base64 document to Cloudflare R2
 * Returns public URL + objectKey
 */
export async function uploadContractorDocument(
  field: AllowedDocumentField,
  base64: string
): Promise<{ fileUrl: string; objectKey: string }> {
  return secureFetch(`${API_URL}/mobile/contractor/documents/upload`, {
    method: "POST",
    body: JSON.stringify({
      field,
      image: base64,
    }),
  });
}

export function uploadContractorDocumentWithProgress(
  field: AllowedDocumentField,
  base64: string,
  onProgress: (percent: number) => void
): Promise<{ fileUrl: string; objectKey: string }> {
  return new Promise(async (resolve, reject) => {
    const token = await getValidToken();

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${API_URL}/mobile/contractor/documents/upload`
    );

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round(
          (event.loaded / event.total) * 100
        );
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));

    xhr.send(
      JSON.stringify({
        field,
        image: base64,
      })
    );
  });
}

/* ----------------------------------------
   DOCUMENTS — SAVE METADATA
----------------------------------------- */

/**
 * Saves document metadata to MongoDB
 * (URL, objectKey, expiry)
 */
export async function saveContractorDocumentMetadata(params: {
  field: AllowedDocumentField;
  fileUrl?: string;
  objectKey?: string;
  expiry?: string; // YYYY-MM-DD
}) {
  return secureFetch(`${API_URL}/mobile/contractor/documents`, {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

/* ----------------------------------------
   DOCUMENTS — DELETE
----------------------------------------- */

/**
 * Deletes document from R2 and clears MongoDB fields
 */
export async function deleteContractorDocument(
  field: AllowedDocumentField
) {
  return secureFetch(`${API_URL}/mobile/contractor/documents`, {
    method: "DELETE",
    body: JSON.stringify({ field }),
  });
}

/* ----------------------------------------
   DOCUMENTS — REPLACE (HELPER)
----------------------------------------- */

/**
 * Convenience helper:
 * delete → upload → save metadata
 */
export async function replaceContractorDocument(params: {
  field: AllowedDocumentField;
  base64: string;
  expiry?: string;
}) {
  const { field, base64, expiry } = params;

  // 1️⃣ Delete existing
  await deleteContractorDocument(field);

  // 2️⃣ Upload new
  const { fileUrl, objectKey } =
    await uploadContractorDocument(field, base64);

  // 3️⃣ Save metadata
  return saveContractorDocumentMetadata({
    field,
    fileUrl,
    objectKey,
    expiry,
  });
}

export async function getContractorDocumentPresign(params: {
  field: AllowedDocumentField;
  mimeType: string;
}): Promise<{ uploadUrl: string; objectKey: string }> {
  return secureFetch(
    `${API_URL}/mobile/contractor/documents/presign`,
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
}