import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { $insertNodes, COMMAND_PRIORITY_EDITOR, NodeKey } from "lexical"
import { useEffect } from "react"
import { $createTypstCodeNode, INSERT_TYPST_CODE_COMMAND } from "./typstCode"

export const TypstCodeEditor = ({
  text,
  nodeKey,
}: {
  text: string
  nodeKey: NodeKey
}) => {
  const [editor] = useLexicalComposerContext()

  return (
    <LexicalNestedComposer initialEditor={editor}>
      <PlainTextPlugin
        contentEditable={<ContentEditable placeholder={null} />}
        ErrorBoundary={LexicalErrorBoundary}
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
        $insertNodes([$createTypstCodeNode()])
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [])

  return null
}

export default TypstCodePlugin
