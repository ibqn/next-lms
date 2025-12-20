import { uuid, primaryKey, index } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"
import { courseTable, type Course } from "./course"
import { userTable, type User } from "./auth"
import { relations, type InferSelectModel } from "drizzle-orm"

export const purchaseTable = schema.table(
  "purchase",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courseTable.id, { onDelete: "cascade" }),

    ...lifecycleDates,
  },
  (table) => [primaryKey({ columns: [table.userId, table.courseId] }), index().on(table.courseId)]
)

export const purchaseRelations = relations(purchaseTable, ({ one }) => ({
  user: one(userTable, { fields: [purchaseTable.userId], references: [userTable.id] }),
  course: one(courseTable, { fields: [purchaseTable.courseId], references: [courseTable.id] }),
}))

export type Purchase = InferSelectModel<typeof purchaseTable> & {
  user?: User | null
  course?: Course | null
}
