//! Converts a Typst document to TyX elements, using `typlite`.
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
//! let tyx_document = tyx_import_typst::convert(Arc::new(world));
//! ```

use ecow::EcoString;
use serde::{Deserialize, Serialize};
pub use tinymist_project::LspWorld;

use std::sync::Arc;
use typlite::ast;

use tyx_schema::{self as s, Editor, Node as TyXNode, TextFormat};

/// The settings for the TyX document.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TyXSettings {
    /// The title of the document.
    pub title: Option<EcoString>,
}

/// A TyX document.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct TyXDocument {
    /// The version of TyX used to generate the document.
    pub version: String,
    /// The Typst preamble of the document.
    pub preamble: String,
    /// The root node of the document.
    pub content: Editor,
    /// The settings for the document.
    pub settings: TyXSettings,
    /// The filename of the document.
    pub filename: String,
    /// Whether the document is dirty.
    pub dirty: bool,
}

/// Converts the main document in a [`LspWorld`] to a [`TyXDocument`]
pub fn convert(world: Arc<LspWorld>) -> Option<TyXDocument> {
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
    let settings = TyXSettings {
        // The base typst document used for introspection.
        title: md_doc.base.info.title.clone(),
    };

    // Generates the tyx output by walking the node
    let content = Converter.work(node);
    let NodeOptionOrList::Node(Some(content)) = content else {
        return None;
    };

    Some(TyXDocument {
        // TODO: use the version from Tauri
        version: "0.2.1".into(),
        preamble: "".into(),
        content: Editor {
            root: Some(Box::new(content)),
        },
        settings,
        filename: String::new(),
        dirty: false,
    })
}

/// Converts a typst document to a TyX node
struct Converter;

#[derive(Debug, Clone, Hash)]
enum NodeOptionOrList {
    Node(Option<TyXNode>),
    List(Vec<TyXNode>),
}

impl Converter {
    /// The main work function.
    fn work(&self, node: ast::Node) -> NodeOptionOrList {
        match node {
            ast::Node::Document(nodes) => NodeOptionOrList::Node(self.document(nodes)),
            ast::Node::ThematicBreak => NodeOptionOrList::Node(self.thematic_break()),
            ast::Node::Heading {
                level,
                content,
                heading_type: _,
            } => NodeOptionOrList::Node(self.heading(level, content)),
            ast::Node::CodeBlock {
                language,
                content,
                block_type: _,
            } => NodeOptionOrList::Node(self.code_block(language, content)),
            ast::Node::HtmlBlock(block) => NodeOptionOrList::Node(self.html_block(block)),
            ast::Node::LinkReferenceDefinition {
                label,
                destination,
                title,
            } => NodeOptionOrList::Node(self.link_reference_definition(label, destination, title)),
            ast::Node::Paragraph(nodes) => NodeOptionOrList::Node(self.paragraph(nodes)),
            ast::Node::BlockQuote(nodes) => NodeOptionOrList::Node(self.block_quote(nodes)),
            ast::Node::OrderedList { start, items } => {
                NodeOptionOrList::Node(self.ordered_list(start, items))
            }
            ast::Node::UnorderedList(list_items) => {
                NodeOptionOrList::Node(self.unordered_list(list_items))
            }
            ast::Node::Table {
                headers,
                alignments,
                rows,
            } => NodeOptionOrList::Node(self.table(headers, alignments, rows)),
            ast::Node::InlineCode(code) => NodeOptionOrList::Node(self.inline_code(code)),
            ast::Node::Emphasis(nodes) => NodeOptionOrList::List(self.emphasis(nodes)),
            ast::Node::Strong(nodes) => NodeOptionOrList::List(self.strong(nodes)),
            ast::Node::Strikethrough(nodes) => NodeOptionOrList::List(self.strikethrough(nodes)),
            ast::Node::Link {
                url,
                title,
                content,
            } => NodeOptionOrList::Node(self.link(url, title, content)),
            ast::Node::ReferenceLink { label, content } => {
                NodeOptionOrList::Node(self.reference_link(label, content))
            }
            ast::Node::Image { url, title, alt } => {
                NodeOptionOrList::Node(self.image(url, title, alt))
            }
            ast::Node::Autolink { url, is_email } => {
                NodeOptionOrList::Node(self.autolink(url, is_email))
            }
            ast::Node::ExtendedAutolink(link) => {
                NodeOptionOrList::Node(self.extended_autolink(link))
            }
            ast::Node::HtmlElement(html_element) => {
                NodeOptionOrList::Node(self.html_element(html_element))
            }
            ast::Node::HardBreak => NodeOptionOrList::Node(self.hard_break()),
            ast::Node::SoftBreak => NodeOptionOrList::Node(self.soft_break()),
            ast::Node::Text(content) => NodeOptionOrList::Node(self.text(content)),
            ast::Node::Custom(..) => {
                NodeOptionOrList::Node(Some(TyXNode::plain(Default::default())))
            }
        }
    }

