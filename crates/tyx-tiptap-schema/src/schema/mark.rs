use super::prelude::*;

/// A `bold` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Bold {}

/// A `code` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Code {}

/// A `highlight` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Highlight {}

/// A `italic` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Italic {}

/// A `link` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Link {
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
pub struct Strike {}

/// A `subscript` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Subscript {}

/// A `superscript` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Superscript {}

/// A `textStyle` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TextStyle {
    /// The `color` attribute.
    pub color: serde_json::Value,
}

/// A `typstCode` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TypstCode {}

/// A `underline` mark.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct Underline {}
