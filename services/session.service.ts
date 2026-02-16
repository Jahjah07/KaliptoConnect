import { auth } from "@/lib/firebase";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

/**
 * Creates secure HTTP-only session cookie on backend
 */
export async function createSession(): Promise<void> {
  const user = auth.currentUser;

  if (!user) throw new Error("No Firebase user");

  // 🚨 CRITICAL: force token refresh after signup/login
  const idToken = await user.getIdToken(true);

  const res = await fetch(`${API_URL}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log("❌ Session creation failed:", err);
    throw new Error("Failed to establish secure session");
  }
}

export async function restoreUserSession() {
  const user = auth.currentUser;
  if (!user) return;

  const token = await user.getIdToken(true);

  await fetch(`${API_URL}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken: token }),
  });
}