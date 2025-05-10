import {
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
      mathfieldRef.current.addEventListener("input", (e) => {
        const target = e.target as MathfieldElement
        const value = target.getValue()
        setValue(
          value,
          (mathfieldRef.current!.computeEngine as any).parse(value, {
            canonical: false,
          })
        )
      })

      mathfieldRef.current.addEventListener("move-out", (e) => {
        if (
          e.detail.direction === "forward" ||
          e.detail.direction === "downward"
        ) {
          props.editor.chain().selectNodeForward().focus().run()
        } else {
          props.editor.chain().selectNodeBackward().focus().run()
        }
      })

      mathfieldRef.current.addEventListener("beforeinput", (e: any) => {
        if (!e.target.value && e.inputType === "deleteContentBackward") {
          props.editor.chain().deleteSelection().run()
        }
      })
    }
  }, [mathfieldRef])

  useEffect(() => {
    if (props.selected && props.editor.state.selection.content().size === 1) {
      mathfieldRef.current?.focus()
    }
  }, [props.selected])

  const setValue = (value: string, json: any) => {
    props.updateAttributes({ value, json })
    setFormula(value)
  }

  return (
    <NodeViewWrapper
      key={`math-editor-${uniqueId}`}
      style={
        props.node.type.name === "math-inline"
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
  selectable: true,

  addOptions() {
    return { exitOnArrowDown: true, HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      value: {
        default: "",
      },
      json: {
        default: {},
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
      json: {
        default: {},
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
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addKeyboardShortcuts() {
    return { "mod-m": () => this.editor.commands.insertMathInline() }
  },
})
