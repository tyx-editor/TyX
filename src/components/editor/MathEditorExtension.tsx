import {
  isNodeSelection,
  mergeAttributes,
  Node,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react"
import { type MathfieldElement } from "mathlive"
import { useEffect, useId, useRef, useState } from "react"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mathliveNew: {
      /**
       * Set a code block
       */
      insertMathBlock: (attributes?: { language: string }) => ReturnType
      /**
       * Inserts an inline math node
       */
      insertMathInline: (attributes?: { language: string }) => ReturnType
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >
    }
  }
}

const MathEditor = (props: NodeViewProps) => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  const uniqueId = useId()
  const [formula, setFormula] = useState(props.node.attrs.value ?? "")

  useEffect(() => {
    if (mathfieldRef.current) {
      const mf = mathfieldRef.current
      mf.defaultMode =
        props.node.type.name === "mathInline" ? "inline-math" : "math"

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
      mathfieldRef.current?.focus()
    }
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

export interface MathOptions {
  /**
   * Define whether the node should be exited on arrow down if there is no node after it.
   * Defaults to `true`.
   */
  exitOnArrowDown: boolean
  /**
   * Custom HTML attributes that should be added to the rendered HTML tag.
   */
  HTMLAttributes: Record<string, any>
}

export const MathBlock = Node.create<MathOptions>({
  name: "mathBlock",
  group: "block",
  defining: true,

  addOptions() {
    return { exitOnArrowDown: true, HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      value: {
        default: "",
      },
      asciimath: {
        default: "",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "math-block",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["math-block", mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathEditor)
  },

  addCommands() {
    return {
      insertMathBlock:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      "mod-shift-m": () => {
        return this.editor.commands.insertMathBlock()
      },
    }
  },
})

export const MathInline = Node.create<MathOptions>({
  name: "mathInline",
  group: "inline",
  inline: true,
  defining: true,

  addOptions() {
    return { exitOnArrowDown: true, HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      value: {
        default: "",
      },
      asciimath: {
        default: "",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "math-inline",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["math-inline", mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathEditor)
  },

  addCommands() {
    return {
      insertMathInline:
        (options) =>
        ({ chain, state }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .setNodeSelection(state.selection.from)
            .focus()
            .run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      "mod-m": () => this.editor.commands.insertMathInline(),
    }
  },
})
