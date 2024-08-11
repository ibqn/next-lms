import type { NewCourse } from "@/db/schema"
import type { CourseSchema } from "@/lib/validators/course"
import axios from "axios"

export const createCourseFn = async (courseData: CourseSchema) => {
  const response = await axios.post<NewCourse>("/api/courses", courseData)
  return response.data
}
