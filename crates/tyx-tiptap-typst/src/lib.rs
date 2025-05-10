//! Converts typst document to tiptap elements, using `typlite`.
//!
//! ## Example
//!
//! Building a world, documented [here](https://github.com/Myriad-Dreamin/tinymist/tree/main/crates/tinymist-world#example-resolves-a-system-universe-from-system-arguments):
//!
//! ```no-run
//! let args = CompileOnceArgs::parse();
//! let verse = args
//!     .resolve_system()
//!     .expect("failed to resolve system universe");
//!
//! let world = verse.snapshot();
//! let tyx_document = tyx_tiptap_typst::convert(world);
//! ```

use ecow::EcoString;
use serde::{Deserialize, Serialize};
pub use tinymist_project::LspWorld;
pub use tyx_tiptap_schema::TyxNode;

use std::sync::Arc;

use cmark_writer::ast;
use tyx_tiptap_schema::{self as s, TyxMark};

/// The settings for the tyx document.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TyxSettings {
    /// The title of the document.
    pub title: Option<EcoString>,
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

/// Converts the main document in a [`LspWorld`] to a [`TyxNode`]
pub fn convert(world: Arc<LspWorld>) -> Option<TyxDocument> {
    // Converts the source code into a markdown document
    let converter = typlite::Typlite::new(world);
    let md_doc = converter.convert_doc(typlite::common::Format::Md).ok()?;
    // Gets the ast representation
    let node = md_doc.parse().ok()?;

    // todo: more settings using `typst query`
    let settings = TyxSettings {
        title: md_doc.base.info.title.clone(),
    };

    // Generates the tyx output by walking the node
    let content = TyxConverter { _base: md_doc.base }.work(node)?;

    Some(TyxDocument {
        version: "0.1.7".into(),
        preamble: "".into(),
        content,
        settings,
        filename: String::new(),
        dirty: false,
    })
}

/// Converts a typst document to a tiptap node
struct TyxConverter {
    /// The base typst document used for introspection.
    _base: typst::html::HtmlDocument,
}

impl TyxConverter {
    /// The main work function.
    fn work(&self, node: ast::Node) -> Option<TyxNode> {
        match node {
            ast::Node::Document(nodes) => self.document(nodes),
            ast::Node::ThematicBreak => self.thematic_break(),
            ast::Node::Heading {
                level,
                content,
                heading_type: _,
            } => self.heading(level, content),
            ast::Node::CodeBlock {
                language,
                content,
                block_type: _,
            } => self.code_block(language, content),
            ast::Node::HtmlBlock(block) => self.html_block(block),
            ast::Node::LinkReferenceDefinition {
                label,
                destination,
                title,
            } => self.link_reference_definition(label, destination, title),
            ast::Node::Paragraph(nodes) => self.paragraph(nodes),
            ast::Node::BlockQuote(nodes) => self.block_quote(nodes),
            ast::Node::OrderedList { start, items } => self.ordered_list(start, items),
            ast::Node::UnorderedList(list_items) => self.unordered_list(list_items),
            ast::Node::Table {
                headers,
                alignments,
                rows,
            } => self.table(headers, alignments, rows),
            ast::Node::InlineCode(code) => self.inline_code(code),
            ast::Node::Emphasis(nodes) => self.emphasis(nodes),
            ast::Node::Strong(nodes) => self.strong(nodes),
            ast::Node::Strikethrough(nodes) => self.strikethrough(nodes),
            ast::Node::Link {
                url,
                title,
                content,
            } => self.link(url, title, content),
            ast::Node::ReferenceLink { label, content } => self.reference_link(label, content),
            ast::Node::Image { url, title, alt } => self.image(url, title, alt),
            ast::Node::Autolink { url, is_email } => self.autolink(url, is_email),
            ast::Node::ExtendedAutolink(link) => self.extended_autolink(link),
            ast::Node::HtmlElement(html_element) => self.html_element(html_element),
            ast::Node::HardBreak => self.hard_break(),
            ast::Node::SoftBreak => self.soft_break(),
            ast::Node::Text(content) => self.text(content),
            ast::Node::Custom(..) => Some(TyxNode::plain(Default::default())),
        }
    }

    /// Converts a list of markdown nodes.
    fn children(&self, nodes: Vec<ast::Node>) -> Vec<TyxNode> {
        let mut children = Vec::new();
        for node in nodes {
            if let Some(child) = self.work(node) {
                children.push(child);
            }
        }
        children
    }

