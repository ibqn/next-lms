import type { NewCourse } from "@/db/schema"
import type { CourseSchema } from "@/lib/validators/course"
import axios from "axios"

export const createCourseFn = async (courseData: CourseSchema) => {
  const response = await axios.post<NewCourse>("/api/courses", courseData)
  return response.data
}

export const updateCourseFn = async (
  courseId: string,
  courseData: CourseSchema
) => {
  const response = await axios.patch<NewCourse>(
    `/api/courses/${courseId}`,
    courseData
  )
  return response.data
}
