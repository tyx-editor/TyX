import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical"
import { useEffect } from "react"
import { TyXSettings } from "../../models"
import {
  getLocalStorage,
  setLocalStorage,
  useLocalStorage,
} from "../../utilities/hooks"

export const TOGGLE_KEYBOARD_MAP_COMMAND: LexicalCommand<string | null> =
  createCommand()

export const KEYBOARD_MAPS: Record<string, Record<string, string>> = {
  Hebrew: {
    a: "ש",
    b: "נ",
    c: "ב",
    d: "ג",
    e: "ק",
    f: "כ",
    g: "ע",
    h: "י",
    i: "ן",
    j: "ח",
    k: "ל",
    l: "ך",
    m: "צ",
    n: "מ",
    o: "ם",
    p: "פ",
    q: "/",
    r: "ר",
    s: "ד",
    t: "א",
    u: "ו",
    v: "ה",
    w: "'",
    x: "ס",
    y: "ט",
    z: "ז",
    ",": "ת",
    ".": "ץ",
    ";": "ף",
    "'": ",",
    "/": ".",
    "`": ";",
    "(": ")",
    ")": "(",
    "[": "]",
    "]": "[",
    "{": "}",
    "}": "{",
    "<": ">",
    ">": "<",
  },
}

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
        return
      }

      const replacement = KEYBOARD_MAPS[keyboardMap][key.toLowerCase()]
      if (replacement) {
        editor.update(() => {
          $getSelection()?.insertText(replacement)
        })
        event.preventDefault()
      }
    }

    return editor.registerRootListener((rootElement, prevRootElement) => {
      rootElement?.addEventListener("keypress", listener)
      prevRootElement?.removeEventListener("keypress", listener)
    })
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

  return <></>
}

export default KeyboardMapPlugin
