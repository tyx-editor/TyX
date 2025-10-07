/**
 * @file Generic UI utilities for working with React.
 */

import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconExclamationMark } from "@tabler/icons-react"
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
    title: options?.title ?? "Success!",
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
    title: options?.title ?? "Failed!",
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
export const showConfirmModal = (
  title: string,
  message: string,
  confirm: string,
  cancel: string,
  onConfirm: () => void,
) => {
  modals.openConfirmModal({
    title,
    children: message,
    onConfirm,
    labels: { confirm, cancel },
  })
}

export const getCurrentDocument = () => {
  const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
  const currentDocument = getLocalStorage<number>("Current Document")
  return openDocuments[currentDocument]
}
