use ecow::EcoString;
use tinymist_project::{LspWorld, base::ShadowApi};
use typst::syntax::{Source, SyntaxNode};
use typst::{World, foundations::Bytes};
use tyx_tiptap_schema::TyxNode;

/// Instruments the main document in a [`LspWorld`] and constructs a
/// [`SyntaxTree`] for wysiwyg editing.
pub fn instrument(world: &mut LspWorld) -> Option<SyntaxTree> {
    let src = world.source(world.main()).ok()?;

    let changed = Bytes::from_string(InstrumentWorker::default().convert(&src));
    world.map_shadow_by_id(src.id(), changed).ok()?;

    Some(SyntaxTree::Markup(EcoString::new()))
}

#[derive(Default)]
struct InstrumentWorker {
    out: String,
}

impl InstrumentWorker {
    fn convert(mut self, src: &Source) -> String {
        self.node(src.root());
        self.out
    }

    fn node(&mut self, node: &SyntaxNode) {
        let mut out = String::new();

        // Trivial transform
        if node.children().as_slice().is_empty() {
            out.push_str(node.text());
        } else {
            for child in node.children() {
                self.node(child);
                out.push_str(child.text());
            }
        }

        self.out.push_str(&out);
    }
}

/// A syntax tree for wysiwyg editing.
pub enum SyntaxTree {
    /// A text node.
    Markup(EcoString),
    /// A block node.
    Decl(SyntaxNode),
}

pub(crate) struct SyntaxConverter;

impl SyntaxConverter {
    pub(crate) fn synth(&self, node: TyxNode) -> Option<TyxNode> {
        Some(node)
    }
}
