/**
 * @file The tauri backend providing the required backend options.
 * Uses a Typst compiler and renderer that is bundled with the binary.
 */

import { getVersion } from "@tauri-apps/api/app"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { relaunch } from "@tauri-apps/plugin-process"
import { check } from "@tauri-apps/plugin-updater"
import { z } from "zod/v4"
import { executeCommandSequence } from "../commands"
import { serialized_tyx_to_typst } from "../converters"
import { TyXDocument, TyXSettings } from "../models"
import { getSettings } from "../settings"
import { showFailureMessage } from "../utilities"
import { getLocalStorage, setLocalStorage } from "../utilities/hooks"
import { serializeDocument, Update } from "./base"

let version: string

export const initializeBackend = () => {
  getVersion().then((v) => (version = v))
  listen<[string, string]>("open", (e) => onOpen(...e.payload))
  listen<[string]>("insertImage", (e) => onInsertImage(...e.payload))
  listen<[string]>("saveas", (e) => onSaveAs(...e.payload))

  getSettingsFromFile().then((settings) => {
    if (settings !== undefined) {
      setLocalStorage("Settings", settings)
    }
  })
}

export const checkForUpdates = async (): Promise<Update | null> => {
  return await check()
}

export const onNew = () => {
  const newDocument: TyXDocument = {
    version,
    preamble: "",
    settings: getLocalStorage("Default Settings", {}),
  }
  onOpen(undefined, JSON.stringify(newDocument))
}

export const newFromTemplate = () => invoke("newfromtemplate")

export const onPreview = async (open = false) => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]

  if (!document) {
    showFailureMessage("No open document to preview!")
    return
  }

  let content = ""
  try {
    content = serialized_tyx_to_typst(JSON.stringify(document))
  } catch (e: any) {
    showFailureMessage(e.message)
    return
  }
  console.log(content)
  const result: string = await invoke("preview", {
    filename: document.filename ?? "",
    content,
    root: document.settings?.root ?? "",
    fontPaths: document.settings?.fontPaths ?? [],
    open: open ?? false,
  })
  if (result) {
    showFailureMessage(result.replace(/\n\n/g, "\n"), {
      title: "Typst compilation failed!",
      raw: true,
    })
  }

  document.dirty = false
  setLocalStorage("Open Documents", openDocuments)
}

export const onSaveAs = (filename?: string) => {
  if (!filename) {
    invoke("saveas")
    return
  }

  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  save(filename, serializeDocument(document))

  if (!document.filename) {
    document.filename = filename
    document.dirty = false
    setLocalStorage("Open Documents", openDocuments)
  } else {
    onOpen(filename, JSON.stringify(document), true)
  }
}

export const onSave = async () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  if (document.filename) {
    document.dirty = false
    setLocalStorage("Open Documents", openDocuments)
    await save(document.filename, serializeDocument(document))
  } else {
    saveAs()
  }
}

export const onOpen = (
  filename?: string | undefined,
  content?: string,
  includeFilename?: boolean,
) => {
  if (!content) {
    open()
    return
  }
  const document = z.safeParse(TyXDocument, JSON.parse(content))
  if (document.error) {
    showFailureMessage(`Failed to open document: ${document.error.message}`)
    return
  }

  const parsedContent = document.data
  if (parsedContent.version?.startsWith("0.1")) {
    showFailureMessage(
      `This TyX file is not compatible with this version of TyX!`,
    )
    return
  }

  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  if (filename && !filename.endsWith(".tyx")) {
    const lastDot = filename?.lastIndexOf(".")
    filename = filename.slice(0, lastDot) + " (Imported).tyx"
  }
  if (!includeFilename) {
    filename = undefined
  }
  openDocuments.push({ ...parsedContent, filename })
  setLocalStorage("Open Documents", openDocuments)
  setLocalStorage("Current Document", openDocuments.length - 1)
}

export const open = (filename: string = "") => invoke("open", { filename })

export const save = (filename: string, content: string) => {
  const format = getSettings().format ?? false
  return invoke("save", { filename, content, format })
}

export const saveAs = () => invoke("saveas")

export const insertImage = () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  invoke("insertimage", { filename: document.filename ?? "" })
}

export const onInsertImage = (path: string) => {
  executeCommandSequence(`insertImage ${path}`)
}

export const readImage = async (filename: string, image: string) => {
  return await invoke<string>("readimage", { filename, image })
}

export const getSettingsFromFile = async (): Promise<
  TyXSettings | undefined
> => {
  const settings = await invoke<string>("getsettings")
  if (settings) {
    return JSON.parse(settings) as TyXSettings
  }
}

export const saveSettingsToFile = async (): Promise<string> => {
  const settings = getSettings()
  return await invoke<string>("setsettings", {
    settings: JSON.stringify(
      {
        $schema: "https://tyx-editor.com/schemas/tyx-settings.schema.json",
        ...settings,
      },
      null,
      4,
    ),
  })
}

export const openSettingsDirectory = () => invoke("opensettingsdirectory")

export { getVersion, relaunch }

export const isWeb = false
