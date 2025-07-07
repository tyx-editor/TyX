import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text"
import { $isAtNodeEnd, $setBlocksType } from "@lexical/selection"
import { $isTableSelection } from "@lexical/table"
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  mergeRegister,
} from "@lexical/utils"
import { ActionIcon, Loader, Tooltip } from "@mantine/core"
import { modals } from "@mantine/modals"
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
  IconDeviceFloppy,
  IconEye,
  IconFileCode,
  IconItalic,
  IconLineDotted,
  IconList,
  IconListNumbers,
  IconSettings,
  IconStrikethrough,
  IconSubscript,
  IconSum,
  IconSuperscript,
  IconUnderline,
} from "@tabler/icons-react"
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  ElementFormatType,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  TextNode,
} from "lexical"
import React, { useCallback, useEffect, useState } from "react"
import { onPreview, onSave, save } from "../../backend"
import { executeCommand, parseCommandSequence } from "../../commands"
import tyx2typst from "../../compilers/tyx2typst"
import { TyXDocument } from "../../models"
import { showSuccessMessage } from "../../utilities"
import { useLocalStorage } from "../../utilities/hooks"
import DocumentSettingsModal from "../DocumentSettingsModal"

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

const getSelectedNode = (selection: RangeSelection): TextNode | ElementNode => {
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

const $findTopLevelElement = (node: LexicalNode) => {
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

const ToolbarControl = ({
  label,
  children,
  command,
  active,
  disabled,
  loading,
  onClick,
}: {
  label: string
  children?: React.ReactNode
  command?: string
  active?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) => {
  if (command) {
    onClick ??= () => parseCommandSequence(command).forEach(executeCommand)
  }

  return (
    <Tooltip label={label}>
      <ActionIcon
        size="md"
        variant={active ? undefined : "default"}
        disabled={disabled || !onClick || loading}
        onClick={onClick}
      >
        {loading ? <Loader size="xs" /> : children}
      </ActionIcon>
    </Tooltip>
  )
}

const ToolbarControlGroup = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ActionIcon.Group display="inline-block" mr={10} mb={10}>
      {children}
    </ActionIcon.Group>
  )
}

const ManagementControls = () => {
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [openDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
    silent: true,
  })
  const [currentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
    silent: true,
  })

  const doc = openDocuments[currentDocument]
  const basename = (doc.filename ?? "Untitled")
    .split("/")
    .pop()!
    .split("\\")
    .pop()

  const preview = () => {
    setLoadingPreview(true)
    onPreview()
      .then(() => setLoadingPreview(false))
      .catch(() => setLoadingPreview(false))
  }

  return (
    <ToolbarControlGroup>
      <ToolbarControl label="Save" onClick={onSave}>
        <IconDeviceFloppy stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Export to Typst"
        onClick={() => {
          const filename = (doc.filename ?? "Untitled.tyx").replace(
            ".tyx",
            ".typ",
          )
          save(filename, tyx2typst(doc)).then(() =>
            showSuccessMessage(`Document exported to ${filename}.`),
          )
        }}
      >
        <IconFileCode stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Preview PDF"
        loading={loadingPreview}
        onClick={preview}
      >
        <IconEye stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Document settings"
        onClick={() =>
          modals.open({
            title: `Document Settings (${basename})`,
            children: <DocumentSettingsModal />,
          })
        }
      >
        <IconSettings stroke={1.5} />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const FormatControls = () => {
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
    <ToolbarControlGroup>
      <ToolbarControl
        active={toolbarState.isBold}
        label="Toggle bold"
        command="formatText bold"
      >
        <IconBold stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isItalic}
        label="Toggle italic"
        command="formatText italic"
      >
        <IconItalic stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isUnderline}
        label="Toggle underline"
        command="formatText underline"
      >
        <IconUnderline stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isStrikethrough}
        label="Toggle strikethrough"
        command="formatText strikethrough"
      >
        <IconStrikethrough stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isSubscript}
        label="Toggle subscript"
        command="formatText subscript"
      >
        <IconSubscript stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isSuperscript}
        label="Toggle superscript"
        command="formatText superscript"
      >
        <IconSuperscript stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isCode}
        label="Toggle code"
        command="formatText code"
      >
        <IconCode stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Clear formatting"
        onClick={() => clearFormatting(editor)}
      >
        <IconClearFormatting stroke={1.5} />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const InsertControls = () => {
  const [editor] = useLexicalComposerContext()

  return (
    <ToolbarControlGroup>
      <ToolbarControl label="Insert math" command="insertMathInline">
        <IconSum stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Insert quote"
        onClick={() => formatQuote(editor, "")}
      >
        <IconBlockquote stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl label="Insert horizontal line">
        <IconLineDotted stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Insert unordered list"
        command="insertUnorderedList"
      >
        <IconList stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl label="Insert ordered list" command="insertOrderedList">
        <IconListNumbers stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl label="Insert code block">
        <IconCode stroke={1.5} />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const AlignmentControls = () => {
  const [editor] = useLexicalComposerContext()
  const [alignment, setAlignment] = useState<ElementFormatType>("")

  const $updateAlignment = useCallback(() => {
    editor.read(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection)
        const parent = node.getParent()

        setAlignment(
          $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || "left",
        )
      }

      if ($isNodeSelection(selection)) {
        for (const node of selection.getNodes()) {
          const selectedElement = $findTopLevelElement(node)
          if ($isElementNode(selectedElement)) {
            setAlignment(selectedElement.getFormatType())
          }
        }
      }
    })
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateAlignment()
          return false
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerUpdateListener($updateAlignment),
    )
  }, [editor])

  return (
    <ToolbarControlGroup>
      <ToolbarControl
        label="Align left"
        command="formatElement left"
        active={alignment === "left"}
      >
        <IconAlignLeft stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Align center"
        command="formatElement center"
        active={alignment === "center"}
      >
        <IconAlignCenter stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Align right"
        command="formatElement right"
        active={alignment === "right"}
      >
        <IconAlignRight stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl
        label="Justify text"
        command="formatElement justify"
        active={alignment === "justify"}
      >
        <IconAlignJustified stroke={1.5} />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const UndoRedoControls = () => {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (canUndo) => {
          setCanUndo(canUndo)
          return false
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (canRedo) => {
          setCanRedo(canRedo)
          return false
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  return (
    <ToolbarControlGroup>
      <ToolbarControl label="Undo" command="undo" disabled={!canUndo}>
        <IconArrowBackUp stroke={1.5} />
      </ToolbarControl>
      <ToolbarControl label="Redo" command="redo" disabled={!canRedo}>
        <IconArrowForwardUp stroke={1.5} />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const ToolbarPlugin = () => {
  return (
    <div
      style={{
        flex: "none",
        padding: 10,
        paddingBottom: 0,
        borderBottom: "1px solid var(--tab-border-color)",
      }}
    >
      <ManagementControls />
      <FormatControls />
      <InsertControls />
      <AlignmentControls />
      <UndoRedoControls />
    </div>
  )
}

export default ToolbarPlugin
