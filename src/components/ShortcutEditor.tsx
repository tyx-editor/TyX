import { ActionIcon, Kbd, Loader, TextInput } from "@mantine/core"
import { IconCode, IconTrash } from "@tabler/icons-react"
import { SingleCommands } from "@tiptap/react"
import { useState } from "react"

const prettifyShortcut = (shortcut: string) => {
  return shortcut
    .replace(/\+/g, "")
    .replace(/ctrl/g, "^")
    .replace(/alt/g, "⌥")
    .replace(/mod/g, "⌘")
    .replace(/shift/g, "⇧")
    .replace(/enter/g, "⏎")
    .replace(/esc/g, "␛")
}

const ShortcutEditor = ({
  shortcut,
  command,
  setShortcut,
  setCommand,
  remove,
}: {
  shortcut: string
  command: [keyof SingleCommands, ...any]
  setShortcut: (newShortcut: string) => void
  setCommand: (newCommand: [keyof SingleCommands, ...any]) => void
  remove: () => void
}) => {
  const [recording, setRecording] = useState(false)

  const record = () => {
    setRecording(true)
    Mousetrap.record((result) => {
      setShortcut(result.join(" "))
      setRecording(false)
    })
  }

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
      <Kbd
        size="md"
        style={{
          cursor: "pointer",
          letterSpacing: 3,
        }}
        onClick={record}
      >
        {recording ? (
          <Loader size="xs" color="white" />
        ) : (
          prettifyShortcut(shortcut)
        )}
      </Kbd>
      <span style={{ flexGrow: 1 }} />
      <TextInput
        leftSection={<IconCode />}
        size="xs"
        style={{ display: "inline-block", height: "100%" }}
        value={command.join(" ")}
        onChange={(e) =>
          setCommand(
            e.currentTarget.value.split(" ") as [keyof SingleCommands, ...any],
          )
        }
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

export default ShortcutEditor