    /// Converts a list of markdown nodes.
    fn children(&self, nodes: Vec<ast::Node>) -> Vec<TyXNode> {
        let mut children = Vec::new();
        for node in nodes {
            match self.work(node) {
                NodeOptionOrList::Node(Some(child)) => {
                    children.push(child);
                }
                NodeOptionOrList::List(list) => {
                    children.extend(list);
                }
                _ => {}
            }
        }
        children
    }

    /// Applies the given text format to any child text nodes.
    fn text_format(mask: u64, node: &mut TyXNode) {
        if let TyXNode::Text(text) = node {
            text.format |= mask;
        }
        match node {
            TyXNode::Root(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::Paragraph(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::List(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::ListItem(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::Quote(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::Code(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::Table(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::TableRow(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::TableCell(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::Link(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::Heading(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            _ => {}
        }
    }

    /// Converts a markdown document.
    fn document(&self, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Root(s::Root {
            version: 1,
            children: self.children(nodes),
            format: "".into(),
            indent: 0,
            direction: None,
            text_format: None,
            text_style: None,
        }))
    }

    /// Converts a thematic break.
    fn thematic_break(&self) -> Option<TyXNode> {
        Some(TyXNode::HorizontalRule(s::HorizontalRule { version: 1 }))
    }

    /// Converts a heading.
    fn heading(&self, level: u8, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Heading(s::Heading {
            version: 1,
            children: self.children(nodes),
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            tag: format!("h{level}").into(),
        }))
    }

    /// Converts a code block.
    fn code_block(&self, language: Option<EcoString>, content: EcoString) -> Option<TyXNode> {
        Some(TyXNode::Code(s::Code {
            version: 1,
            children: vec![TyXNode::plain(content)],
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            language,
        }))
    }

    /// Converts a html element, e.g. `<div></div>`.
    fn html_block(&self, block: EcoString) -> Option<TyXNode> {
        // todo: what's a html block
        Some(TyXNode::plain(block))
    }

    /// Converts a link reference definition.
    fn link_reference_definition(
        &self,
        label: EcoString,
        destination: EcoString,
        title: Option<EcoString>,
    ) -> Option<TyXNode> {
        // todo: what's a link_reference_definition
        Some(TyXNode::plain(
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
    fn paragraph(&self, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Paragraph(s::Paragraph {
            version: 1,
            children: self.children(nodes),
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
        }))
    }

    /// Converts a block quote.
    fn block_quote(&self, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Quote(s::Quote {
            version: 1,
            children: self.children(nodes),
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
        }))
    }

    /// Converts an ordered list.
    fn ordered_list(&self, start: u32, items: Vec<ast::ListItem>) -> Option<TyXNode> {
        let mut children = Vec::new();
        for item in items {
            if let Some(child) = self.list_item(item) {
                children.push(child);
            }
        }
        Some(TyXNode::List(s::List {
            version: 1,
            children,
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            list_type: "number".into(),
            start: start as u64,
            tag: "ol".into(),
        }))
    }

    /// Converts an unordered list.
    fn unordered_list(&self, list_items: Vec<ast::ListItem>) -> Option<TyXNode> {
        // bulletList
        let mut children = Vec::new();
        for item in list_items {
            if let Some(child) = self.list_item(item) {
                children.push(child);
            }
        }

        Some(TyXNode::List(s::List {
            version: 1,
            children,
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            list_type: "bullet".into(),
            start: 0,
            tag: "ul".into(),
        }))
    }

    /// Converts a list item.
    fn list_item(&self, item: ast::ListItem) -> Option<TyXNode> {
        // todo: preserve id.
        let value = match &item {
            ast::ListItem::Ordered { number, .. } => *number,
            _ => None,
        };
        let nodes = match item {
            ast::ListItem::Unordered { content, .. } => content,
            ast::ListItem::Ordered { content, .. } => content,
            ast::ListItem::Task { content, .. } => content,
        };

        Some(TyXNode::ListItem(s::ListItem {
            version: 1,
            children: self.children(nodes),
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            checked: None,
            value: value.unwrap_or(0) as u64,
        }))
    }

    /// Converts a table.
    fn table(
        &self,
        headers: Vec<ast::Node>,
        alignments: Vec<ast::TableAlignment>,
        rows: Vec<Vec<ast::Node>>,
    ) -> Option<TyXNode> {
        let mut children = Vec::new();
        {
            let mut header_children = Vec::new();
            for header in headers {
                if let NodeOptionOrList::Node(Some(child)) = self.work(header) {
                    header_children.push(TyXNode::TableCell(s::TableCell {
                        version: 1,
                        children: vec![child],
                        direction: None,
                        format: "".into(),
                        indent: 0,
                        text_format: None,
                        text_style: None,
                        col_span: None,
                        row_span: None,
                        header_state: 1,
                        width: None,
                        background_color: None,
                        vertical_align: None,
                    }));
                }
            }
            children.push(TyXNode::TableRow(s::TableRow {
                version: 1,
                children: header_children,
                direction: None,
                format: "".into(),
                indent: 0,
                text_format: None,
                text_style: None,
                height: None,
            }));

            // todo: alignments
            let _ = alignments;
        }

        for row in rows {
            let mut row_children = Vec::new();
            for cell in row {
                if let NodeOptionOrList::Node(Some(child)) = self.work(cell) {
                    row_children.push(TyXNode::TableCell(s::TableCell {
                        version: 1,
                        children: vec![child],
                        direction: None,
                        format: "".into(),
                        indent: 0,
                        text_format: None,
                        text_style: None,
                        col_span: None,
                        row_span: None,
                        header_state: 0,
                        width: None,
                        background_color: None,
                        vertical_align: None,
                    }));
                }
            }
            children.push(TyXNode::TableRow(s::TableRow {
                version: 1,
                children: row_children,
                direction: None,
                format: "".into(),
                indent: 0,
                text_format: None,
                text_style: None,
                height: None,
            }));
        }

        Some(TyXNode::Table(s::Table {
            version: 1,
            children,
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
        }))
    }

    /// Converts an inline code.
    fn inline_code(&self, code: EcoString) -> Option<TyXNode> {
        let mut node = TyXNode::plain(code);
        Converter::text_format(TextFormat::Code as u64, &mut node);
        Some(node)
    }

    /// Converts an emphasis.
    fn emphasis(&self, nodes: Vec<ast::Node>) -> Vec<TyXNode> {
        let mut worked = self.children(nodes);
        for node in worked.iter_mut() {
            // todo: we loss semantics here, assuming `emphasis` => `italic`.
            Converter::text_format(TextFormat::Italic as u64, node);
        }
        worked
    }

    /// Converts a strong.
    fn strong(&self, nodes: Vec<ast::Node>) -> Vec<TyXNode> {
        let mut worked = self.children(nodes);
        for node in worked.iter_mut() {
            // todo: we loss semantics here, assuming `strong` => `bold`.
            Converter::text_format(TextFormat::Bold as u64, node);
        }
        worked
    }

    /// Converts a strikethrough.
    fn strikethrough(&self, nodes: Vec<ast::Node>) -> Vec<TyXNode> {
        let mut worked = self.children(nodes);
        for node in worked.iter_mut() {
            Converter::text_format(TextFormat::Strikethrough as u64, node);
        }
        worked
    }

    /// Converts a link.
    fn link(
        &self,
        url: EcoString,
        title: Option<EcoString>,
        content: Vec<ast::Node>,
    ) -> Option<TyXNode> {
        Some(TyXNode::Link(s::Link {
            version: 1,
            children: self.children(content),
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            rel: None,
            target: None,
            title,
            url,
        }))
    }

    /// Converts a reference link.
    fn reference_link(&self, label: EcoString, content: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Link(s::Link {
            version: 1,
            children: self.children(content),
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            rel: None,
            target: None,
            title: None,
            url: format!("#{label}").into(),
        }))
    }

    /// Converts an image.
    fn image(
        &self,
        url: EcoString,
        title: Option<EcoString>,
        alt: Vec<ast::Node>,
    ) -> Option<TyXNode> {
        let _ = title;
        let _ = alt;
        // todo: use title and alt
        Some(TyXNode::Image(s::Image {
            version: 1,
            src: url,
        }))
    }

    /// Converts an autolink.
    fn autolink(&self, url: EcoString, is_email: bool) -> Option<TyXNode> {
        let _ = is_email;
        Some(TyXNode::Link(s::Link {
            version: 1,
            children: vec![TyXNode::plain(url.clone())],
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            rel: None,
            target: None,
            title: None,
            url,
        }))
    }

    /// Converts an extended autolink.
    fn extended_autolink(&self, link: EcoString) -> Option<TyXNode> {
        Some(TyXNode::Link(s::Link {
            version: 1,
            children: vec![TyXNode::plain(link.clone())],
            direction: None,
            format: "".into(),
            indent: 0,
            text_format: None,
            text_style: None,
            rel: None,
            target: None,
            title: None,
            url: link,
        }))
    }

    /// Converts a typst html element.
    fn html_element(&self, _html_element: ast::HtmlElement) -> Option<TyXNode> {
        // todo: what is a html element
        None
    }

    /// Converts a hard break.
    fn hard_break(&self) -> Option<TyXNode> {
        Some(TyXNode::LineBreak(s::LineBreak { version: 1 }))
    }

    /// Converts a soft break.
    fn soft_break(&self) -> Option<TyXNode> {
        // todo: soft break
        Some(TyXNode::LineBreak(s::LineBreak { version: 1 }))
    }

    /// Converts a text node.
    fn text(&self, content: EcoString) -> Option<TyXNode> {
        Some(TyXNode::plain(content))
    }
}

#[cfg(test)]
mod tests;
