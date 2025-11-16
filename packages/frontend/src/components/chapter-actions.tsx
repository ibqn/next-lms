"use client"

import type { Chapter } from "database/src/drizzle/schema/chapter"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { ConfirmModal } from "@/components/modals/confirm-modal"

type ChapterActionsProps = {
  chapter: Chapter
  disabled: boolean
}

export const ChapterActions = ({ chapter, disabled }: ChapterActionsProps) => {
  const { isPublished } = chapter

  return (
    <div className="flex items-center gap-x-2">
      <Button variant="outline" size="sm" disabled={disabled}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={() => {}}>
        <Button size="sm" disabled={disabled}>
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
