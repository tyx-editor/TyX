import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isAtNodeEnd } from "@lexical/selection"
import { mergeRegister } from "@lexical/utils"
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  LexicalEditor,
  NodeKey,
} from "lexical"
import { useEffect } from "react"

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
    const callback = (isFirst: boolean) => {
      const selection = $getSelection()
      const root = $getRoot()
      const firstOrLastNode = isFirst
        ? root.getFirstDescendant()
        : root.getLastDescendant()

      // Only add a paragraph before/after if the nested editor is the first/last one.
      if (!(isFirst ? first : last)) {
        return false
      }

      if (
        firstOrLastNode === null ||
        ($isRangeSelection(selection) &&
          firstOrLastNode.getKey() === selection.focus.key &&
          (isFirst
            ? selection.focus.offset === 0
            : $isAtNodeEnd(selection.focus)))
      ) {
        originalEditor.update(() => {
          const node = $getNodeByKey(nodeKey)
          if (
            node !== null &&
            node ===
              (isFirst
                ? $getRoot().getFirstDescendant()
                : $getRoot().getLastDescendant())
          ) {
            const p = $createParagraphNode()
            if (isFirst) {
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
        () => callback(false),
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        () => callback(true),
        COMMAND_PRIORITY_HIGH,
      ),
    )
  }, [editor, originalEditor, nodeKey])

  return null
}

export default NestedEditorPlugin
