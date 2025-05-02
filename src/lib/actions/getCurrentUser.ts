import { cookies } from "next/headers";
import { cache } from "react";

import { getUserFromSession } from "./auth";

export const getCurrentUser = cache(async () => {
  return await getUserFromSession(await cookies());
});
