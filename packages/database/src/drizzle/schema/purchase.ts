import { uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"
import { courseTable } from "./course"
import { userTable } from "./auth"

export const purchaseTable = schema.table("purchase", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courseTable.id, { onDelete: "cascade" }),

  ...lifecycleDates,
})
