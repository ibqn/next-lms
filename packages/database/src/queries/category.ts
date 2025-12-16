import { asc } from "drizzle-orm"
import { db } from "../drizzle/db"
import { categoryTable, type Category } from "../drizzle/schema/category"

export const getCategories = async (): Promise<Category[]> => {
  const categories = await db.query.category.findMany({
    orderBy: [asc(categoryTable.name)],
  })

  return categories satisfies Category[]
}

export const getCategoryId = async (categoryName: string): Promise<string | undefined> => {
  const category = await db.query.category.findFirst({
    where: ({ name }, { ilike }) => ilike(name, `%${categoryName}%`),
    columns: { id: true },
  })

  return category ? category.id : undefined
}
