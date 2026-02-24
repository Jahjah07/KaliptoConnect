export type Photo = {
  url: string;
  public_id: string;
  type: "before" | "after";
  contractorId: string;
  uploadedAt: string;
};

export type ProjectPhotosGroup = {
  projectId: string;
  projectName: string;
  photos: Photo[];
  createdAt: string;
};
