use std::{
    fs::{self, File, create_dir_all},
    io::Write,
    path::{Path, PathBuf},
    sync::Arc,
};

use base64::{Engine, engine::general_purpose::STANDARD};

use tauri::{Emitter, Manager};

use crate::pdf;
use crate::utils;
use tauri_plugin_dialog::DialogExt;
use tinymist_project::{CompileOnceArgs, EntryReader, TaskInputs, WorldProvider};
use typstyle_core::Typstyle;

#[tauri::command]
pub(crate) fn save(filename: &str, content: &str, format: bool) {
    let mut content = String::from(content);
    if format {
        let typstyle = Typstyle::default();
        if let Ok(text) = typstyle.format_text(&content).render() {
            content = text;
        }
    }

    if let Ok(mut f) = File::create(filename) {
        f.write_all(content.as_bytes()).unwrap();
    }
}

#[tauri::command]
pub(crate) fn saveas(handle: tauri::AppHandle) {
    let h = handle.clone();
    handle
        .dialog()
        .file()
        .add_filter("TyX", &["tyx"])
        .save_file(move |f| {
            if let Some(f) = f
                && let Some(path) = f.as_path()
            {
                let mut path = path.to_str().unwrap().to_string();
                if !path.ends_with(".tyx") {
                    path += ".tyx";
                }
                h.emit("saveas", (path,)).unwrap();
            }
        });
}

pub(crate) fn openfile(handle: &tauri::AppHandle, path: &Path, include_filename: bool) {
    let buffer = if path.extension().is_some_and(|ext| ext == "typ") {
        let Some(dir) = path.parent() else {
            eprintln!("failed to get the base directory of the file to open");
            return;
        };
        let universe = CompileOnceArgs {
            root: Some(PathBuf::from(dir)),
            input: Some(path.to_str().unwrap().into()),
            ..CompileOnceArgs::default()
        }
        .resolve()
        .unwrap();
        let Ok(entry) = universe.entry_state().try_select_path_in_workspace(path) else {
            eprintln!("not selected path {:?}", universe.entry_state());
            return;
        };
        let world = universe.snapshot_with(Some(TaskInputs {
            entry,
            ..TaskInputs::default()
        }));
        if world.main_id().is_none() {
            eprintln!("no main id");
            return;
        }

        let Some(doc) = tyx_converters::typst_to_tyx(Arc::new(world)) else {
            return;
        };
        serde_json::to_string(&doc).unwrap()
    } else {
        // tyx
        std::fs::read_to_string(path).unwrap()
    };

    handle
        .emit("open", (path.to_str().unwrap(), buffer, include_filename))
        .unwrap();
}

#[tauri::command]
pub(crate) fn open(handle: tauri::AppHandle, filename: &str) {
    if !filename.is_empty() {
        let path = Path::new(filename);
        openfile(&handle, path, true);
        return;
    }

    let h = handle.clone();
    handle
        .dialog()
        .file()
        .add_filter("TyX", &["tyx"])
        .add_filter("Typst", &["typ"])
        .pick_file(move |f| {
            if let Some(f) = f
                && let Some(path) = f.as_path()
            {
                openfile(&h, path, true);
            }
        });
}

#[tauri::command]
pub(crate) fn newfromtemplate(handle: tauri::AppHandle) {
    let h = handle.clone();
    let settings_path = utils::get_tyx_config_dir().join("templates");
    if !settings_path.is_dir() {
        create_dir_all(&settings_path).unwrap();
    }

    handle
        .dialog()
        .file()
        .add_filter("TyX", &["tyx"])
        .set_directory(settings_path)
        .pick_file(move |f| {
            if let Some(f) = f
                && let Some(path) = f.as_path()
            {
                openfile(&h, path, false);
            }
        });
}

#[tauri::command]
pub(crate) fn getsettings() -> String {
    let settings_path = utils::get_tyx_config_dir().join("settings.json");

    fs::read_to_string(settings_path).unwrap_or_default()
}

#[tauri::command]
pub(crate) fn opensettingsdirectory() {
    let config_dir = utils::get_tyx_config_dir();
    let _ = create_dir_all(&config_dir);
    open::that(config_dir).unwrap();
}

#[tauri::command]
pub(crate) fn setsettings(settings: &str) -> String {
    let config_dir = utils::get_tyx_config_dir();
    let _ = create_dir_all(&config_dir);
    let settings_path = config_dir.join("settings.json");

    if let Ok(mut f) = File::create(&settings_path) {
        f.write_all(settings.as_bytes()).unwrap();
    }

    settings_path.to_str().unwrap().into()
}

#[tauri::command]
pub(crate) fn readimage(filename: &str, image: &str) -> String {
    let image_path = Path::new(filename)
        .parent()
        .unwrap_or(Path::new(""))
        .join(Path::new(image));
    let bytes = fs::read(image_path).unwrap();

    let extension = image.split(".").last();

    let mimetype = match extension {
        Some("png") => "image/png",
        Some("jpg") => "image/jpeg",
        Some("jpeg") => "image/jpeg",
        Some("svg") => "image/svg+xml",
        Some("gif") => "image/gif",
        _ => return String::new(),
    };

    String::from("data:") + mimetype + ";base64," + STANDARD.encode(&bytes).as_str()
}

#[tauri::command]
pub(crate) fn preview(
    handle: tauri::AppHandle,
    filename: &str,
    content: &str,
    root: &str,
    font_paths: Vec<String>,
    open: bool,
) -> String {
    let filename = if filename.is_empty() {
        let temp_dir = handle.path().temp_dir().unwrap();
        if !temp_dir.is_dir() {
            create_dir_all(&temp_dir).unwrap();
        }

        temp_dir.join("Untitled.tyx").to_str().unwrap().to_string()
    } else {
        filename.to_string()
    };
    let basename = filename
        .strip_suffix(".tyx")
        .unwrap_or(&filename)
        .to_string();

    let dirname = Path::new(basename.as_str())
        .parent()
        .unwrap()
        .to_str()
        .unwrap();
    let pdf_file = basename.clone() + ".pdf";

    let mut root_path = PathBuf::from(dirname);
    if !root.is_empty() {
        root_path.push(PathBuf::from(root));
    }

    let pdf = match pdf::typst_to_pdf(&filename, content, root_path, font_paths) {
        Ok(pdf) => pdf,
        Err(e) => {
            return e;
        }
    };

    let mut f = File::create(&pdf_file).unwrap();
    f.write_all(&pdf).unwrap();

    if open {
        let _ = open::that(String::from("file://") + &pdf_file);
    }

    String::new()
}

#[tauri::command]
pub(crate) fn insertimage(handle: tauri::AppHandle, filename: &str) {
    let dirname = String::from(
        Path::new(filename)
            .parent()
            .unwrap_or(Path::new(""))
            .to_str()
            .unwrap(),
    );
    let h = handle.clone();
    handle
        .dialog()
        .file()
        .add_filter("Image", &["png", "jpg", "jpeg", "gif", "svg"])
        .pick_file(move |f| {
            if let Some(f) = f
                && let Some(path) = f.as_path()
            {
                h.emit(
                    "insertImage",
                    (path.strip_prefix(dirname).unwrap_or(path).to_str().unwrap(),),
                )
                .unwrap();
            }
        });
}
