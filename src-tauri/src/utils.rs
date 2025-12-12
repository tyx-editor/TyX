use std::path::PathBuf;

pub(crate) const IDENTIFIER: &str = "com.tyx-editor.tyx";

pub(crate) fn get_tyx_config_dir() -> PathBuf {
    let base_dirs = directories::BaseDirs::new().unwrap();

    base_dirs.config_dir().join(IDENTIFIER)
}
