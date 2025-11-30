//! Based on https://github.com/oxidecomputer/typify/blob/main/example-build/build.rs
use std::{fs, path::Path};

use typify::{TypeSpace, TypeSpaceSettings};

fn main() {
    let schema_dir = Path::new("../../schemas");
    let output_path = Path::new("src");

    for (schema_name, output_name) in vec![
        ("tyx-document.schema.json", "document.rs"),
        ("tyx-settings.schema.json", "settings.rs"),
    ] {
        let mut schema_path = schema_dir.to_path_buf();
        schema_path.push(schema_name);
        let content = std::fs::read_to_string(schema_path).unwrap();
        let schema = serde_json::from_str::<schemars::schema::RootSchema>(&content).unwrap();

        let mut type_space = TypeSpace::new(TypeSpaceSettings::default().with_struct_builder(true));
        type_space.add_root_schema(schema).unwrap();

        let contents = String::from("#![allow(missing_docs)]\n")
            + prettyplease::unparse(&syn::parse2::<syn::File>(type_space.to_stream()).unwrap())
                .as_str();

        let mut output_path = output_path.to_path_buf();
        output_path.push(output_name);
        let current = std::fs::read_to_string(&output_path).unwrap();
        if current != contents {
            fs::write(output_path, contents).unwrap();
        }
    }
}
