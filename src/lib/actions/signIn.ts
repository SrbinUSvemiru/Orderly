"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { LoginSchema } from "@/types/login-schema";

import { comparePasswords, createUserSession } from "./auth";

export async function signIn(credentials: z.infer<typeof LoginSchema>) {
  try {
    const validatedFields = LoginSchema.safeParse(credentials);

    if (!validatedFields.success) {
      return { success: false, message: "Unable to sign in" };
    }

    const { email, password } = validatedFields.data;

    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        password: true,
        email: true,
        organizationId: true,
        role: true,
        salt: true,
      },
      where: eq(users.email, email),
    });

    if (!user || !user.password) {
      return { message: "User not found", success: false };
    }

    const organisation = await db.query.organizations.findFirst({
      columns: {
        id: true,
        type: true,
      },
      where: eq(organizations.id, user.organizationId),
    });

    if (!organisation) {
      return { message: "User has no organisation", success: false };
    }

    const passwordMatch = await comparePasswords({
      hashedPassword: user.password,
      password: password,
      salt: user.salt,
    });

    if (!passwordMatch) {
      return { message: "Incorrect password", success: false };
    }
    await createUserSession(
      { ...user, organizationType: organisation?.type },
      await cookies()
    );
    return { success: true, message: "User signed in successfully" };
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
}
