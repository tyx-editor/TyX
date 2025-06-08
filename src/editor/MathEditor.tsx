/**
 * @file A TipTap React node view for editing math using Mathfield.
 */

import {
  isNodeSelection,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react"
import { type MathfieldElement } from "mathlive"
import { useEffect, useId, useRef, useState } from "react"
import { TyXSettings } from "../models"
import { DEFAULT_MATH_INLINE_SHORTCUTS } from "../settings"
import { getLocalStorage } from "../utilities/hooks"

declare global {
  interface Window {
    currentMathEditor?: MathfieldElement
  }
}

const moveForward = (props: NodeViewProps) => {
  const position = props.getPos()
  const chain =
    position + props.node.nodeSize === props.editor.state.doc.content.size
      ? props.editor
          .chain()
          .insertContentAt(position + props.node.nodeSize, {
            type: "paragraph",
          })
          .setTextSelection(position + props.node.nodeSize + 1)
      : props.editor.chain().setTextSelection(position + props.node.nodeSize)
  chain.focus().run()
}

const MathEditor = (props: NodeViewProps) => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  const uniqueId = useId()
  const [formula, setFormula] = useState(props.node.attrs.value ?? "")

  const updateCurrentMathEditor = () => {
    const mf = mathfieldRef.current
    if (mf && mf.hasFocus() && window.currentMathEditor !== mf) {
      window.currentMathEditor = mf
      window.dispatchEvent(new Event("mathEditorChanged"))
    } else if (mf && !mf.hasFocus() && window.currentMathEditor === mf) {
      delete window.currentMathEditor
      window.dispatchEvent(new Event("mathEditorChanged"))
    }
  }

  useEffect(() => {
    const mf = mathfieldRef.current
    if (mf) {
      mf.defaultMode =
        props.node.type.name === "mathInline" ? "inline-math" : "math"
      mf.mathVirtualKeyboardPolicy = "manual"

      if (mf.isConnected) {
        mf.addEventListener("focus", updateCurrentMathEditor)
        mf.addEventListener("blur", updateCurrentMathEditor)

        mf.inlineShortcuts = Object.fromEntries(
          getLocalStorage<TyXSettings>("Settings").mathInlineShortcuts ??
            DEFAULT_MATH_INLINE_SHORTCUTS,
        )

        mf.addEventListener("keydown", (e) => {
          if (e.key === " ") {
            e.preventDefault()
            const position = mf.position
            mf.executeCommand("moveAfterParent")
            if (mf.position === position) {
              moveForward(props)
            }
          }
        })

        let element: HTMLElement | null = mf
        while (element && !element.dir) {
          element = element.parentElement
        }
        const dir = element?.dir ?? "ltr"

        mf.addEventListener("input", (e) => {
          const target = e.target as MathfieldElement
          setValue(target.getValue(), target.getValue("ascii-math"))
        })

        mf.addEventListener("move-out", (e) => {
          const position = props.getPos()
          let isForward =
            !e?.detail?.direction ||
            e.detail.direction === "forward" ||
            e.detail.direction === "downward"
          if (dir === "rtl") {
            isForward = !isForward
          }

          if (isForward) {
            moveForward(props)
          } else {
            position === 0
              ? props.editor
                  .chain()
                  .insertContentAt(position, {
                    type: "paragraph",
                  })
                  .setTextSelection(position)
                  .focus()
                  .run()
              : props.editor
                  .chain()
                  .setTextSelection(
                    props.node.type.name === "mathBlock"
                      ? position - 1
                      : position,
                  )
                  .focus()
                  .run()
          }
        })

        mf.addEventListener("beforeinput", (e: any) => {
          if (!e.target.value && e.inputType === "deleteContentBackward") {
            props.editor.chain().deleteSelection().run()
          }
        })

        mf.menuItems = []
      }
    }
  }, [mathfieldRef, mathfieldRef.current?.isConnected])

  useEffect(() => {
    const selection = props.editor.state.selection
    if (isNodeSelection(selection) && selection.from === props.getPos()) {
      mathfieldRef.current?.focus()
    }
    updateCurrentMathEditor()
  }, [props.editor.state.selection, props.selected])

  const setValue = (value: string, asciimath: any) => {
    props.updateAttributes({ value, asciimath })
    setFormula(value)
  }

  return (
    <NodeViewWrapper
      key={`math-editor-${uniqueId}`}
      className={props.node.type.name}
      style={
        props.node.type.name === "mathInline"
          ? { display: "inline-block" }
          : { display: "block", textAlign: "center", fontSize: 24 }
      }
    >
      <NodeViewContent>
        <math-field ref={mathfieldRef}>{formula}</math-field>
      </NodeViewContent>
    </NodeViewWrapper>
  )
}

export default MathEditor
