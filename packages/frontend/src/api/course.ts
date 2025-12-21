import type { Course } from "database/src/drizzle/schema/course"
import type { CreateCourseSchema, UpdateCourseSchema } from "database/src/validators/course"
import { axios } from "./axios"
import type { ApiResponse, PaginatedSuccessResponse, SuccessResponse } from "database/src/types"
import { paginationSchema, type PaginationSchema } from "database/src/validators/pagination"
import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import type { ParamIdSchema } from "database/src/validators/param"
import { courseQuerySchema, type CourseQuerySchema } from "database/src/validators/course-query"

export const postCourse = async (courseData: CreateCourseSchema) => {
  const response = await axios.post<SuccessResponse<Course>>("/courses/dashboard", courseData)
  return response.data
}

export const patchCourse = async (courseId: string, courseData: UpdateCourseSchema) => {
  const response = await axios.patch<SuccessResponse<Course>>(`/courses/dashboard/${courseId}`, courseData)
  return response.data
}

export const deleteCourse = async (courseId: string) => {
  const { data: response } = await axios.delete<ApiResponse<{ id: string | null }>>(`/courses/dashboard/${courseId}`)

  if (!response.success) {
    return null
  }
  const { data: deletedChapter } = response

  return deletedChapter
}

export const getDashboardCourseItems = async (params?: PaginationSchema) => {
  const { data: response } = await axios.get<PaginatedSuccessResponse<Course[]>>("/courses/dashboard", { params })
  const { data: courseItems, pagination } = response
  return { courseItems, pagination }
}

export type GetDashboardCourseItems = Awaited<ReturnType<typeof getDashboardCourseItems>>

export const dashboardCourseListQueryOptions = (paramsInput?: Partial<PaginationSchema>) => {
  const params = paginationSchema.parse(paramsInput ?? {})

  return queryOptions({
    queryKey: ["dashboard-course-list", params] as const,
    queryFn: () => getDashboardCourseItems(params),
    placeholderData: keepPreviousData,
  })
}

export const getDashboardCourseItem = async ({ id }: ParamIdSchema) => {
  try {
    const { data: response } = await axios.get<ApiResponse<Course>>(`/courses/dashboard/${id}`)
    if (!response.success) {
      return null
    }
    return response.data
  } catch (error) {
    console.log("Error fetching course item:", error)
    return null
  }
}

export const dashboardCourseQueryOptions = (paramId?: ParamIdSchema) => {
  return queryOptions({
    queryKey: ["dashboard-course", paramId?.id ?? null] as const,
    queryFn: () => (paramId ? getDashboardCourseItem(paramId) : null),
    enabled: !!paramId?.id,
  })
}

export const getCourseItem = async ({ id }: ParamIdSchema) => {
  try {
    const { data: response } = await axios.get<ApiResponse<Course>>(`/courses/${id}`)
    if (!response.success) {
      return null
    }
    return response.data
  } catch (error) {
    console.log("Error fetching course item:", error)
    return null
  }
}

export const courseQueryOptions = (paramId?: ParamIdSchema) => {
  return queryOptions({
    queryKey: ["course", paramId?.id ?? null] as const,
    queryFn: () => (paramId ? getCourseItem(paramId) : null),
    enabled: !!paramId?.id,
  })
}

export const getCourseItems = async (params?: PaginationSchema & CourseQuerySchema) => {
  const { data: response } = await axios.get<PaginatedSuccessResponse<Course[]>>("/courses", { params })
  const { data: courseItems, pagination } = response
  return { courseItems, pagination }
}

export type GetCourseItems = Awaited<ReturnType<typeof getCourseItems>>

export const courseListQueryOptions = (paramsInput?: Partial<PaginationSchema & CourseQuerySchema>) => {
  const params = paginationSchema.and(courseQuerySchema).parse(paramsInput ?? {})

  return queryOptions({
    queryKey: ["course-list", params] as const,
    queryFn: () => getCourseItems(params),
    placeholderData: keepPreviousData,
  })
}
