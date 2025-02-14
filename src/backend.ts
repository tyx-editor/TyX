import { listen } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/core"
import { check } from "@tauri-apps/plugin-updater"
import { relaunch } from "@tauri-apps/plugin-process"

import { getLocalStorage, setLocalStorage } from "./hooks"
import { TyXDocument } from "./models"

export const initialize = () => {
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

export const onNew = () => onOpen(undefined, "{}")

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
  await invoke("preview", {
    filename: document.filename,
    content: JSON.stringify(document.content),
  })
  document.dirty = false
  setLocalStorage("Open Documents", openDocuments)
}

export const onSaveAs = (filename: string) => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  save(filename, JSON.stringify(document.content))

  if (!document.filename) {
    document.filename = filename
    document.dirty = false
    setLocalStorage("Open Documents", openDocuments)
  } else {
    onOpen(filename, JSON.stringify(document.content))
  }
}

export const onSave = async () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  if (document.filename) {
    document.dirty = false
    setLocalStorage("Open Documents", openDocuments)
    await save(document.filename, JSON.stringify(document.content))
  } else {
    saveAs()
  }
}

export const onOpen = (filename: string | undefined, content: string) => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  openDocuments.push({ filename, content: JSON.parse(content) })
  setLocalStorage("Open Documents", openDocuments)
  setLocalStorage("Current Document", openDocuments.length - 1)
}

export const open = () => invoke("open")

export const save = (filename: string, content: string) => {
  invoke("save", { filename, content })
}

export const saveAs = () => invoke("saveas")
