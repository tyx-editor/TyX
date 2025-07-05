/**
 * @file The implementation for command parsing and execution.
 */

import { TyXCommand } from "./models"
import { showFailureMessage } from "./utilities"
import { setLocalStorage } from "./utilities/hooks"

import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list"
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import { TOGGLE_KEYBOARD_MAP_COMMAND } from "./components/plugins/KeyboardMapPlugin"
import { INSERT_MATH_INLINE_COMMAND } from "./components/plugins/MathPlugin"

const COMMANDS: Record<string, LexicalCommand<any>> = {
  toggleKeyboardMap: TOGGLE_KEYBOARD_MAP_COMMAND,
  formatElement: FORMAT_ELEMENT_COMMAND,
  formatText: FORMAT_TEXT_COMMAND,
  undo: UNDO_COMMAND,
  redo: REDO_COMMAND,
  insertMathInline: INSERT_MATH_INLINE_COMMAND,
  insertOrderedList: INSERT_ORDERED_LIST_COMMAND,
  insertUnorderedList: INSERT_UNORDERED_LIST_COMMAND,
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
  } catch (_) {}

  return parameter
}

/** Splits the given command by spaces, while skipping spaces inside objects. */
export const splitCommand = (command: string) => {
  const result: string[] = []

  let currentStart = 0
  let braceCount = 0
  for (let i = 0; i < command.length; i++) {
    const currentChar = command.charAt(i)
    if (currentChar === " " && braceCount === 0) {
      result.push(command.substring(currentStart, i))
      currentStart = i + 1
    } else if (currentChar === "{") {
      braceCount++
    } else if (currentChar === "}") {
      braceCount--
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

/** Executes the given command. */
export const executeCommand = (command: TyXCommand) => {
  setLocalStorage("Current Command", command.join(" "))

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
          command.length === 2 ? command[1] : command.slice(1),
        )
      } catch (e) {
        showFailureMessage(`Command '${command}' threw an exception: ${e}`)
      }
    }
  }
}
