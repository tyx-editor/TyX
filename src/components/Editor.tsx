/**
 * @file The TipTap editor for a TyX document.
 */

import { ListItemNode, ListNode } from "@lexical/list"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { QuoteNode } from "@lexical/rich-text"
import { Loader } from "@mantine/core"
import {
  RichTextEditor,
  RichTextEditorControlProps,
  useRichTextEditorContext,
} from "@mantine/tiptap"
import {
  IconColumnInsertRight,
  IconColumnRemove,
  IconEye,
  IconIndentDecrease,
  IconIndentIncrease,
  IconRowInsertBottom,
  IconRowRemove,
  IconTableMinus,
  IconTablePlus,
} from "@tabler/icons-react"
import {
  CLEAR_HISTORY_COMMAND,
  LexicalEditor,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical"
import { useEffect, useRef, useState } from "react"
import { onPreview } from "../backend"
import { TyXDocument } from "../models"
import { useLocalStorage, useUpdateOnChange } from "../utilities/hooks"
import KeyboardMapPlugin from "./plugins/KeyboardMapPlugin"
import MathPlugin, { MathNode } from "./plugins/MathPlugin"
import { PageBreakNode } from "./plugins/PageBreakPlugin"
import RemoveDefaultShortcutsPlugin from "./plugins/RemoveDefaultShortcutsPlugin"
import ToolbarPlugin from "./plugins/ToolbarPlugin"

declare global {
  interface Window {
    currentEditor?: LexicalEditor
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

const initialConfig: InitialConfigType = {
  namespace: "TyX",
  theme: {
    text: { underline: "underline", strikethrough: "strikethrough" },
  },
  onError: (error) => {
    console.error(error)
  },
  nodes: [PageBreakNode, ListNode, ListItemNode, QuoteNode, MathNode],
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
  const editorRef = useRef<LexicalEditor>(null)

  const doc = openDocuments[currentDocument]
  const update = (content: SerializedEditorState<SerializedLexicalNode>) => {
    doc.content = content
    doc.dirty = true
    setOpenDocuments(openDocuments)
  }

  const basename = (doc.filename ?? "Untitled")
    .split("/")
    .pop()!
    .split("\\")
    .pop()

  useEffect(() => {
    window.currentEditor = editorRef.current ?? undefined

    const editor = editorRef.current

    if (editor) {
      editor.update(() => {
        const editorState = editor.parseEditorState(doc.content)
        editor.setEditorState(editorState)
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
      })

      return editor.registerUpdateListener(({ editorState }) => {
        update(editorState.toJSON())
      })
    }
  }, [editorRef])

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable aria-placeholder="" placeholder={<></>} />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <HorizontalRulePlugin />
      <ListPlugin />
      <EditorRefPlugin editorRef={editorRef} />

      <KeyboardMapPlugin />
      <RemoveDefaultShortcutsPlugin />
      <MathPlugin />
    </LexicalComposer>
  )
}

export default Editor
