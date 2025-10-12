import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isAtNodeEnd } from "@lexical/selection"
import { mergeRegister } from "@lexical/utils"
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_DOWN_COMMAND,
  LexicalEditor,
  NodeKey,
} from "lexical"
import { useEffect } from "react"
import { $isRTL } from "./utilities"

const NestedEditorPlugin = ({
  editor: originalEditor,
  nodeKey,
  first,
  last,
}: {
  editor: LexicalEditor
  nodeKey: NodeKey
  first: boolean
  last: boolean
}) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const callback = (backward: boolean, ignoreRTL?: boolean) => {
      if ($isRTL() && !ignoreRTL) {
        backward = !backward
      }

      const selection = $getSelection()
      const root = $getRoot()
      const firstOrLastNode = backward
        ? root.getFirstDescendant()
        : root.getLastDescendant()

      // Only add a paragraph before/after if the nested editor is the first/last one.
      if (!(backward ? first : last)) {
        return false
      }

      if (
        firstOrLastNode === null ||
        ($isRangeSelection(selection) &&
          firstOrLastNode.getKey() === selection.focus.key &&
          (backward
            ? selection.focus.offset === 0
            : $isAtNodeEnd(selection.focus)))
      ) {
        originalEditor.update(() => {
          const node = $getNodeByKey(nodeKey)
          if (
            node !== null &&
            node ===
              (backward
                ? $getRoot().getFirstDescendant()
                : $getRoot().getLastDescendant())
          ) {
            const p = $createParagraphNode()
            if (backward) {
              node.insertBefore(p)
            } else {
              node.insertAfter(p)
            }
            p.select()
          }
        })
        return true
      }
      return false
    }

    return mergeRegister(
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        () => callback(true),
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        () => callback(true, true),
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        () => callback(false),
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        () => callback(false, true),
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (e) => {
          if (e.key === "Backspace" && $getRoot().getTextContentSize() === 0) {
            originalEditor.update(() => {
              const node = $getNodeByKey(nodeKey)
              if (node === null) {
                return
              }

              if (!node.isInline()) {
                const p = $createParagraphNode()
                node.replace(p)
                p.select()
              } else {
                node.remove(true)
              }
            })
            e.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    )
  }, [editor, originalEditor, nodeKey])

  return null
}

export default NestedEditorPlugin
