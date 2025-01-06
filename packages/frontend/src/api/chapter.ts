import type { CreateChapterSchema, ReorderChapterSchema } from "database/src/validators/chapter"
import { axios } from "./axios"
import type { ApiResponse } from "backend/src/types"
import { Chapter } from "database/src/drizzle/schema/chapter"

export const postChapter = async (chapterData: CreateChapterSchema) => {
  const { data: response } = await axios.post<ApiResponse<Chapter>>("/chapters", chapterData)

  if (!response.success) {
    return null
  }
  const { data: chapter } = response

  return chapter
}

export const postReorderChapters = async (reorderList: ReorderChapterSchema) => {
  const { data: response } = await axios.post<ApiResponse<{ id: string }[]>>("/chapters/reorder", reorderList)

  if (!response.success) {
    return null
  }
  const { data: chapterIds } = response

  return chapterIds
}
