ALTER TABLE "labels" ALTER COLUMN "created_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "labels" ALTER COLUMN "updated_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "stages" ALTER COLUMN "created_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "stages" ALTER COLUMN "updated_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "created_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "updated_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "workflows" ALTER COLUMN "created_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "workflows" ALTER COLUMN "updated_at" SET DEFAULT 1744451994269;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "owner";