"use client"

import { Chapter } from "database/src/drizzle/schema/chapter"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import { GripIcon, PencilIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ReorderChapterSchema } from "database/src/validators/chapter"

type Props = {
  chapters: Chapter[]
  onReorder: (reorderedData: ReorderChapterSchema) => void
}

export const ChapterList = (props: Props) => {
  const [chapters, setChapters] = useState<Chapter[]>(props.chapters)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updateData = items.map(({ id }, index) => ({ id, position: index + 1 })).slice(startIndex, endIndex + 1)

    setChapters(items)
    props.onReorder({ reorderList: updateData })
  }

  useEffect(() => {
    setChapters(props.chapters)
  }, [props.chapters])

  const router = useRouter()
  const onEdit = (chapterId: string) => {
    router.push(`/teacher/courses/${chapters.at(0)?.courseId}/chapters/${chapterId}`)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "mb-4 flex items-center gap-x-2 rounded-md border text-sm",
                      chapter.isPublished
                        ? "border-sky-200 bg-sky-100 text-sky-700"
                        : "border-slate-200 bg-slate-200 text-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-l-md border-r px-2 py-3 transition",
                        chapter.isPublished
                          ? "border-r-sky-200 hover:bg-sky-200"
                          : "border-r-slate-200 hover:bg-slate-300"
                      )}
                    >
                      <GripIcon className="size-5" />
                    </div>

                    {chapter.title}

                    <div className="ml-auto flex items-center gap-x-2 pr-2.5">
                      {chapter.isFree && <Badge>Free</Badge>}

                      <Badge className={cn(chapter.isPublished ? "bg-sky-700" : "bg-slate-500")}>
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>

                      <PencilIcon
                        className="size-4 cursor-pointer transition hover:opacity-75"
                        onClick={() => {
                          onEdit(chapter.id)
                        }}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
