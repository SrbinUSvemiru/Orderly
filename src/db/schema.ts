import { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_role", userRoles);

const organisationTypes = ["enterprise", "client"] as const;
export type OrganisationType = (typeof organisationTypes)[number];
export const organisationTypeEnum = pgEnum(
  "organisation_type",
  organisationTypes
);

const timestamps = {
  createdAt: bigint("created_at", { mode: "number" }).default(Date.now()),
  updatedAt: bigint("updated_at", { mode: "number" })
    .notNull()
    .default(Date.now())
    .$onUpdate(() => Date.now()),
  deletedAt: bigint("deleted_at", { mode: "number" }),
};

export const organizations = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  type: organisationTypeEnum().notNull().default("client"),
  ...timestamps,
});

export const organizationRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  workflows: many(workflows),
}));

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().unique().notNull(),
  phone: text().unique(),
  firstName: text("first_name").default(""),
  lastName: text("last_name").default(""),
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
