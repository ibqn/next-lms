import type { SuccessResponse } from "database/src/types"
import { axios } from "./axios"
import { queryOptions } from "@tanstack/react-query"
import { ParamIdSchema } from "database/src/validators/param"
import type { CourseProgress } from "database/src/queries/user-progress"

export const getUserProgress = async ({ id: courseId }: ParamIdSchema) => {
  const { data: response } = await axios.get<SuccessResponse<CourseProgress>>(`/courses/${courseId}/progress`)

  if (!response.success) {
    return null
  }
  const { data: progress } = response

  return progress
}

export const progressQueryOptions = (paramId: ParamIdSchema) =>
  queryOptions({ queryKey: ["progress", paramId], queryFn: () => getUserProgress(paramId) })
