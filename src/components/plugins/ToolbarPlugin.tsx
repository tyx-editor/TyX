import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $isTableSelection } from "@lexical/table"
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils"
import { ActionIcon } from "@mantine/core"
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconClearFormatting,
  IconCode,
  IconItalic,
  IconLineDotted,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconSubscript,
  IconSum,
  IconSuperscript,
  IconUnderline,
} from "@tabler/icons-react"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_CRITICAL,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import { useCallback, useEffect, useState } from "react"
import { executeCommand } from "../../commands"

interface ToolbarState {
  isBold?: boolean
  isItalic?: boolean
  isUnderline?: boolean
  isStrikethrough?: boolean
  isSubscript?: boolean
  isSuperscript?: boolean
  isCode?: boolean
}
type ToolbarStateKey = keyof ToolbarState
type ToolbarStateValue<Key extends keyof ToolbarState> = ToolbarState[Key]

const clearFormatting = (editor: LexicalEditor) => {
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

const formatQuote = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== "quote") {
    editor.update(() => {
      const selection = $getSelection()
      $setBlocksType(selection, () => $createQuoteNode())
    })
  }
}

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [toolbarState, setToolbarState] = useState<ToolbarState>({})

  const updateToolbarState = useCallback(
    <Key extends ToolbarStateKey>(key: Key, value: ToolbarStateValue<Key>) => {
      setToolbarState((state) => ({ ...state, [key]: value }))
    },
    [],
  )

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      updateToolbarState("isBold", selection.hasFormat("bold"))
      updateToolbarState("isItalic", selection.hasFormat("italic"))
      updateToolbarState("isUnderline", selection.hasFormat("underline"))
      updateToolbarState(
        "isStrikethrough",
        selection.hasFormat("strikethrough"),
      )
      updateToolbarState("isSubscript", selection.hasFormat("subscript"))
      updateToolbarState("isSuperscript", selection.hasFormat("superscript"))
      updateToolbarState("isCode", selection.hasFormat("code"))
    }
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor, $updateToolbar])

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateToolbar()
    })

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar()
      })
    })
  }, [editor])

  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >
      <ActionIcon.Group display="inline-block" mr={10} mb={10}>
        <ActionIcon
          variant={toolbarState.isBold ? undefined : "default"}
          title="Toggle bold"
          aria-label="Toggle bold"
          onClick={() => executeCommand(["formatText", "bold"])}
        >
          <IconBold stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant={toolbarState.isItalic ? undefined : "default"}
          title="Toggle italic"
          aria-label="Toggle italic"
          onClick={() => executeCommand(["formatText", "italic"])}
        >
          <IconItalic stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant={toolbarState.isUnderline ? undefined : "default"}
          title="Toggle underline"
          aria-label="Toggle underline"
          onClick={() => executeCommand(["formatText", "underline"])}
        >
          <IconUnderline stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant={toolbarState.isStrikethrough ? undefined : "default"}
          title="Toggle strikethrough"
          aria-label="Toggle strikethrough"
          onClick={() => executeCommand(["formatText", "strikethrough"])}
        >
          <IconStrikethrough stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant={toolbarState.isSubscript ? undefined : "default"}
          title="Toggle subscript"
          aria-label="Toggle subscript"
          onClick={() => executeCommand(["formatText", "subscript"])}
        >
          <IconSubscript stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant={toolbarState.isSuperscript ? undefined : "default"}
          title="Toggle superscript"
          aria-label="Toggle superscript"
          onClick={() => executeCommand(["formatText", "superscript"])}
        >
          <IconSuperscript stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant={toolbarState.isCode ? undefined : "default"}
          title="Toggle code"
          aria-label="Toggle code"
          onClick={() => executeCommand(["formatText", "code"])}
        >
          <IconCode stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Clear formatting"
          aria-label="Clear formatting"
          onClick={() => clearFormatting(editor)}
        >
          <IconClearFormatting stroke={1.5} />
        </ActionIcon>
      </ActionIcon.Group>
      <ActionIcon.Group display="inline-block" mr={10} mb={10}>
        <ActionIcon
          size="md"
          variant="default"
          title="Insert math"
          aria-label="Insert math"
          onClick={() => executeCommand(["insertMathInline"])}
        >
          <IconSum stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Insert quote"
          aria-label="Insert quote"
          onClick={() => formatQuote(editor, "")}
        >
          <IconBlockquote stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Insert horizontal line"
          aria-label="Insert horizontal line"
          onClick={() => executeCommand(["insertMathInline"])}
        >
          <IconLineDotted stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Insert unordered list"
          aria-label="Insert unordered list"
          onClick={() => executeCommand(["insertUnorderedList"])}
        >
          <IconList stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Insert ordered list"
          aria-label="Insert ordered list"
          onClick={() => executeCommand(["insertOrderedList"])}
        >
          <IconListNumbers stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Insert code block"
          aria-label="Insert code block"
          onClick={() => executeCommand(["insertMathInline"])}
        >
          <IconCode stroke={1.5} />
        </ActionIcon>
      </ActionIcon.Group>
      <ActionIcon.Group display="inline-block" mr={10} mb={10}>
        <ActionIcon
          size="md"
          variant="default"
          title="Align left"
          aria-label="Align left"
          onClick={() => executeCommand(["formatElement", "left"])}
        >
          <IconAlignLeft stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Align center"
          aria-label="Align center"
          onClick={() => executeCommand(["formatElement", "center"])}
        >
          <IconAlignCenter stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Align right"
          aria-label="Align right"
          onClick={() => executeCommand(["formatElement", "right"])}
        >
          <IconAlignRight stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Justify text"
          aria-label="Justify text"
          onClick={() => executeCommand(["formatElement", "justify"])}
        >
          <IconAlignJustified stroke={1.5} />
        </ActionIcon>
      </ActionIcon.Group>
      <ActionIcon.Group display="inline-block" mr={10} mb={10}>
        <ActionIcon
          size="md"
          variant="default"
          title="Undo"
          aria-label="Undo"
          onClick={() => executeCommand(["undo"])}
        >
          <IconArrowBackUp stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          size="md"
          variant="default"
          title="Redo"
          aria-label="Redo"
          onClick={() => executeCommand(["redo"])}
        >
          <IconArrowForwardUp stroke={1.5} />
        </ActionIcon>
      </ActionIcon.Group>
    </div>
  )
}

export default ToolbarPlugin
