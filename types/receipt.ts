export interface Receipt {
  id: string;
  projectId: string;
  projectName?: string;
  store: string;
  amount: number; 
  date: string; 
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectReceiptsGroup {
  projectId: string;
  projectName: string;
  receipts: Receipt[];
}
