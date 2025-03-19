import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "../../../db/index";
import { workflows } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Decoded token:", token);
    const name = "home";

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
      organizationId: "1",
    });

    return NextResponse.json(
      { user: newWorkflow, message: "Workflow created successfully" },
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

export async function GET() {
  try {
    const users = await db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        type: true,
        image: true,
        organizationId: true,
      },
    });

    if (users) {
      return NextResponse.json({ users: users }, { status: 200 });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
