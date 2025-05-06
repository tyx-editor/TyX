import {
  Link,
  RichTextEditor,
  RichTextEditorControlProps,
  useRichTextEditorContext,
} from "@mantine/tiptap"
import { JSONContent, useEditor } from "@tiptap/react"

import Highlight from "@tiptap/extension-highlight"
import SubScript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"
import TextDirection from "tiptap-text-direction"

import { Loader } from "@mantine/core"
import {
  IconColumnInsertLeft,
  IconColumnRemove,
  IconDeviceFloppy,
  IconEye,
  IconRowInsertBottom,
  IconRowRemove,
  IconSum,
  IconTableMinus,
  IconTablePlus,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { onPreview, onSave } from "../backend"
import { TyXDocument } from "../models"
import { MathBlock, MathInline } from "./MathEditorExtension"

const SaveControl = (props: RichTextEditorControlProps) => {
  return (
    <RichTextEditor.Control
      onClick={onSave}
      aria-label="Save"
      title="Save"
      {...props}
    >
      <IconDeviceFloppy />
    </RichTextEditor.Control>
  )
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
      {editor?.isActive("table") === true && (
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
            title="Insert column on the left"
            aria-label="Insert column on the left"
            onClick={() => editor?.chain().focus().addColumnAfter().run()}
          >
            <IconColumnInsertLeft />
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

const LinkControls = () => {
  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Link />
      <RichTextEditor.Unlink />
    </RichTextEditor.ControlsGroup>
  )
}

const Editor = ({
  doc,
  update,
}: {
  doc: TyXDocument
  update: (content: JSONContent) => void
}) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Superscript,
        SubScript,
        Underline,
        Link,
        Highlight,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          defaultAlignment: "",
        }),
        TextDirection.configure({
          types: ["heading", "paragraph"],
          defaultDirection: "ltr",
        }),
        Table.configure({ resizable: false }),
        TableRow,
        TableCell,
        TableHeader,
        MathBlock,
        MathInline,
      ],
      content: Object.keys(doc.content).length > 0 ? doc.content : undefined,
      onUpdate: ({ editor }) => update(editor.getJSON()),
    },
    []
  )

  useEffect(() => {
    editor?.commands.focus()
  }, [editor])

  return (
    <>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Code />
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              title="Insert math"
              aria-label="Insert math"
              onClick={() => editor?.chain().focus().insertMathInline().run()}
            >
              <IconSum />
            </RichTextEditor.Control>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.CodeBlock />
          </RichTextEditor.ControlsGroup>

          <TableControls />

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

          <RichTextEditor.ControlsGroup>
            <SaveControl disabled={doc.filename !== undefined && !doc.dirty} />
            <PreviewControl disabled={doc.filename === undefined} />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  )
}

export default Editor
