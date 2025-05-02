"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { RegisterSchema } from "@/types/register-schema";

import { generateSalt, hashPassword } from "./auth";

export async function signUp(credentials: z.infer<typeof RegisterSchema>) {
  try {
    const { email, password, firstName, lastName } =
      RegisterSchema.parse(credentials);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0]); // Drizzle returns an array

    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const name = lastName ? `${firstName} ${lastName}` : firstName;

    const [user] = await db
      .insert(users)
      .values({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        name: name,
        salt: salt,
      })
      .returning({ id: users.id, role: users.role });

    if (!user) {
      return { message: "Unable to create user", success: false };
    }

    return { message: "User created successfully", success: true };
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
