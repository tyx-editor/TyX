import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { COMMAND_PRIORITY_CRITICAL, KEY_DOWN_COMMAND } from "lexical"
import { useEffect } from "react"

const CAN_USE_DOM: boolean =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined"
const IS_APPLE: boolean =
  CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
const CONTROL_OR_META = { ctrlKey: !IS_APPLE, metaKey: IS_APPLE }
type ModifierMask = {
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}
function matchModifier(
  event: KeyboardEvent,
  mask: ModifierMask,
  prop: keyof ModifierMask,
) {
  return (mask[prop] || false) == event[prop]
}

function isModifierMatch(event: KeyboardEvent, mask: ModifierMask): boolean {
  return (
    matchModifier(event, mask, "altKey") &&
    matchModifier(event, mask, "ctrlKey") &&
    matchModifier(event, mask, "shiftKey") &&
    matchModifier(event, mask, "metaKey")
  )
}

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
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor])

  return <></>
}

export default RemoveDefaultShortcutsPlugin
