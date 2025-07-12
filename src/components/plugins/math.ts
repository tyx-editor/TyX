import {
  $applyNodeReplacement,
  createCommand,
  DecoratorNode,
  EditorConfig,
  LexicalCommand,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import React from "react"
import { MathEditor } from "./MathPlugin"

export const INSERT_MATH_COMMAND: LexicalCommand<boolean> = createCommand()
export const TOGGLE_MATH_INLINE_COMMAND: LexicalCommand<void> = createCommand()
export const MATH_COMMAND: LexicalCommand<[string, ...any]> = createCommand()

export type SerializedMathNode = Spread<
  {
    inline?: boolean
    formula?: string
    typst?: string
  },
  SerializedLexicalNode
>

export class MathNode extends DecoratorNode<React.ReactNode> {
  __inline: boolean
  __formula: string
  __typst: string

  static getType(): string {
    return "math"
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__formula, node.__typst, node.__inline, node.__key)
  }

  static importJSON(
    serializedNode: LexicalUpdateJSON<SerializedMathNode>,
  ): MathNode {
    return new MathNode().updateFromJSON(serializedNode)
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedMathNode>): this {
    const self = super.updateFromJSON(serializedNode)
    if (typeof serializedNode.inline === "boolean") {
      self.setInline(serializedNode.inline)
    }
    if (typeof serializedNode.formula === "string") {
      self.setFormula(serializedNode.formula)
    }
    if (typeof serializedNode.typst === "string") {
      self.setTypst(serializedNode.typst)
    }
    return self
  }

  exportJSON(): SerializedMathNode {
    const serializedNode: SerializedMathNode = super.exportJSON()
    serializedNode.inline = this.getLatest().__inline
    serializedNode.formula = this.getLatest().__formula
    serializedNode.typst = this.getLatest().__typst
    return serializedNode
  }

  setInline(inline: boolean) {
    const self = this.getWritable()
    self.__inline = inline
    return self
  }

  setFormula(formula: string) {
    const self = this.getWritable()
    self.__formula = formula
    return self
  }

  setTypst(typst: string) {
    const self = this.getWritable()
    self.__typst = typst
    return self
  }

  constructor(
    formula: string = "",
    typst: string = "",
    inline: boolean = true,
    key?: NodeKey,
  ) {
    super(key)
    this.__formula = formula
    this.__typst = typst
    this.__inline = inline
  }

  isInline() {
    return this.__inline
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div")
    div.className = this.__inline
      ? config.theme.mathInline
      : config.theme.mathBlock
    return div
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): false {
    if (prevNode.__inline !== this.__inline) {
      dom.className = this.__inline
        ? config.theme.mathInline
        : config.theme.mathBlock
    }
    return false
  }

  decorate(): React.ReactNode {
    return React.createElement(MathEditor, {
      formula: this.__formula,
      nodeKey: this.getKey(),
      inline: this.__inline,
    })
  }
}

export function $createMathNode(
  contents: string = "",
  inline: boolean = true,
): MathNode {
  return $applyNodeReplacement(new MathNode(contents, undefined, inline))
}

export function $isMathNode(
  node: LexicalNode | null | undefined,
): node is MathNode {
  return node instanceof MathNode
}
