import {
  pgTable,
  pgEnum,
  uuid,
  boolean,
  text,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const UserTypeEnum = pgEnum("type", ["client", "employee"]);

const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
};

export const organizations = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  owner: text().notNull(),
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
  firstName: text().default(""),
  lastName: text().default(""),
  name: text().default(""),
  password: varchar().notNull(),
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "cascade",
  }),
  type: UserTypeEnum().notNull().default("client"),
  image: text(),
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
  active: boolean().notNull().default(true),
  ...timestamps,
});

export const ticketRelations = relations(tickets, ({ one }) => ({
  stage: one(stages, {
    fields: [tickets.stageId],
    references: [stages.id],
  }),
}));
