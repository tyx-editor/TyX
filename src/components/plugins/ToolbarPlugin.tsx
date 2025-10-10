import { $isCodeNode } from "@lexical/code"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isHeadingNode } from "@lexical/rich-text"
import { $findTableNode } from "@lexical/table"
import { mergeRegister } from "@lexical/utils"
import {
  ActionIcon,
  Loader,
  Menu,
  Popover,
  TextInput,
  Tooltip,
} from "@mantine/core"
import { useDebouncedCallback } from "@mantine/hooks"
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconAlpha,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconArrowsHorizontal,
  IconArrowsVertical,
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
  IconFunction,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconIndentDecrease,
  IconIndentIncrease,
  IconItalic,
  IconLineDotted,
  IconLink,
  IconList,
  IconListNumbers,
  IconMatrix,
  IconPhoto,
  IconQuote,
  IconRefreshDot,
  IconRefreshOff,
  IconRowInsertBottom,
  IconRowRemove,
  IconSettings,
  IconStrikethrough,
  IconSubscript,
  IconSum,
  IconSuperscript,
  IconTablePlus,
  IconUnderline,
  IconUnlink,
} from "@tabler/icons-react"
import {
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  BaseSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  ElementFormatType,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { insertImage, isWeb, onPreview, save } from "../../backend"
import { executeCommandSequence } from "../../commands"
import tyx2typst from "../../compilers/tyx2typst"
import { DEFAULT_SERVER_DEBOUNCE_MILLISECONDS, TyXDocument } from "../../models"
import {
  $findTopLevelElement,
  clearFormatting,
  formatCode,
  formatHeading,
  formatQuote,
  getSelectedNode,
} from "../../resources/playground"
import { getSettings } from "../../settings"
import {
  getEditorSelection,
  setEditorSelection,
  showSuccessMessage,
} from "../../utilities"
import { useLocalStorage } from "../../utilities/hooks"
import CommandActionIcon from "../CommandActionIcon"
import { OPEN_LINK_POPUP_COMMAND } from "./tyxCommands"

interface ToolbarState {
  isBold?: boolean
  isItalic?: boolean
  isUnderline?: boolean
  isStrikethrough?: boolean
  isSubscript?: boolean
  isSuperscript?: boolean
  isCode?: boolean
  blockType?: string
  codeLanguage?: string
  elementKey?: NodeKey
}
type ToolbarStateKey = keyof ToolbarState
type ToolbarStateValue<Key extends keyof ToolbarState> = ToolbarState[Key]
const ToolbarContext = React.createContext<ToolbarState>({})
const useToolbarState = () => useContext(ToolbarContext)

const ToolbarControl = React.forwardRef<
  HTMLDivElement,
  {
    label: string
    children?: React.ReactNode
    command?: string
    active?: boolean
    enabled?: boolean
    disabled?: boolean
    loading?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
  }
>(
  (
    { label, children, command, active, disabled, enabled, loading, onClick },
    ref,
  ) => {
    if (command) {
      return (
        <CommandActionIcon
          label={label}
          className="toolbar-control"
          size={30}
          variant={active ? undefined : "default"}
          disabled={!enabled && (disabled || loading)}
          // @ts-ignore
          onMouseDown={(e) => e.preventDefault()}
          command={command}
        >
          {loading ? <Loader size="xs" /> : children}
        </CommandActionIcon>
      )
    }

    return (
      <Tooltip label={label} ref={ref}>
        <ActionIcon
          className="toolbar-control"
          size={30}
          variant={active ? undefined : "default"}
          disabled={!enabled && (disabled || !onClick || loading)}
          onClick={onClick}
          onMouseDown={(e) => e.preventDefault()}
        >
          {loading ? <Loader size="xs" /> : children}
        </ActionIcon>
      </Tooltip>
    )
  },
)

const ToolbarControlGroup = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ActionIcon.Group
      display="inline-block"
      mr={10}
      mb={10}
      style={{ verticalAlign: "middle" }}
    >
      {children}
    </ActionIcon.Group>
  )
}

