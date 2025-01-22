import type { Course } from "database/src/drizzle/schema/course"
import type { CreateCourseSchema, UpdateCourseSchema } from "database/src/validators/course"
import { axios } from "./axios"
import type { SuccessResponse } from "database/src/types"

export const postCourse = async (courseData: CreateCourseSchema) => {
  const response = await axios.post<SuccessResponse<Course>>("/courses", courseData)
  return response.data
}

export const patchCourse = async (courseId: string, courseData: UpdateCourseSchema) => {
  const response = await axios.patch<SuccessResponse<Course>>(`/courses/${courseId}`, courseData)
  return response.data
}
