import {
  $applyNodeReplacement,
  createCommand,
  EditorConfig,
  ElementNode,
  LexicalCommand,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical"

export const INSERT_TYPST_CODE_COMMAND: LexicalCommand<void> = createCommand()

export type SerializedTypstCodeNode = Spread<
  {
    text?: string
  },
  SerializedLexicalNode
>

export class TypstCodeNode extends ElementNode {
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

  static clone(node: TypstCodeNode): TypstCodeNode {
    return new TypstCodeNode(node.__key)
  }

  isInline(): true {
    return true
  }

  canInsertTextAfter(): false {
    return false
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
