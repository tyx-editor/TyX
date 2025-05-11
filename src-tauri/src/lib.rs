use std::{
    fs::File,
    io::Write,
    path::{Path, PathBuf},
    sync::{Arc, LazyLock},
};

#[cfg(not(any(target_os = "android", target_os = "ios")))]
use tauri::menu::{Menu, MenuItemBuilder};
use tauri::{Emitter, Manager};

use tauri_plugin_dialog::DialogExt;
use tauri_plugin_shell::ShellExt;
use tinymist_project::{CompileOnceArgs, EntryReader, LspUniverse, TaskInputs, WorldProvider};

/// A global shared instance to process typst in a workspace.
// todo: load compile arguments
static VERSE: LazyLock<LspUniverse> = LazyLock::new(|| {
    CompileOnceArgs {
        root: Some(PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap()).join("..")),
        input: Some("../main.typ".to_string()),
        ..CompileOnceArgs::default()
    }
    .resolve()
    .unwrap()
});

//
#[tauri::command]
fn save(filename: &str, content: &str) {
    if let Ok(mut f) = File::create(filename) {
        f.write_all(content.as_bytes()).unwrap();
    }
}

#[tauri::command]
fn saveas(handle: tauri::AppHandle) {
    let h = handle.clone();
    handle
        .dialog()
        .file()
        .add_filter("tyx", &["tyx"])
        .save_file(move |f| {
            if let Some(f) = f {
                if let Some(path) = f.as_path() {
                    let mut path = path.to_str().unwrap().to_string();
                    if !path.ends_with(".tyx") {
                        path += ".tyx";
                    }
                    h.emit("saveas", (path,)).unwrap();
                }
            }
        });
}

fn openfile(handle: &tauri::AppHandle, path: &Path) {
    let buffer = if path.extension().is_some_and(|ext| ext == "typ") {
        let Ok(entry) = VERSE.entry_state().try_select_path_in_workspace(path) else {
            eprintln!("not selected path {:?}", VERSE.entry_state());
            return;
        };
        let world = VERSE.snapshot_with(Some(TaskInputs {
            entry,
            ..TaskInputs::default()
        }));
        if world.main_id().is_none() {
            eprintln!("no main id");
            return;
        }

        let Some(mut doc) = tyx_tiptap_typst::convert(Arc::new(world)) else {
            return;
        };
        doc.filename = path.to_str().unwrap().to_string();
        // todo: we serialize it here.
        serde_json::to_string(&doc).unwrap()
    } else {
        // tyx
        std::fs::read_to_string(path).unwrap()
    };
    // eprintln!("open tyx file: {buffer:?}");

    handle
        .emit("open", (path.to_str().unwrap(), buffer))
        .unwrap();
}

#[tauri::command]
fn open(handle: tauri::AppHandle) {
    let h = handle.clone();
    handle
        .dialog()
        .file()
        .add_filter("tyx", &["tyx", "typ"])
        .pick_file(move |f| {
            if let Some(f) = f {
                if let Some(path) = f.as_path() {
                    openfile(&h, path);
                }
            }
        });
}

#[tauri::command]
fn preview(handle: tauri::AppHandle, filename: &str, content: &str) -> String {
    let basename = filename
        .strip_suffix(".tyx")
        .unwrap_or(filename)
        .to_string();
    let dirname = Path::new(basename.as_str())
        .parent()
        .unwrap()
        .to_str()
        .unwrap();
    let typst_file = basename.clone() + ".typ";
    let pdf_file = basename.clone() + ".pdf";

    if let Ok(mut file) = File::create(&typst_file) {
        if file.write_all(content.as_bytes()).is_ok() {
            let command = handle.shell().sidecar("typst").unwrap();

            let fonts_dir = handle
                .path()
                .app_data_dir()
                .unwrap_or(PathBuf::new())
                .join("fonts");

            let result = tauri::async_runtime::block_on(async move {
                command
                    .current_dir(dirname)
                    .args([
                        "compile",
                        &typst_file,
                        &pdf_file,
                        "--open",
                        "--font-path",
                        fonts_dir.to_str().unwrap_or(""),
                    ])
                    .output()
                    .await
            });

            if let Err(e) = result {
                return e.to_string();
            }
            if let Ok(output) = result {
                if let Ok(s) = String::from_utf8(output.stderr) {
                    return s;
                }
            }
        }
    }

    String::new()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[cfg(any(target_os = "android", target_os = "ios"))]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![open, save, saveas, preview])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub fn run() {
    use std::path::PathBuf;

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .menu(|handle| {
            let menu = Menu::default(handle)?;

            for item in menu.items().unwrap() {
                if let Some(submenu) = item.as_submenu() {
                    for (menu, remove_default, menu_items) in [(
                        "File",
                        true,
                        vec![
                            ("New", "new", "CmdOrCtrl+N"),
                            ("Open", "open", "CmdOrCtrl+O"),
                            ("Save", "save", "CmdOrCtrl+S"),
                            ("Save As", "saveas", "CmdOrCtrl+Shift+S"),
                            ("Preview", "preview", "CmdOrCtrl+Shift+K"),
                            ("Close Tab", "close", "CmdOrCtrl+W"),
                        ],
                    )] {
                        if submenu.text().is_ok_and(|s| s == menu) {
                            if remove_default {
                                for _ in 0..submenu.items().unwrap().len() {
                                    submenu.remove_at(0).unwrap();
                                }
                            }

                            for (text, id, accelerator) in menu_items.iter().rev() {
                                submenu
                                    .prepend(
                                        &MenuItemBuilder::new(text)
                                            .id(id)
                                            .accelerator(accelerator)
                                            .build(handle)
                                            .unwrap(),
                                    )
                                    .unwrap();
                            }
                        }
                    }
                }
            }

            Ok(menu)
        })
        .invoke_handler(tauri::generate_handler![open, save, saveas, preview])
        .on_menu_event(|handle, event| match event.id().0.as_str() {
            "open" => open(handle.clone()),
            "saveas" => saveas(handle.clone()),
            "new" | "save" | "preview" | "close" => handle.emit(event.id().0.as_str(), ()).unwrap(),
            _ => {}
        })
        .setup(|app| {
            // TODO: FIXME: this happens before the listeners are set up
            for maybe_file in std::env::args().skip(1) {
                // skip flags like -f or --flag
                if maybe_file.starts_with('-') {
                    continue;
                }

                // handle `file://` path urls and skip other urls
                if let Ok(url) = url::Url::parse(&maybe_file) {
                    if let Ok(path) = url.to_file_path() {
                        openfile(app.handle(), path.as_path());
                    }
                } else {
                    openfile(app.handle(), PathBuf::from(maybe_file).as_path());
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