    /// Converts a markdown document.
    fn document(&self, nodes: Vec<ast::Node>) -> Option<TyxNode> {
        Some(TyxNode::Doc(s::Doc {
            content: Some(self.children(nodes)),
        }))
    }

    /// Converts a thematic break.
    fn thematic_break(&self) -> Option<TyxNode> {
        Some(TyxNode::HorizontalRule(s::HorizontalRule { content: None }))
    }

    /// Converts a heading.
    fn heading(&self, level: u8, nodes: Vec<ast::Node>) -> Option<TyxNode> {
        Some(TyxNode::Heading(s::Heading {
            content: Some(self.children(nodes)),
            level: Some(level as i32),
            dir: serde_json::Value::Null,
            text_align: None,
        }))
    }

    /// Converts a code block.
    fn code_block(&self, language: Option<String>, content: String) -> Option<TyxNode> {
        Some(TyxNode::CodeBlock(s::CodeBlock {
            content: Some(vec![TyxNode::plain(content.into())]),
            language: language
                .map(serde_json::Value::String)
                .unwrap_or(serde_json::Value::Null),
        }))
    }

    /// Converts a html element, e.g. `<div></div>`.
    fn html_block(&self, block: String) -> Option<TyxNode> {
        // todo: what's a html block
        Some(TyxNode::plain(block.into()))
    }

    /// Converts a link reference definition.
    fn link_reference_definition(
        &self,
        label: String,
        destination: String,
        title: Option<String>,
    ) -> Option<TyxNode> {
        // todo: what's a link_reference_definition
        Some(TyxNode::plain(
            format!(
                "link_reference_definition: {} {} {}",
                label,
                destination,
                title.unwrap_or_default()
            )
            .into(),
        ))
    }

    /// Converts a paragraph.
    fn paragraph(&self, nodes: Vec<ast::Node>) -> Option<TyxNode> {
        Some(TyxNode::Paragraph(s::Paragraph {
            content: Some(self.children(nodes)),
            dir: serde_json::Value::Null,
            text_align: None,
        }))
    }

    /// Converts a block quote.
    fn block_quote(&self, nodes: Vec<ast::Node>) -> Option<TyxNode> {
        Some(TyxNode::Blockquote(s::Blockquote {
            content: Some(self.children(nodes)),
        }))
    }

    /// Converts an ordered list.
    fn ordered_list(&self, start: u32, items: Vec<ast::ListItem>) -> Option<TyxNode> {
        let mut children = Vec::new();
        for item in items {
            if let Some(child) = self.list_item(item) {
                children.push(child);
            }
        }
        Some(TyxNode::OrderedList(s::OrderedList {
            content: Some(children),
            start: Some(start as i32),
            ty: serde_json::Value::Null,
        }))
    }

    /// Converts an unordered list.
    fn unordered_list(&self, list_items: Vec<ast::ListItem>) -> Option<TyxNode> {
        // bulletList
        let mut children = Vec::new();
        for item in list_items {
            if let Some(child) = self.list_item(item) {
                children.push(child);
            }
        }

        Some(TyxNode::BulletList(s::BulletList {
            content: Some(children),
        }))
    }

    /// Converts a list item.
    fn list_item(&self, item: ast::ListItem) -> Option<TyxNode> {
        // todo: preserve id.
        let nodes = match item {
            ast::ListItem::Unordered { content, .. } => content,
            ast::ListItem::Ordered { content, .. } => content,
            ast::ListItem::Task { content, .. } => content,
        };

        Some(TyxNode::ListItem(s::ListItem {
            content: Some(self.children(nodes)),
        }))
    }

    /// Converts a table.
    fn table(
        &self,
        headers: Vec<ast::Node>,
        alignments: Vec<ast::TableAlignment>,
        rows: Vec<Vec<ast::Node>>,
    ) -> Option<TyxNode> {
        let mut children = Vec::new();
        {
            let mut header_children = Vec::new();
            for header in headers {
                if let Some(child) = self.work(header) {
                    header_children.push(TyxNode::TableHeader(s::TableHeader {
                        content: Some(vec![child]),
                        colwidth: serde_json::Value::Null,
                        colspan: None,
                        rowspan: None,
                    }));
                }
            }
            children.push(TyxNode::TableRow(s::TableRow {
                content: Some(header_children),
            }));

            // todo: alignments
            let _ = alignments;
        }

        for row in rows {
            let mut row_children = Vec::new();
            for cell in row {
                if let Some(child) = self.work(cell) {
                    row_children.push(TyxNode::TableCell(s::TableCell {
                        content: Some(vec![child]),
                        colwidth: serde_json::Value::Null,
                        colspan: None,
                        rowspan: None,
                    }));
                }
            }
            children.push(TyxNode::TableRow(s::TableRow {
                content: Some(row_children),
            }));
        }

        // todo:
        Some(TyxNode::Table(s::Table {
            content: Some(children),
        }))
    }

