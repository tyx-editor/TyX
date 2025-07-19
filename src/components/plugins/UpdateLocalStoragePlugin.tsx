import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import {
  COMMAND_PRIORITY_EDITOR,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical"
import { useEffect } from "react"
import { TyXDocument } from "../../models"
import { getLocalStorage, setLocalStorage } from "../../utilities/hooks"
import { UPDATE_LOCAL_STORAGE_COMMAND } from "./updateLocalStorage"

const UpdateLocalStoragePlugin = () => {
  const [editor] = useLexicalComposerContext()

  const update = (content: SerializedEditorState<SerializedLexicalNode>) => {
    const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
    const currentDocument = getLocalStorage<number>("Current Document", 0)
    const doc = openDocuments[currentDocument]
    doc.content = content
    doc.dirty = true
    setLocalStorage("Open Documents", openDocuments)
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
