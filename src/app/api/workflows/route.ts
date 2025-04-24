import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../db/index";
import { workflows } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, organizationId, userId } = body;

    const workflow = await db
      .select()
      .from(workflows)
      .where(eq(workflows.name, name))
      .then((res) => res[0]);

    if (workflow) {
      return NextResponse.json(
        { workflow: null, message: "Workflow with this name already exists" },
        { status: 409 }
      );
    }

    await db.insert(workflows).values({
      name: name,
      organizationId: organizationId,
      owner: userId,
    });

    return NextResponse.json(
      { success: true, message: "Workflow created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const workflowsList = await db.query.workflows.findMany();

    if (workflowsList) {
      return NextResponse.json([...workflowsList], { status: 200 });
    } else {
      return NextResponse.json(
        { message: "No workflows found" },
        { status: 404 } // Return 404 if no workflows are found
      );
    }
  } catch (error) {
    console.error("Error geting workflows:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
