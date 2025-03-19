import type { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Assuming the user ID is a string
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Assuming the user ID is a string
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
