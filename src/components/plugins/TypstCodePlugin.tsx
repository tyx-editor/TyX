import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical"
import { useEffect } from "react"
import { $createTypstCodeNode, INSERT_TYPST_CODE_COMMAND } from "./typstCode"

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
