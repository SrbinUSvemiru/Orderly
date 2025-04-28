import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../../db/index";
import { tickets } from "../../../../db/schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stageId = searchParams.get("id");

    if (!stageId) {
      throw new Error("ID is required");
    }
    const openCount = await db.$count(tickets, eq(tickets.stageId, stageId));

    return NextResponse.json(
      { count: openCount || 0, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error geting tickets:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
