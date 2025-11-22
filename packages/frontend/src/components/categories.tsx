"use client"

import type { Category } from "database/src/drizzle/schema/category"
import { CategoryItem } from "@/components/category-item"

type Props = {
  categoryItems: Category[]
}

export const Categories = ({ categoryItems }: Props) => {
  return (
    <div className="flex flex-row gap-x-2 overflow-x-auto pb-2">
      {categoryItems.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}
