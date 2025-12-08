//! Converts a TyX document to a Typst string.
use std::{collections::HashMap, sync::LazyLock};

use regex::{Captures, Regex};
use tyx_schema::*;

fn get_tag_number(tag: &TyXNodeTag) -> i64 {
    match tag {
        TyXNodeTag::H1 => 1,
        TyXNodeTag::H2 => 2,
        TyXNodeTag::H3 => 3,
        TyXNodeTag::H4 => 4,
        TyXNodeTag::H5 => 5,
        TyXNodeTag::H6 => 6,
    }
}

/// Converts TyX nodes to text by joining their texts together.
fn nodes_to_text(nodes: &[TyXNode]) -> String {
    nodes
        .iter()
        .map(node_to_text)
        .collect::<Vec<String>>()
        .join("")
}

/// Converts a TyX node to text.
fn node_to_text(node: &TyXNode) -> String {
    let result = match node {
        TyXNode::Root { children, .. }
        | TyXNode::Paragraph { children, .. }
        | TyXNode::Listitem { children, .. }
        | TyXNode::List { children, .. }
        | TyXNode::Code { children, .. }
        | TyXNode::Quote { children, .. }
        | TyXNode::Table { children, .. }
        | TyXNode::Tablerow { children, .. }
        | TyXNode::Tablecell { children, .. }
        | TyXNode::Link { children, .. }
        | TyXNode::Heading { children, .. } => Some(nodes_to_text(children)),
        TyXNode::Text { text, .. } => Some(text.clone()),
        TyXNode::Math { typst, .. } => typst.clone(),
        TyXNode::Linebreak => Some("\n".into()),
        TyXNode::Typstcode { text, .. } => Some(node_to_text(&text.editor_state.root)),
        _ => None,
    };

    result.unwrap_or("".into())
}

/// Applies the given direction to the output Typst code.
fn apply_direction(result: &str, direction: TyXDirection) -> String {
    match direction.0 {
        Some(d) => format!("#text(dir: {d})[{result}]"),
        None => result.into(),
    }
}

/// Applies the given text format to the output Typst code.
fn apply_text_format(mut result: String, text: &str, format: i64) -> String {
    if format & (TextFormat::Bold as i64) != 0 {
        result = format!("#strong[{result}]");
    }
    if format & (TextFormat::Italic as i64) != 0 {
        result = format!("#emph[{result}]");
    }
    if format & (TextFormat::Underline as i64) != 0 {
        result = format!("#underline[{result}]");
    }
    if format & (TextFormat::Strikethrough as i64) != 0 {
        result = format!("#strike[{result}]");
    }
    if format & (TextFormat::Subscript as i64) != 0 {
        result = format!("#sub[{result}]");
    }
    if format & (TextFormat::Superscript as i64) != 0 {
        result = format!("#super[{result}]");
    }
    if format & (TextFormat::Code as i64) != 0 {
        result = format!("#raw({})", serde_json::to_string(text).unwrap());
    }

    result
}

/// Applies the given alignment format to the output Typst code.
fn apply_format(result: &str, format: &str) -> String {
    if format == "justify" {
        format!("#par(justify: true)[{result}]")
    } else if format == "left"
        || format == "center"
        || format == "right"
        || format == "start"
        || format == "end"
    {
        format!("#align({format})[{result}]")
    } else {
        result.into()
    }
}

/// Joins the children's Typst code, and adds newlines between paragraph children.
fn children_to_typst(children: &[TyXNode]) -> String {
    let mut result = String::new();
    let translated = children.iter().map(node_to_typst).collect::<Vec<_>>();
    for i in 0..translated.len() {
        result += &translated[i].clone().unwrap_or_default();
        if let TyXNode::Paragraph { .. } = children[i]
            && i != translated.len() - 1
        {
            result += "\n\n"
        }
    }
    result
}

/// Escapes special Typst symbols.
fn typst_escape(text: &str) -> String {
    static TYPST_SPECIAL_SYMBOL_REGEX: LazyLock<Regex> =
        LazyLock::new(|| Regex::new("[#=\\[\\]$*_`@<\\-+/\\'\\\"~]").unwrap());
    TYPST_SPECIAL_SYMBOL_REGEX
        .replace_all(text, |c: &Captures| String::from("\\") + &c[0])
        .to_string()
}

