import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { generateSalt, hashPassword } from "@/lib/actions/auth";
import { RegisterSchema } from "@/types/register-schema";

import { db } from "../../../db/index";
import { users } from "../../../db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, firstName, lastName } = RegisterSchema.parse(body);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0]); // Drizzle returns an array

    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const hashedPassword = await hashPassword(password, generateSalt());

    const name = lastName ? `${firstName} ${lastName}` : firstName;

    const [user] = await db
      .insert(users)
      .values({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        name: name,
        salt: hashedPassword,
      })
      .returning({ id: users.id, role: users.role });

    if (!user) {
      return NextResponse.json(
        { message: "User not created", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((res) => res[0]); // Drizzle returns an array

      if (!user) {
        return NextResponse.json(
          { user: null, message: "User not found", success: false },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { user: user, success: true, message: "User success" },
        { status: 200 }
      );
    } else {
      const usersList = await db.query.users.findMany({
        columns: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
          organizationId: true,
        },
      });

      if (users) {
        return NextResponse.json({ usersList }, { status: 200 });
      }
    }
  } catch (error) {
    console.error("Error geting users:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const body = await req.json();
    const { ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { user: null, message: "ID is required" },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({ ...updateData }) // Update only provided fields
      .where(eq(users.id, id));

    // const updatedUser = await db
    //   .select()
    //   .from(users)
    //   .where(eq(users.id, id))
    //   .then((res) => res[0]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { user: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
