//! XXX

use tinymist_project::LspWorld;

/// Converts into a html document for preview.
pub fn preview(world: &LspWorld) -> Option<String> {
    let mut doc = typst::compile::<typst::html::HtmlDocument>(world.html_task().as_ref())
        .output
        .ok()?;

    let body = doc.root.children.iter().find_map(|child| match child {
        typst::html::HtmlNode::Element(element) if element.tag == typst::html::tag::body => {
            Some(element.clone())
        }
        _ => None,
    })?;

    doc.root = body;

    typst_html::html(&doc).ok()
}

#[cfg(test)]
mod tests;
