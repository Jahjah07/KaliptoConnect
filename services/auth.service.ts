// services/auth.service.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { createContractor } from "@/services/contractor.service";

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

export async function logout() {
  return await signOut(auth);
}
