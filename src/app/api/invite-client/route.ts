import sgMail from "@sendgrid/mail";
import { NextRequest, NextResponse } from "next/server";

import { SENGRID_MAIL, SERVER_URL } from "@/constants/server";
import { getUserFromSession } from "@/lib/actions/auth";
import { existingUser } from "@/lib/db_actions/existingUser";
import { generateToken } from "@/lib/encryption";

const apiKey = process.env.SENDGRID_API_KEY || "";
const templateId = process.env.SENDGRID_REGISTER_TEMPLATE_ID || "";
sgMail.setApiKey(apiKey);

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
    const { email, organizationId } = body;
    const token = await generateToken({
      email: email,
      organizationId: organizationId,
    });

    const isExistingUser = await existingUser(email);

    if (isExistingUser) {
      return NextResponse.json(
        { message: "This email already exists", success: false },
        { status: 500 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { message: "Token generation failed", success: false },
        { status: 500 }
      );
    }

    const msg = {
      to: email,
      from: `${SENGRID_MAIL}`,
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
      { message: "Internal Server Error", success: false },
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
