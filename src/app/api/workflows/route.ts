import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../db/index";
import { workflows } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authConfig } from "@/db/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    const body = await req.json();
    const { name } = body;
    const organizationId = "557fedce-7bc1-4081-9f01-ba1ac58d7c99";

    const workflow = await db
      .select()
      .from(workflows)
      .where(eq(workflows.name, name))
      .then((res) => res[0]); // Drizzle returns an array

    if (workflow) {
      return NextResponse.json(
        { workflow: null, message: "Workflow with this name already exists" },
        { status: 409 }
      );
    }

    const newWorkflow = await db.insert(workflows).values({
      name: name,
      organizationId: organizationId,
      owner: session?.user.id,
    });

    return NextResponse.json(
      { user: newWorkflow, message: "Workflow created successfully" },
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
    }
  } catch (error) {
    console.error("Error geting workflows:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
