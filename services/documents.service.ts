import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

export async function updateDocument({
  contractorId,
  field,
  fileUrl,
  expiry,
}: {
  contractorId: string;
  field: string;
  fileUrl: string;
  expiry?: string;
}) {
  const token = await auth.currentUser?.getIdToken();

  const res = await fetch(`${API_URL}/contractors/${contractorId}/documents`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ field, fileUrl, expiry }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Document update failed");
  }

  return json.contractor;
}
