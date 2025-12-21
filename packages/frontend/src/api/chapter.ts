import type { CreateChapterSchema, ReorderChapterSchema, UpdateChapterSchema } from "database/src/validators/chapter"
import { axios } from "./axios"
import type { ApiResponse } from "database/src/types"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import { queryOptions } from "@tanstack/react-query"
import type { ParamIdSchema } from "database/src/validators/param"

export const postChapter = async (chapterData: CreateChapterSchema) => {
  const { data: response } = await axios.post<ApiResponse<Chapter>>("/chapters/dashboard", chapterData)

  if (!response.success) {
    return null
  }
  const { data: chapter } = response

  return chapter
}

export const deleteChapter = async (chapterId: string) => {
  const { data: response } = await axios.delete<ApiResponse<{ id: string | null }>>(`/chapters/dashboard/${chapterId}`)

  if (!response.success) {
    return null
  }
  const { data: deletedChapter } = response

  return deletedChapter
}

export const postReorderChapters = async (reorderList: ReorderChapterSchema) => {
  const { data: response } = await axios.post<ApiResponse<{ id: string }[]>>("/chapters/dashboard/reorder", reorderList)

  if (!response.success) {
    return null
  }
  const { data: chapterIds } = response

  return chapterIds
}

export const getDashboardChapterItem = async ({ id: chapterId }: ParamIdSchema) => {
  try {
    const { data: response } = await axios.get<ApiResponse<Chapter>>(`/chapters/dashboard/${chapterId}`)

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

export const dashboardChapterQueryOptions = (paramId?: ParamIdSchema) =>
  queryOptions({
    queryKey: ["dashboard-chapters", paramId?.id ?? null] as const,
    queryFn: () => (paramId ? getDashboardChapterItem(paramId) : null),
    enabled: !!paramId?.id,
  })

export const getChapterItem = async ({ id: chapterId }: ParamIdSchema) => {
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

export const chapterQueryOptions = (paramId?: ParamIdSchema) =>
  queryOptions({
    queryKey: ["chapters", paramId?.id ?? null] as const,
    queryFn: () => (paramId ? getChapterItem(paramId) : null),
    enabled: !!paramId?.id,
  })

export const patchChapter = async (chapterId: string, chapterData: UpdateChapterSchema) => {
  const { data: response } = await axios.patch<ApiResponse<Chapter>>(`/chapters/dashboard/${chapterId}`, chapterData)

  if (!response.success) {
    return null
  }
  const { data: chapter } = response
  return chapter
}
