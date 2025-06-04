import {
  RichTextEditor,
  RichTextEditorControlProps,
  useRichTextEditorContext,
} from "@mantine/tiptap"
import { Editor as EditorType, JSONContent, useEditor } from "@tiptap/react"
import extensions from "./editor/extensions"

import { Loader } from "@mantine/core"
import { useForceUpdate, useWindowEvent } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import {
  IconCodeAsterisk,
  IconColumnInsertRight,
  IconColumnRemove,
  IconDeviceFloppy,
  IconEye,
  IconFileFunction,
  IconIndentDecrease,
  IconIndentIncrease,
  IconMatrix,
  IconPhoto,
  IconRowInsertBottom,
  IconRowRemove,
  IconSettings,
  IconSum,
  IconTableMinus,
  IconTablePlus,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { insertImage, isWeb, onPreview, onSave, save } from "../backend"
import tyx2typst from "../compilers/tyx2typst"
import { getLocalStorage, useLocalStorage, useUpdateOnChange } from "../hooks"
import { TyXDocument, TyXSettings } from "../models"
import { showSuccessMessage } from "../utilities"
import DocumentSettingsModal from "./DocumentSettingsModal"

declare global {
  interface Window {
    currentEditor?: EditorType
  }
}

const PreviewControl = (props: RichTextEditorControlProps) => {
  const [loading, setLoading] = useState(false)

  return (
    <RichTextEditor.Control
      onClick={() => {
        setLoading(true)
        onPreview()
          .then(() => setLoading(false))
          .catch(() => setLoading(false))
      }}
      aria-label="Preview as PDF"
      title="Preview as PDF"
      {...props}
    >
      {loading ? <Loader size={10} /> : <IconEye />}
    </RichTextEditor.Control>
  )
}

const TableControls = () => {
  const { editor } = useRichTextEditorContext()
  useUpdateOnChange(editor)

  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Control
        title="Insert table"
        aria-label="Insert table"
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
            .run()
        }
      >
        <IconTablePlus />
      </RichTextEditor.Control>
      {editor?.isFocused && editor?.isActive("table") && (
        <>
          <RichTextEditor.Control
            title="Remove table"
            aria-label="Remove table"
            onClick={() => editor?.chain().focus().deleteTable().run()}
          >
            <IconTableMinus />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            title="Insert row below"
            aria-label="Insert row below"
            onClick={() => editor?.chain().focus().addRowAfter().run()}
          >
            <IconRowInsertBottom />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            title="Insert column to the right"
            aria-label="Insert column to the right"
            onClick={() => editor?.chain().focus().addColumnAfter().run()}
          >
            <IconColumnInsertRight />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            title="Delete row"
            aria-label="Delete row"
            onClick={() => editor?.chain().focus().deleteRow().run()}
          >
            <IconRowRemove />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            title="Delete column"
            aria-label="Delete column"
            onClick={() => editor?.chain().focus().deleteColumn().run()}
          >
            <IconColumnRemove />
          </RichTextEditor.Control>
        </>
      )}
    </RichTextEditor.ControlsGroup>
  )
}

const ListControls = () => {
  const { editor } = useRichTextEditorContext()
  useUpdateOnChange(editor)

  if (
    !editor?.isFocused ||
    (!editor?.isActive("bulletList") && !editor?.isActive("orderedList"))
  ) {
    return <></>
  }

  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Control
        title="Lift list item"
        aria-label="Lift list item"
        onClick={() => editor?.chain().focus().liftListItem("listItem").run()}
      >
        <IconIndentDecrease />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Sink list item"
        aria-label="Sink list item"
        onClick={() => editor?.chain().focus().sinkListItem("listItem").run()}
      >
        <IconIndentIncrease />
      </RichTextEditor.Control>
    </RichTextEditor.ControlsGroup>
  )
}

const LinkControls = () => {
  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Link />
      <RichTextEditor.Unlink />
    </RichTextEditor.ControlsGroup>
  )
}

