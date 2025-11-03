import type { ColumnDef } from "@tanstack/react-table"
import type { Course } from "database/src/drizzle/schema/course"

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isPublished",
    header: "Published",
  },
]
