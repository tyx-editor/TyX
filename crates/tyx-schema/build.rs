//! Based on https://github.com/oxidecomputer/typify/blob/main/example-build/build.rs
use typify::{TypeSpace, TypeSpaceSettings};

const SCHEMA_PATH: &str = "../../schemas/tyx.schema.json";
const OUTPUT_PATH: &str = "./src/generated.rs";

fn main() {
    let content = std::fs::read_to_string(SCHEMA_PATH).unwrap();
    let schema = serde_json::from_str::<schemars::schema::RootSchema>(&content).unwrap();

    let mut type_space = TypeSpace::new(&TypeSpaceSettings::default());
    type_space.add_root_schema(schema).unwrap();

    let contents = String::from("#![allow(missing_docs)]\n#![allow(clippy::all)]\n")
        + prettyplease::unparse(&syn::parse2::<syn::File>(type_space.to_stream()).unwrap())
            .as_str();

    let current = std::fs::read_to_string(OUTPUT_PATH).unwrap_or_default();
    if current != contents {
        std::fs::write(OUTPUT_PATH, contents).unwrap();
    }
}
