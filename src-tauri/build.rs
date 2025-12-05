fn main() {
    let config = std::fs::read_to_string("tauri.conf.json").expect("tauri.conf.json not found");
    let version = serde_json::from_str::<serde_json::Value>(&config)
        .ok()
        .and_then(|json| json.get("version")?.as_str().map(|s| s.to_string()))
        .expect("version not found in tauri.conf.json");
    std::fs::write(
        "src/version.rs",
        format!("pub(crate) const VERSION: &str = \"{version}\";"),
    )
    .unwrap();
    tauri_build::build()
}
