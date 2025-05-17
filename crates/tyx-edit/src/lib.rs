//! XXX

#![allow(missing_docs)]

use html::static_html;
use tinymist_project::{LspWorld, base::debug_loc::SourceSpanOffset};
use typst::{
    html::{HtmlDocument, HtmlNode},
    layout::{Abs, Point},
};

mod html;

/// Converts into a html document for preview.
pub fn preview(world: &LspWorld) -> Option<(typst::html::HtmlDocument, String)> {
    let doc = typst::compile::<typst::html::HtmlDocument>(world.html_task().as_ref())
        .output
        .ok()?;

    let body = static_html(&doc).ok()?.body;
    Some((doc, body))
}

#[derive(Debug, Clone)]
pub struct HtmlPath {
    // (Vec<usize>, Option<Point>)
    pub element_path: Vec<usize>,
    pub frame_pos: Option<(f32, f32)>,
}

/// Jumps from html path.
pub fn jump_from_html_path(
    world: &LspWorld,
    doc: &HtmlDocument,
    path: &HtmlPath,
) -> Option<SourceSpanOffset> {
    let mut elem = &doc.root;
    let mut leaf = None;
    for &index in &path.element_path {
        // println!(
        //     "Jumping to: {index} {}({:?})",
        //     elem.tag,
        //     world.range(elem.span),
        // );
        let child = elem.children.get(index)?;
        match child {
            typst::html::HtmlNode::Element(e) => {
                elem = e;
            }
            _ => {
                leaf = Some(child);
            }
        }
    }

    // println!("Jumping to: {leaf:?}");

    match leaf {
        None | Some(HtmlNode::Tag(..)) => None,
        Some(HtmlNode::Text(_, span)) => {
            // todo: sub range in a text element.
            Some((*span).into())
        }
        Some(HtmlNode::Frame(frame)) => {
            let (x, y) = path.frame_pos?;
            let click = Point::new(Abs::pt(x as f64), Abs::pt(y as f64));

            Some(tinymist_query::jump_from_click(world, frame, click)?.0)
        }
        Some(HtmlNode::Element(e)) => Some(e.span.into()),
    }
}

/// Performs click reaction.
pub fn click(world: &LspWorld, doc: &HtmlDocument, span: &SourceSpanOffset) -> Option<String> {
    let _ = doc;
    let _ = span;

    // todo: real patch impl
    let (_, html_content) = preview(world)?;
    Some(html_content)
}

#[cfg(test)]
mod tests;
