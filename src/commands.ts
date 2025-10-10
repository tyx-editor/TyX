/**
 * @file The implementation for command parsing and execution.
 */

import { TyXCommand } from "./models"
import { showFailureMessage } from "./utilities"
import { setLocalStorage } from "./utilities/hooks"

import { TOGGLE_LINK_COMMAND } from "@lexical/link"
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list"
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode"
import { INSERT_TABLE_COMMAND } from "@lexical/table"
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  INSERT_LINE_BREAK_COMMAND,
  LexicalCommand,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import { INSERT_FUNCTION_CALL_COMMAND } from "./components/plugins/functionCall"
import { INSERT_IMAGE_COMMAND } from "./components/plugins/image"
import { TOGGLE_KEYBOARD_MAP_COMMAND } from "./components/plugins/keyboardMap"
import {
  INSERT_MATH_COMMAND,
  MATH_COMMAND,
  TOGGLE_MATH_INLINE_COMMAND,
} from "./components/plugins/math"
import {
  TABLE_INSERT_COLUMN_RIGHT_COMMAND,
  TABLE_INSERT_ROW_BELOW_COMMAND,
  TABLE_REMOVE_COLUMN_COMMAND,
  TABLE_REMOVE_ROW_COMMAND,
} from "./components/plugins/tableCommands"
import { INSERT_TYPST_CODE_COMMAND } from "./components/plugins/typstCode"
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
  OPEN_LINK_POPUP_COMMAND,
  OPEN_SETTINGS_COMMAND,
} from "./components/plugins/tyxCommands"

const COMMANDS: Record<string, LexicalCommand<any>> = {
  toggleKeyboardMap: TOGGLE_KEYBOARD_MAP_COMMAND,
  formatElement: FORMAT_ELEMENT_COMMAND,
  formatText: FORMAT_TEXT_COMMAND,
  clearFormatting: CLEAR_FORMATTING_COMMAND,
  undo: UNDO_COMMAND,
  redo: REDO_COMMAND,
  insertMath: INSERT_MATH_COMMAND,
  insertOrderedList: INSERT_ORDERED_LIST_COMMAND,
  insertUnorderedList: INSERT_UNORDERED_LIST_COMMAND,
  insertLineBreak: INSERT_LINE_BREAK_COMMAND,
  insertHorizontalLine: INSERT_HORIZONTAL_RULE_COMMAND,
  insertTypstCode: INSERT_TYPST_CODE_COMMAND,
  insertImage: INSERT_IMAGE_COMMAND,
  insertFunctionCall: INSERT_FUNCTION_CALL_COMMAND,
  insertQuote: INSERT_QUOTE_COMMAND,
  insertCodeBlock: INSERT_CODE_BLOCK_COMMAND,
  insertHeading: INSERT_HEADING_COMMAND,
  toggleMathInline: TOGGLE_MATH_INLINE_COMMAND,
  math: MATH_COMMAND,
  indent: INDENT_CONTENT_COMMAND,
  outdent: OUTDENT_CONTENT_COMMAND,
  insertTable: INSERT_TABLE_COMMAND,
  tableInsertRowBelow: TABLE_INSERT_ROW_BELOW_COMMAND,
  tableInsertColumnRight: TABLE_INSERT_COLUMN_RIGHT_COMMAND,
  tableRemoveRow: TABLE_REMOVE_ROW_COMMAND,
  tableRemoveColumn: TABLE_REMOVE_COLUMN_COMMAND,
  setLink: TOGGLE_LINK_COMMAND,
  openLinkPopup: OPEN_LINK_POPUP_COMMAND,
  fileOpen: FILE_OPEN_COMMAND,
  fileNew: FILE_NEW_COMMAND,
  fileNewFromTemplate: FILE_NEW_FROM_TEMPLATE_COMMAND,
  fileSave: FILE_SAVE_COMMAND,
  fileSaveAs: FILE_SAVE_AS_COMMAND,
  fileExport: FILE_EXPORT_COMMAND,
  fileClose: FILE_CLOSE_COMMAND,
  filePreview: FILE_PREVIEW_COMMAND,
  openSettings: OPEN_SETTINGS_COMMAND,
  openDocumentSettings: OPEN_DOCUMENT_SETTINGS_COMMAND,
}

/** Parse the given parameter into the corresponding JS object, to be passed to command functions. */
export const parseCommandParameter = (parameter: string) => {
  if (parameter === "null") {
    return null
  }
  if (parameter === "true") {
    return true
  }
  if (parameter === "false") {
    return false
  }

  const asNumber = Number(parameter)
  if (!isNaN(asNumber)) {
    return asNumber
  }

  try {
    return JSON.parse(parameter)
  } catch {
    //
  }

  return parameter
}

/** Splits the given command by spaces, while skipping spaces inside objects or strings. */
export const splitCommand = (command: string) => {
  const result: string[] = []

  let currentStart = 0
  let braceCount = 0
  let bracketCount = 0
  let quoteCount = 0
  for (let i = 0; i < command.length; i++) {
    const currentChar = command.charAt(i)
    if (
      currentChar === " " &&
      braceCount === 0 &&
      quoteCount === 0 &&
      bracketCount === 0
    ) {
      result.push(command.substring(currentStart, i))
      currentStart = i + 1
    } else if (currentChar === "{") {
      braceCount++
    } else if (currentChar === '"') {
      quoteCount = (quoteCount + 1) % 2
    } else if (currentChar === "}") {
      braceCount--
    } else if (currentChar === "[") {
      bracketCount++
    } else if (currentChar === "]") {
      bracketCount--
    }
  }
  result.push(command.substring(currentStart))

  return result
}

/**
 * Parse the given command sequence string into TyX commands.
 * Splits the sequence to commands by semicolons and then each command by spaces, parsing the parameters.
 */
export const parseCommandSequence = (command: string) => {
  return command
    .split(";")
    .map(
      (command) =>
        splitCommand(command.trim()).map(parseCommandParameter) as TyXCommand,
    )
}

/** Executes the given command sequence. */
export const executeCommandSequence = (command: string) => {
  setLocalStorage("Hover Command", null)
  setLocalStorage("Current Command", command)
  parseCommandSequence(command).forEach(executeCommand)
}

/** Executes the given command. */
export const executeCommand = (command: TyXCommand) => {
  if (window.currentEditor) {
    const lexicalCommand = COMMANDS[command[0]]

    if (!lexicalCommand) {
      showFailureMessage(
        `Invalid shortcut: command '${command}' does not exist!`,
      )
    } else {
      try {
        window.currentEditor.dispatchCommand(
          lexicalCommand,
          command.length === 2
            ? command[1]
            : command.length === 1
              ? undefined
              : command.slice(1),
        )
      } catch (e) {
        showFailureMessage(`Command '${command}' threw an exception: ${e}`)
      }
    }
  }
}
