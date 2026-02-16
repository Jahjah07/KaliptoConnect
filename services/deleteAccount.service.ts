import { getAuth } from "firebase/auth";

export async function deleteAccount() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("No user");

  const token = await user.getIdToken(true);

  /* -------------------------
     1. Delete backend data
  -------------------------- */
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/account/delete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Backend deletion failed");
  }

  /* -------------------------
     2. Delete Firebase user
  -------------------------- */
  await user.delete();
}
