import { boolean, text, decimal, uuid, real } from "drizzle-orm/pg-core"
import { lifecycleDates } from "./utils"
import { schema } from "./schema"
import { relations, type InferSelectModel } from "drizzle-orm"
import { categoryTable } from "./category"
import { userTable, type User } from "./auth"
import { attachmentTable } from "./attachment"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const courseTable = schema.table("course", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price").notNull().default(0),
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
    relationName: "category",
  }),
  user: one(userTable, {
    fields: [courseTable.userId],
    references: [userTable.id],
    relationName: "user",
  }),
  attachments: many(attachmentTable),
}))

export type Course = InferSelectModel<typeof courseTable> & {
  user: User | null
}

export const insertCourseSchema = createInsertSchema(courseTable, {
  title: z
    .string()
    .min(3, { message: "Title should have at least 3 characters." }),
})
