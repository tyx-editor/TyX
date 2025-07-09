import {
  $applyNodeReplacement,
  createCommand,
  createEditor,
  DecoratorNode,
  EditorConfig,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import React from "react"
import { TypstCodeEditor } from "./TypstCodePlugin"

export const INSERT_TYPST_CODE_COMMAND: LexicalCommand<void> = createCommand()

export type SerializedTypstCodeNode = Spread<
  {
    text?: SerializedEditor
  },
  SerializedLexicalNode
>

export class TypstCodeNode extends DecoratorNode<React.ReactNode> {
  __text: LexicalEditor

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

  constructor(text?: LexicalEditor, key?: NodeKey) {
    super(key)
    this.__text = text ?? createEditor()
  }

  static clone(node: TypstCodeNode): TypstCodeNode {
    return new TypstCodeNode(node.__text, node.__key)
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
    const serializedEditor = serializedNode.text
    if (serializedEditor) {
      const editorState = self.__text.parseEditorState(
        serializedEditor.editorState,
      )
      if (!editorState.isEmpty()) {
        self.__text.setEditorState(editorState)
      }
    }
    return self
  }

  exportJSON(): SerializedTypstCodeNode {
    return {
      ...super.exportJSON(),
      text: this.__text.toJSON(),
    }
  }

  isInline(): true {
    return true
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
