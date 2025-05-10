use std::{collections::BTreeMap, path::Path};

use serde::{Deserialize, Serialize};

/// The main function to generate the rust schema structs.
pub fn run() {
    // Reads the schema file
    let schema_path = Path::new("assets/tyx.schema.json");
    let schema = std::fs::read_to_string(schema_path).unwrap();
    let mut schema: Schema = serde_json::from_str(&schema).unwrap();

    // Determines the rust type name of the schema objects.
    for (name, node) in &mut schema.nodes {
        node.name = name.clone();
        node.rust_name = make_rust_type(name);
    }
    for (name, mark) in &mut schema.marks {
        mark.name = name.clone();
        mark.rust_name = make_rust_type(name);
    }

    std::fs::create_dir_all("src/schema").unwrap();

    // Generates the node and mark schema structs.
    {
        let mut writer = Writer::new();
        writer.push_str("use super::prelude::*;\n");
        for node in schema.nodes.values() {
            generate_node(node, &mut writer);
        }
        let inner = writer.output;
        std::fs::write("src/schema/node.rs", inner).unwrap();
    }
    {
        let mut writer = Writer::new();
        writer.push_str("use super::prelude::*;\n");
        for mark in schema.marks.values() {
            generate_mark(mark, &mut writer);
        }
        let inner = writer.output;
        std::fs::write("src/schema/mark.rs", inner).unwrap();
    }

    // Generates the node and mark enums.
    {
        let mut writer = Writer::new();
        writer.push_str("pub use mark::*;\n");
        writer.push_str("pub use node::*;\n");
        writer.push_str("mod mark;\n");
        writer.push_str("mod node;\n");
        writer.push_str("mod prelude;\n\n");
        writer.push_str("use prelude::*;\n\n");
        writer.push_str("/// A TyX node.\n");
        writer.push_str("#[derive(Debug, Clone, Hash, Serialize, Deserialize)]\n");
        writer.push_str("#[serde(tag = \"type\", rename_all = \"camelCase\")]\n");
        writer.push_str("pub enum TyxNode {\n");
        writer.push_str("    /// A mark.\n");
        writer.push_str("    Mark(TyxMark),\n");
        for node in schema.nodes.values() {
            let name = &node.rust_name;
            writer.push_str(&format!("    /// A `{name}` node.\n"));
            writer.push_str(&format!("    {name}({name}),\n"));
        }
        writer.push_str("}\n\n");

        writer.push_str("/// A TyX mark.\n");
        writer.push_str("#[derive(Debug, Clone, Hash, Serialize, Deserialize)]\n");
        writer.push_str("#[serde(tag = \"type\", rename_all = \"camelCase\")]\n");
        writer.push_str("pub enum TyxMark {\n");
        for mark in schema.marks.values() {
            let name = &mark.rust_name;
            writer.push_str(&format!("    /// A `{name}` node.\n"));
            writer.push_str(&format!("    {name}({name}),\n"));
        }
        writer.push_str("}\n");

        let inner = writer.output;
        std::fs::write("src/schema/mod.rs", inner).unwrap();
    }
}

/// The schema struct that represents the tiptap schema.
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct Schema {
    /// The top node of the schema.
    top_node: String,
    /// The node schema objects, from name to data.
    nodes: BTreeMap<String, NodeSchema>,
    /// The mark schema objects, from name to data.
    marks: BTreeMap<String, MarkSchema>,
}

/// A node schema object.
#[derive(Debug, Deserialize, Serialize)]
struct NodeSchema {
    /// The node's content pattern.
    content: Option<String>,
    /// The node's group.
    group: Option<String>,
    /// The node's defining flag.
    defining: Option<bool>,
    /// The node's attributes.
    attrs: Option<BTreeMap<String, Attr>>,
    /// The way of parsing the node from DOM.
    #[serde(rename = "parseDOM")]
    parse_dom: Option<Vec<ParseDom>>,

    /// The node schema's raw name.
    #[serde(skip)]
    name: String,
    /// The node schema's rust name.
    #[serde(skip)]
    rust_name: String,
}

/// A mark schema object.
#[derive(Debug, Deserialize, Serialize)]
struct MarkSchema {
    /// The mark's attributes.
    attrs: Option<BTreeMap<String, Attr>>,
    /// The way of parsing the mark from DOM.
    #[serde(rename = "parseDOM")]
    parse_dom: Option<Vec<ParseDom>>,

    /// The mark schema's raw name.
    #[serde(skip)]
    name: String,
    /// The mark schema's rust name.
    #[serde(skip)]
    rust_name: String,
}

/// The way of parsing a node or mark from DOM.
#[derive(Debug, Deserialize, Serialize)]
struct ParseDom {
    /// The DOM's tag name to match.
    tag: Option<String>,
    /// The rule to generate attributes.
    attrs: Option<BTreeMap<String, serde_json::Value>>,
    /// The style parsed from the DOM.
    style: Option<String>,
    /// Whether remove the DOM after parsing.
    consuming: Option<bool>,
    /// Whether to replace the line break with a space.
    linebreak_replacement: Option<bool>,
    /// Whether to preserve the whitespace, like `<pre>` or `<code>`.
    preserve_whitespace: Option<String>,
}

