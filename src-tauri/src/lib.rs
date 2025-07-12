use std::{
    fs::{self, File},
    io::Write,
    path::{Path, PathBuf},
    sync::Arc,
};

use base64::{Engine, engine::general_purpose::STANDARD};

use tauri::Emitter;

use tauri_plugin_dialog::DialogExt;
use tinymist_project::{
    CompileFontArgs, CompileOnceArgs, EntryReader, TaskInputs, WorldProvider, base::ShadowApi,
};
use typst_pdf::PdfOptions;

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

        let Some(doc) = tyx_import_typst::convert(Arc::new(world)) else {
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
fn readimage(filename: &str, image: &str) -> String {
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
fn preview(filename: &str, content: &str, root: &str, font_paths: Vec<String>) -> String {
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

    let mut root_path = PathBuf::from(dirname);
    if !root.is_empty() {
        root_path.push(PathBuf::from(root));
    }
    let universe = CompileOnceArgs {
        root: Some(root_path.canonicalize().unwrap()),
        input: Some(filename.into()),
        font: CompileFontArgs {
            font_paths: font_paths
                .iter()
                .map(|path| {
                    let mut p = PathBuf::from(dirname);
                    p.push(PathBuf::from(path));
                    p.canonicalize().unwrap()
                })
                .collect::<Vec<PathBuf>>(),
            ..CompileFontArgs::default()
        },
        ..CompileOnceArgs::default()
    }
    .resolve()
    .unwrap();
    let Ok(entry) = universe
        .entry_state()
        .try_select_path_in_workspace(Path::new(filename))
    else {
        return String::from("Invalid root directory, couldn't select the file itself!");
    };
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
            if e.is_empty() {
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

#[tauri::command]
fn insertimage(handle: tauri::AppHandle, filename: &str) {
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
        .add_filter("image", &["png", "jpg", "jpeg", "gif", "svg"])
        .pick_file(move |f| {
            if let Some(f) = f {
                if let Some(path) = f.as_path() {
                    h.emit(
                        "insertImage",
                        (path.strip_prefix(dirname).unwrap_or(path).to_str().unwrap(),),
                    )
                    .unwrap();
                }
            }
        });
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

    use tauri::menu::{AboutMetadata, MenuBuilder, MenuItemBuilder, SubmenuBuilder};

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .menu(|handle| {
            let app_submenu = SubmenuBuilder::new(handle, "App")
                .about(Some(AboutMetadata {
                    ..Default::default()
                }))
                .quit()
                .build()?;
            let mut file_submenu = SubmenuBuilder::new(handle, "File");
            for (name, id, accelerator) in [
                ("New", "new", "CmdOrCtrl+N"),
                ("Open", "open", "CmdOrCtrl+O"),
                ("Save", "save", "CmdOrCtrl+S"),
                ("Save As", "saveas", "CmdOrCtrl+Shift+S"),
                ("Preview", "preview", "CmdOrCtrl+Shift+K"),
                ("Close Tab", "close", "CmdOrCtrl+W"),
            ] {
                let menu_item = MenuItemBuilder::new(name)
                    .id(id)
                    .accelerator(accelerator)
                    .build(handle)?;
                file_submenu = file_submenu.item(&menu_item);
            }
            let file_submenu = file_submenu.build()?;

            let edit_submenu = SubmenuBuilder::new(handle, "App")
                .copy()
                .paste()
                .cut()
                .build()?;

            let menu = MenuBuilder::new(handle)
                .items(&[&app_submenu, &file_submenu, &edit_submenu])
                .build()?;
            Ok(menu)
        })
        .invoke_handler(tauri::generate_handler![
            open,
            save,
            saveas,
            preview,
            insertimage,
            readimage
        ])
        .on_menu_event(|handle, event| handle.emit(event.id().0.as_str(), ()).unwrap())
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
