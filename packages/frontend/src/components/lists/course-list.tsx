"use client"

import { CourseDataTable } from "@/components/data-table/course-data-table"
import { courseColumns } from "@/components/columns/course-columns"
import { useSuspenseQuery } from "@tanstack/react-query"
import { PaginationState } from "@tanstack/react-table"
import { useState } from "react"
import { editorCourseListQueryOptions } from "@/api/course"

export const CourseList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data } = useSuspenseQuery(
    editorCourseListQueryOptions({ page: pagination.pageIndex + 1, limit: pagination.pageSize })
  )
  const { courseItems, pagination: paginationResult } = data

  return (
    <CourseDataTable
      columns={courseColumns}
      data={courseItems}
      pagination={pagination}
      setPagination={setPagination}
      pageCount={paginationResult.totalPages}
    />
  )
}
