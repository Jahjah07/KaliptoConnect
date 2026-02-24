import { auth } from "@/lib/firebase";
import { createContractor } from "@/services/contractor.service";

import { startTokenAutoRefresh, stopTokenAutoRefresh } from "@/services/tokenRefresh.service";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { createSession } from "./session.service";

/* ---------------------------------------
   REGISTER USER (SAFE + ATOMIC)
---------------------------------------- */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = displayName?.trim() || "";

  let user: User | null = null;

  try {
    
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    user = cred.user;

    // 🔥 CRITICAL FIX — wait for token to exist
    await user.getIdToken(true);
    await new Promise((r) => setTimeout(r, 800));
    if (cleanName) {
      await updateProfile(user, { displayName: cleanName });
    }

    await createContractor({
      name: cleanName,
      email: cleanEmail,
    });

    await createSession();

    startTokenAutoRefresh();

    return user;
  } catch (err: any) {
    if (user) {
      try {
        await deleteUser(user);
      } catch (cleanupErr) {
        // cleanup error ignored
      }
    }

    throw new Error(err.message || "Registration failed");
  }
}

/* ---------------------------------------
   LOGIN (Firebase only)
---------------------------------------- */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  const cred = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );
  await new Promise((r) => setTimeout(r, 800));
  await createSession(); // backend session
  startTokenAutoRefresh(); // 🔥 START AUTO REFRESH
  return cred.user;
}

/* ---------------------------------------
   PASSWORD RESET
---------------------------------------- */
export async function sendPasswordReset(email: string) {
  try {
    await firebaseSendPasswordResetEmail(auth, email.trim().toLowerCase());
    return true;
  } catch (error: any) {
    throw new Error(error.message || "Failed to send reset email");
  }
}

/* ---------------------------------------
   LOGOUT (Firebase only)
---------------------------------------- */
export async function logout() {
  stopTokenAutoRefresh(); // 🔥 STOP LOOP

  try {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/session`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (err) {
    console.log("⚠️ Failed to delete session cookie:", err);
  }

  return signOut(auth);
}
