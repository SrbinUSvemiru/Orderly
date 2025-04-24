import { NextRequest, NextResponse } from "next/server";

import sgMail from "@sendgrid/mail";
import { generateToken } from "@/lib/encryption";

const apiKey = process.env.SENDGRID_API_KEY || "";
const templateId = process.env.SENDGRID_REGISTER_TEMPLATE_ID || "";
sgMail.setApiKey(apiKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, organizationId } = body;
    const token = generateToken({
      email: email,
      organizationId: organizationId,
    });

    const msg = {
      to: email,
      subject: "Registration",
      from: "srbinusvemiru@gmail.com",
      templateId: templateId,
      dynamicTemplateData: {
        registration_link: `${process.env.URL}/sign-up?token=${token}`,
      },
    };

    const response = await sgMail.send(msg);
    if (response[0].statusCode === 202) {
      return NextResponse.json(
        { message: "Email sent successfully!" },
        { status: 201 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: "Email failed" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

// export async function PATCH(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     const body = await req.json();
//     const { ...updateData } = body;

//     if (!id) {
//       return NextResponse.json(
//         { user: null, message: "ID is required" },
//         { status: 400 }
//       );
//     }

//     await db
//       .update(invites)
//       .set({ ...updateData }) // Update only provided fields
//       .where(eq(invites.id, id));

//     const updatedTicket = await db
//       .select()
//       .from(invites)
//       .where(eq(invites.id, id))
//       .then((res) => res[0]);

//     return NextResponse.json({ ...updatedTicket }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating ticket:", error);
//     return NextResponse.json(
//       { user: null, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
