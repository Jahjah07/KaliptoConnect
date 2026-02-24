import { auth } from "@/lib/firebase";

export async function updateAssignmentStatus(
  assignmentId: string,
  status: "Pending" | "Ongoing" | "Completed"
) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/mobile/project-assignments/${assignmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Failed to update assignment");
  }

  return res.json();
}