const ManagementControls = () => {
  const { t } = useTranslation()
  const [editor] = useLexicalComposerContext()
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [runningServer, setRunningServer] = useState(
    getSettings().autoStartServer ?? false,
  )
  const [openDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
  })
  const [currentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
  })
  const debounce = useMemo(
    () => getSettings().serverDebounce ?? DEFAULT_SERVER_DEBOUNCE_MILLISECONDS,
    [],
  )

  const doc = openDocuments[currentDocument]

  const preview = (open = true) => {
    setLoadingPreview(true)
    onPreview(open)
      .then(() => setLoadingPreview(false))
      .catch(() => setLoadingPreview(false))
  }

  const debouncedPreview = useDebouncedCallback((open?: boolean) => {
    preview(open)
  }, debounce)

  const toggleCompilationServer = () => {
    if (!runningServer) {
      preview(false)
    }
    setRunningServer(!runningServer)
  }

  useEffect(() => {
    if (runningServer) {
      return editor.registerUpdateListener(() => debouncedPreview(false))
    }
  }, [runningServer, editor])

  return (
    <ToolbarControlGroup>
      <ToolbarControl label="Save" command="fileSave">
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
        onClick={() => preview()}
      >
        <IconEye />
      </ToolbarControl>
      {!isWeb && (
        <ToolbarControl
          label={
            runningServer
              ? "Stop compilation server"
              : "Start compilation server"
          }
          onClick={toggleCompilationServer}
        >
          {runningServer ? <IconRefreshOff /> : <IconRefreshDot />}
        </ToolbarControl>
      )}
      <ToolbarControl
        label={t("documentSettings")}
        command="openDocumentSettings"
      >
        <IconSettings />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const FormatControls = () => {
  const [editor] = useLexicalComposerContext()
  const toolbarState = useToolbarState()

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
  const toolbarState = useToolbarState()

  return (
    <ToolbarControlGroup>
      <ToolbarControl label="Insert image" onClick={insertImage}>
        <IconPhoto />
      </ToolbarControl>
      <ToolbarControl label="Insert function" command="insertFunctionCall">
        <IconFunction />
      </ToolbarControl>
      <ToolbarControl label="Insert Typst code" command="insertTypstCode">
        <IconCodeAsterisk />
      </ToolbarControl>
      <ToolbarControl label="Insert math" command="insertMath true">
        <IconSum />
      </ToolbarControl>
      <ToolbarControl
        label="Insert quote"
        onClick={() => formatQuote(editor, toolbarState.blockType ?? "")}
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
        onClick={() => formatCode(editor, toolbarState.blockType ?? "")}
      >
        <IconCode />
      </ToolbarControl>
      <ToolbarControl
        label="Insert footnote"
        command="insertFunctionCall footnote"
      >
        <IconQuote />
      </ToolbarControl>
      <ToolbarControl
        label="Insert horizontal spacing"
        command='insertFunctionCall ["h", [{"type": "length", "value": "1", "unit": "em"}]]'
      >
        <IconArrowsHorizontal />
      </ToolbarControl>
      <ToolbarControl
        label="Insert vertical spacing"
        command='insertFunctionCall ["v", [{"type": "length", "value": "1", "unit": "em"}]]'
      >
        <IconArrowsVertical />
      </ToolbarControl>
    </ToolbarControlGroup>
  )
}

const HeadingControls = () => {
  const [editor] = useLexicalComposerContext()
  const toolbarState = useToolbarState()

  return (
    <ToolbarControlGroup>
      <ToolbarControl
        active={toolbarState.blockType === "h1"}
        label="Insert heading"
        onClick={() =>
          formatHeading(editor, toolbarState.blockType ?? "", "h1")
        }
      >
        <IconH1 />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.blockType === "h2"}
        label="Insert subheading"
        onClick={() =>
          formatHeading(editor, toolbarState.blockType ?? "", "h2")
        }
      >
        <IconH2 />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.blockType === "h3"}
        label="Insert subsubheading"
        onClick={() =>
          formatHeading(editor, toolbarState.blockType ?? "", "h3")
        }
      >
        <IconH3 />
      </ToolbarControl>
      <ToolbarControl
        active={toolbarState.blockType === "h4"}
        label="Insert subsubsubheading"
        onClick={() =>
          formatHeading(editor, toolbarState.blockType ?? "", "h4")
        }
      >
        <IconH4 />
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

const LinkControls = () => {
  const [editor] = useLexicalComposerContext()
  const [opened, setOpened] = useState(false)
  const [selection, setSelection] = useState<BaseSelection | null>(null)
  const ref = useRef<HTMLInputElement>(null)

  const save = () => {
    setEditorSelection(selection)
    executeCommandSequence(`toggleLink ${ref.current!.value}`)
    setOpened(false)
  }

  const changeOpened = (opened: boolean) => {
    if (!opened) {
      setEditorSelection(selection)
    } else {
      setSelection(getEditorSelection())
    }
    setOpened(opened)
  }

  useEffect(() => {
    return editor.registerCommand(
      OPEN_LINK_POPUP_COMMAND,
      () => {
        changeOpened(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return (
    <ToolbarControlGroup>
      <Popover opened={opened} onChange={changeOpened}>
        <Popover.Target>
          <ToolbarControl
            label="Link"
            onClick={() => {
              changeOpened(true)
            }}
          >
            <IconLink />
          </ToolbarControl>
        </Popover.Target>
        <Popover.Dropdown>
          <TextInput
            ref={ref}
            autoFocus
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                save()
              }
            }}
            rightSection={
              <ActionIcon onClick={save}>
                <IconDeviceFloppy />
              </ActionIcon>
            }
          />
        </Popover.Dropdown>
      </Popover>
      <ToolbarControl label="Unlink" command="toggleLink null">
        <IconUnlink />
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
        command='insertTable {"rows": 3, "columns": 3, "includeHeaders": false}'
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

const CodeControls = () => {
  const [editor] = useLexicalComposerContext()
  const toolbarState = useToolbarState()
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(toolbarState.codeLanguage ?? "")
  }, [toolbarState.codeLanguage])

  if (toolbarState.blockType !== "code") {
    return null
  }

  const save = (value: string) => {
    const key = toolbarState.elementKey
    if (!key) {
      return
    }
    editor.update(() => {
      const node = $getNodeByKey(key)
      if ($isCodeNode(node)) {
        node.setLanguage(value)
      }
    })
  }

  return (
    <ToolbarControlGroup>
      <TextInput
        leftSection={<IconFileCode />}
        size="xs"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation()
            save(e.currentTarget.value)
          }
        }}
        onBlur={(e) => save(e.currentTarget.value)}
      />
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
      const anchorNode = selection.anchor.getNode()
      const element = $findTopLevelElement(anchorNode)
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
      updateToolbarState(
        "blockType",
        $isHeadingNode(element) ? element.getTag() : element.getType(),
      )
      updateToolbarState(
        "codeLanguage",
        $isCodeNode(element) ? (element.getLanguage() ?? undefined) : undefined,
      )
      updateToolbarState("elementKey", element.getKey())
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
        flex: "none",
        padding: 10,
        paddingBottom: 0,
        borderBottom: "1px solid var(--tab-border-color)",
      }}
    >
      <ToolbarContext.Provider value={toolbarState}>
        <ManagementControls />
        <FormatControls />
        <InsertControls />
        <HeadingControls />
        <AlignmentControls />
        <LinkControls />
        <IndentationControls />
        <TableControls />
        <MathControls />
        <CodeControls />
        <UndoRedoControls />
      </ToolbarContext.Provider>
    </div>
  )
}

export default ToolbarPlugin
