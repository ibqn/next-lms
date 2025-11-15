import type { Course } from "database/src/drizzle/schema/course"
import type { CreateCourseSchema, UpdateCourseSchema } from "database/src/validators/course"
import { axios } from "./axios"
import type { ApiResponse, PaginatedSuccessResponse, SuccessResponse } from "database/src/types"
import { paginationSchema, PaginationSchema } from "database/src/validators/pagination"
import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import { ParamIdSchema } from "database/src/validators/param"

export const postCourse = async (courseData: CreateCourseSchema) => {
  const response = await axios.post<SuccessResponse<Course>>("/courses", courseData)
  return response.data
}

export const patchCourse = async (courseId: string, courseData: UpdateCourseSchema) => {
  const response = await axios.patch<SuccessResponse<Course>>(`/courses/${courseId}`, courseData)
  return response.data
}

export const getCourseItems = async (params?: PaginationSchema) => {
  const { data: response } = await axios.get<PaginatedSuccessResponse<Course[]>>("/courses", { params })
  const { data: courseItems, pagination } = response
  return { courseItems, pagination }
}
export type GetCourseItems = Awaited<ReturnType<typeof getCourseItems>>

export const courseListQueryOptions = (paramsInput: Partial<PaginationSchema> = {}) => {
  const params = paginationSchema.parse(paramsInput)

  return queryOptions({
    queryKey: ["course-list", params] as const,
    queryFn: () => getCourseItems(params),
    placeholderData: keepPreviousData,
  })
}

export const getCourseItem = async ({ id }: ParamIdSchema) => {
  try {
    const { data: response } = await axios.get<ApiResponse<Course>>(`/course/${id}`)
    if (!response.success) {
      return null
    }
    return response.data
  } catch (error) {
    console.log("Error fetching event item:", error)
    return null
  }
}

export const courseQueryOptions = (paramId?: ParamIdSchema) => {
  return queryOptions({
    queryKey: ["course", paramId?.id] as const,
    queryFn: () => (paramId?.id ? getCourseItem({ id: paramId?.id }) : null),
    enabled: !!paramId?.id,
  })
}
