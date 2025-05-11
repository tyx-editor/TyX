pub use mark::*;
pub use node::*;
mod mark;
mod node;
mod prelude;

use prelude::*;

/// A TyX node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum TyxNode {
    /// A marked content.
    Mark(TyxMarked),
    /// A `Blockquote` node.
    Blockquote(Blockquote),
    /// A `BulletList` node.
    BulletList(BulletList),
    /// A `CodeBlock` node.
    CodeBlock(CodeBlock),
    /// A `Doc` node.
    Doc(Doc),
    /// A `HardBreak` node.
    HardBreak(HardBreak),
    /// A `Heading` node.
    Heading(Heading),
    /// A `HorizontalRule` node.
    HorizontalRule(HorizontalRule),
    /// A `ListItem` node.
    ListItem(ListItem),
    /// A `MathBlock` node.
    MathBlock(MathBlock),
    /// A `MathInline` node.
    MathInline(MathInline),
    /// A `OrderedList` node.
    OrderedList(OrderedList),
    /// A `Paragraph` node.
    Paragraph(Paragraph),
    /// A `Table` node.
    Table(Table),
    /// A `TableCell` node.
    TableCell(TableCell),
    /// A `TableHeader` node.
    TableHeader(TableHeader),
    /// A `TableRow` node.
    TableRow(TableRow),
    /// A `Text` node.
    Text(Text),
}

/// A TyX mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum TyxMark {
    /// A `Bold` node.
    Bold(Bold),
    /// A `Code` node.
    Code(Code),
    /// A `Highlight` node.
    Highlight(Highlight),
    /// A `Italic` node.
    Italic(Italic),
    /// A `Link` node.
    Link(Link),
    /// A `Strike` node.
    Strike(Strike),
    /// A `Subscript` node.
    Subscript(Subscript),
    /// A `Superscript` node.
    Superscript(Superscript),
    /// A `TextStyle` node.
    TextStyle(TextStyle),
    /// A `TypstCode` node.
    TypstCode(TypstCode),
    /// A `Underline` node.
    Underline(Underline),
}
