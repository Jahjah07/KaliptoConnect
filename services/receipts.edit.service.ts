// services/receipts.service.ts

import { apiFetch } from "@/services/api";
import { Receipt } from "@/types/receipt";

/* ---------------------------------------
   FETCH RECEIPT
----------------------------------------*/
export function fetchReceiptById(id: string): Promise<Receipt> {
  return apiFetch(`/mobile/receipts/${id}`);
}

/* ---------------------------------------
   UPDATE RECEIPT
----------------------------------------*/
export function updateReceipt(
  id: string,
  data: {
    title?: string;
    amount?: number | null;
    date?: string | null;
  }
): Promise<Receipt> {
  return apiFetch(`/mobile/receipts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}