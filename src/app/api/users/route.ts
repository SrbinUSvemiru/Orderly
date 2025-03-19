import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../db/index";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt";
import { RegisterSchema } from "@/types/register-schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, firstName, lastName } = RegisterSchema.parse(body);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0]); // Drizzle returns an array

    if (user) {
      return NextResponse.json(
        { user: null, message: "User with this mail already exists" },
        { status: 409 }
      );
    }
    const hashedPassword = await hash(password, 10);

    const name = lastName ? `${firstName} ${lastName}` : firstName;

    const newUser = await db.insert(users).values({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      name: name,
    });

    return NextResponse.json(
      { user: newUser, message: "User created successfully" },
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
