use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn serialized_tyx_to_typst(document: &str) -> String {
    tyx_to_typst::serialized_tyx_to_typst(document)
}

#[wasm_bindgen]
pub fn serialized_stringify_function(
    name: &str,
    position_parameters: &str,
    named_parameters: &str,
    include_content: bool,
) -> String {
    tyx_to_typst::serialized_stringify_function(
        Some(name.into()),
        position_parameters,
        named_parameters,
        include_content,
    )
}
