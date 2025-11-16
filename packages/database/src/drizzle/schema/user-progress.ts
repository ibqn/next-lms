import { uuid, boolean, index, unique } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"
import { relations, type InferSelectModel } from "drizzle-orm"
import { chapterTable } from "./chapter"
import { userTable } from "./auth"

export const userProgressTable = schema.table(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
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
  (table) => [index().on(table.chapterId), unique().on(table.chapterId, table.userId)]
)

export const chapterRelations = relations(userProgressTable, ({ one, many }) => ({}))

export type UserProgress = InferSelectModel<typeof userProgressTable>
