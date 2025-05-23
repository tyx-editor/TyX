use std::{
    fs::File,
    io::Write,
    path::{Path, PathBuf},
    sync::Arc,
};

use tauri::Emitter;
#[cfg(not(any(target_os = "android", target_os = "ios")))]
use tauri::menu::{Menu, MenuItemBuilder};

use tauri_plugin_dialog::DialogExt;
use tinymist_project::{CompileOnceArgs, EntryReader, TaskInputs, WorldProvider, base::ShadowApi};
use typst_pdf::PdfOptions;

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

        let Some(doc) = tyx_tiptap_typst::convert(Arc::new(world)) else {
            return;
        };
        // todo: we serialize it here.
        serde_json::to_string(&doc).unwrap()
    } else {
        // tyx
        std::fs::read_to_string(path).unwrap()
    };

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
fn preview(filename: &str, content: &str) -> String {
    let basename = filename
        .strip_suffix(".tyx")
        .unwrap_or(filename)
        .to_string();
    let dirname = Path::new(basename.as_str())
        .parent()
        .unwrap()
        .to_str()
        .unwrap();
    let pdf_file = basename.clone() + ".pdf";

    let universe = CompileOnceArgs {
        root: Some(PathBuf::from(dirname)),
        input: Some(filename.into()),
        ..CompileOnceArgs::default()
    }
    .resolve()
    .unwrap();
    let entry = universe
        .entry_state()
        .try_select_path_in_workspace(Path::new(filename))
        .unwrap();
    let mut world = universe.snapshot_with(Some(TaskInputs {
        entry,
        ..TaskInputs::default()
    }));
    let main = world.main_id().unwrap();
    let _ = world.map_shadow_by_id(
        main,
        typst::foundations::Bytes::from_string(content.to_owned()),
    );
    let doc = match typst::compile(&world).output {
        Ok(doc) => doc,
        Err(e) => {
            if e.len() == 0 {
                return String::new();
            }
            return e[0].message.to_string();
        }
    };
    let pdf = typst_pdf::pdf(&doc, &PdfOptions::default()).unwrap();
    let mut f = File::create(&pdf_file).unwrap();
    f.write_all(&pdf).unwrap();
    let _ = open::that(&pdf_file);

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
