import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconExclamationMark } from "@tabler/icons-react"

interface MessageOptions {
  title?: string
  raw?: boolean
}

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

export const showConfirmModal = (message: string, onConfirm: () => void) => {
  modals.openConfirmModal({
    title: "Please confirm your action!",
    children: message,
    onConfirm,
    labels: { confirm: "Confirm", cancel: "Cancel" },
  })
}
