import { getServerSession } from "next-auth";

import { authConfig } from "@/db/auth";

export async function getAuthenticatedSession() {
  const session = await getServerSession(authConfig);

  if (!session) {
    return null;
  }

  return session;
}
