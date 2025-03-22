import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "../../../db/index";
import { workflows } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Decoded token:", token);
    const body = await req.json();
    const { organizationId, name } = body;

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
    const workflows = await db.query.users.findMany();

    if (workflows) {
      return NextResponse.json({ workflows: workflows }, { status: 200 });
    }
  } catch (error) {
    console.error("Error geting workflows:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
