//! The build script to generate tiptap schema
//!
//! The `tyx.schema.json` is obtained from the frontend.
//!
//! It generates the `src/schema` crate, using the [`generate`] crate, and
//! re-runs if the schema file is changed.

#[path = "src/generate.rs"]
mod generate;

fn main() {
    println!("cargo:rerun-if-changed=assets/tyx.schema.json");
    generate::run();
}
