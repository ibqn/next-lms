import { uuid, boolean, primaryKey, index } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"
import { relations, type InferSelectModel } from "drizzle-orm"
import { chapterTable, type Chapter } from "./chapter"
import { userTable, type User } from "./auth"

export const userProgressTable = schema.table(
  "user_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    chapterId: uuid("chapter_id")
      .notNull()
      .references(() => chapterTable.id, {
        onDelete: "cascade",
      }),
    isCompleted: boolean("is_completed").default(false),
    ...lifecycleDates,
  },
  (table) => [primaryKey({ columns: [table.userId, table.chapterId] }), index().on(table.chapterId)]
)

export const userProgressRelations = relations(userProgressTable, ({ one }) => ({
  user: one(userTable, { fields: [userProgressTable.userId], references: [userTable.id] }),
  chapter: one(chapterTable, { fields: [userProgressTable.chapterId], references: [chapterTable.id] }),
}))

export type UserProgress = InferSelectModel<typeof userProgressTable> & {
  user?: User | null
  chapter?: Chapter | null
}
