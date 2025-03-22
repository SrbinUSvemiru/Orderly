import { db } from "../../../../db/index";
import { users } from "../../../../db/schema";

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getServerSession } from "next-auth";
import { authConfig } from "@/db/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { user: null, message: "ID is required" },
        { status: 400 }
      );
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0]); // Drizzle returns an array

    if (!user) {
      return NextResponse.json(
        { user: null, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...user }, { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { user: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    const id = params.id ? params.id : session?.user.id;

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

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0]);

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { user: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
