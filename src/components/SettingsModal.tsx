import { Button, Fieldset } from "@mantine/core"
import { IconRotate } from "@tabler/icons-react"
import { useLocalStorage } from "../hooks"
import { refreshKeyboardShortcuts } from "../keyboardShortcuts"
import { DEFAULT_KEYBOARD_SHORTCUTS, TyXSettings } from "../models"
import ShortcutEditor from "./ShortcutEditor"

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
    </>
  )
}

export default SettingsModal
