/**
 * @file A modal for customizing the app-wide settings.
 */

import { Button, Fieldset, Select } from "@mantine/core"
import {
  IconKeyboard,
  IconLanguage,
  IconPlus,
  IconRotate,
} from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
import { KEYBOARD_MAPS } from "../editor/KeyboardMapExtension"
import { TyXSettings } from "../models"
import { DEFAULT_MATH_INLINE_SHORTCUTS } from "../settings"
import {
  DEFAULT_KEYBOARD_SHORTCUTS,
  refreshKeyboardShortcuts,
} from "../shortcuts"
import { TRANSLATIONS } from "../translations"
import { useLocalStorage } from "../utilities/hooks"
import KeyboardShortcutEditor from "./KeyboardShortcutEditor"
import MathInlineShortcutEditor from "./MathInlineShortcutEditor"

const SettingsModal = () => {
  const { t } = useTranslation()
  const [settings, setSettings] = useLocalStorage<TyXSettings>({
    key: "Settings",
    defaultValue: {},
  })

  settings.keyboardShortcuts = settings.keyboardShortcuts ?? [
    ...DEFAULT_KEYBOARD_SHORTCUTS,
  ]
  settings.mathInlineShortcuts = settings.mathInlineShortcuts ?? [
    ...DEFAULT_MATH_INLINE_SHORTCUTS,
  ]

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
    </>
  )
}

export default SettingsModal
