/**
 * @file The Lexical editor for a TyX document.
 */

import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { LexicalEditor } from "lexical"

import { useMemo } from "react"
import { TyXDocument } from "../models"
import { getLocalStorage } from "../utilities/hooks"
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin"
import CurrentEditorPlugin from "./plugins/CurrentEditorPlugin"
import { ImageNode } from "./plugins/image"
import ImagePlugin from "./plugins/ImagePlugin"
import KeyboardMapPlugin from "./plugins/KeyboardMapPlugin"
import { MathNode } from "./plugins/math"
import MathPlugin from "./plugins/MathPlugin"
import RemoveDefaultShortcutsPlugin from "./plugins/RemoveDefaultShortcutsPlugin"
import TableCommandsPlugin from "./plugins/TableCommandsPlugin"
import ToolbarPlugin from "./plugins/ToolbarPlugin"
import { TypstCodeNode } from "./plugins/typstCode"
import TypstCodePlugin from "./plugins/TypstCodePlugin"
import UpdateLocalStoragePlugin from "./plugins/UpdateLocalStoragePlugin"

declare global {
  interface Window {
    currentEditor?: LexicalEditor
  }
}

const initialConfig: InitialConfigType = {
  namespace: "TyX",
  theme: {
    root: "editor",
    code: "code",
    text: {
      underline: "underline",
      strikethrough: "strikethrough",
      italic: "italic",
    },
    codeHighlight: {
      atrule: "token atrule",
      attr: "token attr",
      boolean: "token boolean",
      builtin: "token builtin",
      cdata: "token cdata",
      char: "token char",
      class: "token class",
      "class-name": "token class-name",
      comment: "token comment",
      constant: "token constant",
      deleted: "token deleted",
      doctype: "token doctype",
      entity: "token entity",
      function: "token function",
      important: "token important",
      inserted: "token inserted",
      keyword: "token keyword",
      namespace: "token namespace",
      number: "token number",
      operator: "token operator",
      prolog: "token prolog",
      property: "token property",
      punctuation: "token punctuation",
      regex: "token regex",
      selector: "token selector",
      string: "token string",
      symbol: "token symbol",
      tag: "token tag",
      url: "token url",
      variable: "token variable",
    },
    mathInline: "math-inline",
    mathBlock: "math-block",
    typstCode: "typst-code",
  },
  onError: (error) => {
    console.error(error)
  },
  nodes: [
    TableNode,
    TableRowNode,
    TableCellNode,
    LinkNode,
    CodeNode,
    CodeHighlightNode,
    HeadingNode,
    HorizontalRuleNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    MathNode,
    TypstCodeNode,
    ImageNode,
  ],
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
      <HistoryPlugin />
      <HorizontalRulePlugin />
      <ListPlugin hasStrictIndent />
      <TablePlugin />
      <LinkPlugin />

      <TabIndentationPlugin />
      <MarkdownShortcutPlugin />
      <AutoFocusPlugin />

      <UpdateLocalStoragePlugin />
      <TableCommandsPlugin />
      <CodeHighlightPlugin />
      <RemoveDefaultShortcutsPlugin />
      <CurrentEditorPlugin />
      <KeyboardMapPlugin />

      <MathPlugin />
      <TypstCodePlugin />
      <ImagePlugin />
    </LexicalComposer>
  )
}

export default Editor
