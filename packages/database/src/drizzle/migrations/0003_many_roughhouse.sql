ALTER TABLE "drizzle"."video_data" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "drizzle"."video_data" CASCADE;--> statement-breakpoint
ALTER TABLE "drizzle"."user_progress" DROP CONSTRAINT "user_progress_chapter_id_user_id_unique";--> statement-breakpoint
ALTER TABLE "drizzle"."stripe_customer" ALTER COLUMN "stripe_customer_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "drizzle"."stripe_customer" ADD CONSTRAINT "stripe_customer_user_id_stripe_customer_id_pk" PRIMARY KEY("user_id","stripe_customer_id");--> statement-breakpoint
ALTER TABLE "drizzle"."user_progress" ADD CONSTRAINT "user_progress_user_id_chapter_id_pk" PRIMARY KEY("user_id","chapter_id");--> statement-breakpoint
CREATE INDEX "purchase_course_id_index" ON "drizzle"."purchase" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "stripe_customer_stripe_customer_id_index" ON "drizzle"."stripe_customer" USING btree ("stripe_customer_id");--> statement-breakpoint
ALTER TABLE "drizzle"."stripe_customer" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "drizzle"."user_progress" DROP COLUMN "id";