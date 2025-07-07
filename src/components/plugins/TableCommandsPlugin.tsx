import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
} from "@lexical/table"
import { mergeRegister } from "@lexical/utils"
import { COMMAND_PRIORITY_EDITOR } from "lexical"
import { useEffect } from "react"
import {
  TABLE_INSERT_COLUMN_RIGHT_COMMAND,
  TABLE_INSERT_ROW_BELOW_COMMAND,
  TABLE_REMOVE_COLUMN_COMMAND,
  TABLE_REMOVE_ROW_COMMAND,
} from "./tableCommands"
import { $isRTL } from "./utilities"

const TableCommandsPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TABLE_INSERT_ROW_BELOW_COMMAND,
        () => {
          $insertTableRowAtSelection()
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        TABLE_INSERT_COLUMN_RIGHT_COMMAND,
        () => {
          $insertTableColumnAtSelection(!$isRTL())
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        TABLE_REMOVE_ROW_COMMAND,
        () => {
          $deleteTableRowAtSelection()
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        TABLE_REMOVE_COLUMN_COMMAND,
        () => {
          $deleteTableColumnAtSelection()
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [])

  return null
}

export default TableCommandsPlugin
