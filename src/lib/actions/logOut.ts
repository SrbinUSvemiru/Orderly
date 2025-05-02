"use server";

import { cookies } from "next/headers";

import { removeUserFromSession } from "./auth";

export async function logOut() {
  await removeUserFromSession(await cookies());
}
