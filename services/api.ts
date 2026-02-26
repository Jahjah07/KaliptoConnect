// src/services/api.ts
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://crm-system-gray.vercel.app/api";

type ApiOptions = RequestInit & {
  skipJson?: boolean;
};

export async function apiFetch(
  path: string,
  options: ApiOptions = {}
) {
  const {
    method = "GET",
    skipJson = false,
    headers,
    body,
    ...rest
  } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      ...(body && !skipJson
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    body,
    ...rest,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data?.error || message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }

    /* ------------------------------------------
       🔐 ACCOUNT LIFECYCLE INTERCEPTOR
    ------------------------------------------ */

    if (
      message.includes("pending deletion") ||
      message.includes("ACCOUNT_PENDING_DELETION")
    ) {
      Toast.show({
        type: "error",
        text1: "Account Scheduled for Deletion",
        text2:
          "Your account is scheduled for deletion. Restore it to continue.",
      });

      // Optional redirect
      router.replace("/(dashboard)/profile");

      throw new Error("ACCOUNT_PENDING_DELETION");
    }

    throw new Error(message);
  }

  if (skipJson) return response;

  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}