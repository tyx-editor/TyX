import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"

const CurrentEditorPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    window.currentEditor = editor

    return () => {
      if (window.currentEditor === editor) {
        window.currentEditor = undefined
      }
    }
  }, [editor])

  return null
}

export default CurrentEditorPlugin
