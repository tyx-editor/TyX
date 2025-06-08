/**
 * @file An editor for a specific math inline shortcut.
 */

import { ActionIcon, TextInput } from "@mantine/core"
import { IconCode, IconTrash, IconWriting } from "@tabler/icons-react"

const MathInlineShortcutEditor = ({
  shortcut,
  command,
  setShortcut,
  setCommand,
  remove,
}: {
  shortcut: string
  command: string
  setShortcut: (newShortcut: string) => void
  setCommand: (newCommand: string) => void
  remove: () => void
}) => {
  return (
    <div
      dir="ltr"
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 5,
        marginTop: 5,
      }}
    >
      <TextInput
        leftSection={<IconWriting />}
        style={{ display: "inline-block", height: "100%" }}
        value={shortcut}
        onChange={(e) => setShortcut(e.currentTarget.value)}
        mr={10}
      />
      <span style={{ flexGrow: 1 }} />
      <TextInput
        leftSection={<IconCode />}
        style={{ display: "inline-block", height: "100%" }}
        value={command}
        onChange={(e) => setCommand(e.currentTarget.value)}
      />
      <ActionIcon
        ml="xs"
        h="100%"
        color="red"
        variant="subtle"
        onClick={remove}
      >
        <IconTrash />
      </ActionIcon>
    </div>
  )
}

export default MathInlineShortcutEditor
