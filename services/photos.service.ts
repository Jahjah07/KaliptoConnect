// src/services/photos.service.ts

import { apiFetch } from "@/services/api";

/* -------------------------------
   Upload photo
-------------------------------- */

export function uploadPhoto(
  projectId: string,
  base64: string,
  type: "before" | "after"
) {
  return apiFetch(`/mobile/projects/${projectId}/photos`, {
    method: "POST",
    body: JSON.stringify({
      image: base64,
      type,
    }),
  });
}

/* -------------------------------
   Fetch photos for 1 project
-------------------------------- */

export function fetchProjectPhotos(projectId: string) {
  return apiFetch(`/mobile/projects/${projectId}/photos`);
}

/* -------------------------------
   Fetch ALL photos across ALL projects
-------------------------------- */

export function fetchAllPhotos() {
  return apiFetch(`/mobile/photos/all`);
}