/**
 * @file The implementation for command parsing and execution.
 */

import { TyXCommand } from "./models"
import { showFailureMessage } from "./utilities"

/** Parse the given parameter into the corresponding JS object, to be passed to command functions. */
export const parseCommandParameter = (parameter: string) => {
  if (parameter === "null") {
    return null
  }

  const asNumber = Number(parameter)
  if (!isNaN(asNumber)) {
    return asNumber
  }

  return parameter
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
        command.trim().split(" ").map(parseCommandParameter) as TyXCommand,
    )
}

/** Executes the given command. */
export const executeCommand = (command: TyXCommand) => {
  if (window.currentEditor) {
    const commandFunction = window.currentEditor.commands[command[0]]

    if (!commandFunction) {
      showFailureMessage(
        `Invalid shortcut: command '${command}' does not exist!`,
      )
    } else {
      try {
        // @ts-ignore
        commandFunction(...command.slice(1))
      } catch (e) {
        showFailureMessage(`Command '${command}' threw an exception: ${e}`)
      }
    }
  }
}
