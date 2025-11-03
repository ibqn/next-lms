"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table/course"
import { columns } from "@/components/columns/course"
import { useSuspenseQuery } from "@tanstack/react-query"
import { PaginationState } from "@tanstack/react-table"
import { useState } from "react"
import { courseListQueryOptions } from "@/api/course"

export const CourseList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data } = useSuspenseQuery(
    courseListQueryOptions({ page: pagination.pageIndex + 1, limit: pagination.pageSize })
  )
  const { courseItems, pagination: paginationResult } = data

  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-between">
        <Button onClick={() => router.push(`/teacher/create`)}>
          <Plus className="size-4" />
          New Course
        </Button>
      </div>

      <Separator />

      <DataTable
        columns={columns}
        data={courseItems}
        pagination={pagination}
        setPagination={setPagination}
        pageCount={paginationResult.totalPages}
      />
    </>
  )
}