    /// Converts an inline code.
    fn inline_code(&self, code: String) -> Option<TyxNode> {
        Some(TyxNode::Mark(TyxMark::Code(s::Code {
            content: Some(vec![TyxNode::plain(code.into())]),
        })))
    }

    /// Converts a emphasis.
    fn emphasis(&self, nodes: Vec<ast::Node>) -> Option<TyxNode> {
        // todo: we loss semantics here, as an `emphasis` can be configured to be `bold`
        // or `italic`.
        Some(TyxNode::Mark(TyxMark::Italic(s::Italic {
            content: Some(self.children(nodes)),
        })))
    }

    /// Converts a strong emphasis.
    fn strong(&self, nodes: Vec<ast::Node>) -> Option<TyxNode> {
        Some(TyxNode::Mark(TyxMark::Bold(s::Bold {
            content: Some(self.children(nodes)),
        })))
    }

    /// Converts a strikethrough.
    fn strikethrough(&self, nodes: Vec<ast::Node>) -> Option<TyxNode> {
        Some(TyxNode::Mark(TyxMark::Strike(s::Strike {
            content: Some(self.children(nodes)),
        })))
    }

    /// Converts a link.
    fn link(&self, url: String, title: Option<String>, content: Vec<ast::Node>) -> Option<TyxNode> {
        let _ = title;
        Some(TyxNode::Mark(TyxMark::Link(s::Link {
            content: Some(self.children(content)),
            rel: None,
            class: serde_json::Value::Null,
            target: None,
            href: serde_json::Value::String(url),
        })))
    }

    /// Converts a reference link.
    fn reference_link(&self, label: String, content: Vec<ast::Node>) -> Option<TyxNode> {
        let _ = label;
        Some(TyxNode::Mark(TyxMark::Link(s::Link {
            content: Some(self.children(content)),
            rel: None,
            class: serde_json::Value::Null,
            target: None,
            href: serde_json::Value::String(format!("#{label}")),
        })))
    }

    /// Converts an image.
    fn image(&self, url: String, title: Option<String>, alt: Vec<ast::Node>) -> Option<TyxNode> {
        let _ = title;
        // todo: there is no image support in tyx yet.
        Some(TyxNode::Mark(TyxMark::Link(s::Link {
            content: Some(self.children(alt)),
            rel: None,
            class: serde_json::Value::Null,
            target: None,
            href: serde_json::Value::String(url),
        })))
    }

    /// Converts an autolink.
    fn autolink(&self, url: String, is_email: bool) -> Option<TyxNode> {
        let _ = is_email;
        Some(TyxNode::Mark(TyxMark::Link(s::Link {
            content: Some(vec![TyxNode::plain(url.as_str().into())]),
            rel: None,
            class: serde_json::Value::Null,
            target: None,
            href: serde_json::Value::String(url),
        })))
    }

    /// Converts an extended autolink.
    fn extended_autolink(&self, link: String) -> Option<TyxNode> {
        Some(TyxNode::Mark(TyxMark::Link(s::Link {
            content: Some(vec![TyxNode::plain(link.as_str().into())]),
            rel: None,
            class: serde_json::Value::Null,
            target: None,
            href: serde_json::Value::String(link),
        })))
    }

    /// Converts a typst html element.
    fn html_element(&self, _html_element: ast::HtmlElement) -> Option<TyxNode> {
        // todo: what is a html element
        None
    }

    /// Converts a hard break.
    fn hard_break(&self) -> Option<TyxNode> {
        Some(TyxNode::HardBreak(s::HardBreak { content: None }))
    }

    /// Converts a soft break.
    fn soft_break(&self) -> Option<TyxNode> {
        // todo: soft break
        Some(TyxNode::HardBreak(s::HardBreak { content: None }))
    }

    /// Converts a text node.
    fn text(&self, content: String) -> Option<TyxNode> {
        Some(TyxNode::plain(content.into()))
    }
}

#[cfg(test)]
mod tests;
