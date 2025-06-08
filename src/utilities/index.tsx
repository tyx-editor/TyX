/**
 * @file Generic UI utilities for working with React.
 */

import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconExclamationMark } from "@tabler/icons-react"

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
export const showConfirmModal = (message: string, onConfirm: () => void) => {
  modals.openConfirmModal({
    title: "Please confirm your action!",
    children: message,
    onConfirm,
    labels: { confirm: "Confirm", cancel: "Cancel" },
  })
}
