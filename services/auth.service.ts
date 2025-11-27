// services/auth.service.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth";

import { auth, firestore } from "@/lib/firebase";
import { IUser } from "@/types/user";
import { createContractor } from "@/services/contractor.service";
import { doc, setDoc } from "firebase/firestore";

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  // Create user
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // Update display name if provided
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Save user to Firestore
  await setDoc(doc(firestore, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    createdAt: Date.now(),
  });

  // Create contractor in your backend API
  await createContractor({
    firebaseUid: user.uid,
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
