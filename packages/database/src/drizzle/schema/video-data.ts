import { uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"
import { relations, type InferSelectModel } from "drizzle-orm"
import { chapterTable } from "./chapter"

export const videoDataTable = schema.table("video-data", {
  id: uuid("id").primaryKey().defaultRandom(),

  assetId: uuid("asset_id"),
  chapterId: uuid("chapter_id").references(() => chapterTable.id, {
    onDelete: "cascade",
  }),
  ...lifecycleDates,
})

export const videoDataRelations = relations(
  videoDataTable,
  ({ one, many }) => ({})
)

export type VideoData = InferSelectModel<typeof videoDataTable>
