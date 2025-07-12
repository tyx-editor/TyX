//! The schema for TyX

use ecow::EcoString;
use serde::{Deserialize, Serialize};

/// Masks for text format.
/// See https://github.com/facebook/lexical/blob/cde863d444adf9c189626c789b53657c3352dbb1/packages/lexical/src/LexicalConstants.ts#L106.
pub enum TextFormat {
    /// Bold.
    Bold = 1,
    /// Italic.
    Italic = 1 << 1,
    /// Strikethrough.
    Strikethrough = 1 << 2,
    /// Underline.
    Underline = 1 << 3,
    /// Code.
    Code = 1 << 4,
    /// Subscript.
    Subscript = 1 << 5,
    /// Superscript.
    Superscript = 1 << 6,
    /// Highlight.
    Highlight = 1 << 7,
    /// Lowercase.
    Lowercase = 1 << 8,
    /// Uppercase.
    Uppercase = 1 << 9,
    /// Capitalize.
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
    /// Root.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub root: Option<Box<Node>>,
}

/// A `root` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Root {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
}

/// A `paragraph` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Paragraph {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
}

/// A `text` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Text {
    /// Version.
    pub version: u64,
    /// Detail.
    pub detail: u64,
    /// Format.
    pub format: u64,
    /// Mode.
    pub mode: EcoString,
    /// Style.
    pub style: EcoString,
    /// Text.
    pub text: EcoString,
}

/// A `list` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct List {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    /// List Type.
    #[serde(rename = "listType")]
    pub list_type: EcoString,
    /// Start.
    pub start: u64,
    /// Tag.
    pub tag: EcoString,
}

/// A `listitem` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct ListItem {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    /// Checked.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub checked: Option<bool>,
    /// Value.
    pub value: u64,
}

/// A `quote` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Quote {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
}

/// A `code` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Code {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    /// Language.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<EcoString>,
}

/// A `table` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Table {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
}

/// A `tablerow` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TableRow {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    /// Height.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u64>,
}

/// A `tablecell` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TableCell {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    /// Column Span.
    #[serde(rename = "colSpan")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub col_span: Option<u64>,
    /// Row Span.
    #[serde(rename = "rowSpan")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub row_span: Option<u64>,
    /// Header State.
    #[serde(rename = "headerState")]
    pub header_state: u64,
    /// Width.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u64>,
    /// Background Color.
    #[serde(rename = "backgroundColor")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub background_color: Option<EcoString>,
    /// Vertical Align.
    #[serde(rename = "verticalAlign")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub vertical_align: Option<EcoString>,
}

/// A `linebreak` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct LineBreak {
    /// Version.
    pub version: u64,
}

/// A `horizontalrule` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct HorizontalRule {
    /// Version.
    pub version: u64,
}

/// An `image` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Image {
    /// Version.
    pub version: u64,
    /// Source.
    pub src: EcoString,
}

/// A `link` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Link {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    /// Rel.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rel: Option<EcoString>,
    /// Target.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target: Option<EcoString>,
    /// Title.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<EcoString>,
    /// URL.
    pub url: EcoString,
}

/// A `heading` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Heading {
    /// Version.
    pub version: u64,
    /// Children.
    pub children: Vec<Node>,
    /// Direction.
    pub direction: Option<EcoString>,
    /// Format.
    pub format: EcoString,
    /// Indent.
    pub indent: u64,
    /// Text Format.
    #[serde(rename = "textFormat")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_format: Option<u64>,
    /// Text Style.
    #[serde(rename = "textStyle")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_style: Option<EcoString>,
    /// Tag.
    pub tag: EcoString,
}

/// A `typstcode` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TypstCode {
    /// Version.
    pub version: u64,
    /// Text.
    pub text: Editor,
}

/// A `math` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Math {
    /// Version.
    pub version: u64,
    /// Inline.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inline: Option<bool>,
    /// Formula.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub formula: Option<EcoString>,
    /// ASCII Math.
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
            text,
        })
    }
}
