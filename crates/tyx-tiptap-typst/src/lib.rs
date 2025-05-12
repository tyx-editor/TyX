//! Converts typst document to tiptap elements, using `typlite`.
//!
//! ## Example
//!
//! Building a world, documented [here](https://github.com/Myriad-Dreamin/tinymist/tree/main/crates/tinymist-world#example-resolves-a-system-universe-from-system-arguments):
//!
//! ```no_run
//! use std::sync::Arc;
//! use tinymist_project::{CompileOnceArgs, WorldProvider};
//!
//! let verse = CompileOnceArgs::default()
//!     .resolve()
//!     .expect("failed to resolve system universe");
//!
//! let world = verse.snapshot();
//! let tyx_document = tyx_tiptap_typst::convert(Arc::new(world));
//! ```

pub use tinymist_project::LspWorld;
pub use tyx_tiptap_schema::TyxNode;

mod concrete;

use std::sync::Arc;

use ecow::EcoString;
use serde::{Deserialize, Serialize};

use crate::concrete::*;

/// Converts the main document in a [`LspWorld`] to a [`TyxNode`]
pub fn convert(world: Arc<LspWorld>) -> Option<TyxDocument> {
    // Converts the source code into a markdown document
    let converter = typlite::Typlite::new(world);
    let md_doc = match converter.convert_doc(typlite::common::Format::Md) {
        Ok(md_doc) => md_doc,
        Err(err) => {
            eprintln!("{err:?}");
            return None;
        }
    };
    // Gets the ast representation
    let node = md_doc.parse().ok()?;

    // todo: more settings using `typst query`
    let settings = TyxSettings {
        // The base typst document used for introspection.
        title: md_doc.base.info.title.clone(),
    };

    // Generates the tyx output by walking the node
    let mut content = Stage1Converter.work(node)?;
    Stage2Converter::default().work(&mut content);

    Some(TyxDocument {
        // TODO: use the version from Tauri
        version: "0.1.11".into(),
        preamble: "".into(),
        content,
        settings,
        filename: String::new(),
        dirty: false,
    })
}

/// A tyx document for wysiwyg editing.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TyxDocument {
    /// The version of the document.
    pub version: String,
    /// The preamble of the document.
    pub preamble: String,
    /// The root node of the document.
    pub content: TyxNode,
    /// The settings for the document.
    pub settings: TyxSettings,
    /// The filename of the document.
    pub filename: String,
    /// Whether the document is dirty.
    pub dirty: bool,
}

/// The settings for the tyx document.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TyxSettings {
    /// The title of the document.
    pub title: Option<EcoString>,
}

#[cfg(test)]
mod tests;
