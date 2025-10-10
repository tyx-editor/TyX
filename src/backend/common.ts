import { t } from "i18next"
import { TyXDocument } from "../models"
import { showConfirmModal } from "../utilities"
import { getLocalStorage, setLocalStorage } from "../utilities/hooks"

const close = (
  openDocuments: TyXDocument[],
  index: number,
  currentDocument: number,
) => {
  openDocuments.splice(index, 1)
  setLocalStorage("Open Documents", openDocuments)
  if (index <= currentDocument && currentDocument !== 0) {
    setLocalStorage("Current Document", currentDocument - 1)
  }
}

export const onClose = (fileIndex?: number) => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  const index = fileIndex ?? currentDocument

  if (openDocuments[index]?.dirty) {
    showConfirmModal(t("theChangesWontBeSaved") + "!", () =>
      close(openDocuments, index, currentDocument),
    )
    return
  }

  close(openDocuments, index, currentDocument)
}
