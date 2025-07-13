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

export interface ParameterDescription {
  type: string
  required?: boolean
  label?: string
  documentation?: string
}

export const FUNCTIONS: Record<
  string,
  | {
      content: boolean
      positional?: ParameterDescription[]
      named?: (ParameterDescription & { name: string })[]
    }
  | undefined
> = {
  h: {
    content: false,
    positional: [
      {
        type: "length",
        label: "Amount",
        documentation: "How much spacing to insert",
        required: true,
      },
    ],
    named: [
      {
        type: "boolean",
        name: "weak",
        label: "Weak",
        documentation:
          "If true, the spacing collapses at the start or end of a paragraph. Moreover, from multiple adjacent weak spacings all but the largest one collapse",
      },
    ],
  },
  v: {
    content: false,
    positional: [
      {
        type: "length",
        label: "Amount",
        documentation: "How much spacing to insert",
        required: true,
      },
    ],
    named: [
      {
        type: "boolean",
        name: "weak",
        label: "Weak",
        documentation:
          "If true, the spacing collapses at the start or end of a paragraph. Moreover, from multiple adjacent weak spacings all but the largest one collapse",
      },
    ],
  },
  footnote: { content: true },
}

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
    if (FUNCTIONS[name]?.content) {
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
    if (serializedNode.name && FUNCTIONS[serializedNode.name]?.content) {
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

  setName(name: string) {
    const self = this.getWritable()
    self.__name = name
    return self
  }

  setPositionParameters(positionParameters: TyXValue[]) {
    const self = this.getWritable()
    self.__positionParameters = positionParameters
    return self
  }

  setNamedParameters(namedParameters: Record<string, TyXValue>) {
    const self = this.getWritable()
    self.__namedParameters = namedParameters
    return self
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
