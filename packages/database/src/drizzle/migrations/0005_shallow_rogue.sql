ALTER TABLE "drizzle"."user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "drizzle"."user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");