/**
 * @file The web backend providing the required backend options.
 * Uses Typst.ts for compiling and rendering.
 */

import { modals } from "@mantine/modals"
import { createTypstCompiler, TypstCompiler } from "@myriaddreamin/typst.ts"
import { version } from "../../src-tauri/tauri.conf.json"
import tyx2typst from "../compilers/tyx2typst"
import SaveAsModal from "../components/SaveAsModal"
import { TyXDocument } from "../models"
import { showFailureMessage } from "../utilities"
import { getLocalStorage, setLocalStorage } from "../utilities/hooks"

let compiler: TypstCompiler

export const initializeBackend = async () => {
  compiler = createTypstCompiler()
  await compiler.init({
    beforeBuild: [],
    getModule: () =>
      "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler@0.6.0/pkg/typst_ts_web_compiler_bg.wasm",
  })
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

export const onPreview = async () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const document = openDocuments[currentDocument]
  compiler.addSource("/main.typ", tyx2typst(document, version))
  const result = await compiler.compile({
    format: "pdf",
    mainFilePath: "/main.typ",
    diagnostics: "none",
  })
  if (result.result) {
    const blob = new Blob([result.result], {
      type: "application/pdf",
    })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement("a")
    a.href = url
    let filename = document.filename
    if (filename && filename.endsWith(".tyx")) {
      filename = filename.slice(0, -4)
    }
    a.download = (filename ?? "Untitled") + ".pdf"
    window.document.body.appendChild(a)
    a.click()
    window.document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
    save(document.filename, JSON.stringify(document))
  } else {
    saveAs()
  }
}

export const onOpen = (filename: string | undefined, content: string) => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const parsedContent = JSON.parse(content)
  if (parsedContent?.version?.startsWith("0.1")) {
    showFailureMessage(
      `This TyX file is not compatible with this version of TyX!`,
    )
    return
  }
  openDocuments.push({ ...parsedContent, filename })
  setLocalStorage("Open Documents", openDocuments)
  setLocalStorage("Current Document", openDocuments.length - 1)

  const input = document.getElementById("open")
  if (input) {
    document.body.removeChild(input)
  }
}

export const open = () => {
  const input = document.createElement("input")
  input.id = "open"
  input.type = "file"
  input.accept = ".tyx"
  input.style.display = "none"
  document.body.appendChild(input)
  input.onchange = () => {
    if (input.files && input.files.length > 0) {
      const filename = input.files[0].name
      const reader = new FileReader()
      reader.onload = () => {
        onOpen(filename, reader.result as string)
      }
      reader.readAsText(input.files[0])
    }
  }
  input.click()
}

export const insertImage = () => {}

export const onInsertImage = () => {}

export const save = async (filename: string, content: string) => {
  const a = document.createElement("a")
  a.download = filename
  a.href = "data:text/json;charset=utf-8," + encodeURIComponent(content)
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const saveAs = () =>
  modals.open({
    title: "Save Document",
    children: <SaveAsModal />,
  })

export const getVersion = async () => version

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const readImage = async (_filename: string, _image: string) => ""

export const isWeb = true
