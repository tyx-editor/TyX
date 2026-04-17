//! Automatically generates the version from Tauri configuration.

const TAURI_CONF: &str = "../../src-tauri/tauri.conf.json";

fn main() {
    println!("cargo:rerun-if-changed={TAURI_CONF}");

    let config = std::fs::read_to_string(TAURI_CONF).expect("tauri.conf.json not found");
    let version = serde_json::from_str::<serde_json::Value>(&config)
        .ok()
        .and_then(|json| json.get("version")?.as_str().map(|s| s.to_string()))
        .expect("version not found in tauri.conf.json");

    let out_dir = std::env::var("OUT_DIR").unwrap();
    let output_path = std::path::Path::new(&out_dir).join("version.rs");
    std::fs::write(
        output_path,
        format!("/// The version of TyX.\npub const VERSION: &str = \"{version}\";\n"),
    )
    .unwrap();
}
