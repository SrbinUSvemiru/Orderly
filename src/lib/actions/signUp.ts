"use server";

import { v4 as uuid } from "uuid";
import { z } from "zod";

import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { RegisterSchema } from "@/types/register-schema";

import { existingUser } from "../db_actions/existingUser";
import { generateSalt, hashPassword } from "./auth";

export async function signUp(credentials: z.infer<typeof RegisterSchema>) {
  try {
    console.log("credentials", credentials);
    const parsed = RegisterSchema.parse(credentials);

    const { email, password, firstName, lastName, companyName } = parsed;

    const isExistingUser = await existingUser(email);

    if (isExistingUser) {
      throw new Error("User with this email already exists");
    }
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const name = lastName ? `${firstName} ${lastName}` : firstName;
    const orgId = uuid();

    const [organisation] = await db
      .insert(organizations)
      .values({
        id: orgId,
        name: companyName,
      })
      .returning({ id: organizations.id });

    const [user] = await db
      .insert(users)
      .values({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        name: name,
        salt: salt,
        organizationId: orgId,
      })
      .returning({ id: users.id, role: users.role });

    if (!user) {
      return { message: "Unable to create user", success: false };
    }

    if (!organisation) {
      return { message: "Unable to create organisation", success: false };
    }

    return { message: "User created successfully", success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { message: "Internal server error", success: false };
  }
}
