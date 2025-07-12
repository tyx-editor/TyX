//! The schema for TyX

use ecow::EcoString;
use serde::{Deserialize, Serialize};

/// Masks for text format.
/// See https://github.com/facebook/lexical/blob/cde863d444adf9c189626c789b53657c3352dbb1/packages/lexical/src/LexicalConstants.ts#L106.
pub enum TextFormat {
    ///
    Bold = 1,
    ///
    Italic = 1 << 1,
    ///
    Strikethrough = 1 << 2,
    ///
    Underline = 1 << 3,
    ///
    Code = 1 << 4,
    ///
    Subscript = 1 << 5,
    ///
    Superscript = 1 << 6,
    ///
    Highlight = 1 << 7,
    ///
    Lowercase = 1 << 8,
    ///
    Uppercase = 1 << 9,
    ///
    Capitalize = 1 << 10,
}

/// Some TyX node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Node {
    /// A `root` node.
    Root(Root),
    /// A `paragraph` node.
    Paragraph(Paragraph),
    /// A `text` node.
    Text(Text),
    /// A `list` node.
    List(List),
    /// A `listitem` node.
    ListItem(ListItem),
    /// A `quote` node.
    Quote(Quote),
    /// A `code` node.
    Code(Code),
    /// A `table` node.
    Table(Table),
    /// A `tablerow` node.
    TableRow(TableRow),
    /// A `tablecell` node.
    TableCell(TableCell),
    /// A `linebreak` node.
    LineBreak(LineBreak),
    /// A `horizontalrule` node.
    HorizontalRule(HorizontalRule),
    /// An `image` node.
    Image(Image),
    /// A `link` node.
    Link(Link),
    /// A `heading` node.
    Heading(Heading),
    /// A `typstcode` node.
    TypstCode(TypstCode),
    /// A `math` node.
    Math(Math),
}

/// A serialized TyX editor.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Editor {
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub root: Option<Box<Node>>,
}

/// A `root` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Root {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
}

/// A `paragraph` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Paragraph {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
}

/// A `text` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Text {
    ///
    pub version: u64,
    ///
    pub detail: u64,
    ///
    pub format: u64,
    ///
    pub mode: EcoString,
    ///
    pub style: EcoString,
    ///
    pub text: EcoString,
}

/// A `list` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct List {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    ///
    #[serde(rename = "listType")]
    pub list_type: EcoString,
    ///
    pub start: u64,
    ///
    pub tag: EcoString,
}

/// A `listitem` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct ListItem {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub checked: Option<bool>,
    ///
    pub value: u64,
}

/// A `quote` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Quote {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
}

/// A `code` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Code {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<EcoString>,
}

/// A `table` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Table {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
}

/// A `tablerow` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TableRow {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u64>,
}

/// A `tablecell` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TableCell {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    ///
    #[serde(rename = "colSpan")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub col_span: Option<u64>,
    ///
    #[serde(rename = "rowSpan")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub row_span: Option<u64>,
    ///
    #[serde(rename = "headerState")]
    pub header_state: u64,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u64>,
    ///
    #[serde(rename = "backgroundColor")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub background_color: Option<EcoString>,
    ///
    #[serde(rename = "verticalAlign")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub vertical_align: Option<EcoString>,
}

/// A `linebreak` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct LineBreak {
    ///
    pub version: u64,
}

/// A `horizontalrule` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct HorizontalRule {
    ///
    pub version: u64,
}

/// An `image` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Image {
    ///
    pub version: u64,
    ///
    pub src: EcoString,
}

/// A `link` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Link {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rel: Option<EcoString>,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target: Option<EcoString>,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<EcoString>,
    ///
    pub url: EcoString,
}

/// A `heading` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Heading {
    ///
    pub version: u64,
    ///
    pub children: Vec<Node>,
    ///
    pub direction: Option<EcoString>,
    ///
    pub format: EcoString,
    ///
    pub indent: u64,
    ///
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    ///
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    ///
    pub tag: EcoString,
}

/// A `typstcode` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TypstCode {
    ///
    pub version: u64,
    ///
    pub text: Editor,
}

/// A `math` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Math {
    ///
    pub version: u64,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inline: Option<bool>,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub formula: Option<EcoString>,
    ///
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asciimath: Option<EcoString>,
}

impl Node {
    /// Creates a plain text node.
    pub fn plain(text: EcoString) -> Self {
        Node::Text(Text {
            version: 1,
            detail: 0,
            format: 0,
            mode: "normal".into(),
            style: "".into(),
            text: text,
        })
    }
}
