export type Stage = {
  id: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  active: boolean;
  workflowId: string;
  weight: number;
};
