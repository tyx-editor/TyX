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
  SerializedEditorState,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import React from "react"
import { FUNCTIONS } from "../../functions"
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

export class FunctionCallNode extends DecoratorNode<React.ReactNode> {
  __name: string
  __positionParameters: TyXValue[]
  __namedParameters: Record<string, TyXValue>
  __inline: boolean
  __editors: Record<number, LexicalEditor>

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
    inline?: boolean,
    key?: NodeKey,
  ) {
    super(key)
    this.__name = name
    this.__positionParameters =
      positionParameters ??
      FUNCTIONS[name]?.positional?.map((description) => ({
        type: description.type,
      })) ??
      []
    this.__namedParameters =
      namedParameters ??
      Object.fromEntries(
        (FUNCTIONS[name]?.named ?? []).map((description) => [
          description.name,
          { type: description.type },
        ]),
      )
    this.__inline = inline ?? true
    this.__editors = {}
    this.__updateEditors()
  }

  __updateEditors() {
    const positional = FUNCTIONS[this.__name]?.positional ?? []
    for (let i = 0; i < positional.length; i++) {
      if (positional[i]?.type === "content") {
        const parameter: TyXValue | undefined = (this.__positionParameters ??
          [])[i]
        if (!this.__editors[i]) {
          this.__editors[i] = createEditor()
        }
        if (parameter?.type === "content" && parameter?.value !== undefined) {
          const state = this.__editors[i].parseEditorState({
            root: parameter.value,
          })
          if (!state.isEmpty()) {
            this.__editors[i].setEditorState(state)
          }
        }
      }
    }
  }

  setContentParameter(
    index: number,
    state: SerializedEditorState<SerializedLexicalNode>,
  ) {
    const self = this.getWritable()
    self.__positionParameters[index] = { type: "content", value: state.root }
    return self
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
    this.__updateEditors()

    return self
  }

  exportJSON(): SerializedFunctionCallNode {
    return {
      ...super.exportJSON(),
      name: this.__name,
      inline: this.__inline,
      positionParameters: this.__positionParameters,
      namedParameters: this.__namedParameters,
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
    return Object.keys(this.__editors).length !== 0
  }

  decorate(): React.ReactNode {
    return React.createElement(FunctionCallEditor, {
      nodeKey: this.getKey(),
      contents: this.__editors,
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
    new FunctionCallNode(name, positionParameters, namedParameters, inline),
  )
}

export function $isFunctionCallNode(
  node: LexicalNode | null | undefined,
): node is FunctionCallNode {
  return node instanceof FunctionCallNode
}
