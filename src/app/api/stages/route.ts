import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { getUserFromSession } from "@/lib/actions/auth";

import { db } from "../../../db/index";
import { stages } from "../../../db/schema";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession(req.cookies);

    if (!sessionUser) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { name, weight, workflowId } = body;

    const stage = await db
      .select()
      .from(stages)
      .where(eq(stages.name, name))
      .then((res) => res[0]); // Drizzle returns an array

    if (stage) {
      return NextResponse.json(
        { success: false, message: "Stage with this name already exists" },
        { status: 409 }
      );
    }

    await db.insert(stages).values({
      name: name,
      weight: weight,
      workflowId: workflowId,
    });

    return NextResponse.json(
      { success: true, message: "Stage created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession(req.cookies);

    if (!sessionUser) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new Error("ID is required");
    }
    const stagesList = await db
      .select()
      .from(stages)
      .where(eq(stages.workflowId, id))
      .then((res) => res); // Drizzle returns an array

    if (stagesList) {
      return NextResponse.json([...stagesList], { status: 200 });
    }
    throw new Error("Error geting stages forom database");
  } catch (error) {
    console.error("Error geting stages:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
