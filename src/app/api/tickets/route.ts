import { db } from "../../../db/index";
import { tickets } from "../../../db/schema";

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, stageId } = body;

    const newTicket = await db.insert(tickets).values({
      name: name,
      stageId: stageId,
    });

    return NextResponse.json(
      { ticket: newTicket, message: "Ticket created successfully" },
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

    if (!id) {
      throw new Error("ID is required");
    }
    const ticketsList = await db
      .select()
      .from(tickets)
      .where(eq(tickets.stageId, id))
      .then((res) => res); // Drizzle returns an array

    if (ticketsList) {
      return NextResponse.json([...ticketsList], { status: 200 });
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
        { user: null, message: "ID is required" },
        { status: 400 }
      );
    }

    await db
      .update(tickets)
      .set({ ...updateData }) // Update only provided fields
      .where(eq(tickets.id, id));

    const updatedTicket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id))
      .then((res) => res[0]);

    return NextResponse.json({ ...updatedTicket }, { status: 200 });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { user: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
