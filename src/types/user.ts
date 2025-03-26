export type User = {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  active: boolean;
  organizationId: string | null;
  type: string;
  image: string | null;
};
