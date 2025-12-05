//! Based on https://github.com/oxidecomputer/typify/blob/main/example-build/build.rs
use typify::{TypeSpace, TypeSpaceSettings};

const SCHEMA_PATH: &str = "../../schemas/tyx.schema.json";
const OUTPUT_PATH: &str = "./src/generated.rs";

fn main() {
    let content = std::fs::read_to_string(SCHEMA_PATH).unwrap();
    let schema = serde_json::from_str::<schemars::schema::RootSchema>(&content).unwrap();

    let mut type_space = TypeSpace::new(&TypeSpaceSettings::default());
    type_space.add_root_schema(schema).unwrap();

    let mut contents = String::from("#![allow(missing_docs)]\n#![allow(clippy::all)]\n")
        + prettyplease::unparse(&syn::parse2::<syn::File>(type_space.to_stream()).unwrap())
            .as_str();

    contents = contents
        .replace(
            r#"RootNode(TyXRootNode),
    ParagraphNode(TyXParagraphNode),
    TextNode(TyXTextNode),
    MathNode(TyXMathNode),
    ListItemNode(TyXListItemNode),
    ListNode(TyXListNode),
    CodeNode(TyXCodeNode),
    QuoteNode(TyXQuoteNode),
    TableNode(TyXTableNode),
    TableRowNode(TyXTableRowNode),
    TableCellNode(TyXTableCellNode),
    LineBreakNode(TyXLineBreakNode),
    HorizontalRuleNode(TyXHorizontalRuleNode),
    TypstCodeNode(TyXTypstCodeNode),
    ImageNode(TyXImageNode),
    LinkNode(TyXLinkNode),
    HeadingNode(TyXHeadingNode),
    FunctionCallNode(TyXFunctionCallNode),
}"#,
            r#"#[serde(rename = "root")]
    RootNode(TyXRootNode),
    #[serde(rename = "paragraph")]
    ParagraphNode(TyXParagraphNode),
    #[serde(rename = "text")]
    TextNode(TyXTextNode),
    #[serde(rename = "math")]
    MathNode(TyXMathNode),
    #[serde(rename = "listitem")]
    ListItemNode(TyXListItemNode),
    #[serde(rename = "list")]
    ListNode(TyXListNode),
    #[serde(rename = "code")]
    CodeNode(TyXCodeNode),
    #[serde(rename = "quote")]
    QuoteNode(TyXQuoteNode),
    #[serde(rename = "table")]
    TableNode(TyXTableNode),
    #[serde(rename = "tablerow")]
    TableRowNode(TyXTableRowNode),
    #[serde(rename = "tablecell")]
    TableCellNode(TyXTableCellNode),
    #[serde(rename = "linebreak")]
    LineBreakNode(TyXLineBreakNode),
    #[serde(rename = "horizontalrule")]
    HorizontalRuleNode(TyXHorizontalRuleNode),
    #[serde(rename = "typstcode")]
    TypstCodeNode(TyXTypstCodeNode),
    #[serde(rename = "image")]
    ImageNode(TyXImageNode),
    #[serde(rename = "link")]
    LinkNode(TyXLinkNode),
    #[serde(rename = "heading")]
    HeadingNode(TyXHeadingNode),
    #[serde(rename = "functioncall")]
    FunctionCallNode(TyXFunctionCallNode),
}"#,
        )
        .replace(
            r#"LengthValue(TyXLengthValue),
    BooleanValue(TyXBooleanValue),
    ContentValue(TyXContentValue)"#,
            r#"#[serde(rename = "length")]
    LengthValue(TyXLengthValue),
    #[serde(rename = "boolean")]
    BooleanValue(TyXBooleanValue),
    #[serde(rename = "content")]
    ContentValue(TyXContentValue)"#,
        )
        .replace("#[serde(untagged)]", r#"#[serde(tag = "type")]"#)
        .replace(
            "pub type_: ::std::string::String",
            "#[serde(skip_deserializing)]\n    pub type_: ::std::string::String",
        );

    let current = std::fs::read_to_string(OUTPUT_PATH).unwrap_or_default();
    if current != contents {
        std::fs::write(OUTPUT_PATH, contents).unwrap();
    }
}
