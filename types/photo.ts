export type Photo = {
  url: string;
  public_id: string;
  contractorId: string;
  uploadedAt: string;
};

export type ProjectPhotosGroup = {
  projectId: string;
  projectName: string;
  photos: Photo[];
};
