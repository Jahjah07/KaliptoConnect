import { auth } from "@/lib/firebase";
import { Receipt } from "@/types/receipt";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

async function getToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/* ---------------------------------------
   FETCH RECEIPT
----------------------------------------*/
export async function fetchReceiptById(id: string): Promise<Receipt> {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/mobile/receipts/${id}`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch receipt");
  }

  return res.json();
}

/* ---------------------------------------
   UPDATE RECEIPT
----------------------------------------*/
export async function updateReceipt(
  id: string,
  data: {
    title?: string;
    amount?: number | null;
    date?: string | null;
  }
): Promise<Receipt> {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/mobile/receipts/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update receipt");
  }

  return res.json();
}
