import {
  RichTextEditor,
  RichTextEditorControlProps,
  useRichTextEditorContext,
} from "@mantine/tiptap"
import { JSONContent, useEditor } from "@tiptap/react"
import extensions from "./editor/extensions"

import { Loader } from "@mantine/core"
import { modals } from "@mantine/modals"
import {
  IconColumnInsertRight,
  IconCodeAsterisk,
  IconColumnRemove,
  IconDeviceFloppy,
  IconEye,
  IconRowInsertBottom,
  IconRowRemove,
  IconSettings,
  IconSum,
  IconTableMinus,
  IconTablePlus,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { isWeb, onPreview, onSave } from "../backend"
import { TyXDocument } from "../models"
import DocumentSettingsModal from "./DocumentSettingsModal"

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
      extensions,
      content: Object.keys(doc.content).length > 0 ? doc.content : undefined,
      onUpdate: ({ editor }) => update(editor.getJSON()),
    },
    [],
  )

  useEffect(() => {
    editor?.commands.focus()
  }, [editor])

  const basename = (doc.filename ?? "Untitled")
    .split("/")
    .pop()!
    .split("\\")
    .pop()

  return (
    <>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky>
          <RichTextEditor.ControlsGroup>
            <SaveControl disabled={doc.filename !== undefined && !doc.dirty} />
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
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  )
}

export default Editor
