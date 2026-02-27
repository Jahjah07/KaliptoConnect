import { auth } from "@/lib/firebase";
import { createContractor } from "@/services/contractor.service";
import { showError, showSuccess } from "@/services/toast.service";
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

/* =========================================================
   🔐 Helpers
========================================================= */

function genericLoginError() {
  return "Invalid email or password.";
}

function mapRegisterError(error: any): string {
  const code = error?.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "Unable to create account. Please try again.";
  }
}

async function securityDelay() {
  await new Promise((r) => setTimeout(r, 400));
}

/* =========================================================
   📝 REGISTER
========================================================= */

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<{ success: boolean; user?: User }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = displayName?.trim() || "";

  let user: User | null = null;

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

    user = cred.user;

    if (cleanName) {
      await updateProfile(user, { displayName: cleanName });
    }

    await createSession();

    try {
      await createContractor({
        name: cleanName,
        email: cleanEmail,
      });
    } catch (err) {
      await logout(); // remove session
      throw err;
    }
    
    showSuccess({
      title: "Account Created",
      message: "Your account has been successfully created.",
    });

    return { success: true, user };
  } catch (err: any) {
    if (user) {
      try {
        await deleteUser(user);
      } catch {}
    }

    showError({
      title: "Registration Failed",
      message: mapRegisterError(err),
    });

    return { success: false };
  }
}

/* =========================================================
   🔑 LOGIN
========================================================= */

export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User }> {
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

    try {
      await createSession(); // 🔥 Role enforcement happens here
    } catch {
      // 🔐 Role mismatch → force sign out
      await auth.signOut();

      showError({
        title: "Login Failed",
        message: "Invalid email or password.",
      });

      return { success: false };
    }

    return { success: true, user: cred.user };
  } catch {
    await securityDelay();

    showError({
      title: "Login Failed",
      message: genericLoginError(),
    });

    return { success: false };
  }
}

/* =========================================================
   🔁 PASSWORD RESET
========================================================= */

export async function sendPasswordReset(
  email: string
): Promise<{ success: boolean }> {
  try {
    await firebaseSendPasswordResetEmail(
      auth,
      email.trim().toLowerCase()
    );

    showSuccess({
      title: "Reset Email Sent",
      message: "Check your inbox for password reset instructions.",
    });

    return { success: true };
  } catch {
    showSuccess({
      title: "Reset Email Sent",
      message:
        "If an account exists for this email, a reset link has been sent.",
    });

    return { success: true };
  }
}

/* =========================================================
   🚪 LOGOUT
========================================================= */

export async function logout(): Promise<void> {
  try {
    await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/session`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  } catch (err) {
  }

  await signOut(auth);

  showSuccess({
    title: "Logged Out",
  });
}