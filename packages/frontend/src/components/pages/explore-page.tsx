"use client"

import { categoryQueryOptions } from "@/api/category"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Categories } from "../categories"
import { SearchInput } from "@/components/search-input"
import { ExploreCourseList } from "@/components/explore-course-list"

export const ExplorePage = () => {
  const { data: categories } = useSuspenseQuery(categoryQueryOptions())

  return (
    <>
      <SearchInput className="mx-6 mt-6 flex md:hidden" />
      <div className="flex w-full flex-col space-y-4 p-6">
        {categories && <Categories categoryItems={categories} />}

        <ExploreCourseList />
      </div>
    </>
  )
}
