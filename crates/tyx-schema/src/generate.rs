use schemafy_lib::Expander;

pub fn run() {
    let prelude = String::from(
        "#![allow(missing_docs)]
        
extern crate serde;
extern crate serde_json;

use serde::{Serialize, Deserialize};
",
    );
    let json = std::fs::read_to_string("../../schemas/tyx-document.schema.json")
        .expect("Read schema JSON file");
    let schema = serde_json::from_str(&json).unwrap();
    let mut expander = Expander::new(None, "::schemafy_core::", &schema);
    let code = expander.expand(&schema);
    std::fs::write(
        "src/document.rs",
        rustfmt_wrapper::rustfmt(prelude + code.to_string().as_str()).unwrap(),
    )
    .unwrap();
}
