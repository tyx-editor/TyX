use ecow::{EcoString, eco_format};
use serde::{Deserialize, Serialize};
use tinymist_project::LspWorld;
use typst::syntax::{Source, SyntaxKind, SyntaxNode};
use typst::{World, foundations::Bytes};
use tyx_tiptap_schema::TyxNode;

/// Instruments the main document in a [`LspWorld`] and constructs a
/// [`SyntaxTree`] for wysiwyg editing.
pub fn instrument(world: &LspWorld) -> Option<(SyntaxTree, Bytes)> {
    let src = world.source(world.main()).ok()?;

    let mut worker = InstrumentWorker::default();
    let node = worker.convert(&src);
    let changed = Bytes::from_string(worker.out);

    Some((node, changed))
}

#[derive(Default)]
struct InstrumentWorker {
    out: String,
}

impl InstrumentWorker {
    fn convert(&mut self, src: &Source) -> SyntaxTree {
        self.node(src.root())
    }

    fn node(&mut self, node: &SyntaxNode) -> SyntaxTree {
        match node.kind() {
            SyntaxKind::Markup => {
                let mut children = vec![];
                for child in node.children() {
                    if matches!(child.kind(), SyntaxKind::Hash) {
                        self.out.push_str(child.text());
                        continue;
                    }
                    if matches!(child.kind(), SyntaxKind::Semicolon) {
                        if let Some(SyntaxTree::Markup(decl) | SyntaxTree::Decl(decl)) =
                            children.last_mut()
                        {
                            decl.semi = true
                        }

                        self.out.push_str(child.text());
                        continue;
                    }

                    let child = self.node(child);
                    children.push(child);
                }
                SyntaxTree::Content(children)
            }
            _ => self.generic(node),
        }
    }

    // Trivial transform
    fn generic(&mut self, node: &SyntaxNode) -> SyntaxTree {
        if node.children().as_slice().is_empty() {
            self.out.push_str(node.text());
        } else {
            for child in node.children() {
                self.generic(child);
            }
        }

        let decl = SyntaxDecl {
            span: eco_format!("{:x}", node.span().into_raw()),
            content: node.clone().into_text(),
            semi: false,
        };

        use SyntaxKind::*;
        match node.kind() {
            Bool | Str | Int | Float | Ident | LetBinding | ShowRule | SetRule | ModuleImport
            | ModuleInclude | Binary | Unary | DestructAssignment => SyntaxTree::Decl(decl),
            _ => SyntaxTree::Markup(decl),
        }
    }
}

/// A syntax tree for wysiwyg editing.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub enum SyntaxTree {
    /// A content block.
    Content(Vec<SyntaxTree>),
    /// A markup node.
    Markup(SyntaxDecl),
    /// A block node.
    Decl(SyntaxDecl),
}

/// A syntax declaration.
#[derive(Debug, Clone, Hash, Serialize, Deserialize)]
pub struct SyntaxDecl {
    pub span: EcoString,
    pub content: EcoString,
    pub semi: bool,
}

pub(crate) struct SyntaxConverter;

impl SyntaxConverter {
    pub(crate) fn synth(&self, node: TyxNode) -> Option<TyxNode> {
        Some(node)
    }
}
