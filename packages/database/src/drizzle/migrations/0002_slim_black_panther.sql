ALTER TABLE "drizzle"."purchase" ADD CONSTRAINT "purchase_user_id_course_id_pk" PRIMARY KEY("user_id","course_id");--> statement-breakpoint
ALTER TABLE "drizzle"."purchase" DROP COLUMN "id";