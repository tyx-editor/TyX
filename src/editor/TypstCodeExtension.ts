import { Mark, mergeAttributes } from "@tiptap/react"

export interface TypstCodeOptions {
  /**
   * Custom HTML attributes that should be added to the rendered HTML tag.
   */
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    typstCode: {
      setTypstCode: () => ReturnType
      unsetTypstCode: () => ReturnType
      toggleTypstCode: () => ReturnType
    }
  }
}

export const TypstCode = Mark.create<TypstCodeOptions>({
  name: "typstCode",
  excludes: "_",
  code: true,
  exitable: true,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  parseHTML() {
    return [
      {
        tag: "code",
        attrs: { "data-kind": "typstCode" },
        preserveWhitespace: "full",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "code",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-kind": "typstCode",
        class: "typst",
      }),
    ]
  },

  addCommands() {
    return {
      setTypstCode:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name)
        },
      unsetTypstCode:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      toggleTypstCode:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
    }
  },
})
