/**
 * @file The Lexical editor for a TyX document.
 */

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { LexicalEditor, NodeKey } from "lexical"

import { useMemo } from "react"
import { initialConfig } from "../config"
import { TyXDocument } from "../models"
import { useSharedHistoryContext } from "../resources/playground"
import { getLocalStorage } from "../utilities/hooks"
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin"
import CurrentEditorPlugin from "./plugins/CurrentEditorPlugin"
import FunctionCallPlugin from "./plugins/FunctionCallPlugin"
import ImagePlugin from "./plugins/ImagePlugin"
import KeyboardMapPlugin from "./plugins/KeyboardMapPlugin"
import MathPlugin from "./plugins/MathPlugin"
import RemoveDefaultShortcutsPlugin from "./plugins/RemoveDefaultShortcutsPlugin"
import TableCommandsPlugin from "./plugins/TableCommandsPlugin"
import ToolbarPlugin from "./plugins/ToolbarPlugin"
import TypstCodePlugin from "./plugins/TypstCodePlugin"
import TyXCommandsPlugin from "./plugins/TyXCommandsPlugin"
import UpdateLocalStoragePlugin from "./plugins/UpdateLocalStoragePlugin"

declare global {
  interface Window {
    currentEditor?: LexicalEditor
    currentNodeKey?: NodeKey
  }
}

const Editor = () => {
  const config: InitialConfigType = useMemo(() => {
    const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents", [])
    const currentDocument = getLocalStorage<number>("Current Document", 0)
    const doc = openDocuments[currentDocument]
    return {
      ...initialConfig,
      editorState: doc.content ? JSON.stringify(doc.content) : undefined,
    }
  }, [])
  const { historyState } = useSharedHistoryContext()

  return (
    <LexicalComposer initialConfig={config}>
      <ToolbarPlugin />

      <div style={{ flexGrow: 1, padding: 10, overflowY: "auto" }}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable aria-placeholder="" placeholder={<></>} />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin externalHistoryState={historyState} />
      <HorizontalRulePlugin />
      <ListPlugin hasStrictIndent />
      <TablePlugin />
      <LinkPlugin />

      <TabIndentationPlugin />
      <MarkdownShortcutPlugin />
      <AutoFocusPlugin />

      <TyXCommandsPlugin />
      <UpdateLocalStoragePlugin />
      <TableCommandsPlugin />
      <CodeHighlightPlugin />
      <RemoveDefaultShortcutsPlugin />
      <CurrentEditorPlugin />
      <KeyboardMapPlugin />

      <MathPlugin />
      <TypstCodePlugin />
      <ImagePlugin />
      <FunctionCallPlugin />
    </LexicalComposer>
  )
}

export default Editor
