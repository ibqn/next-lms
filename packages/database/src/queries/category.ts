import { asc } from "drizzle-orm"
import { db } from "../drizzle/db"
import { categoryTable, type Category } from "../drizzle/schema/category"

export const getCategories = async () => {
  const categories = await db.query.category.findMany({
    columns: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [asc(categoryTable.name)],
  })

  return categories satisfies Category[] as Category[]
}
