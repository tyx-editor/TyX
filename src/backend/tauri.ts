/**
 * @file The tauri backend providing the required backend options.
 * Uses a Typst compiler and renderer that is bundled with the binary.
 */

import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { relaunch } from "@tauri-apps/plugin-process"
import { check } from "@tauri-apps/plugin-updater"

import { getVersion } from "@tauri-apps/api/app"
import { executeCommand } from "../commands"
import tyx2typst from "../compilers/tyx2typst"
import { TyXDocument } from "../models"
import { getSettings } from "../settings"
import { showFailureMessage } from "../utilities"
import { getLocalStorage, setLocalStorage } from "../utilities/hooks"

let version: string

export const initializeBackend = () => {
  getVersion().then((v) => (version = v))
  listen<[string, string]>("open", (e) => onOpen(...(e.payload ?? [])))
  listen("new", onNew)
  listen("save", onSave)
  listen("close", onClose)
  listen("preview", () => onPreview(false))
  listen<[string]>("insertImage", (e) => onInsertImage(...e.payload))
  listen<[string]>("saveas", (e) => onSaveAs(...e.payload))

  check()
    .then(async (update) => {
      if (update?.available) {
        await update.downloadAndInstall()
        await relaunch()
      }
    })
    .catch(() => {})
}

export const onNew = () => {
  const newDocument: TyXDocument = {
    version,
    preamble: "",
    settings: getLocalStorage("Default Settings", {}),
  }
  onOpen(undefined, JSON.stringify(newDocument))
}

export const onClose = () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  openDocuments.splice(currentDocument, 1)
  setLocalStorage("Open Documents", openDocuments)
  setLocalStorage("Current Document", currentDocument - 1)
}

export const onPreview = async (open = false) => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]

  if (!document) {
    showFailureMessage("No open document to preview!")
    return
  }
  if (!document.filename) {
    showFailureMessage(
      "Current document must be saved before it can be previewed!",
    )
    return
  }

  let content = ""
  try {
    content = tyx2typst(document, version)
  } catch (e: any) {
    showFailureMessage(e.message)
    return
  }
  const result: string = await invoke("preview", {
    filename: document.filename,
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

export const onSaveAs = (filename: string) => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  save(filename, JSON.stringify(document))

  if (!document.filename) {
    document.filename = filename
    document.dirty = false
    setLocalStorage("Open Documents", openDocuments)
  } else {
    onOpen(filename, JSON.stringify(document))
  }
}

export const onSave = async () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  if (document.filename) {
    document.dirty = false
    setLocalStorage("Open Documents", openDocuments)
    await save(document.filename, JSON.stringify(document))
  } else {
    saveAs()
  }
}

export const onOpen = (filename?: string | undefined, content?: string) => {
  if (!content) {
    open()
    return
  }
  const parsedContent = JSON.parse(content)
  if (parsedContent?.version?.startsWith("0.1")) {
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
  executeCommand(["insertImage", path])
}

export const readImage = async (filename: string, image: string) => {
  return await invoke<string>("readimage", { filename, image })
}

export { getVersion }

export const isWeb = false
