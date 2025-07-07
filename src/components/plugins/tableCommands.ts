import { createCommand, LexicalCommand } from "lexical"

export const TABLE_INSERT_ROW_BELOW_COMMAND: LexicalCommand<void> =
  createCommand()
export const TABLE_INSERT_COLUMN_RIGHT_COMMAND: LexicalCommand<void> =
  createCommand()
export const TABLE_REMOVE_ROW_COMMAND: LexicalCommand<void> = createCommand()
export const TABLE_REMOVE_COLUMN_COMMAND: LexicalCommand<void> = createCommand()
