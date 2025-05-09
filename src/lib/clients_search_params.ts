import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

import { ClientColumnDef } from "@/app/(dashboard)/clients/columns";
import { flagConfig } from "@/config/flag-config";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";

type Omited = Omit<ClientColumnDef, "owner">;

export const searchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value)
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Omited>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  name: parseAsString.withDefault(""),
  owner: parseAsString.withDefault(""),
  address: parseAsString.withDefault(""),
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const createClientSchema = z.object({
  name: z.string(),
  owner: z.string(),
  address: z.string(),
});

export const updateClientSchema = z.object({
  name: z.string().optional(),
  owner: z.string().optional(),
  address: z.string().optional(),
});

export type GetClientsSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type CreateClientSchema = z.infer<typeof createClientSchema>;
export type UpdateClientschema = z.infer<typeof updateClientSchema>;
