//! Converts a TyX document to a Typst string.
use std::{collections::HashMap, sync::LazyLock};

use regex::{Captures, Regex};
use tyx_schema::*;

fn get_tag_number(tag: &TyXHeadingNodeTag) -> i64 {
    match tag {
        TyXHeadingNodeTag::H1 => 1,
        TyXHeadingNodeTag::H2 => 2,
        TyXHeadingNodeTag::H3 => 3,
        TyXHeadingNodeTag::H4 => 4,
        TyXHeadingNodeTag::H5 => 5,
        TyXHeadingNodeTag::H6 => 6,
    }
}

/// Converts TyX nodes to text by joining their texts together.
fn nodes_to_text(nodes: &Vec<TyXNode>) -> String {
    nodes
        .iter()
        .map(node_to_text)
        .collect::<Vec<String>>()
        .join("")
}

/// Converts a TyX node to text.
fn node_to_text(node: &TyXNode) -> String {
    let result = match node {
        TyXNode::RootNode(root) => Some(nodes_to_text(&root.children)),
        TyXNode::ParagraphNode(paragraph) => Some(nodes_to_text(&paragraph.children)),
        TyXNode::TextNode(text) => Some(text.text.clone()),
        TyXNode::MathNode(math) => math.typst.clone(),
        TyXNode::ListItemNode(list_item) => Some(nodes_to_text(&list_item.children)),
        TyXNode::ListNode(list) => Some(nodes_to_text(&list.children)),
        TyXNode::CodeNode(code) => Some(nodes_to_text(&code.children)),
        TyXNode::QuoteNode(quote) => Some(nodes_to_text(&quote.children)),
        TyXNode::TableNode(table) => Some(nodes_to_text(&table.children)),
        TyXNode::TableRowNode(table_row) => Some(nodes_to_text(&table_row.children)),
        TyXNode::TableCellNode(table_cell) => Some(nodes_to_text(&table_cell.children)),
        TyXNode::LineBreakNode(_) => Some("\n".into()),
        TyXNode::TypstCodeNode(typst_code) => Some(node_to_text(&TyXNode::RootNode(
            typst_code.text.editor_state.root.clone(),
        ))),
        TyXNode::LinkNode(link) => Some(nodes_to_text(&link.children)),
        TyXNode::HeadingNode(heading) => Some(nodes_to_text(&heading.children)),
        _ => None,
    };

    result.unwrap_or("".into())
}

/// Applies the given direction to the output Typst code.
fn apply_direction(result: &str, direction: TyXDirection) -> String {
    match direction.0 {
        Some(d) => format!("#text(dir: {})[{}]", d, result),
        None => result.into(),
    }
}

/// Applies the given text format to the output Typst code.
fn apply_text_format(mut result: String, text: &str, format: i64) -> String {
    if format & (TextFormat::Bold as i64) != 0 {
        result = format!("#strong[{}]", result);
    }
    if format & (TextFormat::Italic as i64) != 0 {
        result = format!("#emph[{}]", result);
    }
    if format & (TextFormat::Underline as i64) != 0 {
        result = format!("#underline[{}]", result);
    }
    if format & (TextFormat::Strikethrough as i64) != 0 {
        result = format!("#strike[{}]", result);
    }
    if format & (TextFormat::Subscript as i64) != 0 {
        result = format!("#sub[{}]", result);
    }
    if format & (TextFormat::Superscript as i64) != 0 {
        result = format!("#super[{}]", result);
    }
    if format & (TextFormat::Code as i64) != 0 {
        result = format!("#raw({})", serde_json::to_string(text).unwrap());
    }

    result
}

/// Applies the given alignment format to the output Typst code.
fn apply_format(result: &str, format: &str) -> String {
    if format == "justify" {
        format!("#par(justify: true)[{}]", result)
    } else if format == "left"
        || format == "center"
        || format == "right"
        || format == "start"
        || format == "end"
    {
        format!("#align({})[{}]", format, result)
    } else {
        result.into()
    }
}

