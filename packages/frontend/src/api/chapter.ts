import type { CreateChapterSchema, ReorderChapterSchema, UpdateChapterSchema } from "database/src/validators/chapter"
import { axios } from "./axios"
import type { ApiResponse } from "database/src/types"
import { Chapter } from "database/src/drizzle/schema/chapter"
import { queryOptions } from "@tanstack/react-query"

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

export const getChapter = async (chapterId: string) => {
  try {
    const { data: response } = await axios.get<ApiResponse<Chapter>>(`/chapters/${chapterId}`)

    if (!response.success) {
      return null
    }
    const { data: chapter } = response
    return chapter
  } catch (error) {
    console.error(error)
    return null
  }
}

export const chapterQueryOptions = (courseId: string) =>
  queryOptions({
    queryKey: ["chapters", courseId] as const,
    queryFn: () => getChapter(courseId),
  })

export const patchChapter = async (chapterId: string, chapterData: UpdateChapterSchema) => {
  const { data: response } = await axios.patch<ApiResponse<Chapter>>(`/chapters/${chapterId}`, chapterData)

  if (!response.success) {
    return null
  }
  const { data: chapter } = response
  return chapter
}
