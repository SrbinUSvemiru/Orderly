export type Ticket = {
  id: string;
  name: string;
  stageId: string;
  weight: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  active: boolean;
};
