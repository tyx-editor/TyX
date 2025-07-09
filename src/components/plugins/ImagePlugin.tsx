import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical"
import { useEffect, useState } from "react"
import { readImage } from "../../backend"
import { getCurrentDocument } from "../../utilities"
import { $createImageNode, INSERT_IMAGE_COMMAND } from "./image"

export const ImageEditor = ({ src }: { src: string }) => {
  const [contents, setContents] = useState<string>()

  useEffect(() => {
    setContents(undefined)
    const doc = getCurrentDocument()
    readImage(doc.filename!, src).then(setContents)
  }, [src])

  return <img style={{ display: "inline-block" }} src={contents} />
}

const ImagePlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (src) => {
        $insertNodes([$createImageNode(src)])
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}

export default ImagePlugin
