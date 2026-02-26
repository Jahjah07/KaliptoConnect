import { apiFetch } from "@/services/api";

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

export function createContractor(payload: {
  name: string;
  email: string;
}) {
  return apiFetch("/mobile/contractor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getContractor() {
  return apiFetch("/mobile/contractor");
}

export function updateContractorProfile(
  updates: Record<string, unknown>
) {
  return apiFetch("/mobile/contractor/update", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteContractor() {
  return apiFetch("/mobile/contractor/delete", {
    method: "DELETE",
  });
}

/* ----------------------------------------
   DOCUMENTS — R2 UPLOAD
----------------------------------------- */

export function uploadContractorDocument(
  field: AllowedDocumentField,
  base64: string
): Promise<{ fileUrl: string; objectKey: string }> {
  return apiFetch("/mobile/contractor/documents/upload", {
    method: "POST",
    body: JSON.stringify({
      field,
      image: base64,
    }),
  });
}

/* ----------------------------------------
   DOCUMENTS — SAVE METADATA
----------------------------------------- */

export function saveContractorDocumentMetadata(params: {
  field: AllowedDocumentField;
  fileUrl?: string;
  objectKey?: string;
  expiry?: string;
}) {
  return apiFetch("/mobile/contractor/documents", {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

/* ----------------------------------------
   DOCUMENTS — DELETE
----------------------------------------- */

export function deleteContractorDocument(
  field: AllowedDocumentField
) {
  return apiFetch("/mobile/contractor/documents", {
    method: "DELETE",
    body: JSON.stringify({ field }),
  });
}

/* ----------------------------------------
   DOCUMENTS — REPLACE
----------------------------------------- */

export async function replaceContractorDocument(params: {
  field: AllowedDocumentField;
  base64: string;
  expiry?: string;
}) {
  const { field, base64, expiry } = params;

  await deleteContractorDocument(field);

  const { fileUrl, objectKey } =
    await uploadContractorDocument(field, base64);

  return saveContractorDocumentMetadata({
    field,
    fileUrl,
    objectKey,
    expiry,
  });
}

/* ----------------------------------------
   DOCUMENTS — PRESIGN
----------------------------------------- */

export function getContractorDocumentPresign(params: {
  field: AllowedDocumentField;
  mimeType: string;
}): Promise<{ uploadUrl: string; objectKey: string }> {
  return apiFetch(
    "/mobile/contractor/documents/presign",
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
}