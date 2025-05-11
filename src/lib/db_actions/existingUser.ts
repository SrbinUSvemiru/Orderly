import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function existingUser(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
}
