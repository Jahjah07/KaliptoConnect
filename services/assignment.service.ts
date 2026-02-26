import { apiFetch } from "@/services/api";

export function updateAssignmentStatus(
  assignmentId: string,
  status: "Pending" | "Ongoing" | "Completed"
) {
  return apiFetch(
    `/mobile/project-assignments/${assignmentId}`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    }
  );
}