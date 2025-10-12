import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  COMMAND_PRIORITY_NORMAL,
  CommandListenerPriority,
  FOCUS_COMMAND,
} from "lexical"
import { useEffect } from "react"

const CurrentEditorPlugin = ({
  priority,
}: {
  priority?: CommandListenerPriority
}) => {
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

        return true
      },
      priority ?? COMMAND_PRIORITY_NORMAL,
    )
  }, [editor])

  return null
}

export default CurrentEditorPlugin
