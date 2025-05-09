import "server-only";

import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import { map } from "lodash";

import { GetClientsSchema } from "@/lib/clients_search_params";
import { filterColumns } from "@/lib/filter-columns";
import { unstable_cache } from "@/lib/unstable-cache";

import { db } from "..";
import { organizations, users } from "../schema";

export async function getClients(input: GetClientsSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;
        const limit = input.perPage;

        const advancedTable =
          input.filterFlag === "advancedFilters" ||
          input.filterFlag === "commandFilters";

        const advancedWhere = filterColumns({
          table: organizations,
          filters: input.filters,
          joinOperator: input.joinOperator,
        });

        const where = advancedTable
          ? and(advancedWhere, eq(organizations.type, "client"))
          : and(
              input.name
                ? ilike(organizations.name, `%${input.name}%`)
                : undefined,
              input.address
                ? ilike(
                    // this becomes: address->>'formatted'
                    sql`${organizations.address}->>'formatted'`,
                    `%${input.address}%`
                  )
                : undefined,
              eq(organizations.type, "client")
            );

        const orderBy =
          input.sort.length > 0
            ? map(input.sort, (item) =>
                item.desc
                  ? desc(organizations[item.id])
                  : asc(organizations[item.id])
              )
            : [asc(organizations.createdAt)];

        const data = await db
          .select({
            id: organizations.id,
            name: organizations.name,
            address: sql`${organizations.address}->>'formatted'`,
            type: organizations.type,
            createdAt: organizations.createdAt,
            updatedAt: organizations.updatedAt,
            owner: sql`${users.firstName} || ' ' || ${users.lastName}`,
          })
          .from(organizations)
          .innerJoin(users, eq(users.id, organizations.ownerId))
          .where(where)
          .orderBy(...orderBy)
          .limit(limit)
          .offset(offset);

        const total = await db
          .select({
            count: count(),
          })
          .from(organizations)
          .where(where)
          .execute()
          .then((res) => res[0]?.count ?? 0);

        const pageCount = Math.ceil(total / input.perPage);
        return { data, pageCount };
      } catch (_err) {
        console.error(_err);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 1,
      tags: ["clients"],
    }
  )();
}