/// Joins the children's Typst code, and adds newlines between paragraph children.
fn children_to_typst(children: &Vec<TyXNode>) -> String {
    let mut result = String::new();
    let translated = children.iter().map(node_to_typst).collect::<Vec<_>>();
    for i in 0..translated.len() {
        result += &translated[i].clone().unwrap_or_default();
        if let TyXNode::ParagraphNode(_) = children[i]
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
        .replace_all(text, |c: &Captures| String::from("\\") + &c[0].to_string())
        .to_string()
}

/// Converts a TyX node to Typst code.
fn node_to_typst(root: &TyXNode) -> Option<String> {
    println!("{:?}", root);
    match root {
        TyXNode::RootNode(tyx_root_node) => Some(apply_direction(
            &children_to_typst(&tyx_root_node.children),
            tyx_root_node
                .direction
                .clone()
                .unwrap_or(TyXDirection(None)),
        )),
        TyXNode::ParagraphNode(tyx_paragraph_node) => Some(apply_direction(
            &apply_format(
                &children_to_typst(&tyx_paragraph_node.children),
                &format!("{}", tyx_paragraph_node.format),
            ),
            tyx_paragraph_node
                .direction
                .clone()
                .unwrap_or(TyXDirection(None)),
        )),
        TyXNode::TextNode(tyx_text_node) => Some(apply_text_format(
            typst_escape(&tyx_text_node.text),
            &tyx_text_node.text,
            tyx_text_node.format,
        )),
        TyXNode::MathNode(tyx_math_node) => {
            if tyx_math_node.inline.unwrap_or(false) {
                Some(format!(
                    "${}$",
                    tyx_math_node.typst.clone().unwrap_or_default()
                ))
            } else {
                Some(format!(
                    "$ {} $\n",
                    tyx_math_node.typst.clone().unwrap_or_default()
                ))
            }
        }
        TyXNode::ListItemNode(tyx_list_item_node) => {
            Some(children_to_typst(&tyx_list_item_node.children))
        }
        TyXNode::ListNode(tyx_list_node) => {
            let mut result = match tyx_list_node.list_type {
                TyXListNodeListType::Bullet => "\n#list(".into(),
                TyXListNodeListType::Number => format!("\n#enum(start: {},", tyx_list_node.start),
                _ => return None,
            };

            for i in 0..(tyx_list_node.children.len() - 1) {
                result += &format!(
                    "[{}]",
                    node_to_typst(&tyx_list_node.children[i]).unwrap_or_default()
                );

                let delimiter = if let TyXNode::ListItemNode(tyx_list_item_node) =
                    &tyx_list_node.children[i + 1]
                    && let TyXNode::ListNode(_) = tyx_list_item_node.children[0]
                {
                    " + "
                } else {
                    ", "
                };
                result += delimiter;
            }

            if let Some(last) = tyx_list_node.children.last() {
                result += &format!("[{}]", node_to_typst(last).unwrap_or_default());
            }

            result += ")\n";

            Some(apply_direction(
                &result,
                tyx_list_node
                    .direction
                    .clone()
                    .unwrap_or(TyXDirection(None)),
            ))
        }
        TyXNode::CodeNode(tyx_code_node) => Some(format!(
            "#text(dir: ltr)[#raw(block: true, lang: {}, {})]",
            serde_json::to_string(&tyx_code_node.language.clone().unwrap_or("none".into()))
                .unwrap(),
            serde_json::to_string(&node_to_text(root)).unwrap()
        )),
        TyXNode::QuoteNode(tyx_quote_node) => Some(apply_direction(
            &format!(
                "#quote(block: true)[{}]",
                children_to_typst(&tyx_quote_node.children)
            ),
            tyx_quote_node
                .direction
                .clone()
                .unwrap_or(TyXDirection(None)),
        )),
        TyXNode::TableNode(tyx_table_node) => {
            let Some(TyXNode::TableRowNode(row)) = tyx_table_node.children.first() else {
                return None;
            };
            let columns = (0..row.children.len())
                .map(|_| String::from("1fr"))
                .collect::<Vec<String>>()
                .join(", ");
            let children = tyx_table_node
                .children
                .iter()
                .map(|child| node_to_typst(child).unwrap_or_default())
                .collect::<Vec<String>>()
                .join(", ");

            Some(apply_direction(
                &format!("#table(columns: ({}), {})", columns, children),
                tyx_table_node
                    .direction
                    .clone()
                    .unwrap_or(TyXDirection(None)),
            ))
        }
        TyXNode::TableRowNode(tyx_table_row_node) => Some(
            tyx_table_row_node
                .children
                .iter()
                .map(|child| node_to_typst(child).unwrap_or_default())
                .collect::<Vec<String>>()
                .join(", "),
        ),
        TyXNode::TableCellNode(tyx_table_cell_node) => Some(apply_direction(
            &children_to_typst(&tyx_table_cell_node.children),
            tyx_table_cell_node
                .direction
                .clone()
                .unwrap_or(TyXDirection(None)),
        )),
        TyXNode::LineBreakNode(_) => Some("\\ \n".into()),
        TyXNode::HorizontalRuleNode(_) => Some("#line(length: 100%)\n".into()),
        TyXNode::TypstCodeNode(tyx_typst_code_node) => Some(node_to_text(&TyXNode::RootNode(
            tyx_typst_code_node.text.editor_state.root.clone(),
        ))),
        TyXNode::ImageNode(tyx_image_node) => Some(format!(
            "#image({})",
            serde_json::to_string(&tyx_image_node.src).unwrap()
        )),
        TyXNode::LinkNode(tyx_link_node) => Some(format!(
            "#link({})[{}]",
            serde_json::to_string(&tyx_link_node.url).unwrap(),
            children_to_typst(&tyx_link_node.children)
        )),
        TyXNode::HeadingNode(tyx_heading_node) => Some(format!(
            "#heading(depth: {})[{}]",
            get_tag_number(&tyx_heading_node.tag),
            children_to_typst(&tyx_heading_node.children)
        )),
        TyXNode::FunctionCallNode(tyx_function_call_node) => Some(format!(
            "#{}",
            stringify_function(
                &tyx_function_call_node.name,
                &tyx_function_call_node.position_parameters,
                &tyx_function_call_node.named_parameters,
                true
            )
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
        if !include_content && let TyXValue::ContentValue(_) = parameter {
            continue;
        }

        if let Some(value) = tyx_value_to_typst(parameter.clone()) {
            parameters.push(value);
        }
    }
    for (parameter_name, parameter_value) in named_parameters.iter() {
        if let Some(value) = tyx_value_to_typst(parameter_value.clone()) {
            parameters.push(format!("{}: {}", parameter_name, value));
        }
    }

    format!(
        "{}({})",
        name.clone().unwrap_or_default(),
        parameters.join(", ")
    )
}

/// Converts a TyX value to a Typst string.
fn tyx_value_to_typst(value: TyXValue) -> Option<String> {
    match value {
        TyXValue::LengthValue(length) => {
            Some(length.unit.clone().map_or(String::from("none"), |unit| {
                length.value.clone().unwrap_or("".into()) + unit.as_str()
            }))
        }
        TyXValue::BooleanValue(boolean) => boolean
            .value
            .map(|v| if v { "true".into() } else { "false".into() }),
        TyXValue::ContentValue(content) => {
            if let Some(root) = content.value {
                let converted = node_to_typst(&TyXNode::RootNode(root));

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
        result += &format!("#set page(flipped: {})\n", flipped);
    }
    if let Some(columns) = &settings.columns {
        result += &format!("#set page(columns: {})\n", columns);
    }
    if let Some(language) = &settings.language {
        result += &format!(
            "#set page(lang: {})\n",
            serde_json::to_string(language).unwrap()
        );
    }
    if let Some(justified) = &settings.justified {
        result += &format!("#set par(justify: {})\n", justified);
    }

    let indentation = settings.indentation.clone().unwrap_or(TyXLength {
        unit: None,
        value: None,
    });
    if let Some(indentation) = tyx_value_to_typst(TyXValue::LengthValue(TyXLengthValue {
        type_: "length".into(),
        unit: indentation.unit,
        value: indentation.value,
    })) && indentation != "none"
    {
        result += &format!("#set par(first-line-indent: {})\n", &indentation);
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
        "// Automatically generated by TyX{}.\n\n// Settings\n#metadata(json(bytes(```json {}```.text))) <tyx-settings>\n{}",
        version,
        settings,
        tyx_document_settings_to_typst(&document.settings)
    );

    if let Some(preamble) = &document.preamble {
        content += &format!("// Preamble\n{}\n\n", &preamble);
    }

    if let Some(document_content) = &document.content {
        content += &format!(
            "// Content\n{}",
            node_to_typst(&TyXNode::RootNode(document_content.root.clone())).unwrap_or_default()
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
