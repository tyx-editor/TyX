// Utilities from Lexical Playground.
import { $createCodeNode, $isCodeNode } from "@lexical/code"
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text"
import { $isAtNodeEnd, $setBlocksType } from "@lexical/selection"
import { $isTableSelection } from "@lexical/table"
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
} from "@lexical/utils"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  $isRootOrShadowRoot,
  $isTextNode,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  TextNode,
} from "lexical"

export const clearFormatting = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const anchor = selection.anchor
      const focus = selection.focus
      const nodes = selection.getNodes()
      const extractedNodes = selection.extract()

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return
      }

      nodes.forEach((node, idx) => {
        // We split the first and last node by the selection
        // So that we don't format unselected text inside those nodes
        if ($isTextNode(node)) {
          // Use a separate variable to ensure TS does not lose the refinement
          let textNode = node
          if (idx === 0 && anchor.offset !== 0) {
            textNode = textNode.splitText(anchor.offset)[1] || textNode
          }
          if (idx === nodes.length - 1) {
            textNode = textNode.splitText(focus.offset)[0] || textNode
          }
          /**
           * If the selected text has one format applied
           * selecting a portion of the text, could
           * clear the format to the wrong portion of the text.
           *
           * The cleared text is based on the length of the selected text.
           */
          // We need this in case the selected text only has one format
          const extractedTextNode = extractedNodes[0]
          if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
            textNode = extractedTextNode
          }

          if (textNode.__style !== "") {
            textNode.setStyle("")
          }
          if (textNode.__format !== 0) {
            textNode.setFormat(0)
          }
          const nearestBlockElement =
            $getNearestBlockElementAncestorOrThrow(textNode)
          if (nearestBlockElement.__format !== 0) {
            nearestBlockElement.setFormat("")
          }
          if (nearestBlockElement.__indent !== 0) {
            nearestBlockElement.setIndent(0)
          }
          node = textNode
        } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
          node.replace($createParagraphNode(), true)
        }
      })
    }
  })
}

export const formatHeading = (
  editor: LexicalEditor,
  blockType: string,
  headingSize: HeadingTagType,
) => {
  if (blockType !== headingSize) {
    editor.update(() => {
      const selection = $getSelection()
      $setBlocksType(selection, () => $createHeadingNode(headingSize))
    })
  }
}

export const formatCode = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== "code") {
    editor.update(() => {
      let selection = $getSelection()
      if (!selection) {
        return
      }
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        $setBlocksType(selection, () => $createCodeNode())
      } else {
        const textContent = selection.getTextContent()
        const codeNode = $createCodeNode()
        selection.insertNodes([codeNode])
        selection = $getSelection()
        if ($isRangeSelection(selection)) {
          selection.insertRawText(textContent)
        }
      }
    })
  }
}

export const formatQuote = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== "quote") {
    editor.update(() => {
      const selection = $getSelection()
      $setBlocksType(selection, () => $createQuoteNode())
    })
  }
}

export const getSelectedNode = (
  selection: RangeSelection,
): TextNode | ElementNode => {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode
  }
}

export const $findTopLevelElement = (node: LexicalNode) => {
  let topLevelElement =
    node.getKey() === "root"
      ? node
      : $findMatchingParent(node, (e) => {
          const parent = e.getParent()
          return parent !== null && $isRootOrShadowRoot(parent)
        })

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow()
  }
  return topLevelElement
}

export const $isParentElementRTL = (selection: RangeSelection): boolean => {
  const anchorNode = selection.anchor.getNode()
  const parent = $isRootNode(anchorNode)
    ? anchorNode
    : anchorNode.getParentOrThrow()

  return parent.getDirection() === "rtl"
}

export const CAN_USE_DOM: boolean =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined"
export const IS_APPLE: boolean =
  CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
export const CONTROL_OR_META = { ctrlKey: !IS_APPLE, metaKey: IS_APPLE }
export const CONTROL_OR_ALT = { altKey: IS_APPLE, ctrlKey: !IS_APPLE }

type ModifierMask = {
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}

export function matchModifier(
  event: KeyboardEvent,
  mask: ModifierMask,
  prop: keyof ModifierMask,
) {
  return (mask[prop] || false) == event[prop]
}

export const $getToolbarState = () => {
  const selection = $getSelection()
  if ($isRangeSelection(selection)) {
    const anchorNode = selection.anchor.getNode()
    const element = $findTopLevelElement(anchorNode)
    return {
      isBold: selection.hasFormat("bold"),
      isItalic: selection.hasFormat("italic"),
      isUnderline: selection.hasFormat("underline"),
      isStrikethrough: selection.hasFormat("strikethrough"),
      isSubscript: selection.hasFormat("subscript"),
      isSuperscript: selection.hasFormat("superscript"),
      isCode: selection.hasFormat("code"),
      blockType: $isHeadingNode(element) ? element.getTag() : element.getType(),
      codeLanguage: $isCodeNode(element)
        ? (element.getLanguage() ?? undefined)
        : undefined,
      elementKey: element.getKey(),
    }
  }

  return {}
}
