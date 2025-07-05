/**
 * @file An extension for Typst function calls.
 * Possibly includes "inside content" and arguments.
 */

import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react"
import FunctionCallNode from "./FunctionCallNode"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    functionCallCommands: {
      /**
       * Inserts a inline function call node
       */
      insertFunctionCallInline: (name: string, parameters?: any) => ReturnType

      /**
       * Inserts a block function call node
       */
      insertFunctionCallBlock: (name: string, parameters?: any) => ReturnType
    }
  }
}

export interface FunctionCallOptions {
  /**
   * Custom HTML attributes that should be added to the rendered HTML tag.
   */
  HTMLAttributes: Record<string, any>
}

export const FunctionCallBlock = Node.create<FunctionCallOptions>({
  name: "functionCallBlock",
  group: "block",
  defining: true,
  content: "block*",

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      name: {
        default: "",
      },
      parameters: {
        default: {},
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "function-call-block",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "function-call-block",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FunctionCallNode)
  },

  addCommands() {
    return {
      insertFunctionCallBlock:
        (name, parameters) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { name, parameters },
            content: [{ type: "paragraph" }],
          }),
    }
  },
})

export const FunctionCallInline = Node.create<FunctionCallOptions>({
  name: "functionCallInline",
  group: "inline",
  content: "inline*",
  inline: true,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      name: {
        default: "",
      },
      parameters: {
        default: {},
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "function-call-inline",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "function-call-inline",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FunctionCallNode)
  },

  addCommands() {
    return {
      insertFunctionCallInline:
        (name, parameters) =>
        ({ chain, state }) =>
          chain()
            .insertContent({
              type: this.name,
              attrs: { name, parameters },
            })
            .setTextSelection(state.selection.from + 1)
            .focus()
            .run(),
    }
  },
})
