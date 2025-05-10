import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconExclamationMark } from "@tabler/icons-react"

export const showSuccessMessage = (successMessage: string) => {
  notifications.show({
    title: "Success!",
    color: "green",
    icon: <IconCheck />,
    message: successMessage,
  })
}

interface MessageOptions {
  title?: string
  raw?: boolean
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
