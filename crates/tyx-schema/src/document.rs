#![allow(missing_docs)]
/// Error types.
pub mod error {
    /// Error from a `TryFrom` or `FromStr` implementation.
    pub struct ConversionError(::std::borrow::Cow<'static, str>);
    impl ::std::error::Error for ConversionError {}
    impl ::std::fmt::Display for ConversionError {
        fn fmt(
            &self,
            f: &mut ::std::fmt::Formatter<'_>,
        ) -> Result<(), ::std::fmt::Error> {
            ::std::fmt::Display::fmt(&self.0, f)
        }
    }
    impl ::std::fmt::Debug for ConversionError {
        fn fmt(
            &self,
            f: &mut ::std::fmt::Formatter<'_>,
        ) -> Result<(), ::std::fmt::Error> {
            ::std::fmt::Debug::fmt(&self.0, f)
        }
    }
    impl From<&'static str> for ConversionError {
        fn from(value: &'static str) -> Self {
            Self(value.into())
        }
    }
    impl From<String> for ConversionError {
        fn from(value: String) -> Self {
            Self(value.into())
        }
    }
}
///TyX specification for a Typst function.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "TyX specification for a Typst function.",
///  "type": "object",
///  "properties": {
///    "positional": {
///      "description": "Positional arguments to the function.",
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/ParameterDescription"
///      }
///    },
///    "named": {
///      "description": "Named arguments to the function.",
///      "type": "array",
///      "items": {
///        "type": "object",
///        "required": [
///          "name",
///          "type"
///        ],
///        "properties": {
///          "type": {
///            "description": "The TyX type of this parameter.",
///            "type": "string"
///          },
///          "required": {
///            "description": "Whether this parameter is required.",
///            "type": "boolean"
///          },
///          "label": {
///            "description": "Optional label (usually name) of this parameter.",
///            "type": "string"
///          },
///          "documentation": {
///            "description": "Optional documentation for this parameter to show on hover.",
///            "type": "string"
///          },
///          "name": {
///            "type": "string"
///          }
///        },
///        "additionalProperties": false
///      }
///    },
///    "inline": {
///      "description": "Whether TyX should display the function as inline.",
///      "type": "boolean"
///    }
///  },
///  "additionalProperties": false,
///  "id": "FunctionDefinition"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct FunctionDefinition {
    ///Whether TyX should display the function as inline.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub inline: ::std::option::Option<bool>,
    ///Named arguments to the function.
    #[serde(default, skip_serializing_if = "::std::vec::Vec::is_empty")]
    pub named: ::std::vec::Vec<FunctionDefinitionNamedItem>,
    ///Positional arguments to the function.
    #[serde(default, skip_serializing_if = "::std::vec::Vec::is_empty")]
    pub positional: ::std::vec::Vec<ParameterDescription>,
}
impl ::std::convert::From<&FunctionDefinition> for FunctionDefinition {
    fn from(value: &FunctionDefinition) -> Self {
        value.clone()
    }
}
impl ::std::default::Default for FunctionDefinition {
    fn default() -> Self {
        Self {
            inline: Default::default(),
            named: Default::default(),
            positional: Default::default(),
        }
    }
}
impl FunctionDefinition {
    pub fn builder() -> builder::FunctionDefinition {
        Default::default()
    }
}
///`FunctionDefinitionNamedItem`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "type": "object",
///  "required": [
///    "name",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "description": "The TyX type of this parameter.",
///      "type": "string"
///    },
///    "required": {
///      "description": "Whether this parameter is required.",
///      "type": "boolean"
///    },
///    "label": {
///      "description": "Optional label (usually name) of this parameter.",
///      "type": "string"
///    },
///    "documentation": {
///      "description": "Optional documentation for this parameter to show on hover.",
///      "type": "string"
///    },
///    "name": {
///      "type": "string"
///    }
///  },
///  "additionalProperties": false
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct FunctionDefinitionNamedItem {
    ///Optional documentation for this parameter to show on hover.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub documentation: ::std::option::Option<::std::string::String>,
    ///Optional label (usually name) of this parameter.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub label: ::std::option::Option<::std::string::String>,
    pub name: ::std::string::String,
    ///Whether this parameter is required.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub required: ::std::option::Option<bool>,
    ///The TyX type of this parameter.
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
}
impl ::std::convert::From<&FunctionDefinitionNamedItem> for FunctionDefinitionNamedItem {
    fn from(value: &FunctionDefinitionNamedItem) -> Self {
        value.clone()
    }
}
impl FunctionDefinitionNamedItem {
    pub fn builder() -> builder::FunctionDefinitionNamedItem {
        Default::default()
    }
}
///TyX specification for a function parameter.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "TyX specification for a function parameter.",
///  "type": "object",
///  "required": [
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "description": "The TyX type of this parameter.",
///      "type": "string"
///    },
///    "required": {
///      "description": "Whether this parameter is required.",
///      "type": "boolean"
///    },
///    "label": {
///      "description": "Optional label (usually name) of this parameter.",
///      "type": "string"
///    },
///    "documentation": {
///      "description": "Optional documentation for this parameter to show on hover.",
///      "type": "string"
///    }
///  },
///  "additionalProperties": false,
///  "id": "ParameterDescription"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct ParameterDescription {
    ///Optional documentation for this parameter to show on hover.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub documentation: ::std::option::Option<::std::string::String>,
    ///Optional label (usually name) of this parameter.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub label: ::std::option::Option<::std::string::String>,
    ///Whether this parameter is required.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub required: ::std::option::Option<bool>,
    ///The TyX type of this parameter.
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
}
impl ::std::convert::From<&ParameterDescription> for ParameterDescription {
    fn from(value: &ParameterDescription) -> Self {
        value.clone()
    }
}
impl ParameterDescription {
    pub fn builder() -> builder::ParameterDescription {
        Default::default()
    }
}
///An object representing Typst `bool` type.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "An object representing Typst `bool` type.",
///  "type": "object",
///  "required": [
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "boolean"
///    },
///    "value": {
///      "type": "boolean"
///    }
///  },
///  "additionalProperties": false,
///  "id": "TyXBooleanValue"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXBooleanValue {
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub value: ::std::option::Option<bool>,
}
impl ::std::convert::From<&TyXBooleanValue> for TyXBooleanValue {
    fn from(value: &TyXBooleanValue) -> Self {
        value.clone()
    }
}
impl TyXBooleanValue {
    pub fn builder() -> builder::TyXBooleanValue {
        Default::default()
    }
}
///A node describing a code block.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a code block.",
///  "type": "object",
///  "required": [
///    "children",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "code"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    },
///    "language": {
///      "type": "string"
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXCodeNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXCodeNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub language: ::std::option::Option<::std::string::String>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXCodeNode> for TyXCodeNode {
    fn from(value: &TyXCodeNode) -> Self {
        value.clone()
    }
}
impl TyXCodeNode {
    pub fn builder() -> builder::TyXCodeNode {
        Default::default()
    }
}
///An object representing an entire TyX document. Saved in `.tyx` files.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "title": "TyXDocument",
///  "description": "An object representing an entire TyX document. Saved in `.tyx` files.",
///  "type": "object",
///  "required": [
///    "version"
///  ],
///  "properties": {
///    "$schema": {
///      "type": "string"
///    },
///    "version": {
///      "description": "The version of TyX in which the document was created.",
///      "type": "string"
///    },
///    "preamble": {
///      "description": "Raw Typst code to insert before the content.",
///      "type": "string"
///    },
///    "filename": {
///      "description": "The filename of the document, unused.",
///      "type": "string"
///    },
///    "content": {
///      "description": "The serialized content of the editor.",
///      "type": "object",
///      "required": [
///        "root"
///      ],
///      "properties": {
///        "root": {
///          "$ref": "#/definitions/TyXRootNode"
///        }
///      },
///      "additionalProperties": false
///    },
///    "dirty": {
///      "description": "Whether the document has been modified since loading, unused.",
///      "type": "boolean"
///    },
///    "settings": {
///      "description": "The document's settings.",
///      "allOf": [
///        {
///          "$ref": "#/definitions/TyXDocumentSettings"
///        }
///      ]
///    }
///  },
///  "additionalProperties": false,
///  "id": "TyXDocument"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXDocument {
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub content: ::std::option::Option<TyXDocumentContent>,
    ///Whether the document has been modified since loading, unused.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub dirty: ::std::option::Option<bool>,
    ///The filename of the document, unused.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub filename: ::std::option::Option<::std::string::String>,
    ///Raw Typst code to insert before the content.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub preamble: ::std::option::Option<::std::string::String>,
    #[serde(
        rename = "$schema",
        default,
        skip_serializing_if = "::std::option::Option::is_none"
    )]
    pub schema: ::std::option::Option<::std::string::String>,
    ///The document's settings.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub settings: ::std::option::Option<TyXDocumentSettings>,
    ///The version of TyX in which the document was created.
    pub version: ::std::string::String,
}
impl ::std::convert::From<&TyXDocument> for TyXDocument {
    fn from(value: &TyXDocument) -> Self {
        value.clone()
    }
}
impl TyXDocument {
    pub fn builder() -> builder::TyXDocument {
        Default::default()
    }
}
///The serialized content of the editor.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "The serialized content of the editor.",
///  "type": "object",
///  "required": [
///    "root"
///  ],
///  "properties": {
///    "root": {
///      "$ref": "#/definitions/TyXRootNode"
///    }
///  },
///  "additionalProperties": false
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXDocumentContent {
    pub root: TyXRootNode,
}
impl ::std::convert::From<&TyXDocumentContent> for TyXDocumentContent {
    fn from(value: &TyXDocumentContent) -> Self {
        value.clone()
    }
}
impl TyXDocumentContent {
    pub fn builder() -> builder::TyXDocumentContent {
        Default::default()
    }
}
///An object wrapping some common Typst document configuration options.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "An object wrapping some common Typst document configuration options.",
///  "type": "object",
///  "properties": {
///    "root": {
///      "description": "The root directory for the Typst compiler.",
///      "type": "string"
///    },
///    "fontPaths": {
///      "description": "Additional font paths for the Typst compiler.",
///      "type": "array",
///      "items": {
///        "type": "string"
///      }
///    },
///    "language": {
///      "description": "The language of the document.",
///      "type": "string"
///    },
///    "paper": {
///      "description": "The paper size of the document.",
///      "type": "string"
///    },
///    "flipped": {
///      "description": "Whether the document's page is flipped.",
///      "type": "boolean"
///    },
///    "justified": {
///      "description": "Whether the document's text is justified.",
///      "type": "boolean"
///    },
///    "indentation": {
///      "description": "Optional indentation for paragraphs in the document.",
///      "type": "object",
///      "properties": {
///        "unit": {
///          "description": "The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'.",
///          "type": "string"
///        },
///        "value": {
///          "description": "The length numeric value.",
///          "type": "string"
///        }
///      },
///      "additionalProperties": false
///    },
///    "columns": {
///      "description": "The amount of columns in the document.",
///      "type": "number"
///    },
///    "functions": {
///      "description": "Additional TyX function definitions.",
///      "type": "object",
///      "additionalProperties": {
///        "$ref": "#/definitions/FunctionDefinition"
///      },
///      "propertyNames": {
///        "type": "string"
///      }
///    }
///  },
///  "additionalProperties": false,
///  "id": "TyXDocumentSettings"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXDocumentSettings {
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub columns: ::std::option::Option<f64>,
    ///Whether the document's page is flipped.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub flipped: ::std::option::Option<bool>,
    ///Additional font paths for the Typst compiler.
    #[serde(
        rename = "fontPaths",
        default,
        skip_serializing_if = "::std::vec::Vec::is_empty"
    )]
    pub font_paths: ::std::vec::Vec<::std::string::String>,
    ///Additional TyX function definitions.
    #[serde(default, skip_serializing_if = ":: std :: collections :: HashMap::is_empty")]
    pub functions: ::std::collections::HashMap<
        ::std::string::String,
        FunctionDefinition,
    >,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub indentation: ::std::option::Option<TyXDocumentSettingsIndentation>,
    ///Whether the document's text is justified.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub justified: ::std::option::Option<bool>,
    ///The language of the document.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub language: ::std::option::Option<::std::string::String>,
    ///The paper size of the document.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub paper: ::std::option::Option<::std::string::String>,
    ///The root directory for the Typst compiler.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub root: ::std::option::Option<::std::string::String>,
}
impl ::std::convert::From<&TyXDocumentSettings> for TyXDocumentSettings {
    fn from(value: &TyXDocumentSettings) -> Self {
        value.clone()
    }
}
impl ::std::default::Default for TyXDocumentSettings {
    fn default() -> Self {
        Self {
            columns: Default::default(),
            flipped: Default::default(),
            font_paths: Default::default(),
            functions: Default::default(),
            indentation: Default::default(),
            justified: Default::default(),
            language: Default::default(),
            paper: Default::default(),
            root: Default::default(),
        }
    }
}
impl TyXDocumentSettings {
    pub fn builder() -> builder::TyXDocumentSettings {
        Default::default()
    }
}
///Optional indentation for paragraphs in the document.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "Optional indentation for paragraphs in the document.",
///  "type": "object",
///  "properties": {
///    "unit": {
///      "description": "The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'.",
///      "type": "string"
///    },
///    "value": {
///      "description": "The length numeric value.",
///      "type": "string"
///    }
///  },
///  "additionalProperties": false
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXDocumentSettingsIndentation {
    ///The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub unit: ::std::option::Option<::std::string::String>,
    ///The length numeric value.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub value: ::std::option::Option<::std::string::String>,
}
impl ::std::convert::From<&TyXDocumentSettingsIndentation>
for TyXDocumentSettingsIndentation {
    fn from(value: &TyXDocumentSettingsIndentation) -> Self {
        value.clone()
    }
}
impl ::std::default::Default for TyXDocumentSettingsIndentation {
    fn default() -> Self {
        Self {
            unit: Default::default(),
            value: Default::default(),
        }
    }
}
impl TyXDocumentSettingsIndentation {
    pub fn builder() -> builder::TyXDocumentSettingsIndentation {
        Default::default()
    }
}
///A function call node.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A function call node.",
///  "type": "object",
///  "required": [
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "functioncall"
///    },
///    "name": {
///      "type": "string"
///    },
///    "positionParameters": {
///      "type": "array",
///      "items": {
///        "anyOf": [
///          {
///            "$ref": "#/definitions/TyXLengthValue"
///          },
///          {
///            "$ref": "#/definitions/TyXBooleanValue"
///          },
///          {
///            "type": "object",
///            "required": [
///              "type"
///            ],
///            "properties": {
///              "type": {
///                "type": "string",
///                "const": "content"
///              },
///              "value": {
///                "allOf": [
///                  {
///                    "$ref": "#/definitions/TyXRootNode"
///                  }
///                ]
///              }
///            },
///            "additionalProperties": false
///          }
///        ]
///      }
///    },
///    "namedParameters": {
///      "type": "object",
///      "additionalProperties": {
///        "anyOf": [
///          {
///            "$ref": "#/definitions/TyXLengthValue"
///          },
///          {
///            "$ref": "#/definitions/TyXBooleanValue"
///          },
///          {
///            "type": "object",
///            "required": [
///              "type"
///            ],
///            "properties": {
///              "type": {
///                "type": "string",
///                "const": "content"
///              },
///              "value": {
///                "allOf": [
///                  {
///                    "$ref": "#/definitions/TyXRootNode"
///                  }
///                ]
///              }
///            },
///            "additionalProperties": false
///          }
///        ]
///      },
///      "propertyNames": {
///        "type": "string"
///      }
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXFunctionCallNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXFunctionCallNode {
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub name: ::std::option::Option<::std::string::String>,
    #[serde(
        rename = "namedParameters",
        default,
        skip_serializing_if = ":: std :: collections :: HashMap::is_empty"
    )]
    pub named_parameters: ::std::collections::HashMap<
        ::std::string::String,
        TyXFunctionCallNodeNamedParametersValue,
    >,
    #[serde(
        rename = "positionParameters",
        default,
        skip_serializing_if = "::std::vec::Vec::is_empty"
    )]
    pub position_parameters: ::std::vec::Vec<TyXFunctionCallNodePositionParametersItem>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXFunctionCallNode> for TyXFunctionCallNode {
    fn from(value: &TyXFunctionCallNode) -> Self {
        value.clone()
    }
}
impl TyXFunctionCallNode {
    pub fn builder() -> builder::TyXFunctionCallNode {
        Default::default()
    }
}
///`TyXFunctionCallNodeNamedParametersValue`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "$ref": "#/definitions/TyXLengthValue"
///    },
///    {
///      "$ref": "#/definitions/TyXBooleanValue"
///    },
///    {
///      "type": "object",
///      "required": [
///        "type"
///      ],
///      "properties": {
///        "type": {
///          "type": "string",
///          "const": "content"
///        },
///        "value": {
///          "allOf": [
///            {
///              "$ref": "#/definitions/TyXRootNode"
///            }
///          ]
///        }
///      },
///      "additionalProperties": false
///    }
///  ]
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(untagged, deny_unknown_fields)]
pub enum TyXFunctionCallNodeNamedParametersValue {
    TyXLengthValue(TyXLengthValue),
    TyXBooleanValue(TyXBooleanValue),
    Object {
        #[serde(rename = "type")]
        type_: ::std::string::String,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        value: ::std::option::Option<TyXRootNode>,
    },
}
impl ::std::convert::From<&Self> for TyXFunctionCallNodeNamedParametersValue {
    fn from(value: &TyXFunctionCallNodeNamedParametersValue) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<TyXLengthValue> for TyXFunctionCallNodeNamedParametersValue {
    fn from(value: TyXLengthValue) -> Self {
        Self::TyXLengthValue(value)
    }
}
impl ::std::convert::From<TyXBooleanValue> for TyXFunctionCallNodeNamedParametersValue {
    fn from(value: TyXBooleanValue) -> Self {
        Self::TyXBooleanValue(value)
    }
}
///`TyXFunctionCallNodePositionParametersItem`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "$ref": "#/definitions/TyXLengthValue"
///    },
///    {
///      "$ref": "#/definitions/TyXBooleanValue"
///    },
///    {
///      "type": "object",
///      "required": [
///        "type"
///      ],
///      "properties": {
///        "type": {
///          "type": "string",
///          "const": "content"
///        },
///        "value": {
///          "allOf": [
///            {
///              "$ref": "#/definitions/TyXRootNode"
///            }
///          ]
///        }
///      },
///      "additionalProperties": false
///    }
///  ]
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(untagged, deny_unknown_fields)]
pub enum TyXFunctionCallNodePositionParametersItem {
    TyXLengthValue(TyXLengthValue),
    TyXBooleanValue(TyXBooleanValue),
    Object {
        #[serde(rename = "type")]
        type_: ::std::string::String,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        value: ::std::option::Option<TyXRootNode>,
    },
}
impl ::std::convert::From<&Self> for TyXFunctionCallNodePositionParametersItem {
    fn from(value: &TyXFunctionCallNodePositionParametersItem) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<TyXLengthValue> for TyXFunctionCallNodePositionParametersItem {
    fn from(value: TyXLengthValue) -> Self {
        Self::TyXLengthValue(value)
    }
}
impl ::std::convert::From<TyXBooleanValue>
for TyXFunctionCallNodePositionParametersItem {
    fn from(value: TyXBooleanValue) -> Self {
        Self::TyXBooleanValue(value)
    }
}
///A heading node.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A heading node.",
///  "type": "object",
///  "required": [
///    "children",
///    "tag",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "heading"
///    },
///    "tag": {
///      "anyOf": [
///        {
///          "type": "string",
///          "const": "h1"
///        },
///        {
///          "type": "string",
///          "const": "h2"
///        },
///        {
///          "type": "string",
///          "const": "h3"
///        },
///        {
///          "type": "string",
///          "const": "h4"
///        },
///        {
///          "type": "string",
///          "const": "h5"
///        },
///        {
///          "type": "string",
///          "const": "h6"
///        }
///      ]
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXHeadingNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXHeadingNode {
    pub children: ::std::vec::Vec<TyXNode>,
    pub tag: TyXHeadingNodeTag,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXHeadingNode> for TyXHeadingNode {
    fn from(value: &TyXHeadingNode) -> Self {
        value.clone()
    }
}
impl TyXHeadingNode {
    pub fn builder() -> builder::TyXHeadingNode {
        Default::default()
    }
}
///`TyXHeadingNodeTag`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "h1"
///    },
///    {
///      "type": "string",
///      "const": "h2"
///    },
///    {
///      "type": "string",
///      "const": "h3"
///    },
///    {
///      "type": "string",
///      "const": "h4"
///    },
///    {
///      "type": "string",
///      "const": "h5"
///    },
///    {
///      "type": "string",
///      "const": "h6"
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXHeadingNodeTag {
    #[serde(rename = "h1")]
    H1,
    #[serde(rename = "h2")]
    H2,
    #[serde(rename = "h3")]
    H3,
    #[serde(rename = "h4")]
    H4,
    #[serde(rename = "h5")]
    H5,
    #[serde(rename = "h6")]
    H6,
}
impl ::std::convert::From<&Self> for TyXHeadingNodeTag {
    fn from(value: &TyXHeadingNodeTag) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXHeadingNodeTag {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::H1 => f.write_str("h1"),
            Self::H2 => f.write_str("h2"),
            Self::H3 => f.write_str("h3"),
            Self::H4 => f.write_str("h4"),
            Self::H5 => f.write_str("h5"),
            Self::H6 => f.write_str("h6"),
        }
    }
}
impl ::std::str::FromStr for TyXHeadingNodeTag {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "h1" => Ok(Self::H1),
            "h2" => Ok(Self::H2),
            "h3" => Ok(Self::H3),
            "h4" => Ok(Self::H4),
            "h5" => Ok(Self::H5),
            "h6" => Ok(Self::H6),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXHeadingNodeTag {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXHeadingNodeTag {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXHeadingNodeTag {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///A horizontal rule node.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A horizontal rule node.",
///  "type": "object",
///  "required": [
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "horizontalrule"
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXHorizontalRuleNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXHorizontalRuleNode {
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXHorizontalRuleNode> for TyXHorizontalRuleNode {
    fn from(value: &TyXHorizontalRuleNode) -> Self {
        value.clone()
    }
}
impl TyXHorizontalRuleNode {
    pub fn builder() -> builder::TyXHorizontalRuleNode {
        Default::default()
    }
}
///An image node.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "An image node.",
///  "type": "object",
///  "required": [
///    "src",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "image"
///    },
///    "src": {
///      "type": "string"
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXImageNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXImageNode {
    pub src: ::std::string::String,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXImageNode> for TyXImageNode {
    fn from(value: &TyXImageNode) -> Self {
        value.clone()
    }
}
impl TyXImageNode {
    pub fn builder() -> builder::TyXImageNode {
        Default::default()
    }
}
///An object representing Typst `relative` or `fraction` types.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "An object representing Typst `relative` or `fraction` types.",
///  "type": "object",
///  "required": [
///    "type"
///  ],
///  "properties": {
///    "unit": {
///      "description": "The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'.",
///      "type": "string"
///    },
///    "value": {
///      "description": "The length numeric value.",
///      "type": "string"
///    },
///    "type": {
///      "type": "string",
///      "const": "length"
///    }
///  },
///  "additionalProperties": false,
///  "id": "TyXLengthValue"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXLengthValue {
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    ///The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub unit: ::std::option::Option<::std::string::String>,
    ///The length numeric value.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub value: ::std::option::Option<::std::string::String>,
}
impl ::std::convert::From<&TyXLengthValue> for TyXLengthValue {
    fn from(value: &TyXLengthValue) -> Self {
        value.clone()
    }
}
impl TyXLengthValue {
    pub fn builder() -> builder::TyXLengthValue {
        Default::default()
    }
}
///A line break node.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A line break node.",
///  "type": "object",
///  "required": [
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "linebreak"
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXLineBreakNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXLineBreakNode {
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXLineBreakNode> for TyXLineBreakNode {
    fn from(value: &TyXLineBreakNode) -> Self {
        value.clone()
    }
}
impl TyXLineBreakNode {
    pub fn builder() -> builder::TyXLineBreakNode {
        Default::default()
    }
}
///A link node.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A link node.",
///  "type": "object",
///  "required": [
///    "children",
///    "type",
///    "url"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "link"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    },
///    "url": {
///      "type": "string"
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXLinkNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXLinkNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    pub url: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXLinkNode> for TyXLinkNode {
    fn from(value: &TyXLinkNode) -> Self {
        value.clone()
    }
}
impl TyXLinkNode {
    pub fn builder() -> builder::TyXLinkNode {
        Default::default()
    }
}
///A node describing a list item.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a list item.",
///  "type": "object",
///  "required": [
///    "children",
///    "type",
///    "value"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "listitem"
///    },
///    "value": {
///      "type": "integer",
///      "maximum": 9007199254740991.0,
///      "minimum": -9007199254740991.0
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXListItemNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXListItemNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    pub value: i64,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXListItemNode> for TyXListItemNode {
    fn from(value: &TyXListItemNode) -> Self {
        value.clone()
    }
}
impl TyXListItemNode {
    pub fn builder() -> builder::TyXListItemNode {
        Default::default()
    }
}
///A node describing a bullet or numbered list.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a bullet or numbered list.",
///  "type": "object",
///  "required": [
///    "children",
///    "listType",
///    "start",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "list"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    },
///    "listType": {
///      "anyOf": [
///        {
///          "type": "string",
///          "const": "bullet"
///        },
///        {
///          "type": "string",
///          "const": "number"
///        },
///        {
///          "type": "string",
///          "const": "check"
///        }
///      ]
///    },
///    "start": {
///      "type": "integer",
///      "maximum": 9007199254740991.0,
///      "minimum": -9007199254740991.0
///    },
///    "direction": {
///      "anyOf": [
///        {
///          "anyOf": [
///            {
///              "type": "string",
///              "const": "ltr"
///            },
///            {
///              "type": "string",
///              "const": "rtl"
///            }
///          ]
///        },
///        {
///          "type": "null"
///        }
///      ]
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXListNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXListNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub direction: ::std::option::Option<TyXListNodeDirection>,
    #[serde(rename = "listType")]
    pub list_type: TyXListNodeListType,
    pub start: i64,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXListNode> for TyXListNode {
    fn from(value: &TyXListNode) -> Self {
        value.clone()
    }
}
impl TyXListNode {
    pub fn builder() -> builder::TyXListNode {
        Default::default()
    }
}
///`TyXListNodeDirection`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "ltr"
///    },
///    {
///      "type": "string",
///      "const": "rtl"
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXListNodeDirection {
    #[serde(rename = "ltr")]
    Ltr,
    #[serde(rename = "rtl")]
    Rtl,
}
impl ::std::convert::From<&Self> for TyXListNodeDirection {
    fn from(value: &TyXListNodeDirection) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXListNodeDirection {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Ltr => f.write_str("ltr"),
            Self::Rtl => f.write_str("rtl"),
        }
    }
}
impl ::std::str::FromStr for TyXListNodeDirection {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "ltr" => Ok(Self::Ltr),
            "rtl" => Ok(Self::Rtl),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXListNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXListNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXListNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///`TyXListNodeListType`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "bullet"
///    },
///    {
///      "type": "string",
///      "const": "number"
///    },
///    {
///      "type": "string",
///      "const": "check"
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXListNodeListType {
    #[serde(rename = "bullet")]
    Bullet,
    #[serde(rename = "number")]
    Number,
    #[serde(rename = "check")]
    Check,
}
impl ::std::convert::From<&Self> for TyXListNodeListType {
    fn from(value: &TyXListNodeListType) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXListNodeListType {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Bullet => f.write_str("bullet"),
            Self::Number => f.write_str("number"),
            Self::Check => f.write_str("check"),
        }
    }
}
impl ::std::str::FromStr for TyXListNodeListType {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "bullet" => Ok(Self::Bullet),
            "number" => Ok(Self::Number),
            "check" => Ok(Self::Check),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXListNodeListType {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXListNodeListType {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXListNodeListType {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///A node describing a math equation.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a math equation.",
///  "type": "object",
///  "required": [
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "math"
///    },
///    "typst": {
///      "type": "string"
///    },
///    "formula": {
///      "type": "string"
///    },
///    "inline": {
///      "type": "boolean"
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXMathNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXMathNode {
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub formula: ::std::option::Option<::std::string::String>,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub inline: ::std::option::Option<bool>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub typst: ::std::option::Option<::std::string::String>,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXMathNode> for TyXMathNode {
    fn from(value: &TyXMathNode) -> Self {
        value.clone()
    }
}
impl TyXMathNode {
    pub fn builder() -> builder::TyXMathNode {
        Default::default()
    }
}
///Some TyX node.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "Some TyX node.",
///  "anyOf": [
///    {
///      "$ref": "#/definitions/TyXRootNode"
///    },
///    {
///      "$ref": "#/definitions/TyXParagraphNode"
///    },
///    {
///      "$ref": "#/definitions/TyXTextNode"
///    },
///    {
///      "$ref": "#/definitions/TyXMathNode"
///    },
///    {
///      "$ref": "#/definitions/TyXListItemNode"
///    },
///    {
///      "$ref": "#/definitions/TyXListNode"
///    },
///    {
///      "$ref": "#/definitions/TyXCodeNode"
///    },
///    {
///      "$ref": "#/definitions/TyXQuoteNode"
///    },
///    {
///      "$ref": "#/definitions/TyXTableNode"
///    },
///    {
///      "$ref": "#/definitions/TyXTableRowNode"
///    },
///    {
///      "$ref": "#/definitions/TyXTableCellNode"
///    },
///    {
///      "$ref": "#/definitions/TyXLineBreakNode"
///    },
///    {
///      "$ref": "#/definitions/TyXHorizontalRuleNode"
///    },
///    {
///      "$ref": "#/definitions/TyXTypstCodeNode"
///    },
///    {
///      "$ref": "#/definitions/TyXImageNode"
///    },
///    {
///      "$ref": "#/definitions/TyXLinkNode"
///    },
///    {
///      "$ref": "#/definitions/TyXHeadingNode"
///    },
///    {
///      "$ref": "#/definitions/TyXFunctionCallNode"
///    }
///  ],
///  "id": "TyXNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(untagged)]
pub enum TyXNode {
    RootNode(TyXRootNode),
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
}
impl ::std::convert::From<&Self> for TyXNode {
    fn from(value: &TyXNode) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<TyXRootNode> for TyXNode {
    fn from(value: TyXRootNode) -> Self {
        Self::RootNode(value)
    }
}
impl ::std::convert::From<TyXParagraphNode> for TyXNode {
    fn from(value: TyXParagraphNode) -> Self {
        Self::ParagraphNode(value)
    }
}
impl ::std::convert::From<TyXTextNode> for TyXNode {
    fn from(value: TyXTextNode) -> Self {
        Self::TextNode(value)
    }
}
impl ::std::convert::From<TyXMathNode> for TyXNode {
    fn from(value: TyXMathNode) -> Self {
        Self::MathNode(value)
    }
}
impl ::std::convert::From<TyXListItemNode> for TyXNode {
    fn from(value: TyXListItemNode) -> Self {
        Self::ListItemNode(value)
    }
}
impl ::std::convert::From<TyXListNode> for TyXNode {
    fn from(value: TyXListNode) -> Self {
        Self::ListNode(value)
    }
}
impl ::std::convert::From<TyXCodeNode> for TyXNode {
    fn from(value: TyXCodeNode) -> Self {
        Self::CodeNode(value)
    }
}
impl ::std::convert::From<TyXQuoteNode> for TyXNode {
    fn from(value: TyXQuoteNode) -> Self {
        Self::QuoteNode(value)
    }
}
impl ::std::convert::From<TyXTableNode> for TyXNode {
    fn from(value: TyXTableNode) -> Self {
        Self::TableNode(value)
    }
}
impl ::std::convert::From<TyXTableRowNode> for TyXNode {
    fn from(value: TyXTableRowNode) -> Self {
        Self::TableRowNode(value)
    }
}
impl ::std::convert::From<TyXTableCellNode> for TyXNode {
    fn from(value: TyXTableCellNode) -> Self {
        Self::TableCellNode(value)
    }
}
impl ::std::convert::From<TyXLineBreakNode> for TyXNode {
    fn from(value: TyXLineBreakNode) -> Self {
        Self::LineBreakNode(value)
    }
}
impl ::std::convert::From<TyXHorizontalRuleNode> for TyXNode {
    fn from(value: TyXHorizontalRuleNode) -> Self {
        Self::HorizontalRuleNode(value)
    }
}
impl ::std::convert::From<TyXTypstCodeNode> for TyXNode {
    fn from(value: TyXTypstCodeNode) -> Self {
        Self::TypstCodeNode(value)
    }
}
impl ::std::convert::From<TyXImageNode> for TyXNode {
    fn from(value: TyXImageNode) -> Self {
        Self::ImageNode(value)
    }
}
impl ::std::convert::From<TyXLinkNode> for TyXNode {
    fn from(value: TyXLinkNode) -> Self {
        Self::LinkNode(value)
    }
}
impl ::std::convert::From<TyXHeadingNode> for TyXNode {
    fn from(value: TyXHeadingNode) -> Self {
        Self::HeadingNode(value)
    }
}
impl ::std::convert::From<TyXFunctionCallNode> for TyXNode {
    fn from(value: TyXFunctionCallNode) -> Self {
        Self::FunctionCallNode(value)
    }
}
///A node describing a paragraph.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a paragraph.",
///  "type": "object",
///  "required": [
///    "children",
///    "format",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "paragraph"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    },
///    "format": {
///      "anyOf": [
///        {
///          "type": "string",
///          "const": "left"
///        },
///        {
///          "type": "string",
///          "const": "start"
///        },
///        {
///          "type": "string",
///          "const": "center"
///        },
///        {
///          "type": "string",
///          "const": "right"
///        },
///        {
///          "type": "string",
///          "const": "end"
///        },
///        {
///          "type": "string",
///          "const": "justify"
///        },
///        {
///          "type": "string",
///          "const": ""
///        }
///      ]
///    },
///    "direction": {
///      "anyOf": [
///        {
///          "anyOf": [
///            {
///              "type": "string",
///              "const": "ltr"
///            },
///            {
///              "type": "string",
///              "const": "rtl"
///            }
///          ]
///        },
///        {
///          "type": "null"
///        }
///      ]
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXParagraphNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXParagraphNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub direction: ::std::option::Option<TyXParagraphNodeDirection>,
    pub format: TyXParagraphNodeFormat,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXParagraphNode> for TyXParagraphNode {
    fn from(value: &TyXParagraphNode) -> Self {
        value.clone()
    }
}
impl TyXParagraphNode {
    pub fn builder() -> builder::TyXParagraphNode {
        Default::default()
    }
}
///`TyXParagraphNodeDirection`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "ltr"
///    },
///    {
///      "type": "string",
///      "const": "rtl"
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXParagraphNodeDirection {
    #[serde(rename = "ltr")]
    Ltr,
    #[serde(rename = "rtl")]
    Rtl,
}
impl ::std::convert::From<&Self> for TyXParagraphNodeDirection {
    fn from(value: &TyXParagraphNodeDirection) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXParagraphNodeDirection {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Ltr => f.write_str("ltr"),
            Self::Rtl => f.write_str("rtl"),
        }
    }
}
impl ::std::str::FromStr for TyXParagraphNodeDirection {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "ltr" => Ok(Self::Ltr),
            "rtl" => Ok(Self::Rtl),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXParagraphNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXParagraphNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXParagraphNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///`TyXParagraphNodeFormat`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "left"
///    },
///    {
///      "type": "string",
///      "const": "start"
///    },
///    {
///      "type": "string",
///      "const": "center"
///    },
///    {
///      "type": "string",
///      "const": "right"
///    },
///    {
///      "type": "string",
///      "const": "end"
///    },
///    {
///      "type": "string",
///      "const": "justify"
///    },
///    {
///      "type": "string",
///      "const": ""
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXParagraphNodeFormat {
    #[serde(rename = "left")]
    Left,
    #[serde(rename = "start")]
    Start,
    #[serde(rename = "center")]
    Center,
    #[serde(rename = "right")]
    Right,
    #[serde(rename = "end")]
    End,
    #[serde(rename = "justify")]
    Justify,
    #[serde(rename = "")]
    X,
}
impl ::std::convert::From<&Self> for TyXParagraphNodeFormat {
    fn from(value: &TyXParagraphNodeFormat) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXParagraphNodeFormat {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Left => f.write_str("left"),
            Self::Start => f.write_str("start"),
            Self::Center => f.write_str("center"),
            Self::Right => f.write_str("right"),
            Self::End => f.write_str("end"),
            Self::Justify => f.write_str("justify"),
            Self::X => f.write_str(""),
        }
    }
}
impl ::std::str::FromStr for TyXParagraphNodeFormat {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "left" => Ok(Self::Left),
            "start" => Ok(Self::Start),
            "center" => Ok(Self::Center),
            "right" => Ok(Self::Right),
            "end" => Ok(Self::End),
            "justify" => Ok(Self::Justify),
            "" => Ok(Self::X),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXParagraphNodeFormat {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXParagraphNodeFormat {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXParagraphNodeFormat {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///A node describing a block quote.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a block quote.",
///  "type": "object",
///  "required": [
///    "children",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "quote"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    },
///    "direction": {
///      "anyOf": [
///        {
///          "anyOf": [
///            {
///              "type": "string",
///              "const": "ltr"
///            },
///            {
///              "type": "string",
///              "const": "rtl"
///            }
///          ]
///        },
///        {
///          "type": "null"
///        }
///      ]
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXQuoteNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXQuoteNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub direction: ::std::option::Option<TyXQuoteNodeDirection>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXQuoteNode> for TyXQuoteNode {
    fn from(value: &TyXQuoteNode) -> Self {
        value.clone()
    }
}
impl TyXQuoteNode {
    pub fn builder() -> builder::TyXQuoteNode {
        Default::default()
    }
}
///`TyXQuoteNodeDirection`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "ltr"
///    },
///    {
///      "type": "string",
///      "const": "rtl"
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXQuoteNodeDirection {
    #[serde(rename = "ltr")]
    Ltr,
    #[serde(rename = "rtl")]
    Rtl,
}
impl ::std::convert::From<&Self> for TyXQuoteNodeDirection {
    fn from(value: &TyXQuoteNodeDirection) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXQuoteNodeDirection {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Ltr => f.write_str("ltr"),
            Self::Rtl => f.write_str("rtl"),
        }
    }
}
impl ::std::str::FromStr for TyXQuoteNodeDirection {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "ltr" => Ok(Self::Ltr),
            "rtl" => Ok(Self::Rtl),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXQuoteNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXQuoteNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXQuoteNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///The node at the root of a TyX document.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "The node at the root of a TyX document.",
///  "type": "object",
///  "required": [
///    "children",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "root"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    },
///    "direction": {
///      "anyOf": [
///        {
///          "anyOf": [
///            {
///              "type": "string",
///              "const": "ltr"
///            },
///            {
///              "type": "string",
///              "const": "rtl"
///            }
///          ]
///        },
///        {
///          "type": "null"
///        }
///      ]
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXRootNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXRootNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub direction: ::std::option::Option<TyXRootNodeDirection>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXRootNode> for TyXRootNode {
    fn from(value: &TyXRootNode) -> Self {
        value.clone()
    }
}
impl TyXRootNode {
    pub fn builder() -> builder::TyXRootNode {
        Default::default()
    }
}
///`TyXRootNodeDirection`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "ltr"
///    },
///    {
///      "type": "string",
///      "const": "rtl"
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXRootNodeDirection {
    #[serde(rename = "ltr")]
    Ltr,
    #[serde(rename = "rtl")]
    Rtl,
}
impl ::std::convert::From<&Self> for TyXRootNodeDirection {
    fn from(value: &TyXRootNodeDirection) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXRootNodeDirection {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Ltr => f.write_str("ltr"),
            Self::Rtl => f.write_str("rtl"),
        }
    }
}
impl ::std::str::FromStr for TyXRootNodeDirection {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "ltr" => Ok(Self::Ltr),
            "rtl" => Ok(Self::Rtl),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXRootNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXRootNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXRootNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///A node describing a table cell.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a table cell.",
///  "type": "object",
///  "required": [
///    "children",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "tablecell"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    },
///    "direction": {
///      "anyOf": [
///        {
///          "anyOf": [
///            {
///              "type": "string",
///              "const": "ltr"
///            },
///            {
///              "type": "string",
///              "const": "rtl"
///            }
///          ]
///        },
///        {
///          "type": "null"
///        }
///      ]
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXTableCellNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXTableCellNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub direction: ::std::option::Option<TyXTableCellNodeDirection>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTableCellNode> for TyXTableCellNode {
    fn from(value: &TyXTableCellNode) -> Self {
        value.clone()
    }
}
impl TyXTableCellNode {
    pub fn builder() -> builder::TyXTableCellNode {
        Default::default()
    }
}
///`TyXTableCellNodeDirection`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "ltr"
///    },
///    {
///      "type": "string",
///      "const": "rtl"
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXTableCellNodeDirection {
    #[serde(rename = "ltr")]
    Ltr,
    #[serde(rename = "rtl")]
    Rtl,
}
impl ::std::convert::From<&Self> for TyXTableCellNodeDirection {
    fn from(value: &TyXTableCellNodeDirection) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXTableCellNodeDirection {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Ltr => f.write_str("ltr"),
            Self::Rtl => f.write_str("rtl"),
        }
    }
}
impl ::std::str::FromStr for TyXTableCellNodeDirection {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "ltr" => Ok(Self::Ltr),
            "rtl" => Ok(Self::Rtl),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXTableCellNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXTableCellNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXTableCellNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///A node describing a table.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a table.",
///  "type": "object",
///  "required": [
///    "children",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "table"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    },
///    "direction": {
///      "anyOf": [
///        {
///          "anyOf": [
///            {
///              "type": "string",
///              "const": "ltr"
///            },
///            {
///              "type": "string",
///              "const": "rtl"
///            }
///          ]
///        },
///        {
///          "type": "null"
///        }
///      ]
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXTableNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXTableNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub direction: ::std::option::Option<TyXTableNodeDirection>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTableNode> for TyXTableNode {
    fn from(value: &TyXTableNode) -> Self {
        value.clone()
    }
}
impl TyXTableNode {
    pub fn builder() -> builder::TyXTableNode {
        Default::default()
    }
}
///`TyXTableNodeDirection`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "ltr"
///    },
///    {
///      "type": "string",
///      "const": "rtl"
///    }
///  ]
///}
/// ```
/// </details>
#[derive(
    ::serde::Deserialize,
    ::serde::Serialize,
    Clone,
    Copy,
    Debug,
    Eq,
    Hash,
    Ord,
    PartialEq,
    PartialOrd
)]
pub enum TyXTableNodeDirection {
    #[serde(rename = "ltr")]
    Ltr,
    #[serde(rename = "rtl")]
    Rtl,
}
impl ::std::convert::From<&Self> for TyXTableNodeDirection {
    fn from(value: &TyXTableNodeDirection) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXTableNodeDirection {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Ltr => f.write_str("ltr"),
            Self::Rtl => f.write_str("rtl"),
        }
    }
}
impl ::std::str::FromStr for TyXTableNodeDirection {
    type Err = self::error::ConversionError;
    fn from_str(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        match value {
            "ltr" => Ok(Self::Ltr),
            "rtl" => Ok(Self::Rtl),
            _ => Err("invalid value".into()),
        }
    }
}
impl ::std::convert::TryFrom<&str> for TyXTableNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXTableNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXTableNodeDirection {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///A node describing a table row.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing a table row.",
///  "type": "object",
///  "required": [
///    "children",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "tablerow"
///    },
///    "children": {
///      "type": "array",
///      "items": {
///        "$ref": "#/definitions/TyXNode"
///      }
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXTableRowNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXTableRowNode {
    pub children: ::std::vec::Vec<TyXNode>,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTableRowNode> for TyXTableRowNode {
    fn from(value: &TyXTableRowNode) -> Self {
        value.clone()
    }
}
impl TyXTableRowNode {
    pub fn builder() -> builder::TyXTableRowNode {
        Default::default()
    }
}
///A node describing text.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A node describing text.",
///  "type": "object",
///  "required": [
///    "format",
///    "text",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "text"
///    },
///    "text": {
///      "type": "string"
///    },
///    "format": {
///      "type": "integer",
///      "maximum": 9007199254740991.0,
///      "minimum": -9007199254740991.0
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXTextNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXTextNode {
    pub format: i64,
    pub text: ::std::string::String,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTextNode> for TyXTextNode {
    fn from(value: &TyXTextNode) -> Self {
        value.clone()
    }
}
impl TyXTextNode {
    pub fn builder() -> builder::TyXTextNode {
        Default::default()
    }
}
///A raw Typst code node.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A raw Typst code node.",
///  "type": "object",
///  "required": [
///    "text",
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "typstcode"
///    },
///    "text": {
///      "type": "object",
///      "required": [
///        "editorState"
///      ],
///      "properties": {
///        "editorState": {
///          "type": "object",
///          "required": [
///            "root"
///          ],
///          "properties": {
///            "root": {
///              "$ref": "#/definitions/TyXRootNode"
///            }
///          },
///          "additionalProperties": {}
///        }
///      },
///      "additionalProperties": {}
///    }
///  },
///  "additionalProperties": {},
///  "id": "TyXTypstCodeNode"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXTypstCodeNode {
    pub text: TyXTypstCodeNodeText,
    #[serde(rename = "type")]
    pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTypstCodeNode> for TyXTypstCodeNode {
    fn from(value: &TyXTypstCodeNode) -> Self {
        value.clone()
    }
}
impl TyXTypstCodeNode {
    pub fn builder() -> builder::TyXTypstCodeNode {
        Default::default()
    }
}
///`TyXTypstCodeNodeText`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "type": "object",
///  "required": [
///    "editorState"
///  ],
///  "properties": {
///    "editorState": {
///      "type": "object",
///      "required": [
///        "root"
///      ],
///      "properties": {
///        "root": {
///          "$ref": "#/definitions/TyXRootNode"
///        }
///      },
///      "additionalProperties": {}
///    }
///  },
///  "additionalProperties": {}
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXTypstCodeNodeText {
    #[serde(rename = "editorState")]
    pub editor_state: TyXTypstCodeNodeTextEditorState,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTypstCodeNodeText> for TyXTypstCodeNodeText {
    fn from(value: &TyXTypstCodeNodeText) -> Self {
        value.clone()
    }
}
impl TyXTypstCodeNodeText {
    pub fn builder() -> builder::TyXTypstCodeNodeText {
        Default::default()
    }
}
///`TyXTypstCodeNodeTextEditorState`
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "type": "object",
///  "required": [
///    "root"
///  ],
///  "properties": {
///    "root": {
///      "$ref": "#/definitions/TyXRootNode"
///    }
///  },
///  "additionalProperties": {}
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
pub struct TyXTypstCodeNodeTextEditorState {
    pub root: TyXRootNode,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTypstCodeNodeTextEditorState>
for TyXTypstCodeNodeTextEditorState {
    fn from(value: &TyXTypstCodeNodeTextEditorState) -> Self {
        value.clone()
    }
}
impl TyXTypstCodeNodeTextEditorState {
    pub fn builder() -> builder::TyXTypstCodeNodeTextEditorState {
        Default::default()
    }
}
/// Types for composing complex structures.
pub mod builder {
    #[derive(Clone, Debug)]
    pub struct FunctionDefinition {
        inline: ::std::result::Result<
            ::std::option::Option<bool>,
            ::std::string::String,
        >,
        named: ::std::result::Result<
            ::std::vec::Vec<super::FunctionDefinitionNamedItem>,
            ::std::string::String,
        >,
        positional: ::std::result::Result<
            ::std::vec::Vec<super::ParameterDescription>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for FunctionDefinition {
        fn default() -> Self {
            Self {
                inline: Ok(Default::default()),
                named: Ok(Default::default()),
                positional: Ok(Default::default()),
            }
        }
    }
    impl FunctionDefinition {
        pub fn inline<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.inline = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for inline: {}", e)
                });
            self
        }
        pub fn named<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::vec::Vec<super::FunctionDefinitionNamedItem>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.named = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for named: {}", e)
                });
            self
        }
        pub fn positional<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::ParameterDescription>>,
            T::Error: ::std::fmt::Display,
        {
            self.positional = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for positional: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<FunctionDefinition> for super::FunctionDefinition {
        type Error = super::error::ConversionError;
        fn try_from(
            value: FunctionDefinition,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                inline: value.inline?,
                named: value.named?,
                positional: value.positional?,
            })
        }
    }
    impl ::std::convert::From<super::FunctionDefinition> for FunctionDefinition {
        fn from(value: super::FunctionDefinition) -> Self {
            Self {
                inline: Ok(value.inline),
                named: Ok(value.named),
                positional: Ok(value.positional),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct FunctionDefinitionNamedItem {
        documentation: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        label: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        name: ::std::result::Result<::std::string::String, ::std::string::String>,
        required: ::std::result::Result<
            ::std::option::Option<bool>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
    }
    impl ::std::default::Default for FunctionDefinitionNamedItem {
        fn default() -> Self {
            Self {
                documentation: Ok(Default::default()),
                label: Ok(Default::default()),
                name: Err("no value supplied for name".to_string()),
                required: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
            }
        }
    }
    impl FunctionDefinitionNamedItem {
        pub fn documentation<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.documentation = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for documentation: {}", e)
                });
            self
        }
        pub fn label<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.label = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for label: {}", e)
                });
            self
        }
        pub fn name<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.name = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for name: {}", e));
            self
        }
        pub fn required<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.required = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for required: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<FunctionDefinitionNamedItem>
    for super::FunctionDefinitionNamedItem {
        type Error = super::error::ConversionError;
        fn try_from(
            value: FunctionDefinitionNamedItem,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                documentation: value.documentation?,
                label: value.label?,
                name: value.name?,
                required: value.required?,
                type_: value.type_?,
            })
        }
    }
    impl ::std::convert::From<super::FunctionDefinitionNamedItem>
    for FunctionDefinitionNamedItem {
        fn from(value: super::FunctionDefinitionNamedItem) -> Self {
            Self {
                documentation: Ok(value.documentation),
                label: Ok(value.label),
                name: Ok(value.name),
                required: Ok(value.required),
                type_: Ok(value.type_),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct ParameterDescription {
        documentation: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        label: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        required: ::std::result::Result<
            ::std::option::Option<bool>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
    }
    impl ::std::default::Default for ParameterDescription {
        fn default() -> Self {
            Self {
                documentation: Ok(Default::default()),
                label: Ok(Default::default()),
                required: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
            }
        }
    }
    impl ParameterDescription {
        pub fn documentation<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.documentation = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for documentation: {}", e)
                });
            self
        }
        pub fn label<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.label = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for label: {}", e)
                });
            self
        }
        pub fn required<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.required = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for required: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<ParameterDescription> for super::ParameterDescription {
        type Error = super::error::ConversionError;
        fn try_from(
            value: ParameterDescription,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                documentation: value.documentation?,
                label: value.label?,
                required: value.required?,
                type_: value.type_?,
            })
        }
    }
    impl ::std::convert::From<super::ParameterDescription> for ParameterDescription {
        fn from(value: super::ParameterDescription) -> Self {
            Self {
                documentation: Ok(value.documentation),
                label: Ok(value.label),
                required: Ok(value.required),
                type_: Ok(value.type_),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXBooleanValue {
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        value: ::std::result::Result<::std::option::Option<bool>, ::std::string::String>,
    }
    impl ::std::default::Default for TyXBooleanValue {
        fn default() -> Self {
            Self {
                type_: Err("no value supplied for type_".to_string()),
                value: Ok(Default::default()),
            }
        }
    }
    impl TyXBooleanValue {
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn value<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.value = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for value: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXBooleanValue> for super::TyXBooleanValue {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXBooleanValue,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                type_: value.type_?,
                value: value.value?,
            })
        }
    }
    impl ::std::convert::From<super::TyXBooleanValue> for TyXBooleanValue {
        fn from(value: super::TyXBooleanValue) -> Self {
            Self {
                type_: Ok(value.type_),
                value: Ok(value.value),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXCodeNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        language: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXCodeNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                language: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXCodeNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn language<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.language = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for language: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXCodeNode> for super::TyXCodeNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXCodeNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                language: value.language?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXCodeNode> for TyXCodeNode {
        fn from(value: super::TyXCodeNode) -> Self {
            Self {
                children: Ok(value.children),
                language: Ok(value.language),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXDocument {
        content: ::std::result::Result<
            ::std::option::Option<super::TyXDocumentContent>,
            ::std::string::String,
        >,
        dirty: ::std::result::Result<::std::option::Option<bool>, ::std::string::String>,
        filename: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        preamble: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        schema: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        settings: ::std::result::Result<
            ::std::option::Option<super::TyXDocumentSettings>,
            ::std::string::String,
        >,
        version: ::std::result::Result<::std::string::String, ::std::string::String>,
    }
    impl ::std::default::Default for TyXDocument {
        fn default() -> Self {
            Self {
                content: Ok(Default::default()),
                dirty: Ok(Default::default()),
                filename: Ok(Default::default()),
                preamble: Ok(Default::default()),
                schema: Ok(Default::default()),
                settings: Ok(Default::default()),
                version: Err("no value supplied for version".to_string()),
            }
        }
    }
    impl TyXDocument {
        pub fn content<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<super::TyXDocumentContent>>,
            T::Error: ::std::fmt::Display,
        {
            self.content = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for content: {}", e)
                });
            self
        }
        pub fn dirty<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.dirty = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for dirty: {}", e)
                });
            self
        }
        pub fn filename<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.filename = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for filename: {}", e)
                });
            self
        }
        pub fn preamble<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.preamble = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for preamble: {}", e)
                });
            self
        }
        pub fn schema<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.schema = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for schema: {}", e)
                });
            self
        }
        pub fn settings<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::option::Option<super::TyXDocumentSettings>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.settings = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for settings: {}", e)
                });
            self
        }
        pub fn version<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.version = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for version: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXDocument> for super::TyXDocument {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXDocument,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                content: value.content?,
                dirty: value.dirty?,
                filename: value.filename?,
                preamble: value.preamble?,
                schema: value.schema?,
                settings: value.settings?,
                version: value.version?,
            })
        }
    }
    impl ::std::convert::From<super::TyXDocument> for TyXDocument {
        fn from(value: super::TyXDocument) -> Self {
            Self {
                content: Ok(value.content),
                dirty: Ok(value.dirty),
                filename: Ok(value.filename),
                preamble: Ok(value.preamble),
                schema: Ok(value.schema),
                settings: Ok(value.settings),
                version: Ok(value.version),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXDocumentContent {
        root: ::std::result::Result<super::TyXRootNode, ::std::string::String>,
    }
    impl ::std::default::Default for TyXDocumentContent {
        fn default() -> Self {
            Self {
                root: Err("no value supplied for root".to_string()),
            }
        }
    }
    impl TyXDocumentContent {
        pub fn root<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TyXRootNode>,
            T::Error: ::std::fmt::Display,
        {
            self.root = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for root: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<TyXDocumentContent> for super::TyXDocumentContent {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXDocumentContent,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self { root: value.root? })
        }
    }
    impl ::std::convert::From<super::TyXDocumentContent> for TyXDocumentContent {
        fn from(value: super::TyXDocumentContent) -> Self {
            Self { root: Ok(value.root) }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXDocumentSettings {
        columns: ::std::result::Result<
            ::std::option::Option<f64>,
            ::std::string::String,
        >,
        flipped: ::std::result::Result<
            ::std::option::Option<bool>,
            ::std::string::String,
        >,
        font_paths: ::std::result::Result<
            ::std::vec::Vec<::std::string::String>,
            ::std::string::String,
        >,
        functions: ::std::result::Result<
            ::std::collections::HashMap<
                ::std::string::String,
                super::FunctionDefinition,
            >,
            ::std::string::String,
        >,
        indentation: ::std::result::Result<
            ::std::option::Option<super::TyXDocumentSettingsIndentation>,
            ::std::string::String,
        >,
        justified: ::std::result::Result<
            ::std::option::Option<bool>,
            ::std::string::String,
        >,
        language: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        paper: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        root: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXDocumentSettings {
        fn default() -> Self {
            Self {
                columns: Ok(Default::default()),
                flipped: Ok(Default::default()),
                font_paths: Ok(Default::default()),
                functions: Ok(Default::default()),
                indentation: Ok(Default::default()),
                justified: Ok(Default::default()),
                language: Ok(Default::default()),
                paper: Ok(Default::default()),
                root: Ok(Default::default()),
            }
        }
    }
    impl TyXDocumentSettings {
        pub fn columns<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<f64>>,
            T::Error: ::std::fmt::Display,
        {
            self.columns = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for columns: {}", e)
                });
            self
        }
        pub fn flipped<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.flipped = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for flipped: {}", e)
                });
            self
        }
        pub fn font_paths<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.font_paths = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for font_paths: {}", e)
                });
            self
        }
        pub fn functions<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::collections::HashMap<
                    ::std::string::String,
                    super::FunctionDefinition,
                >,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.functions = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for functions: {}", e)
                });
            self
        }
        pub fn indentation<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::option::Option<super::TyXDocumentSettingsIndentation>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.indentation = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for indentation: {}", e)
                });
            self
        }
        pub fn justified<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.justified = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for justified: {}", e)
                });
            self
        }
        pub fn language<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.language = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for language: {}", e)
                });
            self
        }
        pub fn paper<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.paper = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for paper: {}", e)
                });
            self
        }
        pub fn root<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.root = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for root: {}", e));
            self
        }
    }
    impl ::std::convert::TryFrom<TyXDocumentSettings> for super::TyXDocumentSettings {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXDocumentSettings,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                columns: value.columns?,
                flipped: value.flipped?,
                font_paths: value.font_paths?,
                functions: value.functions?,
                indentation: value.indentation?,
                justified: value.justified?,
                language: value.language?,
                paper: value.paper?,
                root: value.root?,
            })
        }
    }
    impl ::std::convert::From<super::TyXDocumentSettings> for TyXDocumentSettings {
        fn from(value: super::TyXDocumentSettings) -> Self {
            Self {
                columns: Ok(value.columns),
                flipped: Ok(value.flipped),
                font_paths: Ok(value.font_paths),
                functions: Ok(value.functions),
                indentation: Ok(value.indentation),
                justified: Ok(value.justified),
                language: Ok(value.language),
                paper: Ok(value.paper),
                root: Ok(value.root),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXDocumentSettingsIndentation {
        unit: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        value: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXDocumentSettingsIndentation {
        fn default() -> Self {
            Self {
                unit: Ok(Default::default()),
                value: Ok(Default::default()),
            }
        }
    }
    impl TyXDocumentSettingsIndentation {
        pub fn unit<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.unit = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for unit: {}", e));
            self
        }
        pub fn value<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.value = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for value: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXDocumentSettingsIndentation>
    for super::TyXDocumentSettingsIndentation {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXDocumentSettingsIndentation,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                unit: value.unit?,
                value: value.value?,
            })
        }
    }
    impl ::std::convert::From<super::TyXDocumentSettingsIndentation>
    for TyXDocumentSettingsIndentation {
        fn from(value: super::TyXDocumentSettingsIndentation) -> Self {
            Self {
                unit: Ok(value.unit),
                value: Ok(value.value),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXFunctionCallNode {
        name: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        named_parameters: ::std::result::Result<
            ::std::collections::HashMap<
                ::std::string::String,
                super::TyXFunctionCallNodeNamedParametersValue,
            >,
            ::std::string::String,
        >,
        position_parameters: ::std::result::Result<
            ::std::vec::Vec<super::TyXFunctionCallNodePositionParametersItem>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXFunctionCallNode {
        fn default() -> Self {
            Self {
                name: Ok(Default::default()),
                named_parameters: Ok(Default::default()),
                position_parameters: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXFunctionCallNode {
        pub fn name<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.name = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for name: {}", e));
            self
        }
        pub fn named_parameters<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::collections::HashMap<
                    ::std::string::String,
                    super::TyXFunctionCallNodeNamedParametersValue,
                >,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.named_parameters = value
                .try_into()
                .map_err(|e| {
                    format!(
                        "error converting supplied value for named_parameters: {}", e
                    )
                });
            self
        }
        pub fn position_parameters<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::vec::Vec<super::TyXFunctionCallNodePositionParametersItem>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.position_parameters = value
                .try_into()
                .map_err(|e| {
                    format!(
                        "error converting supplied value for position_parameters: {}", e
                    )
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXFunctionCallNode> for super::TyXFunctionCallNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXFunctionCallNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                name: value.name?,
                named_parameters: value.named_parameters?,
                position_parameters: value.position_parameters?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXFunctionCallNode> for TyXFunctionCallNode {
        fn from(value: super::TyXFunctionCallNode) -> Self {
            Self {
                name: Ok(value.name),
                named_parameters: Ok(value.named_parameters),
                position_parameters: Ok(value.position_parameters),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXHeadingNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        tag: ::std::result::Result<super::TyXHeadingNodeTag, ::std::string::String>,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXHeadingNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                tag: Err("no value supplied for tag".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXHeadingNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn tag<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TyXHeadingNodeTag>,
            T::Error: ::std::fmt::Display,
        {
            self.tag = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for tag: {}", e));
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXHeadingNode> for super::TyXHeadingNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXHeadingNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                tag: value.tag?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXHeadingNode> for TyXHeadingNode {
        fn from(value: super::TyXHeadingNode) -> Self {
            Self {
                children: Ok(value.children),
                tag: Ok(value.tag),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXHorizontalRuleNode {
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXHorizontalRuleNode {
        fn default() -> Self {
            Self {
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXHorizontalRuleNode {
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXHorizontalRuleNode>
    for super::TyXHorizontalRuleNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXHorizontalRuleNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXHorizontalRuleNode> for TyXHorizontalRuleNode {
        fn from(value: super::TyXHorizontalRuleNode) -> Self {
            Self {
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXImageNode {
        src: ::std::result::Result<::std::string::String, ::std::string::String>,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXImageNode {
        fn default() -> Self {
            Self {
                src: Err("no value supplied for src".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXImageNode {
        pub fn src<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.src = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for src: {}", e));
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXImageNode> for super::TyXImageNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXImageNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                src: value.src?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXImageNode> for TyXImageNode {
        fn from(value: super::TyXImageNode) -> Self {
            Self {
                src: Ok(value.src),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXLengthValue {
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        unit: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        value: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXLengthValue {
        fn default() -> Self {
            Self {
                type_: Err("no value supplied for type_".to_string()),
                unit: Ok(Default::default()),
                value: Ok(Default::default()),
            }
        }
    }
    impl TyXLengthValue {
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn unit<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.unit = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for unit: {}", e));
            self
        }
        pub fn value<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.value = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for value: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXLengthValue> for super::TyXLengthValue {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXLengthValue,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                type_: value.type_?,
                unit: value.unit?,
                value: value.value?,
            })
        }
    }
    impl ::std::convert::From<super::TyXLengthValue> for TyXLengthValue {
        fn from(value: super::TyXLengthValue) -> Self {
            Self {
                type_: Ok(value.type_),
                unit: Ok(value.unit),
                value: Ok(value.value),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXLineBreakNode {
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXLineBreakNode {
        fn default() -> Self {
            Self {
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXLineBreakNode {
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXLineBreakNode> for super::TyXLineBreakNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXLineBreakNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXLineBreakNode> for TyXLineBreakNode {
        fn from(value: super::TyXLineBreakNode) -> Self {
            Self {
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXLinkNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        url: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXLinkNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                url: Err("no value supplied for url".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXLinkNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn url<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.url = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for url: {}", e));
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXLinkNode> for super::TyXLinkNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXLinkNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                type_: value.type_?,
                url: value.url?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXLinkNode> for TyXLinkNode {
        fn from(value: super::TyXLinkNode) -> Self {
            Self {
                children: Ok(value.children),
                type_: Ok(value.type_),
                url: Ok(value.url),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXListItemNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        value: ::std::result::Result<i64, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXListItemNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                value: Err("no value supplied for value".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXListItemNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn value<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<i64>,
            T::Error: ::std::fmt::Display,
        {
            self.value = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for value: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXListItemNode> for super::TyXListItemNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXListItemNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                type_: value.type_?,
                value: value.value?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXListItemNode> for TyXListItemNode {
        fn from(value: super::TyXListItemNode) -> Self {
            Self {
                children: Ok(value.children),
                type_: Ok(value.type_),
                value: Ok(value.value),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXListNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        direction: ::std::result::Result<
            ::std::option::Option<super::TyXListNodeDirection>,
            ::std::string::String,
        >,
        list_type: ::std::result::Result<
            super::TyXListNodeListType,
            ::std::string::String,
        >,
        start: ::std::result::Result<i64, ::std::string::String>,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXListNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                direction: Ok(Default::default()),
                list_type: Err("no value supplied for list_type".to_string()),
                start: Err("no value supplied for start".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXListNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn direction<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::option::Option<super::TyXListNodeDirection>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.direction = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for direction: {}", e)
                });
            self
        }
        pub fn list_type<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TyXListNodeListType>,
            T::Error: ::std::fmt::Display,
        {
            self.list_type = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for list_type: {}", e)
                });
            self
        }
        pub fn start<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<i64>,
            T::Error: ::std::fmt::Display,
        {
            self.start = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for start: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXListNode> for super::TyXListNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXListNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                direction: value.direction?,
                list_type: value.list_type?,
                start: value.start?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXListNode> for TyXListNode {
        fn from(value: super::TyXListNode) -> Self {
            Self {
                children: Ok(value.children),
                direction: Ok(value.direction),
                list_type: Ok(value.list_type),
                start: Ok(value.start),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXMathNode {
        formula: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        inline: ::std::result::Result<
            ::std::option::Option<bool>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        typst: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXMathNode {
        fn default() -> Self {
            Self {
                formula: Ok(Default::default()),
                inline: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
                typst: Ok(Default::default()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXMathNode {
        pub fn formula<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.formula = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for formula: {}", e)
                });
            self
        }
        pub fn inline<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.inline = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for inline: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn typst<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.typst = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for typst: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXMathNode> for super::TyXMathNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXMathNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                formula: value.formula?,
                inline: value.inline?,
                type_: value.type_?,
                typst: value.typst?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXMathNode> for TyXMathNode {
        fn from(value: super::TyXMathNode) -> Self {
            Self {
                formula: Ok(value.formula),
                inline: Ok(value.inline),
                type_: Ok(value.type_),
                typst: Ok(value.typst),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXParagraphNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        direction: ::std::result::Result<
            ::std::option::Option<super::TyXParagraphNodeDirection>,
            ::std::string::String,
        >,
        format: ::std::result::Result<
            super::TyXParagraphNodeFormat,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXParagraphNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                direction: Ok(Default::default()),
                format: Err("no value supplied for format".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXParagraphNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn direction<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::option::Option<super::TyXParagraphNodeDirection>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.direction = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for direction: {}", e)
                });
            self
        }
        pub fn format<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TyXParagraphNodeFormat>,
            T::Error: ::std::fmt::Display,
        {
            self.format = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for format: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXParagraphNode> for super::TyXParagraphNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXParagraphNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                direction: value.direction?,
                format: value.format?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXParagraphNode> for TyXParagraphNode {
        fn from(value: super::TyXParagraphNode) -> Self {
            Self {
                children: Ok(value.children),
                direction: Ok(value.direction),
                format: Ok(value.format),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXQuoteNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        direction: ::std::result::Result<
            ::std::option::Option<super::TyXQuoteNodeDirection>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXQuoteNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                direction: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXQuoteNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn direction<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::option::Option<super::TyXQuoteNodeDirection>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.direction = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for direction: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXQuoteNode> for super::TyXQuoteNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXQuoteNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                direction: value.direction?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXQuoteNode> for TyXQuoteNode {
        fn from(value: super::TyXQuoteNode) -> Self {
            Self {
                children: Ok(value.children),
                direction: Ok(value.direction),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXRootNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        direction: ::std::result::Result<
            ::std::option::Option<super::TyXRootNodeDirection>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXRootNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                direction: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXRootNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn direction<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::option::Option<super::TyXRootNodeDirection>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.direction = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for direction: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXRootNode> for super::TyXRootNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXRootNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                direction: value.direction?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXRootNode> for TyXRootNode {
        fn from(value: super::TyXRootNode) -> Self {
            Self {
                children: Ok(value.children),
                direction: Ok(value.direction),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXTableCellNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        direction: ::std::result::Result<
            ::std::option::Option<super::TyXTableCellNodeDirection>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXTableCellNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                direction: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXTableCellNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn direction<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::option::Option<super::TyXTableCellNodeDirection>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.direction = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for direction: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXTableCellNode> for super::TyXTableCellNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXTableCellNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                direction: value.direction?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXTableCellNode> for TyXTableCellNode {
        fn from(value: super::TyXTableCellNode) -> Self {
            Self {
                children: Ok(value.children),
                direction: Ok(value.direction),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXTableNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        direction: ::std::result::Result<
            ::std::option::Option<super::TyXTableNodeDirection>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXTableNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                direction: Ok(Default::default()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXTableNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn direction<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::option::Option<super::TyXTableNodeDirection>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.direction = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for direction: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXTableNode> for super::TyXTableNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXTableNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                direction: value.direction?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXTableNode> for TyXTableNode {
        fn from(value: super::TyXTableNode) -> Self {
            Self {
                children: Ok(value.children),
                direction: Ok(value.direction),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXTableRowNode {
        children: ::std::result::Result<
            ::std::vec::Vec<super::TyXNode>,
            ::std::string::String,
        >,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXTableRowNode {
        fn default() -> Self {
            Self {
                children: Err("no value supplied for children".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXTableRowNode {
        pub fn children<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<super::TyXNode>>,
            T::Error: ::std::fmt::Display,
        {
            self.children = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for children: {}", e)
                });
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXTableRowNode> for super::TyXTableRowNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXTableRowNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                children: value.children?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXTableRowNode> for TyXTableRowNode {
        fn from(value: super::TyXTableRowNode) -> Self {
            Self {
                children: Ok(value.children),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXTextNode {
        format: ::std::result::Result<i64, ::std::string::String>,
        text: ::std::result::Result<::std::string::String, ::std::string::String>,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXTextNode {
        fn default() -> Self {
            Self {
                format: Err("no value supplied for format".to_string()),
                text: Err("no value supplied for text".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXTextNode {
        pub fn format<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<i64>,
            T::Error: ::std::fmt::Display,
        {
            self.format = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for format: {}", e)
                });
            self
        }
        pub fn text<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.text = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for text: {}", e));
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXTextNode> for super::TyXTextNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXTextNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                format: value.format?,
                text: value.text?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXTextNode> for TyXTextNode {
        fn from(value: super::TyXTextNode) -> Self {
            Self {
                format: Ok(value.format),
                text: Ok(value.text),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXTypstCodeNode {
        text: ::std::result::Result<super::TyXTypstCodeNodeText, ::std::string::String>,
        type_: ::std::result::Result<::std::string::String, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXTypstCodeNode {
        fn default() -> Self {
            Self {
                text: Err("no value supplied for text".to_string()),
                type_: Err("no value supplied for type_".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXTypstCodeNode {
        pub fn text<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TyXTypstCodeNodeText>,
            T::Error: ::std::fmt::Display,
        {
            self.text = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for text: {}", e));
            self
        }
        pub fn type_<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::string::String>,
            T::Error: ::std::fmt::Display,
        {
            self.type_ = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for type_: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXTypstCodeNode> for super::TyXTypstCodeNode {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXTypstCodeNode,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                text: value.text?,
                type_: value.type_?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXTypstCodeNode> for TyXTypstCodeNode {
        fn from(value: super::TyXTypstCodeNode) -> Self {
            Self {
                text: Ok(value.text),
                type_: Ok(value.type_),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXTypstCodeNodeText {
        editor_state: ::std::result::Result<
            super::TyXTypstCodeNodeTextEditorState,
            ::std::string::String,
        >,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXTypstCodeNodeText {
        fn default() -> Self {
            Self {
                editor_state: Err("no value supplied for editor_state".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXTypstCodeNodeText {
        pub fn editor_state<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TyXTypstCodeNodeTextEditorState>,
            T::Error: ::std::fmt::Display,
        {
            self.editor_state = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for editor_state: {}", e)
                });
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXTypstCodeNodeText> for super::TyXTypstCodeNodeText {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXTypstCodeNodeText,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                editor_state: value.editor_state?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXTypstCodeNodeText> for TyXTypstCodeNodeText {
        fn from(value: super::TyXTypstCodeNodeText) -> Self {
            Self {
                editor_state: Ok(value.editor_state),
                extra: Ok(value.extra),
            }
        }
    }
    #[derive(Clone, Debug)]
    pub struct TyXTypstCodeNodeTextEditorState {
        root: ::std::result::Result<super::TyXRootNode, ::std::string::String>,
        extra: ::std::result::Result<
            ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXTypstCodeNodeTextEditorState {
        fn default() -> Self {
            Self {
                root: Err("no value supplied for root".to_string()),
                extra: Err("no value supplied for extra".to_string()),
            }
        }
    }
    impl TyXTypstCodeNodeTextEditorState {
        pub fn root<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<super::TyXRootNode>,
            T::Error: ::std::fmt::Display,
        {
            self.root = value
                .try_into()
                .map_err(|e| format!("error converting supplied value for root: {}", e));
            self
        }
        pub fn extra<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::serde_json::Map<::std::string::String, ::serde_json::Value>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.extra = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for extra: {}", e)
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXTypstCodeNodeTextEditorState>
    for super::TyXTypstCodeNodeTextEditorState {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXTypstCodeNodeTextEditorState,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                root: value.root?,
                extra: value.extra?,
            })
        }
    }
    impl ::std::convert::From<super::TyXTypstCodeNodeTextEditorState>
    for TyXTypstCodeNodeTextEditorState {
        fn from(value: super::TyXTypstCodeNodeTextEditorState) -> Self {
            Self {
                root: Ok(value.root),
                extra: Ok(value.extra),
            }
        }
    }
}
