//! The tiptap schema for Tyx

pub use schema::*;

mod schema;

use ecow::EcoString;
use serde::{Deserialize, Serialize};

impl TyxNode {
    /// Creates a plain text node.
    pub fn plain(text: EcoString) -> Self {
        TyxNode::Text(Text {
            text,
            marks: vec![],
        })
    }

    /// Creates a marked content.
    pub fn marked(content: Vec<TyxNode>, mark: TyxMark) -> Self {
        TyxNode::Mark(TyxMarked { mark, content })
    }
}

/// A `marked` node.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TyxMarked {
    /// The node's mark.
    pub mark: TyxMark,
    /// The node's content.
    pub content: Vec<TyxNode>,
}
