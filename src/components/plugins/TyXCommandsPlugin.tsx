import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { HeadingTagType } from "@lexical/rich-text"
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
  save,
} from "../../backend"
import { onClose } from "../../backend/common"
import { serialized_tyx_to_typst } from "../../converters"
import { TyXDocument } from "../../models"
import {
  $getToolbarState,
  clearFormatting,
  formatCode,
  formatHeading,
  formatQuote,
} from "../../resources/playground"
import { showFailureMessage, showSuccessMessage } from "../../utilities"
import { getLocalStorage } from "../../utilities/hooks"
import DocumentSettingsModal from "../DocumentSettingsModal"
import SettingsModal from "../SettingsModal"
import {
  CLEAR_FORMATTING_COMMAND,
  FILE_CLOSE_COMMAND,
  FILE_EXPORT_COMMAND,
  FILE_NEW_COMMAND,
  FILE_NEW_FROM_TEMPLATE_COMMAND,
  FILE_OPEN_COMMAND,
  FILE_PREVIEW_COMMAND,
  FILE_SAVE_AS_COMMAND,
  FILE_SAVE_COMMAND,
  INSERT_CODE_BLOCK_COMMAND,
  INSERT_HEADING_COMMAND,
  INSERT_QUOTE_COMMAND,
  OPEN_DOCUMENT_SETTINGS_COMMAND,
  OPEN_SETTINGS_COMMAND,
} from "./tyxCommands"

const TyXCommandsPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_QUOTE_COMMAND,
        () => {
          const editor = window.currentEditor
          if (editor !== undefined) {
            editor.update(() => {
              const state = $getToolbarState()
              formatQuote(editor, state.blockType ?? "")
            })
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        INSERT_CODE_BLOCK_COMMAND,
        () => {
          const editor = window.currentEditor
          if (editor !== undefined) {
            editor.update(() => {
              const state = $getToolbarState()
              formatCode(editor, state.blockType ?? "")
            })
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        INSERT_HEADING_COMMAND,
        (level) => {
          const editor = window.currentEditor
          if (editor !== undefined && 1 <= level && level <= 6) {
            editor.update(() => {
              const state = $getToolbarState()
              formatHeading(
                editor,
                state.blockType ?? "",
                `h${level}` as HeadingTagType,
              )
            })
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        CLEAR_FORMATTING_COMMAND,
        () => {
          if (window.currentEditor !== undefined) {
            clearFormatting(window.currentEditor)
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
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
        FILE_EXPORT_COMMAND,
        (format) => {
          if (format === "typst") {
            const openDocuments = getLocalStorage<TyXDocument[]>(
              "Open Documents",
              [],
            )
            const currentDocument = getLocalStorage<number>("Current Document")
            const doc = openDocuments[currentDocument]
            const filename = (doc.filename ?? "Untitled.tyx").replace(
              ".tyx",
              ".typ",
            )
            try {
              save(filename, serialized_tyx_to_typst(JSON.stringify(doc))).then(
                () => showSuccessMessage(`Document exported to ${filename}.`),
              )
            } catch {
              showFailureMessage("Document export failed!")
            }
          }
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
            showFailureMessage(t("noOpenDocument"))
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
