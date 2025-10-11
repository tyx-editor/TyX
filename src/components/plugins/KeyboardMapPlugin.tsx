import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  isModifierMatch,
  KEY_DOWN_COMMAND,
  SKIP_SCROLL_INTO_VIEW_TAG,
} from "lexical"
import { useEffect } from "react"
import { TyXSettings } from "../../models"
import { CONTROL_OR_ALT } from "../../resources/playground"
import {
  getLocalStorage,
  setLocalStorage,
  useLocalStorage,
} from "../../utilities/hooks"
import { KEYBOARD_MAPS, TOGGLE_KEYBOARD_MAP_COMMAND } from "./keyboardMap"

const KeyboardMapPlugin = ({
  skipInitialization,
}: {
  skipInitialization?: boolean
}) => {
  const [editor] = useLexicalComposerContext()
  const [settings] = useLocalStorage<TyXSettings>({
    key: "Settings",
    defaultValue: {},
  })

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_KEYBOARD_MAP_COMMAND,
        (layout) => {
          const currentMap = getLocalStorage<string | null>(
            "Keyboard Map",
            null,
          )
          setLocalStorage("Keyboard Map", currentMap === layout ? null : layout)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (e) => {
          const selection = $getSelection()
          if (selection === null) {
            return false
          }

          // Keyboard map is disabled inside these nodes.
          if (
            selection
              .getNodes()
              .some(
                (node) =>
                  node
                    .getParents()
                    .some((parent) => parent.getType() === "code") ||
                  node.getType() === "typstcode" ||
                  node.getType() === "code",
              )
          ) {
            return false
          }

          const { key, ctrlKey, metaKey, altKey } = e
          const keyboardMap = getLocalStorage<string | null>(
            "Keyboard Map",
            null,
          )

          if (!keyboardMap || ctrlKey || metaKey || altKey) {
            return false
          }

          const replacement = KEYBOARD_MAPS[keyboardMap][key.toLowerCase()]
          if (replacement) {
            e.preventDefault()
            editor.update(
              () => {
                $getSelection()?.insertText(replacement)
              },
              { tag: [SKIP_SCROLL_INTO_VIEW_TAG] },
            )
            return true
          } else if (
            Object.values(KEYBOARD_MAPS[keyboardMap]).includes(
              key.toLowerCase(),
            )
          ) {
            setLocalStorage(
              "Current Warning",
              "Verify your OS keyboard layout is English when using a keyboard map",
            )
          }

          return false
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (e) => {
          const selection = $getSelection()
          let mode: "word" | "character" | null = null
          if (isModifierMatch(e, CONTROL_OR_ALT)) {
            mode = "word"
          } else if (isModifierMatch(e, {})) {
            mode = "character"
          }

          if (e.key === "Backspace" && $isRangeSelection(selection) && mode) {
            editor.update(
              () => {
                if (mode === "word") {
                  selection.deleteWord(true)
                } else if (mode === "character") {
                  selection.deleteCharacter(true)
                }
              },
              { tag: [SKIP_SCROLL_INTO_VIEW_TAG] },
            )

            e.preventDefault()
            return true
          }

          return false
        },
        COMMAND_PRIORITY_HIGH,
      ),
    )
  }, [editor])

  useEffect(() => {
    if (!skipInitialization) {
      setLocalStorage("Keyboard Map", settings.keyboardMap ?? null)
    }
  }, [settings])

  return null
}

export default KeyboardMapPlugin
