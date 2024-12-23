import { index, text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { courseTable } from "./course"
import { lifecycleDates } from "./utils"
import { relations, type InferSelectModel } from "drizzle-orm"

export const attachmentTable = schema.table(
  "attachment",
  {
    id: uuid("id").defaultRandom(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courseTable.id, { onDelete: "cascade" }),

    ...lifecycleDates,
  },
  (table) => [index("course_index").on(table.courseId)]
)

export const attachmentRelations = relations(attachmentTable, ({ one }) => ({
  course: one(courseTable, {
    fields: [attachmentTable.courseId],
    references: [courseTable.id],
    relationName: "course",
  }),
}))

export type Attachment = InferSelectModel<typeof attachmentTable>