const MathControls = () => {
  const forceUpdate = useForceUpdate()

  useWindowEvent("mathEditorChanged", forceUpdate)

  if (!window.currentMathEditor) {
    return <></>
  }

  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Control
        title="Insert matrix"
        aria-label="Insert matrix"
        onClick={() =>
          window.currentMathEditor?.executeCommand(
            "insert",
            "\\begin{pmatrix} #0 & #? \\\\ #? & #? \\end{pmatrix}",
          )
        }
      >
        <IconMatrix />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Insert row below"
        aria-label="Insert row below"
        onClick={() => window.currentMathEditor?.executeCommand("addRowAfter")}
      >
        <IconRowInsertBottom />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Insert column to the right"
        aria-label="Insert column to the right"
        onClick={() =>
          window.currentMathEditor?.executeCommand("addColumnAfter")
        }
      >
        <IconColumnInsertRight />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Delete row"
        aria-label="Delete row"
        onClick={() => window.currentMathEditor?.executeCommand("removeRow")}
      >
        <IconRowRemove />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        title="Delete column"
        aria-label="Delete column"
        onClick={() => window.currentMathEditor?.executeCommand("removeColumn")}
      >
        <IconColumnRemove />
      </RichTextEditor.Control>
    </RichTextEditor.ControlsGroup>
  )
}

const Editor = () => {
  const [openDocuments, setOpenDocuments] = useLocalStorage<TyXDocument[]>({
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
  const update = (content: JSONContent) => {
    openDocuments[currentDocument].content = content
    openDocuments[currentDocument].dirty = true
    setOpenDocuments(openDocuments)
  }

  const editor = useEditor({
    extensions,
    content: Object.keys(doc.content).length > 0 ? doc.content : undefined,
    onUpdate: ({ editor }) => update(editor.getJSON()),
    shouldRerenderOnTransaction: false,
  })

  useEffect(() => {
    editor?.commands.focus()
    window.currentEditor = editor ?? undefined

    const settings = getLocalStorage<TyXSettings>("Settings")
    editor?.commands.setKeyboardLayout(settings.keyboardMap ?? null)

    return () => (window.currentEditor = undefined)
  }, [editor])

  const basename = (doc.filename ?? "Untitled")
    .split("/")
    .pop()!
    .split("\\")
    .pop()

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control
            onClick={onSave}
            aria-label="Save"
            title="Save"
            disabled={doc.filename !== undefined && !doc.dirty}
          >
            <IconDeviceFloppy />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            onClick={() => {
              const filename = (doc.filename ?? "Untitled.tyx").replace(
                ".tyx",
                ".typ",
              )
              save(filename, tyx2typst(doc)).then(() =>
                showSuccessMessage(`Document exported to ${filename}.`),
              )
            }}
            aria-label="Export to Typst"
            title="Export to Typst"
          >
            <IconFileFunction />
          </RichTextEditor.Control>
          <PreviewControl disabled={!isWeb && doc.filename === undefined} />
          <RichTextEditor.Control
            title="Document settings"
            aria-label="Document settings"
            onClick={() =>
              modals.open({
                title: `Document Settings (${basename})`,
                children: <DocumentSettingsModal />,
              })
            }
          >
            <IconSettings />
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.ColorPicker
            colors={[
              "#25262b",
              "#868e96",
              "#fa5252",
              "#e64980",
              "#be4bdb",
              "#7950f2",
              "#4c6ef5",
              "#228be6",
              "#15aabf",
              "#12b886",
              "#40c057",
              "#82c91e",
              "#fab005",
              "#fd7e14",
            ]}
          />
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
          <RichTextEditor.Code />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control
            title="Insert image"
            aria-label="Insert image"
            onClick={insertImage}
          >
            <IconPhoto />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            title="Insert typst code"
            aria-label="Insert typst code"
            onClick={() => editor?.chain().focus().toggleTypstCode().run()}
          >
            <IconCodeAsterisk />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            title="Insert math"
            aria-label="Insert math"
            onClick={() => editor?.chain().focus().insertMathInline().run()}
          >
            <IconSum />
          </RichTextEditor.Control>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.CodeBlock />
        </RichTextEditor.ControlsGroup>

        <TableControls />

        <ListControls />

        <LinkControls />

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignRight />
          <RichTextEditor.AlignJustify />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>

        <MathControls />
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content spellCheck={false} />
    </RichTextEditor>
  )
}

export default Editor
