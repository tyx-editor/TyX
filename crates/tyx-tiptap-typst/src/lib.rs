//! Converts typst document to tiptap elements, using `typlite`.
//!
//! ## Overview
//!
//! ### PreStage: Instrument
//!
//! The main document is instrumented to mark special nodes, like func calls. We
//! also get a syntax-form document in this stage.
//!
//! ### Stage 1: Compilation
//!
//! Understands the typst document by compilation. This stage we will get a
//! concrete-form document containing all the nodes that has been typesetted by
//! typst's HTML export.
//!
//! ### Stage 2: Post-Processing
//!
//! The document is post-processed to fit in the tiptap's requirement. See [issue #30](https://github.com/tyx-editor/TyX/issues/30).
//!
//! ### Post-Stage: Synth
//!
//! Combining the _syntax form_ and the _concrete form_ into a single document.
//!
//! ## Example of two-form synthesis
//!
//! The input is:
//!
//! ```typ
//! #let f(x) = [Hello, #x!]
//!
//! = Heading
//!
//! #f[X], #f
//! ```
//!
//! We will instrument it into:
//!
//! ```typ
//! #let f(x) = [Hello, #x!]
//!
//! = Heading
//!
//! #_inst(f[X], pos: 1), #_inst(f, pos: 2)
//! ```
//!
//! And gets the _syntax form_:
//!
//! ```typ
//! #Decl[let f(x) = [Hello, #x!]]
//! #Markup[
//!
//! = Heading
//!
//! ]
//! #FnCall(syntax: f[X], pos: 1)
//! #Markup[, ]
//! #Variable(syntax: f, pos: 2)
//! ```
//!
//! And gets the _concrete form_ by stage 2:
//!
//! ```typ
//! <Heading>Heading</Heading>
//! <FnCall pos="1">
//!   <span>Hello, X!</span>
//! </FnCall>
//! <span>,&nbsp;</span>
//! <Variable pos="2">
//!   <code>f</code>
//! </Variable>
//! <span>,&nbsp;</span>
//! ```
//!
//! Finally, we synthesize the two forms into a single node for wysiwyg editing:
//!
//! ```typ
//! #Decl[let f(x) = [Hello, #x!]]
//! #Markup[#Heading[Heading]]
//! #FnCall(syntax: f[X], pos: 1, {
//!   Markup[Hello, X!]
//! })
//! #Markup[, ]
//! #Variable(syntax: f, pos: 2, {
//!   Code[f]
//! })
//! ```
//!
//! ## Utilizing the Result for Wysiwyg Editing
//!
//! In the above example, we have `Decl`, `Markup`, `FnCall`, and `Variable`
//! nodes and we can implement wysiwyg editing for them.
//!
//! ```typ
//! #Decl[let f(x) = [Hello, #x!]]
//! #Markup[...]
//! #FnCall(syntax: f[X], pos: 1, {...})
//! #Variable(syntax: f, pos: 2, {...})
//! ```
//!
//! - `Decl` is a raw source code node. When clicking it, we could show a popup
//!   with the source code and let the user edit it. When finished, we could
//!   update the source code and recompile it.
//! - `Markup` is supported by tiptap officially.
//! - `FnCall` and `Variable` are not so trivial, but as a fallback, if no
//!   special wysiwyg is supported, we can edit them like `Decl`.
//!
//! ## Special Typst Nodes Editing
//!
//! Some special wysiwyg on typst nodes could be supported, for example,
//! - `#FnCall(syntax: cetz.canvas[...], ...)`: edit a cetz canvas.
//! - `#Variable(syntax: x, ...)`: update a variable.
//! - `#Include(syntax: "chapter1.typ", ...)`: edit a sub file.
//!
//! Please note that, we can implement none of them. As a fallback, we can show
//! a popup with the source code and let the user edit it. All the `Markup` can
//! be still edit in wysiwyg way, because it is supported by tiptap officially.
//!
//! ## Conversion vice versa
//!
//! We can convert typst to tiptap with the above way. Optionally, we can
//! convert tiptap back to typst by diff and merge the changes using the
//! information from _syntax form_. Example:
//!
//! Original:
//!
//! ```typ
//! #Decl[let f(x) = [Hello, #x!]]
//! #Markup[Heading[1]]
//! #FnCall(syntax: f[X], pos: 1)
//! #Variable(syntax: f, pos: 2)
//! ```
//!
//! Edited:
//!
//! ```typ
//! #Decl[let f(x) = [Good bye, #x!]]
//! #Markup[Heading[2]]
//! #FnCall(syntax: f[X], pos: 1)
//! #Variable(syntax: f, pos: 2)
//! ```
//!
//! We generate a GNU patch to apply to the original document:
//!
//! ```patch
//! - let f(x) = [Hello, #x!]
//! + let f(x) = [Good bye, #x!]
//!
//! - = 1
//! + = 2
//!
//! #f[X], #f
//! ```
//!
//! ## Example to Run
//!
//! Building a world, documented [here](https://github.com/Myriad-Dreamin/tinymist/tree/main/crates/tinymist-world#example-resolves-a-system-universe-from-system-arguments):
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
mod syntax;

use std::sync::Arc;

use ecow::EcoString;
use serde::{Deserialize, Serialize};

use crate::{concrete::*, syntax::*};

pub use syntax::{SyntaxTree, instrument};

/// Converts the main document in a [`LspWorld`] to a [`TyxNode`]
pub fn convert(mut world: LspWorld) -> Option<TyxDocument> {
    instrument(&mut world)?;

    // Converts the source code into a markdown document
    let converter = typlite::Typlite::new(Arc::new(world));
    let md_doc = converter.convert_doc(typlite::common::Format::Md).ok()?;
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
    let content = SyntaxConverter.synth(content)?;

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
