export type User = {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  active: boolean;
  organizationId: string;
  image?: string;
  type: string;
};
