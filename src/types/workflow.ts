export interface Workflow {
  id: string;
  owner: string;
  name: string;
  organizationId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  active: boolean;
}
