import type { Update as TauriUpdate } from "@tauri-apps/plugin-updater"
import { TyXDocument } from "../models"

export type Update = TauriUpdate

export const serializeDocument = (document: TyXDocument) => {
  return JSON.stringify({
    $schema: "https://tyx-editor.com/schemas/tyx-document.schema.json",
    ...document,
    dirty: undefined,
    filename: undefined,
  })
}
