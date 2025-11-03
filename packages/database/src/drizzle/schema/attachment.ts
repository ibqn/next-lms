import { index, text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { courseTable } from "./course"
import { lifecycleDates } from "./utils"
import { relations, type InferSelectModel } from "drizzle-orm"
import { userTable } from "./auth"

export const attachmentTable = schema.table(
  "attachment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courseTable.id, { onDelete: "cascade" }),

    ...lifecycleDates,
  },
  (table) => [index().on(table.courseId)]
)

export const attachmentRelations = relations(attachmentTable, ({ one }) => ({
  user: one(userTable, {
    fields: [attachmentTable.userId],
    references: [userTable.id],
  }),
  course: one(courseTable, {
    fields: [attachmentTable.courseId],
    references: [courseTable.id],
  }),
}))

export type Attachment = InferSelectModel<typeof attachmentTable>
