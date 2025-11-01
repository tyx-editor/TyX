import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  COMMAND_PRIORITY_LOW,
  isModifierMatch,
  KEY_DOWN_COMMAND,
} from "lexical"
import { useEffect } from "react"
import { CONTROL_OR_META } from "../../resources/playground"

/** @brief Remove the default shortcuts set in https://github.com/facebook/lexical/blob/main/packages/lexical/src/LexicalUtils.ts */
const RemoveDefaultShortcutsPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        // Bold, Italic, Underline, Undo
        if (
          ["b", "i", "u", "z"].includes(event.key.toLowerCase()) &&
          isModifierMatch(event, CONTROL_OR_META)
        ) {
          return true
        }

        // Redo
        if (
          event.key.toLowerCase() === "z" &&
          isModifierMatch(event, { ...CONTROL_OR_META, shiftKey: true })
        ) {
          return true
        }

        return false
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])

  return null
}

export default RemoveDefaultShortcutsPlugin
