import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import { mergeRegister } from "@lexical/utils"
import {
  $createNodeSelection,
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $setSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  KEY_DOWN_COMMAND,
  NodeKey,
} from "lexical"
import { MathfieldElement } from "mathlive"
import { useEffect, useRef, useState } from "react"
import { tex2typst } from "tex2typst"
import { DEFAULT_MATH_INLINE_SHORTCUTS, getSettings } from "../../settings"
import {
  $createMathNode,
  $isMathNode,
  INSERT_MATH_COMMAND,
  MATH_COMMAND,
  TOGGLE_MATH_INLINE_COMMAND,
} from "./math"

declare module "mathlive" {
  interface MathfieldElement {
    isRegistered?: boolean
  }
}

declare global {
  interface Window {
    currentMathEditor?: MathfieldElement
  }

  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >
    }
  }
}

export const MathEditor = ({
  formula: initialFormula,
  nodeKey,
  inline,
}: {
  formula: string
  nodeKey: NodeKey
  inline?: boolean
}) => {
  const [editor] = useLexicalComposerContext()
  const [formula, setFormula] = useState("")
  const [isSelected] = useLexicalNodeSelection(nodeKey)
  const mathfieldRef = useRef<MathfieldElement>(null)

  const updateCurrentMathEditor = () => {
    const mf = mathfieldRef.current
    if (mf && mf.hasFocus() && window.currentMathEditor !== mf) {
      window.currentMathEditor = mf
      window.dispatchEvent(new Event("mathEditorChanged"))
    } else if (
      (mf && !mf.hasFocus() && window.currentMathEditor === mf) ||
      (!mf &&
        window.currentMathEditor !== undefined &&
        window.currentMathEditor.parentElement === null)
    ) {
      delete window.currentMathEditor
      window.dispatchEvent(new Event("mathEditorChanged"))
    }
  }

  const updateValue = (formula: string, typst: string) => {
    setFormula(formula)
    setTimeout(() => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isMathNode(node)) {
          node.setFormula(formula)
          node.setTypst(typst)
        }
      })
    }, 0)
  }

  useEffect(() => {
    setFormula(initialFormula)
  }, [initialFormula])

  useEffect(() => {
    const mf = mathfieldRef.current
    if (mf) {
      mf.mathVirtualKeyboardPolicy = "manual"

      if (mf.isConnected && !mf.isRegistered) {
        mf.isRegistered = true

        mf.addEventListener("focus", () => {
          updateCurrentMathEditor()
          editor.update(() => {
            const selection = $createNodeSelection()
            selection.add(nodeKey)
            $setSelection(selection)
          })
        })
        mf.addEventListener("blur", updateCurrentMathEditor)

        mf.inlineShortcuts = Object.fromEntries(
          getSettings().mathInlineShortcuts ?? DEFAULT_MATH_INLINE_SHORTCUTS,
        )

        mf.addEventListener("input", (e) => {
          const target = e.target as MathfieldElement
          updateValue(
            target.getValue(),
            tex2typst(target.getValue("latex-without-placeholders"), {
              customTexMacros: { "\\differentialD": "\\text{d}" },
            }),
          )
        })

        mf.addEventListener("move-out", (e) => {
          let isForward =
            !e?.detail?.direction ||
            e.detail.direction === "forward" ||
            e.detail.direction === "downward"

          let element: HTMLElement | null = mf
          while (element && !element.dir) {
            element = element.parentElement
          }
          const dir = element?.dir ?? "ltr"

          if (dir === "rtl") {
            isForward = !isForward
          }

          mf.blur()
          editor.update(() => {
            const node = $getNodeByKey(nodeKey)
            if (node) {
              $setSelection(isForward ? node.selectEnd() : node.selectStart())
            }
          })
        })

        mf.addEventListener("keydown", (e) => {
          if (e.key === " ") {
            e.preventDefault()

            const popover = document.querySelector(
              "#mathlive-suggestion-popover",
            )
            const current = popover?.querySelector(".ML__popover__current") as
              | HTMLLIElement
              | undefined
            // If popover is visible, should complete the popover instead of moving after parent
            if (popover !== null) {
              current?.click()
              mf.executeCommand("commit")
              return
            }
            const position = mf.position
            mf.executeCommand("moveAfterParent")
            if (mf.position === position) {
              mf.blur()
              editor.update(() => {
                const node = $getNodeByKey(nodeKey)
                if (node) {
                  $setSelection(node.selectEnd())
                }
              })
            }
          }
        })

        mf.addEventListener("beforeinput", (e: InputEvent) => {
          const target = e.target as MathfieldElement
          if (
            !target.value &&
            e.inputType === "deleteContentBackward" &&
            !target.shadowRoot?.querySelector(".ML__raw-latex")
          ) {
            e.preventDefault()
            e.stopImmediatePropagation()
            editor.update(() => {
              const node = $getNodeByKey(nodeKey)
              if (node === null) {
                return
              }

              if (!node.isInline()) {
                const p = $createParagraphNode()
                node.replace(p)
                p.select()
              } else {
                node.remove(true)
              }
            })
          }
        })

        mf.menuItems = []
      }
    }
  }, [mathfieldRef.current])

  useEffect(() => {
    const mf = mathfieldRef.current
    if (mf) {
      mf.defaultMode = inline ? "inline-math" : "math"
    }
  }, [inline])

  useEffect(() => {
    if (isSelected) {
      const shouldFocus = editor.read(() => {
        const selection = $getSelection()
        if (selection?.getNodes().length === 1) {
          return true
        }
        return false
      })

      if (shouldFocus) {
        mathfieldRef.current?.focus()
        updateCurrentMathEditor()
      }
    }

    return updateCurrentMathEditor
  }, [mathfieldRef.current, isSelected])

  return <math-field ref={mathfieldRef}>{formula}</math-field>
}

const MathPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_MATH_COMMAND,
        (inline) => {
          const node = $createMathNode("", inline)
          $insertNodes([node])

          const selection = $createNodeSelection()
          selection.add(node.getKey())
          $setSelection(selection)

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        TOGGLE_MATH_INLINE_COMMAND,
        () => {
          const selection = $getSelection()
          if ($isNodeSelection(selection)) {
            for (const node of selection.getNodes()) {
              if ($isMathNode(node)) {
                node.setInline(!node.isInline())
                return true
              }
            }
          }

          editor.dispatchCommand(INSERT_MATH_COMMAND, false)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        MATH_COMMAND,
        ([command, ...args]) => {
          try {
            // @ts-ignore
            window.currentMathEditor?.executeCommand(command, ...args)
          } catch (e) {
            console.log(e)
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (e) => {
          const target = e.target as HTMLElement | null
          return target?.tagName === "MATH-FIELD"
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    )
  }, [editor])

  return null
}

export default MathPlugin
