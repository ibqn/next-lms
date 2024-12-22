import type { NewCourse } from "database/src/drizzle/schema/course"
import type { CourseSchema, UpdateCourseSchema } from "@/lib/validators/course"
import axios from "axios"

export const createCourseFn = async (courseData: CourseSchema) => {
  const response = await axios.post<NewCourse>("/api/courses", courseData)
  return response.data
}

export const updateCourseFn = async (
  courseId: string,
  courseData: UpdateCourseSchema
) => {
  const response = await axios.patch<UpdateCourseSchema>(
    `/api/courses/${courseId}`,
    courseData
  )
  return response.data
}
