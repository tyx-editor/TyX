//! The build script to generate the TyX schema
//!
//! It generates the `src/schema` crate, using the [`generate`] crate, and
//! re-runs if the schema file is changed.

#[path = "src/generate.rs"]
mod generate;

fn main() {
    println!("cargo:rerun-if-changed=../../schemas/tyx-document.schema.json");
    generate::run();
}
