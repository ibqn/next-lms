ALTER TABLE "drizzle"."user" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "drizzle"."user" ADD COLUMN "email" text;