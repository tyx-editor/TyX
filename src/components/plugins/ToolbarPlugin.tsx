import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $findTableNode } from "@lexical/table"
import { mergeRegister } from "@lexical/utils"
import { ActionIcon, Loader, Menu, Tooltip } from "@mantine/core"
import { modals } from "@mantine/modals"
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconAlpha,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconClearFormatting,
  IconCode,
  IconCodeAsterisk,
  IconColumnInsertRight,
  IconColumnRemove,
  IconDeviceFloppy,
  IconEye,
  IconFileCode,
  IconIndentDecrease,
  IconIndentIncrease,
  IconItalic,
  IconLineDotted,
  IconList,
  IconListNumbers,
  IconMatrix,
  IconPhoto,
  IconRowInsertBottom,
  IconRowRemove,
  IconSettings,
  IconStrikethrough,
  IconSubscript,
  IconSum,
  IconSuperscript,
  IconTablePlus,
  IconUnderline,
} from "@tabler/icons-react"
import {
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  ElementFormatType,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import React, { useCallback, useEffect, useState } from "react"
import { onPreview, onSave, save } from "../../backend"
import { executeCommand, parseCommandSequence } from "../../commands"
import tyx2typst from "../../compilers/tyx2typst"
import { TyXDocument } from "../../models"
import {
  $findTopLevelElement,
  clearFormatting,
  formatCode,
  formatQuote,
  getSelectedNode,
} from "../../resources/playground"
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

const ToolbarControl = React.forwardRef<
  HTMLDivElement,
  {
    label: string
    children?: React.ReactNode
    command?: string
    active?: boolean
    disabled?: boolean
    loading?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
  }
>(({ label, children, command, active, disabled, loading, onClick }, ref) => {
  if (command) {
    onClick ??= () => parseCommandSequence(command).forEach(executeCommand)
  }

  return (
    <Tooltip label={label} ref={ref}>
      <ActionIcon
        className="toolbar-control"
        size="md"
        variant={active ? undefined : "default"}
        disabled={disabled || !onClick || loading}
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()}
      >
        {loading ? <Loader size="xs" /> : children}
      </ActionIcon>
    </Tooltip>
  )
})

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
        <IconDeviceFloppy />
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
        <IconFileCode />
      </ToolbarControl>
      <ToolbarControl
        label="Preview PDF"
        loading={loadingPreview}
        onClick={preview}
      >
        <IconEye />
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
        <IconSettings />
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
        <IconBold />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isItalic}
        label="Toggle italic"
        command="formatText italic"
      >
        <IconItalic />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isUnderline}
        label="Toggle underline"
        command="formatText underline"
      >
        <IconUnderline />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isStrikethrough}
        label="Toggle strikethrough"
        command="formatText strikethrough"
      >
        <IconStrikethrough />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isSubscript}
        label="Toggle subscript"
        command="formatText subscript"
      >
        <IconSubscript />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isSuperscript}
        label="Toggle superscript"
        command="formatText superscript"
      >
        <IconSuperscript />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.isCode}
        label="Toggle code"
        command="formatText code"
      >
        <IconCode />
      </ToolbarControl>
      <ToolbarControl
        label="Clear formatting"
        onClick={() => clearFormatting(editor)}
      >
        <IconClearFormatting />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const InsertControls = () => {
  const [editor] = useLexicalComposerContext()

  return (
    <ToolbarControlGroup>
      <ToolbarControl label="Insert image">
        <IconPhoto />
      </ToolbarControl>
      <ToolbarControl label="Insert Typst code">
        <IconCodeAsterisk />
      </ToolbarControl>
      <ToolbarControl label="Insert math" command="insertMathInline">
        <IconSum />
      </ToolbarControl>
      <ToolbarControl
        label="Insert quote"
        onClick={() => formatQuote(editor, "")}
      >
        <IconBlockquote />
      </ToolbarControl>
      <ToolbarControl
        label="Insert horizontal line"
        command="insertHorizontalLine"
      >
        <IconLineDotted />
      </ToolbarControl>
      <ToolbarControl
        label="Insert unordered list"
        command="insertUnorderedList"
      >
        <IconList />
      </ToolbarControl>
      <ToolbarControl label="Insert ordered list" command="insertOrderedList">
        <IconListNumbers />
      </ToolbarControl>
      <ToolbarControl
        label="Insert code block"
        onClick={() => formatCode(editor, "")}
      >
        <IconCode />
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
            : parent?.getFormatType() || "",
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
        <IconAlignLeft />
      </ToolbarControl>
      <ToolbarControl
        label="Align center"
        command="formatElement center"
        active={alignment === "center"}
      >
        <IconAlignCenter />
      </ToolbarControl>
      <ToolbarControl
        label="Align right"
        command="formatElement right"
        active={alignment === "right"}
      >
        <IconAlignRight />
      </ToolbarControl>
      <ToolbarControl
        label="Justify text"
        command="formatElement justify"
        active={alignment === "justify"}
      >
        <IconAlignJustified />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const IndentationControls = () => {
  return (
    <ToolbarControlGroup>
      <ToolbarControl label="Indent" command="indent">
        <IconIndentIncrease />
      </ToolbarControl>
      <ToolbarControl label="Outdent" command="outdent">
        <IconIndentDecrease />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const TableControls = () => {
  const [editor] = useLexicalComposerContext()
  const [isTable, setIsTable] = useState(false)

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          setIsTable($findTableNode(selection.anchor.getNode()) !== null)
        } else {
          setIsTable(false)
        }
        return false
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return (
    <ToolbarControlGroup>
      <ToolbarControl
        label="Insert table"
        command='insertTable {"rows": 3, "columns": 3}'
      >
        <IconTablePlus />
      </ToolbarControl>
      {isTable && (
        <>
          <ToolbarControl
            label="Insert row below"
            command="tableInsertRowBelow"
          >
            <IconRowInsertBottom />
          </ToolbarControl>
          <ToolbarControl
            label="Insert column to the right"
            command="tableInsertColumnRight"
          >
            <IconColumnInsertRight />
          </ToolbarControl>
          <ToolbarControl label="Remove row" command="tableRemoveRow">
            <IconRowRemove />
          </ToolbarControl>
          <ToolbarControl label="Remove column" command="tableRemoveColumn">
            <IconColumnRemove />
          </ToolbarControl>
        </>
      )}
    </ToolbarControlGroup>
  )
}

const MathControls = () => {
  const [editor] = useLexicalComposerContext()
  const [isMath, setIsMath] = useState(false)

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setIsMath(window.currentMathEditor !== undefined)
    })
  }, [editor])

  if (!isMath) {
    return null
  }

  return (
    <ToolbarControlGroup>
      <ToolbarControl
        label="Insert matrix"
        command='math insert "\\begin{pmatrix} #0 & #? \\\\ #? & #? \\end{pmatrix}"'
      >
        <IconMatrix />
      </ToolbarControl>
      <ToolbarControl label="Insert row below" command="math addRowAfter">
        <IconRowInsertBottom />
      </ToolbarControl>
      <ToolbarControl
        label="Insert column to the right"
        command="math addColumnAfter"
      >
        <IconColumnInsertRight />
      </ToolbarControl>
      <ToolbarControl label="Remove row" command="math removeRow">
        <IconRowRemove />
      </ToolbarControl>
      <ToolbarControl label="Remove column" command="math removeColumn">
        <IconColumnRemove />
      </ToolbarControl>
      <Menu trapFocus={false}>
        <Menu.Target>
          <ToolbarControl label="Insert Greek letters">
            <IconAlpha />
          </ToolbarControl>
        </Menu.Target>
        <Menu.Dropdown>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 4,
              padding: 4,
            }}
          >
            {[
              ["alpha", "α"],
              ["beta", "β"],
              ["gamma", "γ"],
              ["delta", "δ"],
              ["varepsilon", "ε"],
              ["zeta", "ζ"],
              ["eta", "η"],
              ["vartheta", "θ"],
              ["iota", "ι"],
              ["kappa", "κ"],
              ["lambda", "λ"],
              ["mu", "μ"],
              ["nu", "ν"],
              ["xi", "ξ"],
              ["omicron", "ο"],
              ["pi", "π"],
              ["rho", "ρ"],
              ["sigma", "σ"],
              ["tau", "τ"],
              ["upsilon", "υ"],
              ["varphi", "φ"],
              ["chi", "χ"],
              ["psi", "ψ"],
              ["omega", "ω"],
            ].map(([characterName, character], index) => (
              <ToolbarControl
                label={`Insert ${characterName}`}
                command={`math insert \\${characterName}`}
                key={index}
              >
                {character}
              </ToolbarControl>
            ))}
          </div>
        </Menu.Dropdown>
      </Menu>
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
        <IconArrowBackUp />
      </ToolbarControl>
      <ToolbarControl label="Redo" command="redo" disabled={!canRedo}>
        <IconArrowForwardUp />
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
      <IndentationControls />
      <TableControls />
      <MathControls />
      <UndoRedoControls />
    </div>
  )
}

export default ToolbarPlugin
