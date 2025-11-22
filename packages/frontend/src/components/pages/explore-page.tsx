"use client"

import { categoryQueryOptions } from "@/api/category"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Categories } from "../categories"

export const ExplorePage = () => {
  const { data: categories } = useSuspenseQuery(categoryQueryOptions())

  return (
    <div className="flex w-full flex-col p-6">
      {categories && <Categories categoryItems={categories} />}
      <div>text</div>
    </div>
  )
}
