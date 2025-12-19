import type { Delta } from "quill"
import { QuillEditor } from "./quill-editor"
import { useQuillEditor } from "../hooks/use-quill-editor"
import { useEffect, useMemo } from "react"
import "quill/dist/quill.bubble.css"
import { cn } from "@/lib/utils"

type BubbleEditorProps = {
  value?: string | null
  className?: string
}

export const BubbleEditor = ({ value, className }: BubbleEditorProps) => {
  const { editorRef } = useQuillEditor()

  const delta = useMemo(() => {
    try {
      return JSON.parse(value ?? "{}") as Delta
    } catch {
      return {} as Delta
    }
  }, [value])

  useEffect(() => {
    editorRef.current?.setContents(delta)
  }, [delta, editorRef])

  return (
    <div className={cn("[&_.ql-container]:text-sm! [&_.ql-editor]:p-0!", className)}>
      <QuillEditor editorRef={editorRef} readOnly={true} defaultValue={delta} />
    </div>
  )
}
