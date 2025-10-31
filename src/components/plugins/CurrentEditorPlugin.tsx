import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  COMMAND_PRIORITY_NORMAL,
  CommandListenerPriority,
  FOCUS_COMMAND,
  NodeKey,
} from "lexical"
import { useEffect } from "react"

const CurrentEditorPlugin = ({
  priority,
  nodeKey,
}: {
  priority?: CommandListenerPriority
  nodeKey?: NodeKey
}) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    window.currentEditor = editor
    window.currentNodeKey = nodeKey

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
        window.currentNodeKey = nodeKey

        return true
      },
      priority ?? COMMAND_PRIORITY_NORMAL,
    )
  }, [editor])

  return null
}

export default CurrentEditorPlugin