/// Converts a TyX node to Typst code.
fn node_to_typst(root: &TyXNode) -> Option<String> {
    match root {
        TyXNode::Root {
            children,
            direction,
            ..
        }
        | TyXNode::Tablecell {
            children,
            direction,
            ..
        } => Some(apply_direction(
            &children_to_typst(children),
            direction.clone().unwrap_or(TyXDirection(None)),
        )),
        TyXNode::Quote {
            children,
            direction,
            ..
        } => Some(apply_direction(
            &format!("#quote(block: true)[{}]", children_to_typst(children)),
            direction.clone().unwrap_or(TyXDirection(None)),
        )),
        TyXNode::Paragraph {
            children,
            direction,
            format,
            ..
        } => Some(apply_direction(
            &apply_format(&children_to_typst(children), &format!("{format}")),
            direction.clone().unwrap_or(TyXDirection(None)),
        )),
        TyXNode::Text { text, format, .. } => {
            Some(apply_text_format(typst_escape(text), text, *format))
        }
        TyXNode::Tab { .. } => Some("\t".into()),
        TyXNode::CodeHighlight { text, .. } => Some(typst_escape(text)),
        TyXNode::Math { typst, inline, .. } => {
            if inline.unwrap_or(false) {
                Some(format!("${}$", typst.clone().unwrap_or_default()))
            } else {
                Some(format!("$ {} $\n", typst.clone().unwrap_or_default()))
            }
        }
        TyXNode::Listitem { children, .. } => Some(children_to_typst(children)),
        TyXNode::List {
            children,
            direction,
            list_type,
            start,
            ..
        } => {
            let mut result = match list_type {
                TyXNodeListType::Bullet => "\n#list(".into(),
                TyXNodeListType::Number => format!("\n#enum(start: {start},"),
                _ => return None,
            };

            for i in 0..(children.len() - 1) {
                result += &format!("[{}]", node_to_typst(&children[i]).unwrap_or_default());

                let delimiter = if let TyXNode::Listitem {
                    children: item_children,
                    ..
                } = &children[i + 1]
                    && let TyXNode::List { .. } = item_children[0]
                {
                    " + "
                } else {
                    ", "
                };
                result += delimiter;
            }

            if let Some(last) = children.last() {
                result += &format!("[{}]", node_to_typst(last).unwrap_or_default());
            }

            result += ")\n";

            Some(apply_direction(
                &result,
                direction.clone().unwrap_or(TyXDirection(None)),
            ))
        }
        TyXNode::Code { language, .. } => Some(format!(
            "#text(dir: ltr)[#raw(block: true, lang: {}, {})]",
            serde_json::to_string(&language.clone().unwrap_or("none".into())).unwrap(),
            serde_json::to_string(&node_to_text(root)).unwrap()
        )),
        TyXNode::Table {
            children,
            direction,
            ..
        } => {
            let Some(TyXNode::Tablerow {
                children: row_children,
            }) = children.first()
            else {
                return None;
            };
            let columns = (0..row_children.len())
                .map(|_| String::from("1fr"))
                .collect::<Vec<String>>()
                .join(", ");
            let children = children
                .iter()
                .map(|child| node_to_typst(child).unwrap_or_default())
                .collect::<Vec<String>>()
                .join(", ");

            Some(apply_direction(
                &format!("#table(columns: ({columns}), {children})"),
                direction.clone().unwrap_or(TyXDirection(None)),
            ))
        }
        TyXNode::Tablerow { children, .. } => Some(
            children
                .iter()
                .map(|child| format!("[{}]", node_to_typst(child).unwrap_or_default()))
                .collect::<Vec<String>>()
                .join(", "),
        ),
        TyXNode::Linebreak => Some("\\ \n".into()),
        TyXNode::Horizontalrule => Some("#line(length: 100%)\n".into()),
        TyXNode::Typstcode { text, .. } => Some(node_to_text(&text.editor_state.root)),
        TyXNode::Image { src, .. } => {
            Some(format!("#image({})", serde_json::to_string(src).unwrap()))
        }
        TyXNode::Link { url, children, .. } => Some(format!(
            "#link({})[{}]",
            serde_json::to_string(url).unwrap(),
            children_to_typst(children)
        )),
        TyXNode::Heading { tag, children, .. } => Some(format!(
            "#heading(depth: {})[{}]",
            get_tag_number(tag),
            children_to_typst(children)
        )),
        TyXNode::Functioncall {
            name,
            position_parameters,
            named_parameters,
            ..
        } => Some(format!(
            "#{}",
            stringify_function(name, position_parameters, named_parameters, true)
        )),
    }
}

