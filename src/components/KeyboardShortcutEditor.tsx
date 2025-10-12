/**
 * @file An editor for a specific keyboard shortcut.
 */

import { ActionIcon, Kbd, Loader, TextInput } from "@mantine/core"
import { useOs, UseOSReturnValue } from "@mantine/hooks"
import { IconCode, IconTrash } from "@tabler/icons-react"
import { useState } from "react"

const prettifyShortcut = (os: UseOSReturnValue, shortcut: string) => {
  if (shortcut === "") {
    return " "
  }

  const apple = os === "ios" || os === "macos"

  return shortcut
    .replaceAll("+", "")
    .replaceAll("ctrl", "^")
    .replaceAll("alt", "⌥")
    .replaceAll("mod", apple ? "⌘" : "^")
    .replaceAll("meta", apple ? "⌘" : "⊞")
    .replaceAll("shift", "⇧")
    .replaceAll("enter", "⏎")
    .replaceAll("esc", "␛")
    .replaceAll("space", "␣")
    .toUpperCase()
}

const KeyboardShortcutEditor = ({
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
  const [recording, setRecording] = useState(false)
  const os = useOs()

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
          letterSpacing: 5,
          fontFamily: "inherit",
        }}
        pr={0}
        onClick={record}
      >
        {recording ? (
          <Loader size="xs" color="white" />
        ) : (
          prettifyShortcut(os, shortcut)
        )}
      </Kbd>
      <span style={{ flexGrow: 1 }} />
      <TextInput
        leftSection={<IconCode />}
        size="xs"
        style={{ display: "inline-block", height: "100%" }}
        value={command}
        onBlur={(e) =>
          setCommand(e.currentTarget.value.replace(/[“”“‟”❝❞〝〞]/g, '"'))
        }
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

export default KeyboardShortcutEditor
