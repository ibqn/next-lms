"use client"

import { chapterQueryOptions } from "@/api/chapter"
import { useQuery } from "@tanstack/react-query"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import { useParams } from "next/navigation"

export default function ChapterIdPage() {
  const { chapterId } = useParams<{ chapterId: Chapter["id"] }>()

  const { data: chapter } = useQuery(chapterQueryOptions({ id: chapterId }))

  return (
    <div>
      Chapter Page {chapterId} and {chapter?.title}
    </div>
  )
}
