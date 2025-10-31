/**
 * @file A modal for customizing the app-wide settings.
 */

import { Button, Fieldset, NumberInput, Select, Switch } from "@mantine/core"
import {
  IconDeviceFloppy,
  IconFolderOpen,
  IconKeyboard,
  IconLanguage,
  IconPlus,
  IconRotate,
} from "@tabler/icons-react"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { isWeb, openSettingsDirectory, saveSettingsToFile } from "../backend"
import { DEFAULT_SERVER_DEBOUNCE_MILLISECONDS, TyXSettings } from "../models"
import { DEFAULT_MATH_INLINE_SHORTCUTS } from "../settings"
import { refreshKeyboardShortcuts } from "../shortcuts"
import { TRANSLATIONS } from "../translations"
import { showSuccessMessage } from "../utilities"
import { useLocalStorage } from "../utilities/hooks"
import KeyboardShortcutEditor from "./KeyboardShortcutEditor"
import MathInlineShortcutEditor from "./MathInlineShortcutEditor"
import { KEYBOARD_MAPS } from "./plugins/keyboardMap"

const SettingsModal = () => {
  const { t } = useTranslation()
  const [settings, setSettings] = useLocalStorage<TyXSettings>({
    key: "Settings",
    defaultValue: {},
  })

  settings.keyboardShortcuts = settings.keyboardShortcuts ?? []
  settings.mathInlineShortcuts = settings.mathInlineShortcuts ?? [
    ...DEFAULT_MATH_INLINE_SHORTCUTS,
  ]

  useEffect(() => {
    return () => {
      saveSettingsToFile()
    }
  }, [])

  return (
    <>
      <Fieldset legend={t("ui")}>
        <Select
          label={t("language")}
          leftSection={<IconLanguage />}
          data={TRANSLATIONS}
          value={settings.language ?? "en"}
          onChange={(v) => setSettings({ ...settings, language: v ?? "en" })}
        />
      </Fieldset>
      <Fieldset legend={t("keyboardShortcuts")} mt="xs">
        {settings.keyboardShortcuts!.map(
          ([shortcut, command], shortcutIndex) => (
            <KeyboardShortcutEditor
              shortcut={shortcut}
              command={command}
              setShortcut={(s) => {
                const newSettings = { ...settings }
                newSettings.keyboardShortcuts![shortcutIndex][0] = s
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              setCommand={(command) => {
                const newSettings = { ...settings }
                newSettings.keyboardShortcuts![shortcutIndex][1] = command
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              remove={() => {
                const newSettings = { ...settings }
                newSettings.keyboardShortcuts!.splice(shortcutIndex, 1)
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              key={shortcutIndex}
            />
          ),
        )}
        <Button
          fullWidth
          leftSection={<IconPlus />}
          mt="xs"
          onClick={() => {
            const newSettings = { ...settings }
            newSettings.keyboardShortcuts!.push(["", ""])
            setSettings(newSettings)
          }}
        >
          {t("add")}
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
          {t("resetToDefault")}
        </Button>
      </Fieldset>
      <Fieldset legend={t("mathInlineShortcuts")} mt="xs">
        {settings.mathInlineShortcuts!.map(
          ([shortcut, command], shortcutIndex) => (
            <MathInlineShortcutEditor
              shortcut={shortcut}
              command={command}
              setShortcut={(s) => {
                const newSettings = { ...settings }
                newSettings.mathInlineShortcuts![shortcutIndex][0] = s
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              setCommand={(command) => {
                const newSettings = { ...settings }
                newSettings.mathInlineShortcuts![shortcutIndex][1] = command
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              remove={() => {
                const newSettings = { ...settings }
                newSettings.mathInlineShortcuts!.splice(shortcutIndex, 1)
                setSettings(newSettings)
                refreshKeyboardShortcuts()
              }}
              key={shortcutIndex}
            />
          ),
        )}
        <Button
          fullWidth
          leftSection={<IconPlus />}
          mt="xs"
          onClick={() => {
            const newSettings = { ...settings }
            newSettings.mathInlineShortcuts!.push(["", ""])
            setSettings(newSettings)
          }}
        >
          {t("add")}
        </Button>
        <Button
          fullWidth
          leftSection={<IconRotate />}
          mt="xs"
          onClick={() => {
            const newSettings = { ...settings }
            delete newSettings.mathInlineShortcuts
            setSettings(newSettings)
          }}
        >
          {t("resetToDefault")}
        </Button>
      </Fieldset>
      <Fieldset legend={t("editing")} mt="xs">
        <Select
          allowDeselect
          label={t("keyboardMap")}
          leftSection={<IconKeyboard />}
          data={Object.keys(KEYBOARD_MAPS)}
          value={settings.keyboardMap ?? null}
          onChange={(keyboardMap) => setSettings({ ...settings, keyboardMap })}
        />
      </Fieldset>
      <Fieldset legend={t("output")} mt="xs">
        {!isWeb && (
          <>
            <Switch
              label={t("formatTypstWithTypstyle")}
              checked={settings.format ?? false}
              onChange={(e) =>
                setSettings({ ...settings, format: e.currentTarget.checked })
              }
            />
            <Switch
              mt="xs"
              label={t("autoStartServer")}
              checked={settings.autoStartServer ?? false}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoStartServer: e.currentTarget.checked,
                })
              }
            />
            <NumberInput
              mt="xs"
              label={t("serverDebounceMs")}
              value={
                settings.serverDebounce ?? DEFAULT_SERVER_DEBOUNCE_MILLISECONDS
              }
              onChange={(v) => {
                if (typeof v === "number") {
                  setSettings({ ...settings, serverDebounce: v })
                }
              }}
            />
          </>
        )}
      </Fieldset>
      {!isWeb && (
        <>
          <Button
            mt="xs"
            fullWidth
            leftSection={<IconDeviceFloppy />}
            onClick={() =>
              saveSettingsToFile().then((f) =>
                showSuccessMessage(`Settings saved to ${f}`),
              )
            }
          >
            {t("save")}
          </Button>
          <Button
            mt="xs"
            fullWidth
            leftSection={<IconFolderOpen />}
            onClick={openSettingsDirectory}
          >
            {t("openSettingsDirectory")}
          </Button>
        </>
      )}
    </>
  )
}

export default SettingsModal
