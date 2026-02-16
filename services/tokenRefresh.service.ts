// services/tokenRefresh.service.ts
import { auth } from "@/lib/firebase";

let refreshTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Starts silent Firebase ID token refresh loop.
 * Runs every 50 minutes.
 */
export function startTokenAutoRefresh() {
  stopTokenAutoRefresh();

  refreshTimer = setInterval(async () => {
    const user = auth.currentUser;

    // 🔑 Auth not ready / user logged out
    if (!user) return;

    try {
      await user.getIdToken(true); // force refresh
      console.log("🔄 Firebase token refreshed silently");
    } catch (err) {
      // Silent failure — do NOT throw
      console.log("⚠️ Token refresh failed");
    }
  }, 50 * 60 * 1000); // 50 minutes
}

/** Stop refresh loop (logout) */
export function stopTokenAutoRefresh() {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}
