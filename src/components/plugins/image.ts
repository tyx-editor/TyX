import {
  $applyNodeReplacement,
  createCommand,
  DecoratorNode,
  LexicalCommand,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import React from "react"
import { ImageEditor } from "./ImagePlugin"

export const INSERT_IMAGE_COMMAND: LexicalCommand<string | undefined> =
  createCommand()

export type SerializedImageNode = Spread<
  {
    src: string
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string

  static getType(): string {
    return "image"
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key)
  }

  static importJSON(serializedNode: SerializedLexicalNode): ImageNode {
    return new ImageNode().updateFromJSON(serializedNode as SerializedImageNode)
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    const self = super.updateFromJSON(serializedNode)
    self.setSrc(serializedNode.src)
    return self
  }

  exportJSON(): SerializedImageNode {
    const serializedNode: SerializedImageNode = {
      ...super.exportJSON(),
      src: this.__src,
    }
    return serializedNode
  }

  setSrc(src: string) {
    const self = this.getWritable()
    self.__src = src
    return self
  }

  constructor(src: string = "", key?: NodeKey) {
    super(key)
    this.__src = src
  }

  createDOM(): HTMLElement {
    return document.createElement("span")
  }

  updateDOM(): false {
    return false
  }

  isInline(): true {
    return true
  }

  decorate(): React.ReactNode {
    return React.createElement(ImageEditor, {
      src: this.__src,
    })
  }
}

export function $createImageNode(src: string = ""): ImageNode {
  return $applyNodeReplacement(new ImageNode(src))
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode
}
