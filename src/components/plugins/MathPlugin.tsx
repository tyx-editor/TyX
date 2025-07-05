import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DecoratorNode,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import { MathfieldElement } from "mathlive"
import { ReactNode, useEffect, useRef, useState } from "react"
import { DEFAULT_MATH_INLINE_SHORTCUTS, getSettings } from "../../settings"
import { $createPageBreakNode } from "./PageBreakPlugin"

export const INSERT_MATH_INLINE_COMMAND: LexicalCommand<void> = createCommand()

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
    const span = document.createElement("span")
    span.classList.add(this.__inline ? "math-inline" : "math-block")
    span.style.display = "contents"
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(): ReactNode {
    return (
      <PageBreakComponent
        // formula={this.__formula}
        nodeKey={this.getKey()}
        // inline={this.__inline}
      />
    )
  }
}

export function $createInlineMathNode(contents: string = ""): MathNode {
  return $applyNodeReplacement(new MathNode(contents))
}

export function $isInlineMathNode(
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
      if ($isInlineMathNode(node)) {
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

      if (mf.isConnected) {
        mf.addEventListener("focus", updateCurrentMathEditor)
        mf.addEventListener("blur", updateCurrentMathEditor)
        mf.addEventListener("keypress", (e) => e.stopPropagation())

        mf.inlineShortcuts = Object.fromEntries(
          getSettings().mathInlineShortcuts ?? DEFAULT_MATH_INLINE_SHORTCUTS,
        )

        //   mf.addEventListener("keydown", (e) => {
        //     if (e.key === " ") {
        //       e.preventDefault()
        //       const position = mf.position
        //       mf.executeCommand("moveAfterParent")
        //       if (mf.position === position) {
        //         moveForward(props)
        //       }
        //     }
        //   })

        let element: HTMLElement | null = mf
        while (element && !element.dir) {
          element = element.parentElement
        }
        const dir = element?.dir ?? "ltr"

        mf.addEventListener("input", (e) => {
          const target = e.target as MathfieldElement
          updateValue(target.getValue(), target.getValue("ascii-math"))
        })

        //   mf.addEventListener("move-out", (e) => {
        //     const position = props.getPos()
        //     let isForward =
        //       !e?.detail?.direction ||
        //       e.detail.direction === "forward" ||
        //       e.detail.direction === "downward"
        //     if (dir === "rtl") {
        //       isForward = !isForward
        //     }

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

        //   mf.addEventListener("beforeinput", (e: any) => {
        //     if (!e.target.value && e.inputType === "deleteContentBackward") {
        //       props.editor.chain().deleteSelection().run()
        //     }
        //   })

        mf.menuItems = []
      }
    }
  }, [mathfieldRef, mathfieldRef.current?.isConnected])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        // mathfieldRef.current?.focus()
        return false
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        console.log(selection, nodeKey)
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor
          const focus = selection.focus
          if (anchor.key === nodeKey || focus.key === nodeKey) {
            console.log("Hi!")
          }
        }
      })
    })
  }, [editor])

  useEffect(() => {
    console.log("Is selected", isSelected)
  }, [isSelected])

  return <math-field ref={mathfieldRef}>{formula}</math-field>
}

const MathPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_MATH_INLINE_COMMAND,
      () => {
        $insertNodes([$createPageBreakNode()])
        // $insertNodes([$createInlineMathNode()])
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return <></>
}

export default MathPlugin

function PageBreakComponent({ nodeKey }: { nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  useEffect(() => {
    return editor.registerCommand(
      CLICK_COMMAND,
      (event: MouseEvent) => {
        const pbElem = editor.getElementByKey(nodeKey)

        if (event.target === pbElem) {
          if (!event.shiftKey) {
            clearSelection()
          }
          setSelected(!isSelected)
          return true
        }

        return false
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [clearSelection, editor, isSelected, nodeKey, setSelected])

  useEffect(() => {
    const pbElem = editor.getElementByKey(nodeKey)
    if (pbElem !== null) {
      pbElem.className = isSelected ? "selected" : ""
    }
    console.log("Is selected", isSelected)
  }, [editor, isSelected, nodeKey])

  return null
}
