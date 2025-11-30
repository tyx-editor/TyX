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
///App-wide customization for TyX.
///
/// <details><summary>JSON schema</summary>
///
/// ```json
///{
///  "title": "TyXSettings",
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
impl TyXSettings {
    pub fn builder() -> builder::TyXSettings {
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
    pub struct TyXSettings {
        auto_start_server: ::std::result::Result<
            ::std::option::Option<bool>,
            ::std::string::String,
        >,
        format: ::std::result::Result<
            ::std::option::Option<bool>,
            ::std::string::String,
        >,
        functions: ::std::result::Result<
            ::std::collections::HashMap<
                ::std::string::String,
                super::FunctionDefinition,
            >,
            ::std::string::String,
        >,
        keyboard_map: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        keyboard_shortcuts: ::std::result::Result<
            ::std::vec::Vec<::std::vec::Vec<::std::string::String>>,
            ::std::string::String,
        >,
        language: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        math_inline_shortcuts: ::std::result::Result<
            ::std::vec::Vec<::std::vec::Vec<::std::string::String>>,
            ::std::string::String,
        >,
        schema: ::std::result::Result<
            ::std::option::Option<::std::string::String>,
            ::std::string::String,
        >,
        server_debounce: ::std::result::Result<
            ::std::option::Option<f64>,
            ::std::string::String,
        >,
        unbind_keyboard_shortcuts: ::std::result::Result<
            ::std::vec::Vec<::std::string::String>,
            ::std::string::String,
        >,
    }
    impl ::std::default::Default for TyXSettings {
        fn default() -> Self {
            Self {
                auto_start_server: Ok(Default::default()),
                format: Ok(Default::default()),
                functions: Ok(Default::default()),
                keyboard_map: Ok(Default::default()),
                keyboard_shortcuts: Ok(Default::default()),
                language: Ok(Default::default()),
                math_inline_shortcuts: Ok(Default::default()),
                schema: Ok(Default::default()),
                server_debounce: Ok(Default::default()),
                unbind_keyboard_shortcuts: Ok(Default::default()),
            }
        }
    }
    impl TyXSettings {
        pub fn auto_start_server<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.auto_start_server = value
                .try_into()
                .map_err(|e| {
                    format!(
                        "error converting supplied value for auto_start_server: {}", e
                    )
                });
            self
        }
        pub fn format<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<bool>>,
            T::Error: ::std::fmt::Display,
        {
            self.format = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for format: {}", e)
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
        pub fn keyboard_map<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.keyboard_map = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for keyboard_map: {}", e)
                });
            self
        }
        pub fn keyboard_shortcuts<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::vec::Vec<::std::vec::Vec<::std::string::String>>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.keyboard_shortcuts = value
                .try_into()
                .map_err(|e| {
                    format!(
                        "error converting supplied value for keyboard_shortcuts: {}", e
                    )
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
        pub fn math_inline_shortcuts<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<
                ::std::vec::Vec<::std::vec::Vec<::std::string::String>>,
            >,
            T::Error: ::std::fmt::Display,
        {
            self.math_inline_shortcuts = value
                .try_into()
                .map_err(|e| {
                    format!(
                        "error converting supplied value for math_inline_shortcuts: {}",
                        e
                    )
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
        pub fn server_debounce<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::option::Option<f64>>,
            T::Error: ::std::fmt::Display,
        {
            self.server_debounce = value
                .try_into()
                .map_err(|e| {
                    format!("error converting supplied value for server_debounce: {}", e)
                });
            self
        }
        pub fn unbind_keyboard_shortcuts<T>(mut self, value: T) -> Self
        where
            T: ::std::convert::TryInto<::std::vec::Vec<::std::string::String>>,
            T::Error: ::std::fmt::Display,
        {
            self.unbind_keyboard_shortcuts = value
                .try_into()
                .map_err(|e| {
                    format!(
                        "error converting supplied value for unbind_keyboard_shortcuts: {}",
                        e
                    )
                });
            self
        }
    }
    impl ::std::convert::TryFrom<TyXSettings> for super::TyXSettings {
        type Error = super::error::ConversionError;
        fn try_from(
            value: TyXSettings,
        ) -> ::std::result::Result<Self, super::error::ConversionError> {
            Ok(Self {
                auto_start_server: value.auto_start_server?,
                format: value.format?,
                functions: value.functions?,
                keyboard_map: value.keyboard_map?,
                keyboard_shortcuts: value.keyboard_shortcuts?,
                language: value.language?,
                math_inline_shortcuts: value.math_inline_shortcuts?,
                schema: value.schema?,
                server_debounce: value.server_debounce?,
                unbind_keyboard_shortcuts: value.unbind_keyboard_shortcuts?,
            })
        }
    }
    impl ::std::convert::From<super::TyXSettings> for TyXSettings {
        fn from(value: super::TyXSettings) -> Self {
            Self {
                auto_start_server: Ok(value.auto_start_server),
                format: Ok(value.format),
                functions: Ok(value.functions),
                keyboard_map: Ok(value.keyboard_map),
                keyboard_shortcuts: Ok(value.keyboard_shortcuts),
                language: Ok(value.language),
                math_inline_shortcuts: Ok(value.math_inline_shortcuts),
                schema: Ok(value.schema),
                server_debounce: Ok(value.server_debounce),
                unbind_keyboard_shortcuts: Ok(value.unbind_keyboard_shortcuts),
            }
        }
    }
}
