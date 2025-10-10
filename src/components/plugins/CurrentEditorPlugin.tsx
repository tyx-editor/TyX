import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { COMMAND_PRIORITY_HIGH, FOCUS_COMMAND } from "lexical"
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

  useEffect(() => {
    return editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        window.currentEditor = editor

        return false
      },
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor])

  return null
}

export default CurrentEditorPlugin
