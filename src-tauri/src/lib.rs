use std::{
    fs::File,
    io::{Read, Write},
    path::Path,
};

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

use tauri::{
    menu::{Menu, MenuItemBuilder},
    Emitter,
};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_shell::ShellExt;
use typst_syntax::{SyntaxKind, SyntaxNode};
use typstyle_core::{calculate_attributes, pretty::PrettyPrinter, strip_trailing_whitespace};

fn doc2typst(value: &serde_json::Value) -> Vec<SyntaxNode> {
    let content = value["content"].as_array();

    if let Some(content) = content {
        vec![SyntaxNode::inner(
            SyntaxKind::Markup,
            content.iter().flat_map(tiptap2typst).collect(),
        )]
    } else {
        vec![]
    }
}

fn paragraph2typst(value: &serde_json::Value) -> Vec<SyntaxNode> {
    if let Some(content) = value["content"].as_array() {
        let mut nodes: Vec<SyntaxNode> = content.iter().flat_map(tiptap2typst).collect();

        if let Some(attrs) = value["attrs"].as_object() {
            for (attr, value) in attrs.iter() {
                if let Some(value) = value.as_str() {
                    if value.is_empty() {
                        continue;
                    }

                    match attr.as_str() {
                        "textAlign" | "dir" => {
                            nodes = vec![
                                SyntaxNode::leaf(SyntaxKind::Hash, "#"),
                                SyntaxNode::inner(
                                    SyntaxKind::FuncCall,
                                    vec![
                                        SyntaxNode::leaf(
                                            SyntaxKind::Ident,
                                            if attr == "textAlign" {
                                                if value == "justify" {
                                                    "par"
                                                } else {
                                                    "align"
                                                }
                                            } else {
                                                "text"
                                            },
                                        ),
                                        SyntaxNode::inner(
                                            SyntaxKind::Args,
                                            vec![
                                                SyntaxNode::leaf(SyntaxKind::LeftParen, "("),
                                                if attr == "textAlign" {
                                                    if value == "justify" {
                                                        SyntaxNode::inner(
                                                            SyntaxKind::Named,
                                                            vec![
                                                                SyntaxNode::leaf(
                                                                    SyntaxKind::Ident,
                                                                    "justify",
                                                                ),
                                                                SyntaxNode::leaf(
                                                                    SyntaxKind::Colon,
                                                                    ":",
                                                                ),
                                                                SyntaxNode::leaf(
                                                                    SyntaxKind::Space,
                                                                    " ",
                                                                ),
                                                                SyntaxNode::leaf(
                                                                    SyntaxKind::Bool,
                                                                    "true",
                                                                ),
                                                            ],
                                                        )
                                                    } else {
                                                        SyntaxNode::leaf(SyntaxKind::Ident, value)
                                                    }
                                                } else {
                                                    SyntaxNode::inner(
                                                        SyntaxKind::Named,
                                                        vec![
                                                            SyntaxNode::leaf(
                                                                SyntaxKind::Ident,
                                                                "dir",
                                                            ),
                                                            SyntaxNode::leaf(
                                                                SyntaxKind::Colon,
                                                                ":",
                                                            ),
                                                            SyntaxNode::leaf(
                                                                SyntaxKind::Space,
                                                                " ",
                                                            ),
                                                            SyntaxNode::leaf(
                                                                SyntaxKind::Ident,
                                                                value,
                                                            ),
                                                        ],
                                                    )
                                                },
                                                SyntaxNode::leaf(SyntaxKind::RightParen, ")"),
                                                SyntaxNode::inner(
                                                    SyntaxKind::ContentBlock,
                                                    vec![
                                                        SyntaxNode::leaf(
                                                            SyntaxKind::LeftBracket,
                                                            "[",
                                                        ),
                                                        SyntaxNode::inner(
                                                            SyntaxKind::Markup,
                                                            nodes,
                                                        ),
                                                        SyntaxNode::leaf(
                                                            SyntaxKind::RightBracket,
                                                            "]",
                                                        ),
                                                    ],
                                                ),
                                            ],
                                        ),
                                    ],
                                ),
                            ]
                        }
                        _ => {}
                    }
                }
            }
        }

        nodes.push(SyntaxNode::leaf(SyntaxKind::Parbreak, "\n\n"));
        nodes
    } else {
        vec![]
    }
}

