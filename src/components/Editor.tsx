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
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import {
  LexicalEditor,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical"

import { TyXDocument } from "../models"
import { useLocalStorage } from "../utilities/hooks"
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin"
import CurrentEditorPlugin from "./plugins/CurrentEditorPlugin"
import KeyboardMapPlugin from "./plugins/KeyboardMapPlugin"
import { MathNode } from "./plugins/math"
import MathPlugin from "./plugins/MathPlugin"
import RemoveDefaultShortcutsPlugin from "./plugins/RemoveDefaultShortcutsPlugin"
import TableCommandsPlugin from "./plugins/TableCommandsPlugin"
import ToolbarPlugin from "./plugins/ToolbarPlugin"
import { TypstCodeNode } from "./plugins/typstCode"
import TypstCodePlugin from "./plugins/TypstCodePlugin"

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
  ],
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
        editorState: doc.content ? JSON.stringify(doc.content) : undefined,
      }}
    >
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

      <TabIndentationPlugin />
      <MarkdownShortcutPlugin />
      <AutoFocusPlugin />
      <OnChangePlugin
        ignoreSelectionChange
        onChange={(editorState) => update(editorState.toJSON())}
      />

      <TableCommandsPlugin />
      <CodeHighlightPlugin />
      <RemoveDefaultShortcutsPlugin />
      <CurrentEditorPlugin />
      <KeyboardMapPlugin />
      <MathPlugin />
      <TypstCodePlugin />
    </LexicalComposer>
  )
}

export default Editor
