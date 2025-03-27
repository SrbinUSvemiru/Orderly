import { Ticket } from "./ticket";

export type Stage = {
  id: string;
  name: string;
  tickets?: Ticket[];
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  active: boolean;
  workflowId: string;
  weight: number;
};
