import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react"
import { type MathfieldElement } from "mathlive"
import MathEditor from "./MathEditor"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mathEditorCommands: {
      /**
       * Set a math block
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

export interface MathOptions {
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
    return { HTMLAttributes: {} }
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
})

export const MathInline = Node.create<MathOptions>({
  name: "mathInline",
  group: "inline",
  inline: true,
  defining: true,

  addOptions() {
    return { HTMLAttributes: {} }
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
})
