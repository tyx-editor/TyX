use super::prelude::*;

/// A `blockquote` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Blockquote {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `bulletList` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct BulletList {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `dir` attribute.
    pub dir: serde_json::Value,
}

/// A `codeBlock` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct CodeBlock {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `language` attribute.
    pub language: serde_json::Value,
}

/// A `doc` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Doc {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `hardBreak` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct HardBreak {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `heading` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Heading {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `dir` attribute.
    pub dir: serde_json::Value,

    /// The `level` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub level: Option<i32>,

    /// The `textAlign` attribute.
    #[serde(rename = "textAlign")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_align: Option<String>,
}

/// A `horizontalRule` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct HorizontalRule {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `image` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Image {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `alt` attribute.
    pub alt: serde_json::Value,

    /// The `src` attribute.
    pub src: serde_json::Value,

    /// The `title` attribute.
    pub title: serde_json::Value,
}

/// A `listItem` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct ListItem {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `mathBlock` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct MathBlock {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `asciimath` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asciimath: Option<String>,

    /// The `value` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<String>,
}

/// A `mathInline` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct MathInline {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `asciimath` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asciimath: Option<String>,

    /// The `value` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<String>,
}

/// A `orderedList` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct OrderedList {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `dir` attribute.
    pub dir: serde_json::Value,

    /// The `start` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<i32>,

    /// The `type` attribute.
    #[serde(rename = "type")]
    pub ty: serde_json::Value,
}

/// A `paragraph` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Paragraph {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `dir` attribute.
    pub dir: serde_json::Value,

    /// The `textAlign` attribute.
    #[serde(rename = "textAlign")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text_align: Option<String>,
}

/// A `table` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Table {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `tableCell` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TableCell {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `colspan` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub colspan: Option<i32>,

    /// The `colwidth` attribute.
    pub colwidth: serde_json::Value,

    /// The `rowspan` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rowspan: Option<i32>,
}

/// A `tableHeader` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TableHeader {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,

    /// The `colspan` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub colspan: Option<i32>,

    /// The `colwidth` attribute.
    pub colwidth: serde_json::Value,

    /// The `rowspan` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rowspan: Option<i32>,
}

/// A `tableRow` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TableRow {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `text` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Text {
    /// The text's mark.
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub marks: Vec<TyxMark>,
    /// The text's content.
    pub text: EcoString,
}
