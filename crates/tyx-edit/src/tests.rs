use std::{collections::HashMap, ops::Range, path::PathBuf, sync::LazyLock};

use typst::{World, WorldExt};

use super::*;

/// Makes snapshot tests for the given function.
/// The fixtures used for snapshot testing are in the `src/fixtures/{name}`
/// directory.
fn snapshot_testing(name: &str, f: &impl Fn(LspWorld, PathBuf)) {
    tinymist_tests::snapshot_testing!(name, |verse, path| {
        f(verse.snapshot(), path);
    });
}

static JUMP: LazyLock<HashMap<String, Vec<HtmlPath>>> = LazyLock::new(|| {
    let mut map = HashMap::new();
    map.insert(
        "equation.typ".into(),
        vec![HtmlPath {
            element_path: vec![1, 0, 0],
            frame_pos: Some((1., 1.)),
        }],
    );
    map
});

#[test]
fn test_preview() {
    snapshot_testing("integration", &|world, _path| {
        let result = preview(&world);
        let doc = result.as_ref().map(|(doc, _)| doc);
        let html_content = result
            .as_ref()
            .map(|(_, body)| body.as_str())
            .unwrap_or("null")
            .as_bytes()
            .to_owned();

        let file_name = _path
            .file_name()
            .unwrap_or_default()
            .to_str()
            .unwrap_or("null");

        let jumps = JUMP
            .get(file_name)
            .unwrap_or(&vec![])
            .iter()
            .zip(std::iter::repeat(doc))
            .map(|(path, doc)| {
                let (range, text) = doc
                    .and_then(|doc| {
                        let span_offset = jump_from_html_path(&world, doc, path)?;
                        let Range { start, end } = world.range(span_offset.span)?;
                        let range = Range {
                            start: start.saturating_add(span_offset.offset),
                            end: end.saturating_add(span_offset.offset),
                        };
                        let text = span_offset.span.id().and_then(|file_id| {
                            let source = world.source(file_id).ok()?;
                            Some(format!(" {}", &source.text()[range.clone()]))
                        });
                        Some((range, text.unwrap_or_default()))
                    })
                    .unwrap_or_default();

                format!("{path:?} => {range:?}{text}")
            })
            .collect::<Vec<_>>()
            .join("\n");

        let hash = tinymist_std::hash::hash128(&html_content);
        insta::with_settings!({
            description => format!("siphash128_13: {hash:016x}"),
        }, {
            insta::assert_snapshot!("jumps", jumps);
            insta::assert_binary_snapshot!(".html", html_content);
        })
    });
}
