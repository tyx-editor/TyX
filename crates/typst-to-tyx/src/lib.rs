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
    TyXNode::TextNode(s::TyXTextNode {
        format: 0,
        text,
        type_: "text".into(),
        extra: Default::default(),
    })
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

    if let TyXNode::RootNode(root) = content {
        Some(s::TyXDocument {
            schema: Some("https://tyx-editor.com/schemas/tyx-document.schema.json".into()),
            // TODO: use the version from Tauri
            version: "0.2.1".into(),
            preamble: None,
            content: Some(s::TyXDocumentContent { root }),
            settings,
            filename: None,
            dirty: Some(false),
        })
    } else {
        None
    }
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
        if let TyXNode::TextNode(text) = node {
            text.format |= mask as i64;
        }
        match node {
            TyXNode::RootNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::ParagraphNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::ListNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::ListItemNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::QuoteNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::CodeNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::TableNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::TableRowNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::TableCellNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::LinkNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            TyXNode::HeadingNode(node) => {
                for child in node.children.iter_mut() {
                    Converter::text_format(mask, child);
                }
            }
            _ => {}
        }
    }

    /// Converts a markdown document.
    fn document(&self, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::RootNode(s::TyXRootNode {
            type_: "root".into(),
            children: self.children(nodes),
            direction: None,
            extra: Default::default(),
        }))
    }

    /// Converts a thematic break.
    fn thematic_break(&self) -> Option<TyXNode> {
        Some(TyXNode::HorizontalRuleNode(s::TyXHorizontalRuleNode {
            type_: "horizontalrule".into(),
            extra: Default::default(),
        }))
    }

    /// Converts a heading.
    fn heading(&self, level: u8, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        let tag = match level {
            1 => s::TyXHeadingNodeTag::H1,
            2 => s::TyXHeadingNodeTag::H2,
            3 => s::TyXHeadingNodeTag::H3,
            4 => s::TyXHeadingNodeTag::H4,
            5 => s::TyXHeadingNodeTag::H5,
            6 => s::TyXHeadingNodeTag::H6,
            _ => return None,
        };
        Some(TyXNode::HeadingNode(s::TyXHeadingNode {
            type_: "heading".into(),
            children: self.children(nodes),
            tag,
            extra: Default::default(),
        }))
    }

    /// Converts a code block.
    fn code_block(&self, language: Option<EcoString>, content: EcoString) -> Option<TyXNode> {
        Some(TyXNode::CodeNode(s::TyXCodeNode {
            type_: "code".into(),
            children: vec![plain(content.into())],
            language: language.map(|x| x.into()),
            extra: Default::default(),
        }))
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
        Some(TyXNode::ParagraphNode(s::TyXParagraphNode {
            type_: "paragraph".into(),
            children: self.children(nodes),
            direction: None,
            format: s::TyXParagraphNodeFormat::X,
            extra: Default::default(),
        }))
    }

    /// Converts a block quote.
    fn block_quote(&self, nodes: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::QuoteNode(s::TyXQuoteNode {
            type_: "quote".into(),
            children: self.children(nodes),
            direction: None,
            extra: Default::default(),
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
        Some(TyXNode::ListNode(s::TyXListNode {
            type_: "list".into(),
            children,
            direction: None,
            list_type: s::TyXListNodeListType::Number,
            start: start as i64,
            extra: Default::default(),
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

        Some(TyXNode::ListNode(s::TyXListNode {
            type_: "list".into(),
            children,
            direction: None,
            list_type: s::TyXListNodeListType::Bullet,
            start: 0,
            extra: Default::default(),
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

        Some(TyXNode::ListItemNode(s::TyXListItemNode {
            type_: "listitem".into(),
            children: self.children(nodes),
            value: value.unwrap_or(0) as i64,
            extra: Default::default(),
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
                    header_children.push(TyXNode::TableCellNode(s::TyXTableCellNode {
                        type_: "tablecell".into(),
                        children: vec![child],
                        direction: None,
                        extra: Default::default(),
                    }));
                }
            }
            children.push(TyXNode::TableRowNode(s::TyXTableRowNode {
                type_: "tablerow".into(),
                children: header_children,
                extra: Default::default(),
            }));

            // todo: alignments
            let _ = alignments;
        }

        for row in rows {
            let mut row_children = Vec::new();
            for cell in row {
                if let NodeOptionOrList::Node(Some(child)) = self.work(cell) {
                    row_children.push(TyXNode::TableCellNode(s::TyXTableCellNode {
                        type_: "tablecell".into(),
                        children: vec![child],
                        direction: None,
                        extra: Default::default(),
                    }));
                }
            }
            children.push(TyXNode::TableRowNode(s::TyXTableRowNode {
                type_: "tablerow".into(),
                children: row_children,
                extra: Default::default(),
            }));
        }

        Some(TyXNode::TableNode(s::TyXTableNode {
            type_: "table".into(),
            children,
            direction: None,
            extra: Default::default(),
        }))
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

        Some(TyXNode::LinkNode(s::TyXLinkNode {
            type_: "link".into(),
            children: self.children(content),
            url: url.into(),
            extra: Default::default(),
        }))
    }

    /// Converts a reference link.
    fn reference_link(&self, label: EcoString, content: Vec<ast::Node>) -> Option<TyXNode> {
        Some(TyXNode::LinkNode(s::TyXLinkNode {
            type_: "link".into(),
            children: self.children(content),
            url: format!("#{label}"),
            extra: Default::default(),
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
        Some(TyXNode::ImageNode(s::TyXImageNode {
            type_: "image".into(),
            src: url.into(),
            extra: Default::default(),
        }))
    }

    /// Converts an autolink.
    fn autolink(&self, url: EcoString, is_email: bool) -> Option<TyXNode> {
        let _ = is_email;
        Some(TyXNode::LinkNode(s::TyXLinkNode {
            type_: "link".into(),
            children: vec![plain(url.clone().into())],
            url: url.into(),
            extra: Default::default(),
        }))
    }

    /// Converts an extended autolink.
    fn extended_autolink(&self, link: EcoString) -> Option<TyXNode> {
        Some(TyXNode::LinkNode(s::TyXLinkNode {
            type_: "link".into(),
            children: vec![plain(link.clone().into())],
            url: link.into(),
            extra: Default::default(),
        }))
    }

    /// Converts a typst html element.
    fn html_element(&self, _html_element: ast::HtmlElement) -> Option<TyXNode> {
        // todo: what is a html element
        None
    }

    /// Converts a hard break.
    fn hard_break(&self) -> Option<TyXNode> {
        Some(TyXNode::LineBreakNode(s::TyXLineBreakNode {
            type_: "linebreak".into(),
            extra: Default::default(),
        }))
    }

    /// Converts a soft break.
    fn soft_break(&self) -> Option<TyXNode> {
        // todo: soft break
        Some(TyXNode::LineBreakNode(s::TyXLineBreakNode {
            type_: "linebreak".into(),
            extra: Default::default(),
        }))
    }

    /// Converts a text node.
    fn text(&self, content: EcoString) -> Option<TyXNode> {
        Some(plain(content.into()))
    }
}
