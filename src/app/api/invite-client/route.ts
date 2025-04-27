import { NextRequest, NextResponse } from "next/server";

import sgMail from "@sendgrid/mail";
import { generateToken } from "@/lib/encryption";
import { SERVER_URL } from "@/constants/server";

import { getAuthenticatedSession } from "@/lib/queries/getAuthenticatedSession";

const apiKey = process.env.SENDGRID_API_KEY || "";
const templateId = process.env.SENDGRID_REGISTER_TEMPLATE_ID || "";
sgMail.setApiKey(apiKey);

export async function POST(req: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { email, organizationId } = body;
    const token = generateToken({
      email: email,
      organizationId: organizationId,
    });

    const msg = {
      to: email,
      from: "srbinusvemiru@gmail.com",
      templateId: templateId,
      dynamicTemplateData: {
        email: email,
        registration_link: `${SERVER_URL}/sign-up?token=${token}`,
      },
    };

    const response = await sgMail.send(msg);
    if (response[0].statusCode === 202) {
      return NextResponse.json(
        { message: "Email sent successfully!", success: true },
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
