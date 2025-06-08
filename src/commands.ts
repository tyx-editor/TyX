import { TyXCommand } from "./models"
import { showFailureMessage } from "./utilities"

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

export const parseCommandSequence = (command: string) => {
  return command
    .split(";")
    .map(
      (command) =>
        command.trim().split(" ").map(parseCommandParameter) as TyXCommand,
    )
}

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
