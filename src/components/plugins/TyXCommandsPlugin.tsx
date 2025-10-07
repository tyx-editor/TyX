import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import { COMMAND_PRIORITY_EDITOR } from "lexical"
import { useEffect } from "react"
import {
  onClose,
  onNew,
  onOpen,
  onPreview,
  onSave,
  onSaveAs,
} from "../../backend"
import {
  FILE_CLOSE_COMMAND,
  FILE_NEW_COMMAND,
  FILE_OPEN_COMMAND,
  FILE_PREVIEW_COMMAND,
  FILE_SAVE_AS_COMMAND,
  FILE_SAVE_COMMAND,
} from "./tyxCommands"

const TyXCommandsPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        FILE_OPEN_COMMAND,
        () => {
          onOpen()
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        FILE_NEW_COMMAND,
        () => {
          onNew()
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        FILE_SAVE_COMMAND,
        () => {
          onSave()
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        FILE_SAVE_AS_COMMAND,
        () => {
          onSaveAs()
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        FILE_CLOSE_COMMAND,
        () => {
          onClose()
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        FILE_PREVIEW_COMMAND,
        () => {
          onPreview(true)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  return null
}

export default TyXCommandsPlugin
