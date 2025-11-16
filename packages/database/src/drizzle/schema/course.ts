import { boolean, text, uuid, real } from "drizzle-orm/pg-core"
import { lifecycleDates } from "./utils"
import { schema } from "./schema"
import { relations, type InferSelectModel } from "drizzle-orm"
import { categoryTable } from "./category"
import { userTable, type User } from "./auth"
import { attachmentTable, type Attachment } from "./attachment"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { chapterTable, type Chapter } from "./chapter"

export const courseTable = schema.table("course", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price"),
  isPublished: boolean("is_published").notNull().default(false),

  imageUrl: text("image_url"),
  userId: uuid("user_id").references(() => userTable.id, {
    onDelete: "set null",
  }),
  categoryId: uuid("category_id").references(() => categoryTable.id, {
    onDelete: "cascade",
  }),

  ...lifecycleDates,
})

export const courseRelations = relations(courseTable, ({ one, many }) => ({
  category: one(categoryTable, {
    fields: [courseTable.categoryId],
    references: [categoryTable.id],
  }),
  user: one(userTable, {
    fields: [courseTable.userId],
    references: [userTable.id],
  }),
  chapters: many(chapterTable),
  attachments: many(attachmentTable),
}))

export type Course = InferSelectModel<typeof courseTable> & {
  user?: User | null
  attachments?: Attachment[]
  chapters?: Chapter[]
}

export const insertCourseSchema = createInsertSchema(courseTable, {
  title: z.string().min(3, { message: "Title should have at least 3 characters." }),
})
