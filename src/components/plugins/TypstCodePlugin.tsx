import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import { mergeRegister } from "@lexical/utils"
import {
  $createNodeSelection,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $insertNodes,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  KEY_DOWN_COMMAND,
  KEY_ENTER_COMMAND,
  LexicalEditor,
  NodeKey,
} from "lexical"
import { useEffect } from "react"
import {
  $createTypstCodeNode,
  $isTypstCodeNode,
  INSERT_TYPST_CODE_COMMAND,
} from "./typstCode"
import { UPDATE_LOCAL_STORAGE_COMMAND } from "./updateLocalStorage"

export const TypstCodeEditor = ({
  text,
  nodeKey,
}: {
  text: LexicalEditor
  nodeKey: NodeKey
}) => {
  const [editor] = useLexicalComposerContext()
  const [isSelected] = useLexicalNodeSelection(nodeKey)

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (e) => {
          const node = $getNodeByKey(nodeKey)
          const textSelection = text.read(() => $getSelection())
          if ($getSelection() === null && textSelection !== null && node) {
            $setSelection(node.selectEnd())
            e?.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (e) => {
          const node = $getNodeByKey(nodeKey)

          if (
            e.key === "Backspace" &&
            $isTypstCodeNode(node) &&
            text.read(() => $getRoot().getTextContentSize()) === 0
          ) {
            node.remove(true)
            e.preventDefault()
            return true
          }

          return false
        },
        COMMAND_PRIORITY_HIGH,
      ),
    )
  }, [editor])

  useEffect(() => {
    if (isSelected) {
      editor.read(() => {
        const selection = $getSelection()
        if (selection?.getNodes().length === 1) {
          text.focus()
        }
      })
    }
  }, [isSelected])

  return (
    <LexicalNestedComposer initialEditor={text}>
      <PlainTextPlugin
        contentEditable={
          <ContentEditable placeholder={<></>} aria-placeholder="" />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <AutoFocusPlugin />
      <OnChangePlugin
        ignoreSelectionChange
        onChange={() =>
          editor.dispatchCommand(UPDATE_LOCAL_STORAGE_COMMAND, undefined)
        }
      />
    </LexicalNestedComposer>
  )
}

const TypstCodePlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_TYPST_CODE_COMMAND,
      () => {
        const node = $createTypstCodeNode()
        $insertNodes([node])

        const selection = $createNodeSelection()
        selection.add(node.getKey())
        $setSelection(selection)

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [])

  return null
}

export default TypstCodePlugin
