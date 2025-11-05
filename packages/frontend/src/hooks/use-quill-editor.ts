import { useRef } from "react"
import Quill from "quill"

export const useQuillEditor = () => {
  const editorRef = useRef<Quill>(null)

  return { editorRef }
}
