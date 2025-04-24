CREATE TYPE "public"."organization_type" AS ENUM('enterprise', 'client');--> statement-breakpoint
CREATE TABLE "labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"color" text DEFAULT '' NOT NULL,
	"created_at" bigint DEFAULT 1744451834114,
	"updated_at" bigint DEFAULT 1744451834114 NOT NULL,
	"deleted_at" bigint
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"owner" text NOT NULL,
	"type" "organization_type" DEFAULT 'client' NOT NULL,
	"created_at" bigint DEFAULT 1744451834114,
	"updated_at" bigint DEFAULT 1744451834114 NOT NULL,
	"deleted_at" bigint
);
--> statement-breakpoint
CREATE TABLE "stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '',
	"weight" integer DEFAULT 0,
	"workflow_id" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" bigint DEFAULT 1744451834114,
	"updated_at" bigint DEFAULT 1744451834114 NOT NULL,
	"deleted_at" bigint
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '',
	"stage_id" uuid NOT NULL,
	"weight" integer DEFAULT 0,
	"owner_id" uuid,
	"label_id" uuid,
	"description" text DEFAULT '',
	"due_date" bigint,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" bigint DEFAULT 1744451834114,
	"updated_at" bigint DEFAULT 1744451834114 NOT NULL,
	"deleted_at" bigint
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"phone" text,
	"first_name" text DEFAULT '',
	"last_name" text DEFAULT '',
	"name" text DEFAULT '',
	"password" varchar NOT NULL,
	"organization_id" uuid,
	"image" text DEFAULT '',
	"active" boolean DEFAULT true NOT NULL,
	"created_at" bigint DEFAULT 1744451834114,
	"updated_at" bigint DEFAULT 1744451834114 NOT NULL,
	"deleted_at" bigint,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '',
	"owner" uuid,
	"organization_id" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" bigint DEFAULT 1744451834114,
	"updated_at" bigint DEFAULT 1744451834114 NOT NULL,
	"deleted_at" bigint
);
--> statement-breakpoint
ALTER TABLE "stages" ADD CONSTRAINT "stages_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;