/// Converts the given TyX function call to Typst code.
pub fn stringify_function(
    name: &Option<String>,
    position_parameters: &Vec<TyXValue>,
    named_parameters: &HashMap<String, TyXValue>,
    include_content: bool,
) -> String {
    let mut parameters = Vec::new();

    for parameter in position_parameters {
        if !include_content && let TyXValue::Content { .. } = parameter {
            continue;
        }

        if let Some(value) = tyx_value_to_typst(parameter.clone()) {
            parameters.push(value);
        }
    }
    for (parameter_name, parameter_value) in named_parameters.iter() {
        if let Some(value) = tyx_value_to_typst(parameter_value.clone()) {
            parameters.push(format!("{parameter_name}: {value}"));
        }
    }

    format!(
        "{}({})",
        name.clone().unwrap_or_default(),
        parameters.join(", ")
    )
}

/// Converts a TyX value to a Typst string.
pub fn tyx_value_to_typst(value: TyXValue) -> Option<String> {
    match value {
        TyXValue::Length { unit, value } => {
            Some(unit.clone().map_or(String::from("none"), |unit| {
                value.clone().unwrap_or("".into()) + unit.as_str()
            }))
        }
        TyXValue::Boolean { value } => {
            value.map(|v| if v { "true".into() } else { "false".into() })
        }
        TyXValue::Content { value } => {
            if let Some(root) = value {
                let converted = node_to_typst(&root);

                converted.map(|c| String::from("[") + c.as_str() + "]")
            } else {
                None
            }
        }
    }
}

/// Converts the given TyX document settings to Typst code.
fn tyx_document_settings_to_typst(settings: &Option<TyXDocumentSettings>) -> String {
    let mut result = String::new();

    let Some(settings) = settings else {
        return String::new();
    };

    if let Some(paper) = &settings.paper {
        result += &format!(
            "#set page(paper: {})\n",
            serde_json::to_string(paper).unwrap()
        );
    }
    if let Some(flipped) = &settings.flipped {
        result += &format!("#set page(flipped: {flipped})\n");
    }
    if let Some(columns) = &settings.columns {
        result += &format!("#set page(columns: {columns})\n");
    }
    if let Some(language) = &settings.language {
        result += &format!(
            "#set text(lang: {})\n",
            serde_json::to_string(language).unwrap()
        );
    }
    if let Some(justified) = &settings.justified {
        result += &format!("#set par(justify: {justified})\n");
    }

    let indentation = settings.indentation.clone().unwrap_or(TyXLength {
        unit: None,
        value: None,
    });
    if let Some(indentation) = tyx_value_to_typst(TyXValue::Length {
        unit: indentation.unit,
        value: indentation.value,
    }) && indentation != "none"
    {
        result += &format!("#set par(first-line-indent: {indentation})\n");
    }

    result
}

/// Converts the given TyX document to Typst code.
pub fn tyx_to_typst(document: &TyXDocument) -> String {
    let version = if document.version.is_empty() {
        "".into()
    } else {
        String::from(" ") + &document.version
    };
    let settings = if let Some(settings) = &document.settings {
        serde_json::to_string(settings).unwrap()
    } else {
        "{}".into()
    };
    let mut content = format!(
        "// Automatically generated by TyX{version}.\n\n// Settings\n#metadata(json(bytes(```json {settings}```.text))) <tyx-settings>\n{}",
        tyx_document_settings_to_typst(&document.settings)
    );

    if let Some(preamble) = &document.preamble {
        content += &format!("// Preamble\n{preamble}\n\n");
    }

    if let Some(document_content) = &document.content {
        content += &format!(
            "// Content\n{}",
            node_to_typst(&document_content.root).unwrap_or_default()
        )
    }

    content
}

/// Converts the serialized TyX document to Typst code.
pub fn serialized_tyx_to_typst(document: &str) -> String {
    let document = serde_json::from_str::<TyXDocument>(document).unwrap();
    tyx_to_typst(&document)
}

/// Converts the serialized TyX function data to Typst code.
pub fn serialized_stringify_function(
    name: Option<String>,
    position_parameters: &str,
    named_parameters: &str,
    include_content: bool,
) -> String {
    let position_parameters = serde_json::from_str::<Vec<TyXValue>>(position_parameters).unwrap();
    let named_parameters =
        serde_json::from_str::<HashMap<String, TyXValue>>(named_parameters).unwrap();
    stringify_function(
        &name,
        &position_parameters,
        &named_parameters,
        include_content,
    )
}
