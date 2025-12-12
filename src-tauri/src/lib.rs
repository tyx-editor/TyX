use std::path::PathBuf;

use tauri::{
    Wry,
    menu::{AboutMetadata, Menu, MenuBuilder, MenuItemBuilder, SubmenuBuilder},
};

mod cli;
mod cmds;
mod pdf;
mod utils;

pub fn get_menu(handle: &tauri::AppHandle) -> Result<Menu<Wry>, tauri::Error> {
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

    let edit_submenu = SubmenuBuilder::new(handle, "Edit")
        .copy()
        .paste()
        .cut()
        .build()?;

    let menu = MenuBuilder::new(handle)
        .items(&[&app_submenu, &file_submenu, &edit_submenu])
        .build()?;

    Ok(menu)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[cfg(any(target_os = "android", target_os = "ios"))]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            cmds::open,
            cmds::save,
            cmds::saveas,
            cmds::preview,
            cmds::insertimage,
            cmds::readimage
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub fn run() {
    use clap::Parser;

    let args = cli::Args::parse();

    if args.process() {
        return;
    }

    let mut files: Vec<PathBuf> = Vec::new();
    for maybe_file in args.files.iter() {
        if let Ok(url) = url::Url::parse(maybe_file) {
            // handle `file://` path urls and skip other urls
            match url.to_file_path() {
                Ok(path) => {
                    files.push(path);
                }
                Err(_) => {
                    println!("warning: failed opening {url}");
                }
            }
        } else {
            files.push(PathBuf::from(maybe_file))
        }
    }

    let opened_files = serde_json::to_string(
        &files
            .iter()
            .map(|f| String::from(f.to_str().unwrap()))
            .collect::<Vec<String>>(),
    )
    .unwrap();
    let initialization_script = format!("window.openedFiles = {opened_files}");

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .menu(get_menu)
        .invoke_handler(tauri::generate_handler![
            cmds::open,
            cmds::save,
            cmds::saveas,
            cmds::preview,
            cmds::insertimage,
            cmds::readimage,
            cmds::getsettings,
            cmds::setsettings,
            cmds::newfromtemplate,
            cmds::opensettingsdirectory
        ])
        .append_invoke_initialization_script(&initialization_script)
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(
            #[allow(unused_variables)]
            |app, event| {
                #[cfg(any(target_os = "macos", target_os = "ios"))]
                if let tauri::RunEvent::Opened { urls } = event {
                    let files = urls
                        .into_iter()
                        .filter_map(|url| url.to_file_path().ok())
                        .collect::<Vec<_>>();

                    for file in files {
                        cmds::openfile(app, file.as_path(), true);
                    }
                }
            },
        );
}
