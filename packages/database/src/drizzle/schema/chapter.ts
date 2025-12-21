import { boolean, index, integer, text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"
import { relations, type InferSelectModel } from "drizzle-orm"
import { courseTable, type Course } from "./course"

export const chapterTable = schema.table(
  "chapter",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    videoUrl: text("video_url"),
    position: integer("position"),
    isPublished: boolean("is_published").notNull().default(false),
    isFree: boolean("is_free").notNull().default(false),

    courseId: uuid("course_id")
      .notNull()
      .references(() => courseTable.id, { onDelete: "cascade" }),

    ...lifecycleDates,
  },
  (table) => [index().on(table.courseId)]
)

export const chapterRelations = relations(chapterTable, ({ one }) => ({
  course: one(courseTable, { fields: [chapterTable.courseId], references: [courseTable.id] }),
}))

export type Chapter = InferSelectModel<typeof chapterTable> & {
  course?: Course | null
}
