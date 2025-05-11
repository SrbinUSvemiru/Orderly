import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      phone?: string;
      firstName: string;
      lastName?: string;
      name?: string;
      createdAt: Date;
      updatedAt?: Date;
      deletedAt?: Date;
      active: boolean;
      organizationId: string;
      image?: string | null;
      type: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      email: string;
      phone?: string;
      firstName: string;
      lastName?: string;
      name?: string;
      createdAt: Date;
      updatedAt?: Date;
      deletedAt?: Date;
      active: boolean;
      organizationId: string;
      image?: string | null;
      type: string;
    };
  }
}
