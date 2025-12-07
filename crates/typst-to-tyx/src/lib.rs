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
//! let tyx_document = typst_to_tyx::typst_to_tyx(Arc::new(world));
//! ```
use ecow::EcoString;
pub use tinymist_project::LspWorld;

use std::sync::Arc;
use typlite::ast;

use tyx_schema::{self as s, TextFormat, TyXNode};

fn plain(text: String) -> TyXNode {
    TyXNode::Text { format: 0, text }
}

/// Converts the main document in a [`LspWorld`] to a [`TyXDocument`]
pub fn typst_to_tyx(world: Arc<LspWorld>) -> Option<s::TyXDocument> {
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
    let settings = Some(s::TyXDocumentSettings::default());

    // Generates the tyx output by walking the node
    let content = Converter.work(node);
    let NodeOptionOrList::Node(Some(content)) = content else {
        return None;
    };

    Some(s::TyXDocument {
        schema: Some("https://tyx-editor.com/schemas/tyx-document.schema.json".into()),
        version: tyx_version::VERSION.into(),
        preamble: None,
        content: Some(s::TyXDocumentContent { root: content }),
        settings,
        filename: None,
        dirty: Some(false),
    })
}

/// Converts a typst document to a TyX node
struct Converter;

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
            ast::Node::Custom(..) => NodeOptionOrList::Node(Some(plain(Default::default()))),
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
        if let TyXNode::Text { format, .. } = node {
            *format |= mask as i64;
        }
        match node {
            TyXNode::Root { children, .. }
            | TyXNode::Paragraph { children, .. }
            | TyXNode::List { children, .. }
            | TyXNode::Listitem { children, .. }
            | TyXNode::Quote { children, .. }
            | TyXNode::Code { children, .. }
            | TyXNode::Table { children, .. }
            | TyXNode::Tablerow { children, .. }
            | TyXNode::Tablecell { children, .. }
            | TyXNode::Link { children, .. }
            | TyXNode::Heading { children, .. } => {
                for child in children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            _ => {}
        }
    }

    /// Converts a markdown document.
    fn document(&self, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Root {
            children: self.children(nodes),
            direction: None,
        })
    }

    /// Converts a thematic break.
    fn thematic_break(&self) -> Option<TyXNode> {
        Some(TyXNode::Horizontalrule {})
    }

    /// Converts a heading.
    fn heading(&self, level: u8, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        let tag = match level {
            1 => s::TyXNodeTag::H1,
            2 => s::TyXNodeTag::H2,
            3 => s::TyXNodeTag::H3,
            4 => s::TyXNodeTag::H4,
            5 => s::TyXNodeTag::H5,
            6 => s::TyXNodeTag::H6,
            _ => return None,
        };
        Some(TyXNode::Heading {
            children: self.children(nodes),
            tag,
        })
    }

    /// Converts a code block.
    fn code_block(&self, language: Option<EcoString>, content: EcoString) -> Option<TyXNode> {
        Some(TyXNode::Code {
            children: vec![plain(content.into())],
            language: language.map(|x| x.into()),
        })
    }

    /// Converts a html element, e.g. `<div></div>`.
    fn html_block(&self, block: EcoString) -> Option<TyXNode> {
        // todo: what's a html block
        Some(plain(block.into()))
    }

    /// Converts a link reference definition.
    fn link_reference_definition(
        &self,
        label: EcoString,
        destination: EcoString,
        title: Option<EcoString>,
    ) -> Option<TyXNode> {
        // todo: what's a link_reference_definition
        Some(plain(format!(
            "link_reference_definition: {} {} {}",
            label,
            destination,
            title.unwrap_or_default()
        )))
    }

    /// Converts a paragraph.
    fn paragraph(&self, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Paragraph {
            children: self.children(nodes),
            direction: None,
            format: s::TyXNodeFormat::X,
        })
    }

    /// Converts a block quote.
    fn block_quote(&self, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Quote {
            children: self.children(nodes),
            direction: None,
        })
    }

    /// Converts an ordered list.
    fn ordered_list(&self, start: u32, items: Vec<ast::ListItem>) -> Option<TyXNode> {
        let mut children = Vec::new();
        for item in items {
            if let Some(child) = self.list_item(item) {
                children.push(child);
            }
        }
        Some(TyXNode::List {
            children,
            direction: None,
            list_type: s::TyXNodeListType::Number,
            start: start as i64,
        })
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

        Some(TyXNode::List {
            children,
            direction: None,
            list_type: s::TyXNodeListType::Bullet,
            start: 0,
        })
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

        Some(TyXNode::Listitem {
            children: self.children(nodes),
            value: value.unwrap_or(0) as i64,
        })
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
                    header_children.push(TyXNode::Tablecell {
                        children: vec![child],
                        direction: None,
                    });
                }
            }
            children.push(TyXNode::Tablerow {
                children: header_children,
            });

            // todo: alignments
            let _ = alignments;
        }

        for row in rows {
            let mut row_children = Vec::new();
            for cell in row {
                if let NodeOptionOrList::Node(Some(child)) = self.work(cell) {
                    row_children.push(TyXNode::Tablecell {
                        children: vec![child],
                        direction: None,
                    });
                }
            }
            children.push(TyXNode::Tablerow {
                children: row_children,
            });
        }

        Some(TyXNode::Table {
            children,
            direction: None,
        })
    }

    /// Converts an inline code.
    fn inline_code(&self, code: EcoString) -> Option<TyXNode> {
        let mut node = plain(code.into());
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
        // todo: title
        let _ = title;

        Some(TyXNode::Link {
            children: self.children(content),
            url: url.into(),
        })
    }

    /// Converts a reference link.
    fn reference_link(&self, label: EcoString, content: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::Link {
            children: self.children(content),
            url: format!("#{label}"),
        })
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
        Some(TyXNode::Image { src: url.into() })
    }

    /// Converts an autolink.
    fn autolink(&self, url: EcoString, is_email: bool) -> Option<TyXNode> {
        let _ = is_email;
        Some(TyXNode::Link {
            children: vec![plain(url.clone().into())],
            url: url.into(),
        })
    }

    /// Converts an extended autolink.
    fn extended_autolink(&self, link: EcoString) -> Option<TyXNode> {
        Some(TyXNode::Link {
            children: vec![plain(link.clone().into())],
            url: link.into(),
        })
    }

    /// Converts a typst html element.
    fn html_element(&self, _html_element: ast::HtmlElement) -> Option<TyXNode> {
        // todo: what is a html element
        None
    }

    /// Converts a hard break.
    fn hard_break(&self) -> Option<TyXNode> {
        Some(TyXNode::Linebreak {})
    }

    /// Converts a soft break.
    fn soft_break(&self) -> Option<TyXNode> {
        // todo: soft break
        Some(TyXNode::Linebreak {})
    }

    /// Converts a text node.
    fn text(&self, content: EcoString) -> Option<TyXNode> {
        Some(plain(content.into()))
    }
}
