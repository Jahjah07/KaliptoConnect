// src/types/receipt.ts
export type Receipt = {
  _id: string;
  projectId: string;   // ✅ ADD THIS
  url: string;
  title: string;
  amount?: number | null;
  contractorId?: {
    _id: string;
    name: string;
  };
  date?: string | null;
  uploadedAt: string;
  updatedAt?: string;
};

export interface ProjectReceiptsGroup {
  projectId: string;
  projectName: string;
  receipts: Receipt[];
}
