import type { Course } from "database/src/drizzle/schema/course"
import type { UpdateCourseSchema } from "@/lib/validators/course"
import type { CreateCourseSchema } from "database/src/validators/course"
import { axios } from "./axios"
import { SuccessResponse } from "backend/src/types"

export const postCourse = async (courseData: CreateCourseSchema) => {
  const response = await axios.post<SuccessResponse<Course>>("/courses", courseData)
  return response.data
}

export const patchCourse = async (courseId: string, courseData: UpdateCourseSchema) => {
  const response = await axios.patch<UpdateCourseSchema>(`/courses/${courseId}`, courseData)
  return response.data
}
