//! The tiptap schema for Tyx

pub use schema::*;

mod schema;

use ecow::EcoString;

impl TyxNode {
    /// Creates a plain text node.
    pub fn plain(text: EcoString) -> Self {
        TyxNode::Text(Text {
            text,
            marks: vec![],
        })
    }
}
