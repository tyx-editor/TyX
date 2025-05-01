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

export const showFailureMessage = (failureMessage: string) => {
  notifications.show({
    title: "Failed!",
    color: "red",
    icon: <IconExclamationMark />,
    message: failureMessage,
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
