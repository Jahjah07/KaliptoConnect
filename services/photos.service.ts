// src/services/photos.service.ts
import axios from "axios";
import { getAuth } from "firebase/auth";

const API = process.env.EXPO_PUBLIC_API_URL;

// Helper: attach Firebase token
async function authHeader() {
  const user = getAuth().currentUser;
  if (!user) return {};

  const token = await user.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// -------------------------------
// Upload photo
// -------------------------------
export async function uploadPhoto(projectId: string, base64: string) {
  const auth = await authHeader();

  const res = await axios.post(
    `${API}/mobile/projects/${projectId}/photos`,
    {
      image: base64,
    },
    auth
  );

  return res.data; // updated photos
}

// -------------------------------
// Fetch photos for 1 project
// -------------------------------
export async function fetchProjectPhotos(projectId: string) {
  const auth = await authHeader();

  const res = await axios.get(
    `${API}/mobile/projects/${projectId}/photos`,
    auth
  );

  return res.data; // array of photos
}

// -------------------------------
// Fetch ALL photos across ALL projects
// -------------------------------
export async function fetchAllPhotos() {
  const auth = await authHeader();

  const res = await axios.get(`${API}/mobile/photos/all`, auth);

  return res.data; 
}
