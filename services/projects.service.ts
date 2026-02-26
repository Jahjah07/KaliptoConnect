// services/projects.service.ts

import { apiFetch } from "@/services/api";

export type Project = {
  _id: string;
  name: string;
  location?: string;
  status: string;
  createdAt: string;
};

/* ---------------------------------------
   GET — Projects assigned to contractor
----------------------------------------*/
export function fetchContractorProjects(): Promise<Project[]> {
  return apiFetch("/mobile/projects");
}

/* ---------------------------------------
   GET — Single project by ID
----------------------------------------*/
export function fetchProjectById(id: string) {
  return apiFetch(`/mobile/projects/${id}`);
}

/* ---------------------------------------
   GET — Project Stats (Photos & Receipts Count)
----------------------------------------*/
export function fetchProjectStats(
  id: string
): Promise<{ photos: number; receipts: number }> {
  return apiFetch(`/mobile/projects/${id}/stats`);
}