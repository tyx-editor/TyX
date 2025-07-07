import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import {
  $applyNodeReplacement,
  $createNodeSelection,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  DecoratorNode,
  LexicalCommand,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import { MathfieldElement } from "mathlive"
import { ReactNode, useEffect, useRef, useState } from "react"
import { DEFAULT_MATH_INLINE_SHORTCUTS, getSettings } from "../../settings"

declare module "mathlive" {
  interface MathfieldElement {
    isRegistered?: boolean
  }
}

export const INSERT_MATH_INLINE_COMMAND: LexicalCommand<void> = createCommand()

export type SerializedMathNode = Spread<
  {
    inline?: boolean
    formula?: string
    asciimath?: string
  },
  SerializedLexicalNode
>

export class MathNode extends DecoratorNode<ReactNode> {
  __inline: boolean
  __formula: string
  __asciimath: string

  static getType(): string {
    return "math-inline"
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(
      node.__formula,
      node.__asciimath,
      node.__inline,
      node.__key,
    )
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
    if (typeof serializedNode.asciimath === "string") {
      self.setAsciimath(serializedNode.asciimath)
    }
    return self
  }

  exportJSON(): SerializedMathNode {
    const serializedNode: SerializedMathNode = super.exportJSON()
    serializedNode.inline = this.getLatest().__inline
    serializedNode.formula = this.getLatest().__formula
    serializedNode.asciimath = this.getLatest().__asciimath
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

  setAsciimath(asciimath: string) {
    const self = this.getWritable()
    self.__asciimath = asciimath
    return self
  }

  constructor(
    formula: string = "",
    asciimath: string = "",
    inline: boolean = true,
    key?: NodeKey,
  ) {
    super(key)
    this.__formula = formula
    this.__asciimath = asciimath
    this.__inline = inline
  }

  isInline() {
    return this.__inline
  }

  createDOM(): HTMLElement {
    if (this.__inline) {
      const span = document.createElement("span")
      span.classList.add("math-inline")
      return span
    } else {
      const div = document.createElement("div")
      div.classList.add("math-block")
      return div
    }
  }

  updateDOM(): false {
    return false
  }

  decorate(): ReactNode {
    return (
      <MathEditor
        formula={this.__formula}
        nodeKey={this.getKey()}
        inline={this.__inline}
      />
    )
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

export const MathEditor = ({
  formula: initialFormula,
  nodeKey,
  inline,
}: {
  formula: string
  nodeKey: string
  inline?: boolean
}) => {
  const [editor] = useLexicalComposerContext()
  const [formula, setFormula] = useState("")
  const [isSelected] = useLexicalNodeSelection(nodeKey)
  const mathfieldRef = useRef<MathfieldElement>(null)

  const updateCurrentMathEditor = () => {
    const mf = mathfieldRef.current
    if (mf && mf.hasFocus() && window.currentMathEditor !== mf) {
      window.currentMathEditor = mf
      window.dispatchEvent(new Event("mathEditorChanged"))
    } else if (mf && !mf.hasFocus() && window.currentMathEditor === mf) {
      delete window.currentMathEditor
      window.dispatchEvent(new Event("mathEditorChanged"))
    }
  }

  const updateValue = (formula: string, asciimath: string) => {
    setFormula(formula)
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isMathNode(node)) {
        node.setFormula(formula)
        node.setAsciimath(asciimath)
      }
    })
  }

  useEffect(() => {
    setFormula(initialFormula)
  }, [initialFormula])

  useEffect(() => {
    const mf = mathfieldRef.current
    if (mf) {
      mf.defaultMode = inline ? "inline-math" : "math"
      mf.mathVirtualKeyboardPolicy = "manual"

      if (mf.isConnected && !mf.isRegistered) {
        mf.isRegistered = true

        mf.addEventListener("focus", updateCurrentMathEditor)
        mf.addEventListener("blur", updateCurrentMathEditor)

        mf.inlineShortcuts = Object.fromEntries(
          getSettings().mathInlineShortcuts ?? DEFAULT_MATH_INLINE_SHORTCUTS,
        )

        mf.addEventListener("input", (e) => {
          const target = e.target as MathfieldElement
          updateValue(target.getValue(), target.getValue("ascii-math"))
        })

        mf.addEventListener("move-out", (e) => {
          let isForward =
            !e?.detail?.direction ||
            e.detail.direction === "forward" ||
            e.detail.direction === "downward"

          let element: HTMLElement | null = mf
          while (element && !element.dir) {
            element = element.parentElement
          }
          const dir = element?.dir ?? "ltr"

          if (dir === "rtl") {
            isForward = !isForward
          }

          mf.blur()
          editor.update(() => {
            const node = $getNodeByKey(nodeKey)
            if (node) {
              $setSelection(isForward ? node.selectEnd() : node.selectStart())
            }
          })
        })

        mf.addEventListener("keydown", (e) => {
          if (e.key === " ") {
            e.preventDefault()
            const position = mf.position
            mf.executeCommand("moveAfterParent")
            if (mf.position === position) {
              mf.blur()
              editor.update(() => {
                const node = $getNodeByKey(nodeKey)
                if (node) {
                  $setSelection(node.selectEnd())
                }
              })
            }
          }
          e.stopImmediatePropagation()
        })

        //     if (isForward) {
        //       moveForward(props)
        //     } else {
        //       position === 0
        //         ? props.editor
        //             .chain()
        //             .insertContentAt(position, {
        //               type: "paragraph",
        //             })
        //             .setTextSelection(position)
        //             .focus()
        //             .run()
        //         : props.editor
        //             .chain()
        //             .setTextSelection(
        //               props.node.type.name === "mathBlock"
        //                 ? position - 1
        //                 : position,
        //             )
        //             .focus()
        //             .run()
        //     }
        //   })

        mf.addEventListener("beforeinput", (e: InputEvent) => {
          const target = e.target as MathfieldElement
          if (!target.value && e.inputType === "deleteContentBackward") {
            e.preventDefault()
            e.stopImmediatePropagation()
            editor.update(() => {
              const node = $getNodeByKey(nodeKey)
              node?.remove()
            })
          }
        })

        mf.menuItems = []
      }
    }
  }, [mathfieldRef])

  useEffect(() => {
    if (isSelected) {
      editor.read(() => {
        const selection = $getSelection()
        if (selection?.getNodes().length === 1) {
          mathfieldRef.current?.focus()
        }
      })
    }
  }, [mathfieldRef, isSelected])

  return <math-field ref={mathfieldRef}>{formula}</math-field>
}

const MathPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_MATH_INLINE_COMMAND,
      () => {
        const node = $createMathNode()
        $insertNodes([node])

        const selection = $createNodeSelection()
        selection.add(node.getKey())
        $setSelection(selection)

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return <></>
}

export default MathPlugin
