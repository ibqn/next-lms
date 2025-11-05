import type { Delta } from "quill"
import { QuillEditor } from "./quill-editor"
import { useQuillEditor } from "../hooks/use-quill-editor"
import { useEffect, useMemo } from "react"
import "quill/dist/quill.snow.css"

type SnowEditorProps = {
  value?: string | null
  onChange?: (value: string) => void
}

export const SnowEditor = ({ value, onChange }: SnowEditorProps) => {
  const { editorRef } = useQuillEditor()

  const delta = useMemo(() => {
    try {
      return JSON.parse(value || "{}") as Delta
    } catch {
      return {} as Delta
    }
  }, [value])

  const onTextChange = () => {
    onChange?.(JSON.stringify(editorRef.current?.getContents()))
  }

  useEffect(() => {
    onChange?.(JSON.stringify(editorRef.current?.getContents()))
  }, [onChange, editorRef])

  return (
    <div className="[&_.ql-container]:text-sm!">
      <QuillEditor editorRef={editorRef} readOnly={false} defaultValue={delta} onTextChange={onTextChange} />
    </div>
  )
}
