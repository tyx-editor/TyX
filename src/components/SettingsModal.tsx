import { Button, Fieldset, Select } from "@mantine/core"
import { IconKeyboard, IconPlus, IconRotate } from "@tabler/icons-react"
import { useLocalStorage } from "../hooks"
import { refreshKeyboardShortcuts } from "../keyboardShortcuts"
import { DEFAULT_KEYBOARD_SHORTCUTS, TyXSettings } from "../models"
import ShortcutEditor from "./ShortcutEditor"
import { KEYBOARD_MAPS } from "./editor/KeyboardMapExtension"

const SettingsModal = () => {
  const [settings, setSettings] = useLocalStorage<TyXSettings>({
    key: "Settings",
    defaultValue: {},
  })

  settings.keyboardShortcuts = settings.keyboardShortcuts ?? {
    ...DEFAULT_KEYBOARD_SHORTCUTS,
  }

  return (
    <>
      <Fieldset legend="Keyboard Shortcuts">
        {Object.keys(settings.keyboardShortcuts)
          .sort()
          .map((shortcut, shortcutIndex) => (
            <ShortcutEditor
              shortcut={shortcut}
              command={settings.keyboardShortcuts![shortcut]}
              setShortcut={(s) => {
                const newSettings = { ...settings }
                newSettings.keyboardShortcuts![s] =
                  newSettings.keyboardShortcuts![shortcut]
                delete newSettings.keyboardShortcuts![shortcut]
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              setCommand={(command) => {
                const newSettings = { ...settings }
                newSettings.keyboardShortcuts![shortcut] = command
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              remove={() => {
                const newSettings = { ...settings }
                delete newSettings.keyboardShortcuts![shortcut]
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              key={shortcutIndex}
            />
          ))}
        <Button
          fullWidth
          leftSection={<IconPlus />}
          mt="xs"
          onClick={() => {
            const newSettings = { ...settings }
            let newShortcut = "z"
            while (newSettings.keyboardShortcuts![newShortcut]) {
              newShortcut += " z"
            }
            newSettings.keyboardShortcuts![newShortcut] = ["selectAll"]
            setSettings(newSettings)
          }}
        >
          Add
        </Button>
        <Button
          fullWidth
          leftSection={<IconRotate />}
          mt="xs"
          onClick={() => {
            const newSettings = { ...settings }
            delete newSettings.keyboardShortcuts
            setSettings(newSettings)
          }}
        >
          Reset to Default
        </Button>
      </Fieldset>
      <Fieldset legend="Editing" mt="xs">
        <Select
          allowDeselect
          label="Keyboard Map"
          leftSection={<IconKeyboard />}
          data={Object.keys(KEYBOARD_MAPS)}
          value={settings.keyboardMap ?? null}
          onChange={(keyboardMap) => setSettings({ ...settings, keyboardMap })}
        />
      </Fieldset>
    </>
  )
}

export default SettingsModal