fn text2typst(value: &serde_json::Value) -> Vec<SyntaxNode> {
    if let Some(text) = value["text"].as_str() {
        let mut nodes = vec![SyntaxNode::leaf(SyntaxKind::Text, text)];

        if let Some(marks) = value["marks"].as_array() {
            for mark in marks {
                if let Some(mark_type) = mark["type"].as_str() {
                    match mark_type {
                        "bold" => {
                            nodes = vec![SyntaxNode::inner(
                                SyntaxKind::Strong,
                                vec![
                                    SyntaxNode::leaf(SyntaxKind::Star, "*"),
                                    SyntaxNode::inner(SyntaxKind::Markup, nodes),
                                    SyntaxNode::leaf(SyntaxKind::Star, "*"),
                                ],
                            )];
                        }
                        "italic" => {
                            nodes = vec![SyntaxNode::inner(
                                SyntaxKind::Emph,
                                vec![
                                    SyntaxNode::leaf(SyntaxKind::Underscore, "_"),
                                    SyntaxNode::inner(SyntaxKind::Markup, nodes),
                                    SyntaxNode::leaf(SyntaxKind::Underscore, "_"),
                                ],
                            )];
                        }
                        "underline" | "strike" => {
                            nodes = vec![
                                SyntaxNode::leaf(SyntaxKind::Hash, "#"),
                                SyntaxNode::inner(
                                    SyntaxKind::FuncCall,
                                    vec![
                                        SyntaxNode::leaf(SyntaxKind::Ident, mark_type),
                                        SyntaxNode::inner(
                                            SyntaxKind::Args,
                                            vec![SyntaxNode::inner(
                                                SyntaxKind::ContentBlock,
                                                vec![
                                                    SyntaxNode::leaf(SyntaxKind::LeftBracket, "["),
                                                    SyntaxNode::inner(SyntaxKind::Markup, nodes),
                                                    SyntaxNode::leaf(SyntaxKind::RightBracket, "]"),
                                                ],
                                            )],
                                        ),
                                    ],
                                ),
                            ]
                        }
                        "link" => {
                            nodes = vec![
                                SyntaxNode::leaf(SyntaxKind::Hash, "#"),
                                SyntaxNode::inner(
                                    SyntaxKind::FuncCall,
                                    vec![
                                        SyntaxNode::leaf(SyntaxKind::Ident, "link"),
                                        SyntaxNode::inner(
                                            SyntaxKind::Args,
                                            vec![
                                                SyntaxNode::leaf(SyntaxKind::LeftParen, "("),
                                                SyntaxNode::leaf(
                                                    SyntaxKind::Str,
                                                    '"'.to_string()
                                                        + mark["attrs"]["href"]
                                                            .as_str()
                                                            .unwrap_or("")
                                                        + "\"",
                                                ),
                                                SyntaxNode::leaf(SyntaxKind::RightParen, ")"),
                                                SyntaxNode::inner(
                                                    SyntaxKind::ContentBlock,
                                                    vec![
                                                        SyntaxNode::leaf(
                                                            SyntaxKind::LeftBracket,
                                                            "[",
                                                        ),
                                                        SyntaxNode::inner(
                                                            SyntaxKind::Markup,
                                                            nodes,
                                                        ),
                                                        SyntaxNode::leaf(
                                                            SyntaxKind::RightBracket,
                                                            "]",
                                                        ),
                                                    ],
                                                ),
                                            ],
                                        ),
                                    ],
                                ),
                            ]
                        }
                        _ => {}
                    }
                }
            }
        }

        nodes
    } else {
        vec![]
    }
}

fn tiptap2typst(value: &serde_json::Value) -> Vec<SyntaxNode> {
    let value_type = value["type"].as_str();

    if let Some(value_type) = value_type {
        match value_type {
            "paragraph" => paragraph2typst(value),
            "doc" => doc2typst(value),
            "text" => text2typst(value),
            _ => vec![],
        }
    } else {
        vec![]
    }
}

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
        .add_filter("tsd", &["tsd"])
        .save_file(move |f| {
            if let Some(f) = f {
                if let Some(path) = f.as_path() {
                    let mut path = path.to_str().unwrap().to_string();
                    if !path.ends_with(".tsd") {
                        path = path + ".tsd";
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
        .add_filter("tsd", &["tsd"])
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
        .strip_suffix(".tsd")
        .unwrap_or(filename)
        .to_string();
    let dirname = Path::new(basename.as_str())
        .parent()
        .unwrap()
        .to_str()
        .unwrap();
    let typst_file = basename.clone() + ".typ";
    let pdf_file = basename.clone() + ".pdf";

    let content: Result<serde_json::Value, serde_json::Error> = serde_json::from_str(content);
    if let Ok(content) = content {
        let typst = tiptap2typst(&content);
        if let Some(typst) = typst.get(0) {
            let attr_map = calculate_attributes(typst.clone());
            let printer = PrettyPrinter::new(attr_map);
            let markup = typst.cast().unwrap();
            let doc = printer.convert_markup(markup);
            let result = strip_trailing_whitespace(&doc.pretty(80).to_string());

            if let Ok(mut file) = File::create(&typst_file) {
                if let Ok(_) = file.write_all(result.as_bytes()) {
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
