use super::prelude::*;

/// A `bold` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Bold {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `code` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Code {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `highlight` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Highlight {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `italic` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Italic {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `link` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Link {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
    /// The `class` attribute.
    pub class: serde_json::Value,
    /// The `href` attribute.
    pub href: serde_json::Value,
    /// The `rel` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rel: Option<String>,
    /// The `target` attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target: Option<String>,
}

/// A `strike` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Strike {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `subscript` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Subscript {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `superscript` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Superscript {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}

/// A `textStyle` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TextStyle {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
    /// The `color` attribute.
    pub color: serde_json::Value,
}

/// A `underline` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Underline {
    /// The node's content.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<Content>,
}
