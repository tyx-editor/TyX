/**
 * @file Adds support for keyboard maps in TipTap.
 */

import { Extension } from "@tiptap/core"
import { Plugin } from "@tiptap/pm/state"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    keyboardMapCommands: {
      /**
       * Sets the currently active keyboard map.
       */
      setKeyboardLayout: (layout: string | null) => ReturnType

      /**
       * Toggles between the given keyboard map and no keyboard map.
       */
      toggleKeyboardLayout: (layout: string) => ReturnType
    }
  }
}

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

const KeyboardMap = Extension.create({
  name: "keyboardMap",

  addStorage() {
    return {
      layout: null,
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            const { key, ctrlKey, metaKey, altKey } = event

            if (!this.storage.layout || ctrlKey || metaKey || altKey) {
              return false
            }

            const replacement =
              KEYBOARD_MAPS[this.storage.layout][key.toLowerCase()]
            if (replacement) {
              const { state, dispatch } = view
              const { from, to } = state.selection

              dispatch(state.tr.insertText(replacement, from, to))
              event.preventDefault()
              return true
            }

            return false
          },
        },
      }),
    ]
  },

  addCommands() {
    return {
      setKeyboardLayout: (layout) => () => {
        this.storage.layout = layout
        return true
      },
      toggleKeyboardLayout: (layout) => () => {
        this.storage.layout = this.storage.layout ? null : layout
        return true
      },
    }
  },
})

export default KeyboardMap
