use std::{
    fs::{File, create_dir_all},
    path::{Path, PathBuf},
};

use tinymist_project::{
    CompileFontArgs, CompileOnceArgs, EntryReader, TaskInputs, WorldProvider, base::ShadowApi,
};
use typst_pdf::PdfOptions;

pub(crate) fn typst_to_pdf(
    filename: &str,
    content: &str,
    root_path: PathBuf,
    font_paths: Vec<String>,
) -> Result<Vec<u8>, String> {
    let dirname = Path::new(filename).parent().unwrap();
    let mut font_paths = font_paths
        .iter()
        .map(|path| {
            let mut p = PathBuf::from(dirname);
            p.push(PathBuf::from(path));
            dunce::canonicalize(&p).unwrap()
        })
        .collect::<Vec<PathBuf>>();

    let tyx_fonts_path = crate::utils::get_tyx_config_dir().join("fonts");
    if !tyx_fonts_path.is_dir() {
        create_dir_all(&tyx_fonts_path).unwrap();
    }
    font_paths.insert(0, tyx_fonts_path);

    let filename_path = PathBuf::from(&filename);
    if !filename_path.is_file() {
        File::create(&filename_path).unwrap();
    }
    let filename_path = dunce::canonicalize(filename_path).unwrap();
    let universe = CompileOnceArgs {
        root: Some(dunce::canonicalize(&root_path).unwrap()),
        input: Some(filename_path.to_str().unwrap().to_string()),
        font: CompileFontArgs {
            font_paths,
            ..CompileFontArgs::default()
        },
        ..CompileOnceArgs::default()
    }
    .resolve()
    .unwrap();
    let entry = match universe
        .entry_state()
        .try_select_path_in_workspace(&filename_path)
    {
        Ok(entry) => entry,
        Err(_e) => {
            return Err("Invalid root directory, couldn't select the file itself!".into());
        }
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
            return Err(e[0].message.to_string());
        }
    };
    let pdf = typst_pdf::pdf(&doc, &PdfOptions::default()).unwrap();

    Ok(pdf)
}
