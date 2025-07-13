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
import { TyXValue } from "../../models"
import { FunctionCallEditor } from "./FunctionCallPlugin"

export const INSERT_FUNCTION_CALL_COMMAND: LexicalCommand<
  | string
  | [
      string,
      TyXValue[] | undefined,
      Record<string, TyXValue> | undefined,
      boolean | undefined,
    ]
> = createCommand()

export type SerializedFunctionCallNode = Spread<
  {
    name?: string
    inline?: boolean
    positionParameters?: TyXValue[]
    namedParameters?: Record<string, TyXValue>
    content?: SerializedEditor
  },
  SerializedLexicalNode
>

export const FUNCTIONS = {
  h: { content: false },
  footnote: { content: true },
} as const

export class FunctionCallNode extends DecoratorNode<React.ReactNode> {
  __name: string
  __positionParameters?: TyXValue[]
  __namedParameters?: Record<string, TyXValue>
  __content?: LexicalEditor
  __inline: boolean

  static getType(): string {
    return "functioncall"
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("span")
    div.classList.add(config.theme.functionCall)
    div.classList.add(config.theme.functionCall + "-" + this.__name)
    return div
  }

  updateDOM(): false {
    return false
  }

  constructor(
    name: string = "",
    positionParameters?: TyXValue[],
    namedParameters?: Record<string, TyXValue>,
    content?: LexicalEditor,
    inline?: boolean,
    key?: NodeKey,
  ) {
    super(key)
    this.__name = name
    this.__positionParameters = positionParameters
    this.__namedParameters = namedParameters
    this.__content = content
    if (FUNCTIONS[name as keyof typeof FUNCTIONS]?.content) {
      this.__content ??= createEditor()
    }
    this.__inline = inline ?? true
  }

  static clone(node: FunctionCallNode): FunctionCallNode {
    return new FunctionCallNode(
      node.__name,
      node.__positionParameters
        ? JSON.parse(JSON.stringify(node.__positionParameters))
        : undefined,
      node.__namedParameters
        ? JSON.parse(JSON.stringify(node.__namedParameters))
        : undefined,
      node.__content,
      node.__inline,
      node.__key,
    )
  }

  static importJSON(
    serializedNode: LexicalUpdateJSON<SerializedFunctionCallNode>,
  ): FunctionCallNode {
    return new FunctionCallNode().updateFromJSON(serializedNode)
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedFunctionCallNode>,
  ): this {
    const self = super.updateFromJSON(serializedNode)
    if (typeof serializedNode.name === "string") {
      this.__name = serializedNode.name
    }
    if (typeof serializedNode.inline === "boolean") {
      this.__inline = serializedNode.inline
    }
    if (Array.isArray(serializedNode.positionParameters)) {
      this.__positionParameters = serializedNode.positionParameters
    }
    if (typeof serializedNode.namedParameters === "object") {
      this.__namedParameters = serializedNode.namedParameters
    }
    if (FUNCTIONS[serializedNode.name as keyof typeof FUNCTIONS]?.content) {
      this.__content ??= createEditor()
    }
    const serializedEditor = serializedNode.content
    if (serializedEditor && self.__content) {
      const editorState = self.__content.parseEditorState(
        serializedEditor.editorState,
      )
      if (!editorState.isEmpty()) {
        self.__content.setEditorState(editorState)
      }
    }
    return self
  }

  exportJSON(): SerializedFunctionCallNode {
    return {
      ...super.exportJSON(),
      name: this.__name,
      inline: this.__inline,
      positionParameters: this.__positionParameters,
      namedParameters: this.__namedParameters,
      content: this.__content?.toJSON(),
    }
  }

  isInline() {
    return this.__inline
  }

  isKeyboardSelectable(): boolean {
    return this.__content !== undefined
  }

  decorate(): React.ReactNode {
    return React.createElement(FunctionCallEditor, {
      nodeKey: this.getKey(),
      content: this.__content,
      name: this.__name,
      positionParameters: this.__positionParameters,
      namedParameters: this.__namedParameters,
    })
  }
}

export function $createFunctionCallNode(
  name: string,
  positionParameters: TyXValue[] | undefined,
  namedParameters: Record<string, TyXValue> | undefined,
  inline: boolean | undefined,
): FunctionCallNode {
  return $applyNodeReplacement(
    new FunctionCallNode(
      name,
      positionParameters,
      namedParameters,
      undefined,
      inline,
    ),
  )
}

export function $isFunctionCallNode(
  node: LexicalNode | null | undefined,
): node is FunctionCallNode {
  return node instanceof FunctionCallNode
}
