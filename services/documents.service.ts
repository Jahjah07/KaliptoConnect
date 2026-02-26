import { apiFetch } from "@/services/api";

export function updateDocument({
  field,
  fileUrl,
  expiry,
}: {
  field: string;
  fileUrl: string;
  expiry?: string;
}) {
  return apiFetch("/mobile/contractor/documents", {
    method: "PUT",
    body: JSON.stringify({ field, fileUrl, expiry }),
  });
}