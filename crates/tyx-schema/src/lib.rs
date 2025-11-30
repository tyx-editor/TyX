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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
}
impl ::std::convert::From<&FunctionDefinitionNamedItem> for FunctionDefinitionNamedItem {
    fn from(value: &FunctionDefinitionNamedItem) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
}
impl ::std::convert::From<&ParameterDescription> for ParameterDescription {
    fn from(value: &ParameterDescription) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub value: ::std::option::Option<bool>,
}
impl ::std::convert::From<&TyXBooleanValue> for TyXBooleanValue {
    fn from(value: &TyXBooleanValue) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXCodeNode> for TyXCodeNode {
    fn from(value: &TyXCodeNode) -> Self {
        value.clone()
    }
}
///An object representing Typst `content` type.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "An object representing Typst `content` type.",
///  "type": "object",
///  "required": [
///    "type"
///  ],
///  "properties": {
///    "type": {
///      "type": "string",
///      "const": "content"
///    },
///    "value": {
///      "allOf": [
///        {
///          "$ref": "#/definitions/TyXRootNode"
///        }
///      ]
///    }
///  },
///  "additionalProperties": false,
///  "id": "TyXContentValue"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXContentValue {
    #[serde(rename = "type")]
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub value: ::std::option::Option<TyXRootNode>,
}
impl ::std::convert::From<&TyXContentValue> for TyXContentValue {
    fn from(value: &TyXContentValue) -> Self {
        value.clone()
    }
}
///A direction of text in TyX.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "A direction of text in TyX.",
///  "anyOf": [
///    {
///      "$ref": "#/definitions/TyXDirectionValue"
///    },
///    {
///      "type": "null"
///    }
///  ],
///  "id": "TyXDirection"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(transparent)]
pub struct TyXDirection(pub ::std::option::Option<TyXDirectionValue>);
impl ::std::ops::Deref for TyXDirection {
    type Target = ::std::option::Option<TyXDirectionValue>;
    fn deref(&self) -> &::std::option::Option<TyXDirectionValue> {
        &self.0
    }
}
impl ::std::convert::From<TyXDirection> for ::std::option::Option<TyXDirectionValue> {
    fn from(value: TyXDirection) -> Self {
        value.0
    }
}
impl ::std::convert::From<&TyXDirection> for TyXDirection {
    fn from(value: &TyXDirection) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<::std::option::Option<TyXDirectionValue>> for TyXDirection {
    fn from(value: ::std::option::Option<TyXDirectionValue>) -> Self {
        Self(value)
    }
}
///Possible direction values of text in TyX.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "Possible direction values of text in TyX.",
///  "anyOf": [
///    {
///      "type": "string",
///      "const": "ltr"
///    },
///    {
///      "type": "string",
///      "const": "rtl"
///    }
///  ],
///  "id": "TyXDirectionValue"
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
pub enum TyXDirectionValue {
    #[serde(rename = "ltr")]
    Ltr,
    #[serde(rename = "rtl")]
    Rtl,
}
impl ::std::convert::From<&Self> for TyXDirectionValue {
    fn from(value: &TyXDirectionValue) -> Self {
        value.clone()
    }
}
impl ::std::fmt::Display for TyXDirectionValue {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        match *self {
            Self::Ltr => f.write_str("ltr"),
            Self::Rtl => f.write_str("rtl"),
        }
    }
}
impl ::std::str::FromStr for TyXDirectionValue {
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
impl ::std::convert::TryFrom<&str> for TyXDirectionValue {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &str,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<&::std::string::String> for TyXDirectionValue {
    type Error = self::error::ConversionError;
    fn try_from(
        value: &::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
impl ::std::convert::TryFrom<::std::string::String> for TyXDirectionValue {
    type Error = self::error::ConversionError;
    fn try_from(
        value: ::std::string::String,
    ) -> ::std::result::Result<Self, self::error::ConversionError> {
        value.parse()
    }
}
///An object representing an entire TyX document. Saved in `.tyx` files.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
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
///      "allOf": [
///        {
///          "$ref": "#/definitions/TyXLength"
///        }
///      ]
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
    ///Optional indentation for paragraphs in the document.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub indentation: ::std::option::Option<TyXLength>,
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
///        "$ref": "#/definitions/TyXValue"
///      }
///    },
///    "namedParameters": {
///      "type": "object",
///      "additionalProperties": {
///        "$ref": "#/definitions/TyXValue"
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
    pub named_parameters: ::std::collections::HashMap<::std::string::String, TyXValue>,
    #[serde(
        rename = "positionParameters",
        default,
        skip_serializing_if = "::std::vec::Vec::is_empty"
    )]
    pub position_parameters: ::std::vec::Vec<TyXValue>,
    #[serde(rename = "type")]
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXFunctionCallNode> for TyXFunctionCallNode {
    fn from(value: &TyXFunctionCallNode) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXHeadingNode> for TyXHeadingNode {
    fn from(value: &TyXHeadingNode) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXHorizontalRuleNode> for TyXHorizontalRuleNode {
    fn from(value: &TyXHorizontalRuleNode) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXImageNode> for TyXImageNode {
    fn from(value: &TyXImageNode) -> Self {
        value.clone()
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
///  "additionalProperties": false,
///  "id": "TyXLength"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXLength {
    ///The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub unit: ::std::option::Option<::std::string::String>,
    ///The length numeric value.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub value: ::std::option::Option<::std::string::String>,
}
impl ::std::convert::From<&TyXLength> for TyXLength {
    fn from(value: &TyXLength) -> Self {
        value.clone()
    }
}
impl ::std::default::Default for TyXLength {
    fn default() -> Self {
        Self {
            unit: Default::default(),
            value: Default::default(),
        }
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
    #[serde(skip_deserializing)]
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXLineBreakNode> for TyXLineBreakNode {
    fn from(value: &TyXLineBreakNode) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
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
    #[serde(skip_deserializing)]
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
///      "$ref": "#/definitions/TyXDirection"
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
    pub direction: ::std::option::Option<TyXDirection>,
    #[serde(rename = "listType")]
    pub list_type: TyXListNodeListType,
    pub start: i64,
    #[serde(rename = "type")]
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXListNode> for TyXListNode {
    fn from(value: &TyXListNode) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
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
#[serde(tag = "type")]
pub enum TyXNode {
    #[serde(rename = "root")]
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
///      "$ref": "#/definitions/TyXDirection"
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
    pub direction: ::std::option::Option<TyXDirection>,
    pub format: TyXParagraphNodeFormat,
    #[serde(rename = "type")]
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXParagraphNode> for TyXParagraphNode {
    fn from(value: &TyXParagraphNode) -> Self {
        value.clone()
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
///      "$ref": "#/definitions/TyXDirection"
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
    pub direction: ::std::option::Option<TyXDirection>,
    #[serde(rename = "type")]
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXQuoteNode> for TyXQuoteNode {
    fn from(value: &TyXQuoteNode) -> Self {
        value.clone()
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
///      "$ref": "#/definitions/TyXDirection"
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
    pub direction: ::std::option::Option<TyXDirection>,
    #[serde(rename = "type")]
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXRootNode> for TyXRootNode {
    fn from(value: &TyXRootNode) -> Self {
        value.clone()
    }
}
///App-wide customization for TyX.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "App-wide customization for TyX.",
///  "type": "object",
///  "properties": {
///    "$schema": {
///      "type": "string"
///    },
///    "language": {
///      "description": "The UI Language for the app.",
///      "type": "string"
///    },
///    "keyboardShortcuts": {
///      "description": "An array of pairs of [shortcut, command] of keyboard shortcuts.",
///      "type": "array",
///      "items": {
///        "type": "array",
///        "items": {
///          "type": "string"
///        }
///      }
///    },
///    "unbindKeyboardShortcuts": {
///      "description": "An array of default shortcuts to unbind, e.g. \"mod+b\"",
///      "type": "array",
///      "items": {
///        "type": "string"
///      }
///    },
///    "keyboardMap": {
///      "description": "The keyboard map for the app.",
///      "anyOf": [
///        {
///          "type": "string"
///        },
///        {
///          "type": "null"
///        }
///      ]
///    },
///    "mathInlineShortcuts": {
///      "description": "An array of pairs of [shortcut, command] of LaTeX inline math replacements.",
///      "type": "array",
///      "items": {
///        "type": "array",
///        "items": {
///          "type": "string"
///        }
///      }
///    },
///    "format": {
///      "description": "Whether to format the output Typst documents.",
///      "type": "boolean"
///    },
///    "autoStartServer": {
///      "description": "Whether to automatically start a server that updates the PDF when the document changes.",
///      "type": "boolean"
///    },
///    "serverDebounce": {
///      "description": "The amount in milliseconds to debounce before updating the PDF.",
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
///  "id": "TyXSettings"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(deny_unknown_fields)]
pub struct TyXSettings {
    ///Whether to automatically start a server that updates the PDF when the document changes.
    #[serde(
        rename = "autoStartServer",
        default,
        skip_serializing_if = "::std::option::Option::is_none"
    )]
    pub auto_start_server: ::std::option::Option<bool>,
    ///Whether to format the output Typst documents.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub format: ::std::option::Option<bool>,
    ///Additional TyX function definitions.
    #[serde(default, skip_serializing_if = ":: std :: collections :: HashMap::is_empty")]
    pub functions: ::std::collections::HashMap<
        ::std::string::String,
        FunctionDefinition,
    >,
    ///The keyboard map for the app.
    #[serde(
        rename = "keyboardMap",
        default,
        skip_serializing_if = "::std::option::Option::is_none"
    )]
    pub keyboard_map: ::std::option::Option<::std::string::String>,
    ///An array of pairs of [shortcut, command] of keyboard shortcuts.
    #[serde(
        rename = "keyboardShortcuts",
        default,
        skip_serializing_if = "::std::vec::Vec::is_empty"
    )]
    pub keyboard_shortcuts: ::std::vec::Vec<::std::vec::Vec<::std::string::String>>,
    ///The UI Language for the app.
    #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
    pub language: ::std::option::Option<::std::string::String>,
    ///An array of pairs of [shortcut, command] of LaTeX inline math replacements.
    #[serde(
        rename = "mathInlineShortcuts",
        default,
        skip_serializing_if = "::std::vec::Vec::is_empty"
    )]
    pub math_inline_shortcuts: ::std::vec::Vec<::std::vec::Vec<::std::string::String>>,
    #[serde(
        rename = "$schema",
        default,
        skip_serializing_if = "::std::option::Option::is_none"
    )]
    pub schema: ::std::option::Option<::std::string::String>,
    #[serde(
        rename = "serverDebounce",
        default,
        skip_serializing_if = "::std::option::Option::is_none"
    )]
    pub server_debounce: ::std::option::Option<f64>,
    ///An array of default shortcuts to unbind, e.g. "mod+b"
    #[serde(
        rename = "unbindKeyboardShortcuts",
        default,
        skip_serializing_if = "::std::vec::Vec::is_empty"
    )]
    pub unbind_keyboard_shortcuts: ::std::vec::Vec<::std::string::String>,
}
impl ::std::convert::From<&TyXSettings> for TyXSettings {
    fn from(value: &TyXSettings) -> Self {
        value.clone()
    }
}
impl ::std::default::Default for TyXSettings {
    fn default() -> Self {
        Self {
            auto_start_server: Default::default(),
            format: Default::default(),
            functions: Default::default(),
            keyboard_map: Default::default(),
            keyboard_shortcuts: Default::default(),
            language: Default::default(),
            math_inline_shortcuts: Default::default(),
            schema: Default::default(),
            server_debounce: Default::default(),
            unbind_keyboard_shortcuts: Default::default(),
        }
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
///      "$ref": "#/definitions/TyXDirection"
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
    pub direction: ::std::option::Option<TyXDirection>,
    #[serde(rename = "type")]
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTableCellNode> for TyXTableCellNode {
    fn from(value: &TyXTableCellNode) -> Self {
        value.clone()
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
///      "$ref": "#/definitions/TyXDirection"
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
    pub direction: ::std::option::Option<TyXDirection>,
    #[serde(rename = "type")]
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTableNode> for TyXTableNode {
    fn from(value: &TyXTableNode) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTableRowNode> for TyXTableRowNode {
    fn from(value: &TyXTableRowNode) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTextNode> for TyXTextNode {
    fn from(value: &TyXTextNode) -> Self {
        value.clone()
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
    #[serde(skip_deserializing)]
pub type_: ::std::string::String,
    #[serde(flatten)]
    pub extra: ::serde_json::Map<::std::string::String, ::serde_json::Value>,
}
impl ::std::convert::From<&TyXTypstCodeNode> for TyXTypstCodeNode {
    fn from(value: &TyXTypstCodeNode) -> Self {
        value.clone()
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
///An object representing some Typst type.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "description": "An object representing some Typst type.",
///  "anyOf": [
///    {
///      "$ref": "#/definitions/TyXLengthValue"
///    },
///    {
///      "$ref": "#/definitions/TyXBooleanValue"
///    },
///    {
///      "$ref": "#/definitions/TyXContentValue"
///    }
///  ],
///  "id": "TyXValue"
///}
/// ```
/// </details>
#[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
#[serde(untagged)]
pub enum TyXValue {
    LengthValue(TyXLengthValue),
    BooleanValue(TyXBooleanValue),
    ContentValue(TyXContentValue),
}
impl ::std::convert::From<&Self> for TyXValue {
    fn from(value: &TyXValue) -> Self {
        value.clone()
    }
}
impl ::std::convert::From<TyXLengthValue> for TyXValue {
    fn from(value: TyXLengthValue) -> Self {
        Self::LengthValue(value)
    }
}
impl ::std::convert::From<TyXBooleanValue> for TyXValue {
    fn from(value: TyXBooleanValue) -> Self {
        Self::BooleanValue(value)
    }
}
impl ::std::convert::From<TyXContentValue> for TyXValue {
    fn from(value: TyXContentValue) -> Self {
        Self::ContentValue(value)
    }
}
