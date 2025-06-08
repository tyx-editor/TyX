import { Button, Fieldset, Select } from "@mantine/core"
import {
  IconKeyboard,
  IconLanguage,
  IconPlus,
  IconRotate,
} from "@tabler/icons-react"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocalStorage } from "../hooks"
import { RTL_LANGUAGES, TRANSLATIONS } from "../i18n"
import { refreshKeyboardShortcuts } from "../keyboardShortcuts"
import { DEFAULT_KEYBOARD_SHORTCUTS, TyXSettings } from "../models"
import ShortcutEditor from "./ShortcutEditor"
import { KEYBOARD_MAPS } from "./editor/KeyboardMapExtension"

const SettingsModal = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation()
  const [settings, setSettings] = useLocalStorage<TyXSettings>({
    key: "Settings",
    defaultValue: {},
  })

  useEffect(() => {
    changeLanguage(settings.language ?? "en")

    document.dir =
      settings.language && RTL_LANGUAGES.includes(settings.language)
        ? "rtl"
        : "ltr"
  }, [settings.language])

  settings.keyboardShortcuts = settings.keyboardShortcuts ?? [
    ...DEFAULT_KEYBOARD_SHORTCUTS,
  ]

  return (
    <>
      <Fieldset legend={t("ui")}>
        <Select
          label={t("language")}
          leftSection={<IconLanguage />}
          data={TRANSLATIONS}
          value={language}
          onChange={(v) => setSettings({ ...settings, language: v ?? "en" })}
        />
      </Fieldset>
      <Fieldset legend={t("keyboardShortcuts")} mt="xs">
        {settings.keyboardShortcuts!.map(
          ([shortcut, command], shortcutIndex) => (
            <ShortcutEditor
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
