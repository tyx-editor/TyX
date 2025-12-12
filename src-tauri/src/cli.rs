use std::path::{Path, PathBuf};

use crate::pdf::typst_to_pdf;
use clap::{Parser, ValueEnum};

#[derive(Debug, Clone, ValueEnum)]
pub(crate) enum ExportFormat {
    Typst,
    Pdf,
}

impl ExportFormat {
    pub(crate) fn extension(&self) -> &str {
        match self {
            Self::Pdf => ".pdf",
            Self::Typst => ".typ",
        }
    }

    pub(crate) fn export(&self, input: String, filename: &str) -> Vec<u8> {
        let dirname = Path::new(filename).parent().unwrap().to_str().unwrap();

        match self {
            Self::Typst => tyx_converters::serialized_tyx_to_typst(&input).into_bytes(),
            Self::Pdf => {
                let contents = tyx_converters::serialized_tyx_to_typst(&input);
                typst_to_pdf(filename, &contents, PathBuf::from(dirname), vec![]).unwrap()
            }
        }
    }
}

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(version = tyx_version::VERSION, about, long_about = None, display_name="TyX")]
pub(crate) struct Args {
    /// Files to open or export.
    pub(crate) files: Vec<String>,
    /// Export as this file format, the default output filenames are just replacing the file extension
    #[arg(short, long)]
    pub(crate) export: Option<ExportFormat>,
    /// Save the output to this filename, requires files to be only one.
    #[arg(short, long)]
    pub(crate) output: Option<String>,
}

impl Args {
    pub(crate) fn process(&self) -> bool {
        let mut should_exit = false;

        let output_filename = match &self.output {
            Some(output) => {
                assert!(self.files.len() == 1);
                Some(output)
            }
            None => None,
        };
        for file in self.files.iter() {
            let contents = std::fs::read_to_string(file).unwrap();
            if let Some(ref format) = self.export {
                let file_base = match file.strip_suffix(".tyx") {
                    Some(file) => file,
                    None => {
                        println!("warning: file {file} might not be a TyX document!");
                        file
                    }
                };
                should_exit = true;
                let default_filename = String::from(file_base) + format.extension();
                let final_output_filename = output_filename.unwrap_or(&default_filename);
                println!("Exported to {final_output_filename}");
                std::fs::write(final_output_filename, format.export(contents, file)).unwrap();
            }
        }

        should_exit
    }
}
