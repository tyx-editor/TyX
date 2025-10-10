import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import { modals } from "@mantine/modals"
import { t } from "i18next"
import { COMMAND_PRIORITY_EDITOR } from "lexical"
import { useEffect } from "react"
import {
  newFromTemplate,
  onNew,
  onOpen,
  onPreview,
  onSave,
  onSaveAs,
} from "../../backend"
import { onClose } from "../../backend/common"
import { TyXDocument } from "../../models"
import { getLocalStorage } from "../../utilities/hooks"
import DocumentSettingsModal from "../DocumentSettingsModal"
import SettingsModal from "../SettingsModal"
import {
  FILE_CLOSE_COMMAND,
  FILE_NEW_COMMAND,
  FILE_NEW_FROM_TEMPLATE_COMMAND,
  FILE_OPEN_COMMAND,
  FILE_PREVIEW_COMMAND,
  FILE_SAVE_AS_COMMAND,
  FILE_SAVE_COMMAND,
  OPEN_DOCUMENT_SETTINGS_COMMAND,
  OPEN_SETTINGS_COMMAND,
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
        FILE_NEW_FROM_TEMPLATE_COMMAND,
        () => {
          newFromTemplate()
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
        (fileIndex) => {
          onClose(fileIndex)
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
      editor.registerCommand(
        OPEN_SETTINGS_COMMAND,
        () => {
          modals.open({
            title: t("settings"),
            children: <SettingsModal />,
          })
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        OPEN_DOCUMENT_SETTINGS_COMMAND,
        () => {
          const openDocuments = getLocalStorage<TyXDocument[]>(
            "Open Documents",
            [],
          )
          const currentDocument = getLocalStorage<number>("Current Document")
          const doc = openDocuments[currentDocument]
          if (!doc) {
            // TODO: show error
            return true
          }

          const basename = (doc.filename ?? t("untitled"))
            .split("/")
            .pop()!
            .split("\\")
            .pop()

          modals.open({
            title: `${t("documentSettings")} (${basename})`,
            children: <DocumentSettingsModal />,
          })
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  return null
}

export default TyXCommandsPlugin
