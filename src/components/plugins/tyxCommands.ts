import { createCommand, LexicalCommand } from "lexical"

export const OPEN_LINK_POPUP_COMMAND: LexicalCommand<void> = createCommand()

export const FILE_OPEN_COMMAND: LexicalCommand<void> = createCommand()
export const FILE_NEW_COMMAND: LexicalCommand<void> = createCommand()
export const FILE_NEW_FROM_TEMPLATE_COMMAND: LexicalCommand<void> =
  createCommand()
export const FILE_SAVE_COMMAND: LexicalCommand<void> = createCommand()
export const FILE_SAVE_AS_COMMAND: LexicalCommand<void> = createCommand()
export const FILE_CLOSE_COMMAND: LexicalCommand<number | undefined> =
  createCommand()
export const FILE_PREVIEW_COMMAND: LexicalCommand<void> = createCommand()

export const OPEN_SETTINGS_COMMAND: LexicalCommand<void> = createCommand()
export const OPEN_DOCUMENT_SETTINGS_COMMAND: LexicalCommand<void> =
  createCommand()

export const INSERT_FUNCTION: LexicalCommand<void> = createCommand()