/// The attribute of a node or mark schema.
#[derive(Debug, Deserialize, Serialize)]
struct Attr {
    /// The attribute's default value.
    default: Option<serde_json::Value>,
}

/// Determines the rust type name of the a schema object.
///
/// It removes `-` and ` ` from the name and converts it to a big camel case.
fn make_rust_type(name: &str) -> String {
    let mut name = name.to_string();
    name = name.replace("-", "_");
    name = name.replace(" ", "_");
    to_big_camel_case(&name)
}

/// Determines the rust field name of a schema object.
///
/// It removes `-` and ` ` from the name and converts it to a snake case.
fn make_rust_field(name: &str) -> String {
    let mut name = name.to_string();
    name = name.replace("-", "_");
    name = name.replace(" ", "_");
    let res = to_snake_case(&name);

    // `type` is a reserved keyword in rust, so we need to rename it to `ty`.
    if res == "type" {
        return "ty".to_string();
    }

    res
}

/// Converts a string to big camel case.
fn to_big_camel_case(name: &str) -> String {
    let mut result = String::new();
    let mut capitalize_next = true;
    for c in name.chars() {
        if c == '_' {
            capitalize_next = true;
        } else if capitalize_next {
            result.push(c.to_ascii_uppercase());
            capitalize_next = false;
        } else {
            result.push(c);
        }
    }
    result
}

/// Converts a string to snake case.
fn to_snake_case(name: &str) -> String {
    let mut result = String::new();
    let mut capitalize_next = false;
    for c in name.chars() {
        if c.is_uppercase() {
            if !result.is_empty() && !capitalize_next {
                result.push('_');
            }
            result.push(c.to_ascii_lowercase());
            capitalize_next = true;
        } else {
            result.push(c);
            capitalize_next = false;
        }
    }
    result
}

/// Generates the rust struct for a node schema.
fn generate_node(node: &NodeSchema, writer: &mut Writer) {
    let name = &node.name;
    let rust_name = &node.rust_name;
    writer.push_str(&format!("\n/// A `{name}` node.\n"));
    writer.push_str("#[derive(Debug, Clone, Hash, Serialize, Deserialize)]\n");
    writer.push_str(&format!("pub struct {rust_name} {{\n"));
    let _ = node;

    if node.name == "text" {
        writer.push_str("    /// The text's mark.\n");
        writer.push_str("    #[serde(skip_serializing_if = \"Vec::is_empty\")]\n");
        writer.push_str("    pub marks: Vec<TyxMark>,\n");
        writer.push_str("    /// The text's content.\n");
        writer.push_str("    pub text: EcoString,\n");
    } else {
        writer.push_str("    /// The node's content.\n");
        writer.push_str("    #[serde(skip_serializing_if = \"Option::is_none\")]\n");
        writer.push_str("    pub content: Option<Content>,\n");
    }

    generate_attrs(&node.attrs, writer);
    writer.push_str("}\n");
}

/// Generates the rust struct for a mark schema.
fn generate_mark(mark: &MarkSchema, writer: &mut Writer) {
    let name = &mark.name;
    let rust_name = &mark.rust_name;
    writer.push_str(&format!("\n/// A `{name}` mark.\n"));
    writer.push_str("#[derive(Debug, Clone, Hash, Serialize, Deserialize)]\n");
    writer.push_str(&format!("pub struct {rust_name} {{\n"));
    writer.push_str("    /// The node's content.\n");
    writer.push_str("    #[serde(skip_serializing_if = \"Option::is_none\")]\n");
    writer.push_str("    pub content: Option<Content>,\n");
    generate_attrs(&mark.attrs, writer);
    writer.push_str("}\n");
}

/// Generates the rust struct for a node or mark schema.
fn generate_attrs(attrs: &Option<BTreeMap<String, Attr>>, writer: &mut Writer) {
    let Some(attrs) = attrs else {
        return;
    };
    for (name, attr) in attrs {
        let rust_name = make_rust_field(name);
        writer.push_str(&format!("    /// The `{name}` attribute.\n"));
        let rust_type = match attr.default {
            Some(ref default) => match default {
                serde_json::Value::Bool(_) => "bool",
                serde_json::Value::Number(_) => "i32",
                serde_json::Value::String(_) => "String",
                _ => "serde_json::Value",
            },
            None => "serde_json::Value",
        };
        let is_optional = attr.default.is_some();
        let rust_type = if is_optional {
            format!("Option<{rust_type}>")
        } else {
            rust_type.to_string()
        };
        if rust_name != *name {
            writer.push_str(&format!("    #[serde(rename = {name:?})]\n"));
        }
        if is_optional {
            writer.push_str("    #[serde(skip_serializing_if = \"Option::is_none\")]\n");
        }
        writer.push_str(&format!("    pub {rust_name}: {rust_type},\n"));
    }
}

/// A simple writer that writes to a string.
struct Writer {
    /// The output string.
    output: String,
}

impl Writer {
    /// Creates a new writer.
    fn new() -> Self {
        Self {
            output: String::new(),
        }
    }

    /// Pushes a string to the output.
    fn push_str(&mut self, text: &str) {
        self.output.push_str(text);
    }
}
