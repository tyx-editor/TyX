//! XXX

use html::static_html;
use tinymist_project::LspWorld;

mod html;

/// Converts into a html document for preview.
pub fn preview(world: &LspWorld) -> Option<String> {
    let doc = typst::compile::<typst::html::HtmlDocument>(world.html_task().as_ref())
        .output
        .ok()?;

    Some(static_html(&doc).ok()?.body)
}

#[cfg(test)]
mod tests;
