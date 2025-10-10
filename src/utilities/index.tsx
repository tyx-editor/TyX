/**
 * @file Generic UI utilities for working with React.
 */

import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconExclamationMark } from "@tabler/icons-react"
import i18n from "i18next"
import { $getSelection, $setSelection, BaseSelection } from "lexical"
import { TyXDocument } from "../models"
import { getLocalStorage } from "./hooks"

interface MessageOptions {
  title?: string
  raw?: boolean
}

/** Shows a success notification with the given message. */
export const showSuccessMessage = (
  successMessage: string,
  options?: MessageOptions,
) => {
  notifications.show({
    title: options?.title ?? i18n.t("success") + "!",
    color: "green",
    icon: <IconCheck />,
    message: options?.raw ? (
      <pre>
        <code>{successMessage}</code>
      </pre>
    ) : (
      successMessage
    ),
  })
}

/** Shows a failure notification with the given message. */
export const showFailureMessage = (
  failureMessage: string,
  options?: MessageOptions,
) => {
  notifications.show({
    title: options?.title ?? i18n.t("failed") + "!",
    color: "red",
    icon: <IconExclamationMark />,
    message: options?.raw ? (
      <pre>
        <code>{failureMessage}</code>
      </pre>
    ) : (
      failureMessage
    ),
  })
}

/** Shows a modal to confirm a possibly dangerous action. */
export const showConfirmModal = (message: string, onConfirm: () => void) => {
  modals.openConfirmModal({
    title: i18n.t("pleaseConfirmYourAction"),
    children: message,
    onConfirm,
    labels: { confirm: i18n.t("confirm"), cancel: i18n.t("cancel") },
  })
}

export const getCurrentDocument = () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  return openDocuments[currentDocument]
}

export const setEditorSelection = (selection: BaseSelection | null) => {
  window.currentEditor?.update(() => {
    $setSelection(selection?.clone() ?? null)
  })
}

export const getEditorSelection = () => {
  return window.currentEditor?.read(() => $getSelection()) ?? null
}

let savedEditorSelection: BaseSelection | null

export const backupEditorSelection = () => {
  savedEditorSelection = getEditorSelection()
}

export const restoreEditorSelection = () => {
  setEditorSelection(savedEditorSelection)
}
