export type Organisation = {
  id: string;
  name: string;
  ownerId: string;
  language: string;
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number | null;
  type: string;
};
