//! Rust bindings for the TyX JSON schema.

mod generated;

pub use generated::*;

/// Masks for text format.
/// See https://github.com/facebook/lexical/blob/cde863d444adf9c189626c789b53657c3352dbb1/packages/lexical/src/LexicalConstants.ts#L106.
#[allow(dead_code)]
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
