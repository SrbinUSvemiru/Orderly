import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../db/index";
import { getServerSession } from "next-auth";
import { authConfig } from "@/db/auth"; // Adjust the import based on your project structure
import { organizations } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getServerSession(authConfig);

    const { name } = body;

    if (session) {
      const organization = await db
        .select()
        .from(organizations)
        .where(eq(organizations.name, name))
        .then((res) => res[0]); // Drizzle returns an array

      if (organization) {
        return NextResponse.json(
          {
            organization: null,
            message: "Organization with this name already exists",
          },
          { status: 409 }
        );
      }

      const newOrganization = await db.insert(organizations).values({
        name: name,
        owner: session.user.id,
      });

      return NextResponse.json(
        {
          organization: newOrganization,
          message: "Organization created successfully",
        },
        { status: 201 }
      );
    }
    return NextResponse.json({ message: "failed" }, { status: 500 });
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
