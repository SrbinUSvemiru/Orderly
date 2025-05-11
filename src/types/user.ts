export type User = {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName?: string;
  name?: string;
  salt?: string;
  createdAt: number;
  updatedAt?: number;
  deletedAt?: number;
  active: boolean;
  organizationId: string;
  image?: string | null;
  role: string;
};
