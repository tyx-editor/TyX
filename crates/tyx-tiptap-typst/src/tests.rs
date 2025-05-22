use std::path::PathBuf;

use ecow::eco_format;
use serde::Serialize;
use tinymist_project::LspWorld;
use typst::{WorldExt, syntax::Span};

use crate::{SyntaxTree, syntax::SyntaxDecl};

/// Makes snapshot tests for the given function.
/// The fixtures used for snapshot testing are in the `src/fixtures/{name}`
/// directory.
fn snapshot_testing(name: &str, f: &impl Fn(LspWorld, PathBuf)) {
    tinymist_tests::snapshot_testing!(name, |verse, path| {
        f(verse.snapshot(), path);
    });
}

#[test]
fn convert() {
    snapshot_testing("integration", &|world, _path| {
        insta::assert_snapshot!(conv(world));
    });
}

/// Converts the given main document in the world to a string.
fn conv(world: LspWorld) -> String {
    let doc = crate::convert(world);
    let node = doc.map(|doc| doc.content);
    serialize(&node)
}

#[test]
fn instrument() {
    snapshot_testing("instrument", &|world, _path| {
        insta::assert_snapshot!(instr(world));
    });
}

/// Converts the given main document in the world to a string.
fn instr(world: LspWorld) -> String {
    let doc = crate::instrument(&world).map(|(doc, _)| resolve_span(&world, doc));
    serialize(&doc)
}

fn resolve_span(world: &LspWorld, doc: SyntaxTree) -> SyntaxTree {
    match doc {
        SyntaxTree::Markup(decl) => {
            let span = u64::from_str_radix(&decl.span, 16).unwrap();
            let range = world
                .range(Span::from_raw(span.try_into().unwrap()))
                .unwrap();
            SyntaxTree::Markup(SyntaxDecl {
                span: eco_format!("{range:?}"),
                content: decl.content,
                semi: decl.semi,
            })
        }
        SyntaxTree::Decl(decl) => {
            let span = u64::from_str_radix(&decl.span, 16).unwrap();
            let range = world
                .range(Span::from_raw(span.try_into().unwrap()))
                .unwrap();
            SyntaxTree::Decl(SyntaxDecl {
                span: eco_format!("{range:?}"),
                content: decl.content,
                semi: decl.semi,
            })
        }
        SyntaxTree::Content(children) => {
            let children = children
                .into_iter()
                .map(|child| resolve_span(world, child))
                .collect();
            SyntaxTree::Content(children)
        }
    }
}

// to pretty with indent 1
fn serialize<T: Serialize>(value: &T) -> String {
    let mut w = Vec::new();
    let mut s = serde_json::Serializer::with_formatter(
        &mut w,
        serde_json::ser::PrettyFormatter::with_indent(b" "),
    );
    value.serialize(&mut s).expect("failed to serialize");
    String::from_utf8(w).expect("invalid utf8")
}
