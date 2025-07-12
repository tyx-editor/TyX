use std::{path::PathBuf, sync::Arc};

use serde::Serialize;
use tinymist_project::LspWorld;

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
    let doc = crate::convert(Arc::new(world));
    // to pretty with indent 1
    let mut w = Vec::new();
    let mut s = serde_json::Serializer::with_formatter(
        &mut w,
        serde_json::ser::PrettyFormatter::with_indent(b" "),
    );
    let node = doc.map(|doc| doc.content);
    node.serialize(&mut s).expect("failed to serialize");
    String::from_utf8(w).expect("invalid utf8")
}
