// services/auth.service.ts
import { auth } from "@/lib/firebase";
import { createContractor } from "@/services/contractor.service";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  await createContractor({
    name: displayName ?? "",
    email,
  });

  return user;
}

export async function loginWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function sendPasswordReset(email: string) {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    console.log("Password reset error:", error);
    throw new Error(error.message || "Failed to send reset email");
  }
}

export async function logout() {
  return await signOut(auth);
}
