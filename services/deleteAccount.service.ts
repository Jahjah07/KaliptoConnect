import { apiFetch } from "@/services/api";

/* ---------------------------------------
   REQUEST ACCOUNT DELETION
----------------------------------------*/
export function requestAccountDeletion() {
  return apiFetch("/mobile/contractor/request-deletion", {
    method: "POST",
  });
}

/* ---------------------------------------
   CANCEL ACCOUNT DELETION
----------------------------------------*/
export function cancelAccountDeletion() {
  return apiFetch("/mobile/contractor/cancel-deletion", {
    method: "POST",
  });
}