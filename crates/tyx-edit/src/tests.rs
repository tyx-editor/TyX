use std::path::PathBuf;

use super::*;

/// Makes snapshot tests for the given function.
/// The fixtures used for snapshot testing are in the `src/fixtures/{name}`
/// directory.
fn snapshot_testing(name: &str, f: &impl Fn(LspWorld, PathBuf)) {
    tinymist_tests::snapshot_testing!(name, |verse, path| {
        f(verse.snapshot(), path);
    });
}

#[test]
fn test_preview() {
    snapshot_testing("integration", &|world, _path| {
        let result = preview(&world).unwrap_or_else(|| "null".into());
        insta::assert_binary_snapshot!(".html", result.into_bytes());
    });
}
