use std::{
    fs::File,
    io::{Read, Write},
    path::Path,
};

use tauri::{
    menu::{Menu, MenuItemBuilder},
    Emitter,
};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_shell::ShellExt;

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
                        path = path + ".tyx";
                    }
                    h.emit("saveas", (path,)).unwrap();
                }
            }
        });
}

#[tauri::command]
fn open(handle: tauri::AppHandle) {
    let h = handle.clone();
    handle
        .dialog()
        .file()
        .add_filter("tyx", &["tyx"])
        .pick_file(move |f| {
            if let Some(f) = f {
                if let Some(path) = f.as_path() {
                    if let Ok(mut f) = File::open(path) {
                        let mut buffer = String::new();
                        f.read_to_string(&mut buffer).unwrap();
                        h.emit("open", (path.to_str().unwrap(), buffer)).unwrap();
                    }
                }
            }
        });
}

#[tauri::command]
fn preview(handle: tauri::AppHandle, filename: &str, content: &str) {
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
        if let Ok(_) = file.write_all(content.as_bytes()) {
            let command = handle.shell().sidecar("typst").unwrap();

            tauri::async_runtime::block_on(async move {
                command
                    .current_dir(dirname)
                    .args(["compile", &typst_file, &pdf_file, "--open"])
                    .output()
                    .await
                    .unwrap()
            });
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
            "new" | "save" | "saveas" | "preview" | "close" => {
                handle.emit(event.id().0.as_str(), ()).unwrap()
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
