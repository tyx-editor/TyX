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

import { TypStudioDocument } from "../models"
import { onPreview, onSave } from "../backend"
import { useEffect } from "react"

export const SaveControl = (props: RichTextEditorControlProps) => {
  return (
    <RichTextEditor.Control
      onClick={onSave}
      aria-label="Save"
      title="Save"
      {...props}
    >
      <i className="fa-solid fa-save" />
    </RichTextEditor.Control>
  )
}

export const PreviewControl = (props: RichTextEditorControlProps) => {
  return (
    <RichTextEditor.Control
      onClick={onPreview}
      aria-label="Preview as PDF"
      title="Preview as PDF"
      {...props}
    >
      <i className="fa-solid fa-eye" />
    </RichTextEditor.Control>
  )
}

const Editor = ({
  doc,
  update,
}: {
  doc: TypStudioDocument
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
            <RichTextEditor.Bold
              icon={() => <i className="fa-solid fa-bold" />}
            />
            <RichTextEditor.Italic
              icon={() => <i className="fa-solid fa-italic" />}
            />
            <RichTextEditor.Underline
              icon={() => <i className="fa-solid fa-underline" />}
            />
            <RichTextEditor.Strikethrough
              icon={() => <i className="fa-solid fa-strikethrough" />}
            />
            <RichTextEditor.ClearFormatting
              icon={() => <i className="fa-solid fa-text-slash" />}
            />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link
              icon={() => <i className="fa-solid fa-link" />}
            />
            <RichTextEditor.Unlink
              icon={() => <i className="fa-solid fa-link-slash" />}
            />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft
              icon={() => <i className="fa-solid fa-align-left" />}
            />
            <RichTextEditor.AlignCenter
              icon={() => <i className="fa-solid fa-align-center" />}
            />
            <RichTextEditor.AlignRight
              icon={() => <i className="fa-solid fa-align-right" />}
            />
            <RichTextEditor.AlignJustify
              icon={() => <i className="fa-solid fa-align-justify" />}
            />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo
              icon={() => <i className="fa-solid fa-undo" />}
            />
            <RichTextEditor.Redo
              icon={() => <i className="fa-solid fa-redo" />}
            />
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
