#![allow(missing_docs)]

extern crate serde;
extern crate serde_json;

use serde::{Deserialize, Serialize};
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct FunctionDefinitionItemNamed {
    #[doc = " Optional documentation for this parameter to show on hover."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub documentation: Option<String>,
    #[doc = " Optional label (usually name) of this parameter."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,
    pub name: String,
    #[doc = " Whether this parameter is required."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub required: Option<bool>,
    #[doc = " The TyX type of this parameter."]
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " TyX specification for a Typst function."]
#[derive(Clone, PartialEq, Debug, Default, Deserialize, Serialize)]
pub struct FunctionDefinition {
    #[doc = " Whether TyX should display the function as inline."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inline: Option<bool>,
    #[doc = " Named arguments to the function."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub named: Option<Vec<FunctionDefinitionItemNamed>>,
    #[doc = " Positional arguments to the function."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub positional: Option<Vec<ParameterDescription>>,
}
#[doc = " TyX specification for a function parameter."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct ParameterDescription {
    #[doc = " Optional documentation for this parameter to show on hover."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub documentation: Option<String>,
    #[doc = " Optional label (usually name) of this parameter."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,
    #[doc = " Whether this parameter is required."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub required: Option<bool>,
    #[doc = " The TyX type of this parameter."]
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " An object representing Typst `bool` type."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXBooleanValue {
    #[serde(rename = "type")]
    pub type_: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<bool>,
}
#[doc = " A node describing a code block."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXCodeNode {
    pub children: Vec<TyXNode>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[serde(rename = "type")]
    pub type_: String,
}
#[derive(Clone, PartialEq, Debug, Default, Deserialize, Serialize)]
pub struct TyXDocumentSettingsIndentation {
    #[doc = " The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unit: Option<String>,
    #[doc = " The length numeric value."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<String>,
}
#[doc = " An object wrapping some common Typst document configuration options."]
#[derive(Clone, PartialEq, Debug, Default, Deserialize, Serialize)]
pub struct TyXDocumentSettings {
    #[doc = " The amount of columns in the document."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub columns: Option<f64>,
    #[doc = " Whether the document's page is flipped."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub flipped: Option<bool>,
    #[doc = " Additional font paths for the Typst compiler."]
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "fontPaths")]
    pub font_paths: Option<Vec<String>>,
    #[doc = " Additional TyX function definitions."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub functions: Option<::std::collections::BTreeMap<String, FunctionDefinition>>,
    #[doc = " Optional indentation for paragraphs in the document."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub indentation: Option<TyXDocumentSettingsIndentation>,
    #[doc = " Whether the document's text is justified."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub justified: Option<bool>,
    #[doc = " The language of the document."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[doc = " The paper size of the document."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub paper: Option<String>,
    #[doc = " The root directory for the Typst compiler."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub root: Option<String>,
}
#[doc = " A function call node."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXFunctionCallNode {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(rename = "namedParameters")]
    pub named_parameters: ::std::collections::BTreeMap<String, serde_json::Value>,
    #[serde(rename = "positionParameters")]
    pub position_parameters: Vec<serde_json::Value>,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A heading node."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXHeadingNode {
    pub children: Vec<TyXNode>,
    pub tag: serde_json::Value,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A horizontal rule node."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXHorizontalRuleNode {
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " An image node."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXImageNode {
    pub src: String,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " An object representing Typst `relative` or `fraction` types."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXLengthValue {
    #[serde(rename = "type")]
    pub type_: String,
    #[doc = " The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unit: Option<String>,
    #[doc = " The length numeric value."]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<String>,
}
#[doc = " A line break node."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXLineBreakNode {
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A link node."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXLinkNode {
    pub children: Vec<TyXNode>,
    #[serde(rename = "type")]
    pub type_: String,
    pub url: String,
}
#[doc = " A node describing a list item."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXListItemNode {
    pub children: Vec<TyXNode>,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A node describing a bullet or numbered list."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXListNode {
    pub children: Vec<TyXNode>,
    pub direction: serde_json::Value,
    #[serde(rename = "listType")]
    pub list_type: serde_json::Value,
    pub start: f64,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A node describing a math equation."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXMathNode {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inline: Option<bool>,
    #[serde(rename = "type")]
    pub type_: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub typst: Option<String>,
}
#[doc = " Some TyX node."]
pub type TyXNode = serde_json::Value;
#[doc = " A node describing a paragraph."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXParagraphNode {
    pub children: Vec<TyXNode>,
    pub direction: serde_json::Value,
    pub format: serde_json::Value,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A node describing a block quote."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXQuoteNode {
    pub children: Vec<TyXNode>,
    pub direction: serde_json::Value,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " The node at the root of a TyX document."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXRootNode {
    pub children: Vec<TyXNode>,
    pub direction: serde_json::Value,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A node describing a table cell."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXTableCellNode {
    pub children: Vec<TyXNode>,
    pub direction: serde_json::Value,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A node describing a table."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXTableNode {
    pub children: Vec<TyXNode>,
    pub direction: serde_json::Value,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A node describing a table row."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXTableRowNode {
    pub children: Vec<TyXNode>,
    #[serde(rename = "type")]
    pub type_: String,
}
#[doc = " A node describing text."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXTextNode {
    pub format: f64,
    pub text: String,
    #[serde(rename = "type")]
    pub type_: String,
}
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXTypstCodeNodeTextEditorState {
    pub root: TyXRootNode,
}
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXTypstCodeNodeText {
    #[serde(rename = "editorState")]
    pub editor_state: TyXTypstCodeNodeTextEditorState,
}
#[doc = " A raw Typst code node."]
#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
pub struct TyXTypstCodeNode {
    pub text: TyXTypstCodeNodeText,
    #[serde(rename = "type")]
    pub type_: String,
}
