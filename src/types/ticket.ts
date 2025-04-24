export type Ticket = {
  id: string;
  name: string;
  stageId: string;
  weight: number;
  createdAt: number;
  updatedAt: number | null;
  deletedAt: number | null;
  active: boolean;
};
