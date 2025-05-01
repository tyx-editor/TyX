import {
  RichTextEditor,
  Link,
  RichTextEditorControlProps,
} from "@mantine/tiptap"
import { JSONContent, useEditor } from "@tiptap/react"

import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import SubScript from "@tiptap/extension-subscript"
import Highlight from "@tiptap/extension-highlight"
import TextDirection from "tiptap-text-direction"

import { TyXDocument } from "../models"
import { onPreview, onSave } from "../backend"
import { useEffect, useState } from "react"
import { Loader } from "@mantine/core"
import { IconDeviceFloppy, IconEye } from "@tabler/icons-react"

export const SaveControl = (props: RichTextEditorControlProps) => {
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

export const PreviewControl = (props: RichTextEditorControlProps) => {
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
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

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
