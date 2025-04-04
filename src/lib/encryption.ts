import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey = process.env.ENCRYPTION_KEY || "default_secret_key";

export function generateToken(payload: object): string {
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, secretKey);

    // Check if decoded is an object (JwtPayload) and not a string
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as JwtPayload;
    } else {
      return null; // If the decoded value is not an object, return null
    }
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
}
