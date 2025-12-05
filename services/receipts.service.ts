// src/services/receipts.service.ts
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

/* -----------------------------------
   Upload Receipt (with image)
------------------------------------ */
export async function uploadReceipt(
  projectId: string,
  base64: string,
  amount: number,
  store: string,
  date: string
) {
  const auth = await authHeader();

  const res = await axios.post(
    `${API}/mobile/projects/${projectId}/receipts`,
    {
      image: base64,
      amount,
      store,
      date,
    },
    auth
  );

  return res.data; // updated project receipts
}

/* -----------------------------------
   Fetch receipts for ONE project
------------------------------------ */
export async function fetchProjectReceipts(projectId: string) {
  const auth = await authHeader();

  const res = await axios.get(
    `${API}/mobile/projects/${projectId}/receipts`,
    auth
  );

  return res.data; // array of receipts
}

/* -----------------------------------
   Fetch ALL receipts across ALL projects
   Format Expected:
   [
     {
       projectId: "p1",
       projectName: "Project Alpha",
       receipts: [ ... ]
     }
   ]
------------------------------------ */
export async function fetchAllReceipts() {
  const auth = await authHeader();

  const res = await axios.get(`${API}/mobile/receipts/all`, auth);

  return res.data;
}
