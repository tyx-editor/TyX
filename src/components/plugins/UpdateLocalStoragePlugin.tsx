import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import {
  COMMAND_PRIORITY_EDITOR,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical"
import { useEffect } from "react"
import { TyXDocument } from "../../models"
import { useLocalStorage } from "../../utilities/hooks"
import { UPDATE_LOCAL_STORAGE_COMMAND } from "./updateLocalStorage"

const UpdateLocalStoragePlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [openDocuments, setOpenDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
    silent: true,
  })
  const [currentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
    silent: true,
  })

  const doc = openDocuments[currentDocument]
  const update = (content: SerializedEditorState<SerializedLexicalNode>) => {
    doc.content = content
    doc.dirty = true
    setOpenDocuments(openDocuments)
  }

  useEffect(() => {
    return editor.registerCommand(
      UPDATE_LOCAL_STORAGE_COMMAND,
      () => {
        update(editor.getEditorState().toJSON())
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return (
    <OnChangePlugin
      ignoreSelectionChange
      onChange={(editorState) => update(editorState.toJSON())}
    />
  )
}

export default UpdateLocalStoragePlugin
