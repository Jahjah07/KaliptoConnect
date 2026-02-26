// session.service.ts

import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

export async function createSession() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user");
  }

  const idToken = await user.getIdToken();

  const res = await fetch(`${API_URL}/session`, {
    method: "POST",
    credentials: "include", // 🔥 critical
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken,
      app: "mobile",
    }),
  });

  if (!res.ok) {
    let message = "Failed to create session";

    try {
      const data = await res.json();
      message = data?.error || message;
    } catch {}

    throw new Error(message);
  }
}