import { JWTPayload, jwtVerify, SignJWT } from "jose";
const secretKey = process.env.ENCRYPTION_KEY || "default_secret_key";

export interface RegisterPayload extends JWTPayload {
  email: string;
  organizationId: string;
}

export async function generateToken(payload: object): Promise<string> {
  return await new SignJWT(payload as RegisterPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

const secret = new TextEncoder().encode(secretKey);

export async function verifyToken(
  token: string
): Promise<RegisterPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as RegisterPayload;
  } catch {
    return null;
  }
}
