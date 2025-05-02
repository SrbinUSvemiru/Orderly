import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../db/index";
import { tickets } from "../../../db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, stageId, ownerId } = body;

    await db.insert(tickets).values({
      name: name,
      stageId: stageId,
      ownerId: ownerId,
    });

    return NextResponse.json(
      { success: true, message: "Ticket created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ticket:", error);
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
    const stageId = searchParams.get("stageId");

    if (!id && !stageId) {
      throw new Error("ID is required");
    }

    if (stageId) {
      const ticketsList = await db
        .select()
        .from(tickets)
        .where(eq(tickets.stageId, stageId))
        .then((res) => res);

      const openCount = await db.$count(tickets, eq(tickets.stageId, stageId));

      if (ticketsList) {
        return NextResponse.json(
          {
            tickets: [...ticketsList],
            count: openCount,
            success: true,
            message: "Ticket success",
          },
          { status: 200 }
        );
      }
    }
    if (id) {
      const ticket = await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, id))
        .then((res) => res);
      if (ticket) {
        return NextResponse.json(
          {
            ticket: { ...ticket[0] },
            success: true,
            message: "Ticket success",
          },
          { status: 200 }
        );
      }
    }
    throw new Error("Error geting tickets from database");
  } catch (error) {
    console.error("Error geting tickets:", error);

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
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    await db
      .update(tickets)
      .set({ ...updateData })
      .where(eq(tickets.id, id));

    return NextResponse.json(
      { success: true, message: "Ticket updated succesfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: "Failed updating ticket" },
      { status: 500 }
    );
  }
}
