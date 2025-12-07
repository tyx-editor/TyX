//! Automatically generates the version from Tauri configuration.

fn main() {
    let config = std::fs::read_to_string("../../src-tauri/tauri.conf.json")
        .expect("tauri.conf.json not found");
    let version = serde_json::from_str::<serde_json::Value>(&config)
        .ok()
        .and_then(|json| json.get("version")?.as_str().map(|s| s.to_string()))
        .expect("version not found in tauri.conf.json");
    let wanted = format!(
        "//! Automatically generated from Tauri configuration\n\n///The version of TyX\npub const VERSION: &str = \"{version}\";"
    );
    let current = std::fs::read_to_string("src/lib.rs").unwrap();

    if current != wanted {
        std::fs::write("src/lib.rs", wanted).unwrap()
    };
}
