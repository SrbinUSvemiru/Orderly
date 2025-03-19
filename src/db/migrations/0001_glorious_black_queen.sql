ALTER TABLE "users" ALTER COLUMN "phone" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "firstName" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastName" text DEFAULT '';