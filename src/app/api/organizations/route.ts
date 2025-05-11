import { NextResponse } from "next/server";

import { db } from "../../../db/index";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { name } = body;

//     const organization = await db
//       .select()
//       .from(organizations)
//       .where(eq(organizations.name, name))
//       .then((res) => res[0]);

//     if (organization) {
//       return NextResponse.json(
//         {
//           organization: null,
//           message: "Organization with this name already exists",
//         },
//         { status: 409 }
//       );
//     }

//     // const newOrganization = await db.insert(organizations).values({
//     //   name: name,
//     // });

//     return NextResponse.json(
//       {
//         organization: newOrganization,
//         message: "Organization created successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: String(error) },
//       { status: 500 }
//     );
//   }
// }

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
