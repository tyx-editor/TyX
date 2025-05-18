import {
  isNodeSelection,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react"
import { type MathfieldElement } from "mathlive"
import { useEffect, useId, useRef, useState } from "react"

declare global {
  interface Window {
    currentMathEditor?: MathfieldElement
  }
}

const MathEditor = (props: NodeViewProps) => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  const uniqueId = useId()
  const [formula, setFormula] = useState(props.node.attrs.value ?? "")

  const mf = mathfieldRef.current

  const updateCurrentMathEditor = () => {
    if (mf && mf.hasFocus() && window.currentMathEditor !== mf) {
      window.currentMathEditor = mf
      window.dispatchEvent(new Event("mathEditorChanged"))
    } else if (mf && !mf.hasFocus() && window.currentMathEditor === mf) {
      delete window.currentMathEditor
      window.dispatchEvent(new Event("mathEditorChanged"))
    }
  }

  useEffect(() => {
    if (mf) {
      mf.defaultMode =
        props.node.type.name === "mathInline" ? "inline-math" : "math"
      mf.mathVirtualKeyboardPolicy = "manual"

      mf.addEventListener("focus", updateCurrentMathEditor)
      mf.addEventListener("blur", updateCurrentMathEditor)

      mf.addEventListener(
        "keydown",
        (ev) => {
          if (ev.key === "\\") {
            ev.preventDefault()
            mf.executeCommand(["insert", "\\backslash"])
          } else if (ev.key === "Escape") ev.preventDefault()
        },
        { capture: true },
      )

      mf.addEventListener("input", (e) => {
        const target = e.target as MathfieldElement
        setValue(target.getValue(), target.getValue("ascii-math"))
      })

      mf.addEventListener("move-out", (e) => {
        const position = props.getPos()
        if (
          e.detail.direction === "forward" ||
          e.detail.direction === "downward"
        ) {
          const chain =
            position + props.node.nodeSize ===
            props.editor.state.doc.content.size
              ? props.editor
                  .chain()
                  .insertContentAt(position + props.node.nodeSize, {
                    type: "paragraph",
                  })
                  .setTextSelection(position + props.node.nodeSize + 1)
              : props.editor
                  .chain()
                  .setTextSelection(position + props.node.nodeSize)
          chain.focus().run()
        } else {
          props.editor.chain().setTextSelection(position).focus().run()
        }
      })

      mf.addEventListener("beforeinput", (e: any) => {
        if (!e.target.value && e.inputType === "deleteContentBackward") {
          props.editor.chain().deleteSelection().run()
        }
      })

      if (mf.isConnected) {
        mf.menuItems = []
      }
    }
  }, [mathfieldRef, mathfieldRef.current?.isConnected])

  useEffect(() => {
    const selection = props.editor.state.selection
    if (isNodeSelection(selection) && selection.from === props.getPos()) {
      mf?.focus()
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
