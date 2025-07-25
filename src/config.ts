import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { InitialConfigType } from "@lexical/react/LexicalComposer"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { FunctionCallNode } from "./components/plugins/functionCall"
import { ImageNode } from "./components/plugins/image"
import { MathNode } from "./components/plugins/math"
import { TypstCodeNode } from "./components/plugins/typstCode"

export const initialConfig: InitialConfigType = {
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
    functionCall: "function-call",
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
    FunctionCallNode,
  ],
}
