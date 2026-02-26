// src/services/receipts.service.ts

import { apiFetch } from "@/services/api";
import { ProjectReceiptsGroup, Receipt } from "@/types/receipt";

/* ---------------------------------------
   POST — Upload receipt (IMAGE ONLY)
----------------------------------------*/
export function uploadReceipt(
  projectId: string,
  base64: string
) {
  return apiFetch(`/mobile/projects/${projectId}/receipts`, {
    method: "POST",
    body: JSON.stringify({
      image: base64,
    }),
  });
}

/* ---------------------------------------
   GET — Receipts for ONE project
----------------------------------------*/
export function fetchProjectReceipts(
  projectId: string
): Promise<Receipt[]> {
  return apiFetch(`/mobile/projects/${projectId}/receipts`);
}

/* ---------------------------------------
   GET — ALL receipts (contractor only)
----------------------------------------*/
export function fetchAllReceipts(): Promise<ProjectReceiptsGroup[]> {
  return apiFetch(`/mobile/receipts`);
}