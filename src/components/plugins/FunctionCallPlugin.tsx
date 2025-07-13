import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
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
import { stringifyFunction } from "../../compilers/lexical2typst"
import { TyXValue } from "../../models"
import CurrentEditorPlugin from "./CurrentEditorPlugin"
import {
  $createFunctionCallNode,
  $isFunctionCallNode,
  INSERT_FUNCTION_CALL_COMMAND,
} from "./functionCall"
import KeyboardMapPlugin from "./KeyboardMapPlugin"
import MathPlugin from "./MathPlugin"
import { UPDATE_LOCAL_STORAGE_COMMAND } from "./updateLocalStorage"

export const FunctionCallEditor = ({
  name,
  content,
  positionParameters,
  namedParameters,
  nodeKey,
}: {
  name: string
  positionParameters: TyXValue[] | undefined
  namedParameters: Record<string, TyXValue> | undefined
  content: LexicalEditor | undefined
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
          const textSelection = content?.read(() => $getSelection())
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
            $isFunctionCallNode(node) &&
            content?.read(() => $getRoot().getTextContentSize()) === 0
          ) {
            node.remove()
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
          content?.focus()
        }
      })
    }
  }, [isSelected])

  return (
    <>
      <span>
        {stringifyFunction(name, positionParameters, namedParameters).replace(
          "()",
          "",
        )}
      </span>
      {content && (
        <LexicalNestedComposer initialEditor={content}>
          <RichTextPlugin
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

          <MathPlugin />
          <CurrentEditorPlugin />
          <KeyboardMapPlugin />
        </LexicalNestedComposer>
      )}
    </>
  )
}

const FunctionCallPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.registerCommand(
      INSERT_FUNCTION_CALL_COMMAND,
      (payload) => {
        const node =
          typeof payload === "string"
            ? $createFunctionCallNode(payload, [], {}, true)
            : $createFunctionCallNode(...payload)
        $insertNodes([node])

        if (node.isKeyboardSelectable()) {
          const selection = $createNodeSelection()
          selection.add(node.getKey())
          $setSelection(selection)
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}

export default FunctionCallPlugin
