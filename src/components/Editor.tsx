/**
 * @file The Lexical editor for a TyX document.
 */

import { ListItemNode, ListNode } from "@lexical/list"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { QuoteNode } from "@lexical/rich-text"
import {
  LexicalEditor,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical"
import { TyXDocument } from "../models"
import { useLocalStorage } from "../utilities/hooks"
import CurrentEditorPlugin from "./plugins/CurrentEditorPlugin"
import KeyboardMapPlugin from "./plugins/KeyboardMapPlugin"
import MathPlugin, { MathNode } from "./plugins/MathPlugin"
import RemoveDefaultShortcutsPlugin from "./plugins/RemoveDefaultShortcutsPlugin"
import ToolbarPlugin from "./plugins/ToolbarPlugin"

declare global {
  interface Window {
    currentEditor?: LexicalEditor
  }
}

const initialConfig: InitialConfigType = {
  namespace: "TyX",
  theme: {
    root: "editor",
    text: {
      underline: "underline",
      strikethrough: "strikethrough",
      italic: "italic",
    },
  },
  onError: (error) => {
    console.error(error)
  },
  nodes: [ListNode, ListItemNode, QuoteNode, MathNode],
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
  const update = (content: SerializedEditorState<SerializedLexicalNode>) => {
    doc.content = content
    doc.dirty = true
    setOpenDocuments(openDocuments)
  }

  return (
    <LexicalComposer
      initialConfig={{
        ...initialConfig,
        editorState: JSON.stringify(doc.content),
      }}
    >
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

      <KeyboardMapPlugin />
      <RemoveDefaultShortcutsPlugin />
      <MathPlugin />
      <OnChangePlugin
        ignoreSelectionChange
        onChange={(editorState) => update(editorState.toJSON())}
      />
      <CurrentEditorPlugin />
    </LexicalComposer>
  )
}

export default Editor
