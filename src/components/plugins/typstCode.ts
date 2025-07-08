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
import { TypstCodeEditor } from "./TypstCodePlugin"

export const INSERT_TYPST_CODE_COMMAND: LexicalCommand<void> = createCommand()

export type SerializedTypstCodeNode = Spread<
  {
    text?: string
  },
  SerializedLexicalNode
>

export class TypstCodeNode extends DecoratorNode<React.ReactNode> {
  __text: string

  static getType(): string {
    return "typstcode"
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("span")
    div.classList.add(config.theme.typstCode)
    return div
  }

  updateDOM(): false {
    return false
  }

  constructor(text: string = "", key?: NodeKey) {
    super(key)
    this.__text = text
  }

  static clone(node: TypstCodeNode): TypstCodeNode {
    return new TypstCodeNode(node.__key)
  }

  static importJSON(
    serializedNode: LexicalUpdateJSON<SerializedTypstCodeNode>,
  ): TypstCodeNode {
    return new TypstCodeNode().updateFromJSON(serializedNode)
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedTypstCodeNode>,
  ): this {
    const self = super.updateFromJSON(serializedNode)
    if (typeof serializedNode.text === "string") {
      self.setText(serializedNode.text)
    }
    return self
  }

  isInline(): true {
    return true
  }

  setText(text: string) {
    const self = this.getWritable()
    self.__text = text
    return self
  }

  decorate(): React.ReactNode {
    return React.createElement(TypstCodeEditor, {
      text: this.__text,
      nodeKey: this.getKey(),
    })
  }
}

export function $createTypstCodeNode(): TypstCodeNode {
  return $applyNodeReplacement(new TypstCodeNode())
}

export function $isTypstCodeNode(
  node: LexicalNode | null | undefined,
): node is TypstCodeNode {
  return node instanceof TypstCodeNode
}
