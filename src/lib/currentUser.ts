import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";

import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { Organisation } from "@/types/organisation";

import { getUserFromSession } from "../lib/actions/auth";

type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDb>>,
  undefined | null
>;

async function _getCurrentUser(): Promise<FullUser | null> {
  const user = await getUserFromSession(await cookies());
  if (user == null) {
    return null;
  }

  const fullUser = await getUserFromDb(user.id);

  return fullUser ?? null;
}

async function _getCurrentOrganisation(): Promise<Organisation | null> {
  const user = await getUserFromSession(await cookies());
  if (user == null) {
    return null;
  }
  const organisation = await getOrganisationFromDb(user?.organizationId);
  return organisation ?? null;
}

export const getCurrentUser = cache(_getCurrentUser);
export const getCurrentOrganisation = cache(_getCurrentOrganisation);

function getUserFromDb(id: string) {
  return db.query.users.findFirst({
    columns: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      phone: true,
      image: true,
      organizationId: true,
      createdAt: true,
      lastName: true,
      active: true,
    },
    where: eq(users.id, id),
  });
}

function getOrganisationFromDb(id: string) {
  return db.query.organizations.findFirst({
    columns: {
      id: true,
      ownerId: true,
      name: true,
      language: true,
      type: true,
    },
    where: eq(organizations.id, id),
  });
}
