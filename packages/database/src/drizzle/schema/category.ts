import { text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"
import { relations, type InferSelectModel } from "drizzle-orm"
import { courseTable } from "./course"

export const categoryTable = schema.table("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),

  ...lifecycleDates,
})

export const categoryRelations = relations(categoryTable, ({ one, many }) => ({
  courses: many(courseTable),
}))

export type Category = InferSelectModel<typeof categoryTable>
