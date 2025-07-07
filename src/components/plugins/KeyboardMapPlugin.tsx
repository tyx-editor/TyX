import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  KEY_DOWN_COMMAND,
} from "lexical"
import { useEffect } from "react"
import { TyXSettings } from "../../models"
import {
  getLocalStorage,
  setLocalStorage,
  useLocalStorage,
} from "../../utilities/hooks"
import { KEYBOARD_MAPS, TOGGLE_KEYBOARD_MAP_COMMAND } from "./keyboardMap"

const KeyboardMapPlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [settings] = useLocalStorage<TyXSettings>({
    key: "Settings",
    defaultValue: {},
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, altKey } = event
      const keyboardMap = getLocalStorage<string | null>("Keyboard Map", null)

      if (!keyboardMap || ctrlKey || metaKey || altKey) {
        return false
      }

      const replacement = KEYBOARD_MAPS[keyboardMap][key.toLowerCase()]
      if (replacement) {
        editor.update(() => {
          $getSelection()?.insertText(replacement)
        })
        event.preventDefault()
        return true
      } else if (
        Object.values(KEYBOARD_MAPS[keyboardMap]).includes(key.toLowerCase())
      ) {
        setLocalStorage(
          "Current Warning",
          "Verify your OS keyboard layout is English when using a keyboard map",
        )
      }

      return false
    }

    // return editor.registerRootListener((rootElement, prevRootElement) => {
    //   rootElement?.addEventListener("keypress", listener)
    //   prevRootElement?.removeEventListener("keypress", listener)
    // })
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      listener,
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      TOGGLE_KEYBOARD_MAP_COMMAND,
      (layout) => {
        const currentMap = getLocalStorage<string | null>("Keyboard Map", null)
        setLocalStorage("Keyboard Map", currentMap === layout ? null : layout)
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  useEffect(() => {
    setLocalStorage("Keyboard Map", settings.keyboardMap ?? null)
  }, [settings])

  return null
}

export default KeyboardMapPlugin
