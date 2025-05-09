"use server";

import { v4 as uuid } from "uuid";
import { z } from "zod";

import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { AccountSchema, RegisterSchema } from "@/types/register-schema";

import { existingUser } from "../db_actions/existingUser";
import { formatAddress } from "../format";
import { generateSalt, hashPassword } from "./auth";

export async function signUp(credentials: z.infer<typeof RegisterSchema>) {
  try {
    const parsed = RegisterSchema.parse(credentials);

    const { email, password, firstName, lastName, companyName, address } =
      parsed;

    const isExistingUser = await existingUser(email);

    if (isExistingUser) {
      return { message: "User with this email already exists", success: false };
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const name = lastName ? `${firstName} ${lastName}` : firstName;

    const orgId = uuid();
    const userId = uuid();

    const addressObj = {
      street: address.street || "",
      streetNumber: address.streetNumber || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
      city: address.city || "",
    };

    const formattedAddress = formatAddress(addressObj);

    const [organisation] = await db
      .insert(organizations)
      .values({
        id: orgId,
        name: companyName,
        ownerId: userId,
        address: {
          ...addressObj,
          formatted: formattedAddress,
        },
      })
      .returning({ id: organizations.id });

    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        name: name,
        salt: salt,
        organizationId: orgId,
        role: "owner",
      })
      .returning({ id: users.id, role: users.role });

    if (!organisation) {
      return { message: "Unable to create organisation", success: false };
    }

    if (!user) {
      return { message: "Unable to create user", success: false };
    }

    return { message: "User created successfully", success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { message: "Internal server error", success: false };
  }
}

export async function signUpUser(credentials: z.infer<typeof AccountSchema>) {
  try {
    const parsed = AccountSchema.parse(credentials);

    const { email, password, firstName, lastName, organisationId } = parsed;

    const isExistingUser = await existingUser(email);

    if (isExistingUser) {
      return { message: "User with this email already exists", success: false };
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
        organizationId: organisationId || "",
        role: "user",
      })
      .returning({ id: users.id, role: users.role });

    if (!user) {
      return { message: "Unable to create user", success: false };
    }

    return { message: "User created successfully", success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { message: "Internal server error", success: false };
  }
}
