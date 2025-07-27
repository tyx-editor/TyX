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
  SerializedEditorState,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import React from "react"
import { getFunctions } from "../../functions"
import { TyXRootNode, TyXValue } from "../../models"
import { FunctionCallEditor } from "./FunctionCallPlugin"

export const INSERT_FUNCTION_CALL_COMMAND: LexicalCommand<
  | string
  | [string, TyXValue[] | undefined, Record<string, TyXValue> | undefined]
> = createCommand()

export type SerializedFunctionCallNode = Spread<
  {
    name?: string
    inline?: boolean
    positionParameters?: TyXValue[]
    namedParameters?: Record<string, TyXValue>
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
    div.classList.add(this.__inline ? "inline" : "block")
    return div
  }

  updateDOM(prevNode: FunctionCallNode, div: HTMLElement): false {
    if (this.__inline !== prevNode.__inline) {
      div.classList.remove(this.__inline ? "block" : "inline")
      div.classList.add(this.__inline ? "inline" : "block")
    }
    return false
  }

  constructor(
    name: string = "",
    positionParameters?: TyXValue[],
    namedParameters?: Record<string, TyXValue>,
    key?: NodeKey,
  ) {
    const functions = getFunctions()
    const definition = functions[name]
    super(key)
    this.__name = name
    this.__positionParameters =
      positionParameters ??
      definition?.positional?.map(
        (description) =>
          ({
            type: description.type,
          }) as TyXValue,
      ) ??
      []
    this.__namedParameters =
      namedParameters ??
      Object.fromEntries(
        (definition?.named ?? []).map((description) => [
          description.name,
          { type: description.type } as TyXValue,
        ]),
      )
    this.__inline = definition?.inline ?? false
    this.__editors = {}
    this.__updateEditors()
  }

  __updateEditors() {
    const functions = getFunctions()
    const positional = functions[this.__name]?.positional ?? []
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
          } as SerializedEditorState)
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
    self.__positionParameters[index] = {
      type: "content",
      value: state.root as TyXRootNode,
    }
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
      self.__name = serializedNode.name
    }
    if (typeof serializedNode.inline === "boolean") {
      self.__inline = serializedNode.inline
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
): FunctionCallNode {
  return $applyNodeReplacement(
    new FunctionCallNode(name, positionParameters, namedParameters),
  )
}

export function $isFunctionCallNode(
  node: LexicalNode | null | undefined,
): node is FunctionCallNode {
  return node instanceof FunctionCallNode
}
