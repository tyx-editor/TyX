//! Based on https://github.com/oxidecomputer/typify/blob/main/example-build/build.rs
use typify::{TypeSpace, TypeSpaceSettings};

const SCHEMA_PATH: &str = "../../schemas/tyx.schema.json";

fn main() {
    println!("cargo:rerun-if-changed={SCHEMA_PATH}");

    let out_dir = std::env::var("OUT_DIR").unwrap();
    let output_path = std::path::Path::new(&out_dir).join("generated.rs");

    let content = std::fs::read_to_string(SCHEMA_PATH).unwrap();
    let schema = serde_json::from_str::<schemars::schema::RootSchema>(&content).unwrap();

    let mut type_space = TypeSpace::new(&TypeSpaceSettings::default());
    type_space.add_root_schema(schema).unwrap();

    let contents =
        prettyplease::unparse(&syn::parse2::<syn::File>(type_space.to_stream()).unwrap());

    std::fs::write(output_path, contents).unwrap();
}
