import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { relaunch } from "@tauri-apps/plugin-process"
import { check } from "@tauri-apps/plugin-updater"

import { getVersion } from "@tauri-apps/api/app"
import { getLocalStorage, setLocalStorage } from "../hooks"
import { TyXDocument } from "../models"
import { showFailureMessage } from "../utilities"
import { document2typst } from "./shared"

let version: string

export const initialize = () => {
  getVersion().then((v) => (version = v))
  listen<[string, string]>("open", (e) => onOpen(...e.payload))
  listen("new", onNew)
  listen("save", onSave)
  listen("close", onClose)
  listen("preview", onPreview)
  listen<[string]>("saveas", (e) => onSaveAs(...e.payload))

  check()
    .then(async (update) => {
      if (update?.available) {
        await update.downloadAndInstall()
        await relaunch()
      }
    })
    .catch((_) => {})
}

export const onNew = () => {
  const newDocument: TyXDocument = { version, preamble: "", content: {} }
  onOpen(undefined, JSON.stringify(newDocument))
}

export const onClose = () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  openDocuments.splice(currentDocument, 1)
  setLocalStorage("Open Documents", openDocuments)
  setLocalStorage("Current Document", currentDocument - 1)
}

export const onPreview = async () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  let content = ""
  try {
    content = document2typst(document, version)
  } catch (e: any) {
    showFailureMessage(e.message)
    return
  }
  await invoke("preview", {
    filename: document.filename,
    content,
  })
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

export const onOpen = (filename: string | undefined, content: string) => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  openDocuments.push({ ...JSON.parse(content), filename })
  setLocalStorage("Open Documents", openDocuments)
  setLocalStorage("Current Document", openDocuments.length - 1)
}

export const open = () => invoke("open")

export const save = (filename: string, content: string) => {
  return invoke("save", { filename, content })
}

export const saveAs = () => invoke("saveas")

export { getVersion }

export const isWeb = false
