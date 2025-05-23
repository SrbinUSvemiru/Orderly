import { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  json,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoles = ["owner", "admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_role", userRoles);

export const organisationTypes = ["enterprise", "client"] as const;
export type OrganisationType = (typeof organisationTypes)[number];
export const organisationTypeEnum = pgEnum(
  "organisation_type",
  organisationTypes
);

export const languages = ["en", "sr"] as const;
export type Language = (typeof languages)[number];
export const languageEnum = pgEnum("language", languages);

export const lensMaterial = ["cr", "polycarbonat", "trivex"] as const;
export type LensMaterial = (typeof lensMaterial)[number];
export const lensMaterialEnum = pgEnum("lens_material", lensMaterial);

export const lensVariant = ["monofocal", "progressive", "bifocal"] as const;
export type LensVariant = (typeof lensVariant)[number];
export const lensVariantEnum = pgEnum("lens_variant", lensVariant);

export const lensCoat = ["uc", "hc", "hmc", "hsc", "blue_cut", "ahsc"] as const;
export type LensCoat = (typeof lensCoat)[number];
export const lensCoatEnum = pgEnum("lens_coat", lensCoat);

export const lensIndex = [
  "1.50",
  "1.53",
  "1.55",
  "1.56",
  "1.60",
  "1.67",
  "1.70",
  "1.74",
  "1.80",
  "1.90",
] as const;
export type LensIndex = (typeof lensIndex)[number];
export const lensIndexEnum = pgEnum("lens_index", lensIndex);

const timestamps = {
  createdAt: bigint("created_at", { mode: "number" })
    .notNull()
    .default(Date.now()),
  updatedAt: bigint("updated_at", { mode: "number" })
    .notNull()
    .default(Date.now())
    .$onUpdate(() => Date.now()),
  deletedAt: bigint("deleted_at", { mode: "number" }),
};

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().unique().notNull(),
  phone: text().unique().default(""),
  firstName: text("first_name").default("").notNull(),
  lastName: text("last_name").default("").notNull(),
  name: text().default(""),
  password: varchar().notNull(),
  salt: text().notNull(),
  role: userRoleEnum().notNull().default("user"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  image: text().default(""),
  active: boolean().notNull().default(true),
  ...timestamps,
});

export const organizations = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  ownerId: uuid("owner_id").notNull(),
  language: languageEnum().notNull().default("en"),
  address: json("address")
    .$type<{
      country: string;
      city: string;
      street: string;
      streetNumber: string;
      postalCode: string;
      formatted: string;
    }>()
    .notNull(),
  type: organisationTypeEnum().notNull().default("client"),
  ...timestamps,
});

export const organizationRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  workflows: many(workflows),
}));

export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

export const workflows = pgTable("workflows", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().default(""),
  owner: uuid().references(() => users.id, {
    onDelete: "cascade",
  }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  active: boolean().notNull().default(true),
  ...timestamps,
});

export const workflowRelations = relations(workflows, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [workflows.organizationId],
    references: [organizations.id],
  }),
  stages: many(stages),
}));

export const stages = pgTable("stages", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().default(""),
  weight: integer().default(0),
  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflows.id, {
      onDelete: "cascade",
    }),
  active: boolean().notNull().default(true),
  ...timestamps,
});

export const labels = pgTable("labels", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull().default(""),
  color: text().notNull().default(""),
  ...timestamps,
});

export const stageRelations = relations(stages, ({ one, many }) => ({
  workflow: one(workflows, {
    fields: [stages.workflowId],
    references: [workflows.id],
  }),
  tickets: many(tickets),
}));

export const tickets = pgTable("tickets", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().default(""),
  stageId: uuid("stage_id")
    .notNull()
    .references(() => stages.id, {
      onDelete: "cascade",
    }),
  weight: integer().default(0),
  ownerId: uuid("owner_id").references(() => users.id, {
    onDelete: "set null",
  }),
  labelId: uuid("label_id").references(() => labels.id, {
    onDelete: "set null",
  }),
  description: text().default(""),
  dueDate: bigint("due_date", { mode: "number" }),
  active: boolean().notNull().default(true),
  ...timestamps,
});

export const lenses = pgTable("lenses", {
  id: uuid().primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  material: lensMaterialEnum().notNull().default("cr"),
  coat: lensCoatEnum().notNull().default("uc"),
  variant: lensVariantEnum().notNull().default("monofocal"),
  index: lensIndexEnum().notNull().default("1.56"),
  value: numeric().notNull().default("0"),
  ...timestamps,
});

export const ticketRelations = relations(tickets, ({ one, many }) => ({
  stage: one(stages, {
    fields: [tickets.stageId],
    references: [stages.id],
  }),
  labels: many(labels),
  owner: one(users, {
    fields: [tickets.ownerId],
    references: [users.id],
  }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);
export type Organisation = typeof organizations.$inferSelect;
