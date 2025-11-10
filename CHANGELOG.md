# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.15] - 2025-11-10

### Fixed

- AppImage should no longer be a blank screen on some latest OSs.
- Heading export is now correctly using depth instead of level.

## [0.2.14] - 2025-11-06

### Changed

- The bundled typst compiler has been bumped to 0.14.0.

### Fixed

- Math conversion is now more reliable with updates from tex2typst and better conversion path.
- Open settings directory now also works when it doesn't exist yet.
- Schema validation concerning the direction parameter no longer throws an error.

## [0.2.13] - 2025-11-01

### Fixed

- Selection around math in RTL on Windows can now enter the math field.
- Keyboard shortcuts now work more fluently with a less hacky implementation.

## [0.2.12] - 2025-10-31

### Added

- There's a new setFunctionCall command to set the current function, or insert a new call.
- The app settings now have a button to open the settings directory.
- Additional math toolbar items are now available.
- The status bar now shows possible completions for keyboard shortcuts as well as hints to a set keyboard shortcut when hovering over a button or running a command.
- Preview of unsaved documents now works locally.
- A new `tyx_schema` python package is available to work with TyX documents and settings in Python.

### Changed

- The default keyboard shortcuts are now included by default, unless unbound in the app settings file.

### Fixed

- The nested editors now share histroy with the main editor, fixing undo/redo scenarios.
- The editor no longer gets stuck when an editor throws an error - the basic commands still work.
- The schema no longer has nullable fields, making it easier to work with in other languages like Python (which don't distinguish between null/undefined).

## [0.2.11] - 2025-10-12

### Changed

- The keyboard map is now ignored inside the typst code and code block nodes.

### Fixed

- The `textcolor`, `intop` and `differentialD` commands are now supported in tex2typst - thanks @qwinsi!
- Commands inside nested editors (in function calls) now work as expected (when entering/leaving).
- Caret movements around nested editors (in function calls) now work when the nested editor is at the start/end, and when it's selected.
- Pressing the space key inside math now doesn't exit when inserting a raw command.
- Deleting a non-inline function call or math node now creates an empty paragraph instead of the deleted node.

## [0.2.10] - 2025-10-10

The default keyboard shortcuts have changed, it is recommended to reset to the defaults after updating!

### Added

- A new command and button for inserting function calls easier.
- More TyX commands for working with TyX itself: `fileNewFromTemplate`, `fileClose`, `openSettings` and `openDocumentSettings`.
- A hint for the command which will be executed when clicking some command button is now shown in the status bar.
- More commands for doing actions in the toolbar are now available.

### Changed

- The status bar is now visible in the welcome screen as well.

### Fixed

- Various issues regarding closing a file.
- Commands continue to work when switching between the main editor and nested editors.

## [0.2.9] - 2025-10-08

### Added

- Additional translations.
- You can now put fonts in a `fonts` folder in the TyX data directory, and they will be picked up when compiling.

### Fixed

- Table column count is now correct.
- Keyboard shortcuts now work on Windows (see https://github.com/tauri-apps/wry/issues/451).

## [0.2.8] - 2025-10-05

### Changed

- Conversion of the math field from LaTeX to Typst is now powered by tyx2typst.

## [0.2.7] - 2025-08-15

### Fixed

- Command sequence execution now shows up in the status bar as the whole sequence
- A table now appears without headers (i.e. the top row does not appear to be bold even though it isn't)
- Previewing now opens the PDF on Windows.

## [0.2.6] - 2025-08-02

### Fixed

- A fatal error that would cause the app to crash upon rendering on Windows was patched.

## [0.2.5] - 2025-08-01

### Fixed

- A fatal error that would cause the app to crash upon opening on Windows was patched.

## [0.2.4] - 2025-07-27

### Added

- The JSON schemas are now more accurate and verified when opening a document.
- Function definitions now also include whether the function is inline or not.
- App settings and document settings can now be customized (outside TyX) to include more function definitions.
- Function calls now support multiple content parameters.

### Fixed

- Preview now opens the generated PDF.
- Document filename is now always persisted after saving.

## [0.2.3] - 2025-07-18

### Added

- It is not possible to save settings in the filesystem, and they are automatically loaded when TyX is opened.
- Settings and documents are now saved with the `$schema` set, and a JSON Schema for them is available in the website.
- The application now prompts the user for updates instead of automatically updating in the background.
- It is now possible to run a compilation server that updates the PDF whenever the TyX document is edited.
- It is now possible via the TyX settings to export Typst files with Typstyle in the app version.

### Fixed

- Double-clicking a `.tyx` file should now work better, although it's still not completely fixed.

## [0.2.2] - 2025-07-13

### Added

- Footnotes can now be inserted.
- Horizontal and vertical spacing can now be inserted and customized.
- Support for any Typst function call is now available with the function call node.

### Changed

- Math conversion is now using mathlive's typst output implemented [here](https://github.com/arnog/mathlive/blob/master/src/formats/atom-to-typst.ts).

### Fixed

- Typst importing works again, albeit major changes may still occur and the implementation is still partial.

## [0.2.1] - 2025-07-10

### Added

- Headings can now be inserted with toolbar buttons again.
- Links can now be inserted again.
- When selecting a code node, you can now change its language.

## [0.2.0] - 2025-07-09

### Breaking Changes

- Files saved with TyX 0.1 are sadly not compatible.
- TyX 0.1 commands (and thus keyboard shortcuts) no longer work.

### Changed

- The underlying editor library was changed from TipTap to Lexical.
- Code nodes are now easier to notice when empty (previously nothing was shown).
- Image contents are no longer saved in the TyX file, only the relative image path.

## [0.1.17] - 2025-06-09

### Added

- The new `toggleKeyboardLayout` command allows easily switching between a keyboard layout and no keyboard layout.
- The math controls now also include greek letters.
- You can now customize inline shortcuts for the math editor in the app settings.

### Changed

- The generated Typst is now _much_ more readable.

### Fixed

- List item keyboard shortcuts are now back, so pressing enter in the editor while in a bullet/item list correctly inserts another item.
- The "Mathfield not mounted" error has been fixed.

## [0.1.16] - 2025-06-04

### Added

- App translations infrastructure and Hebrew translations.
- Initial support for images (only for the local version).

### Fixed

- Cursor movements around math formulas in RTL languages.

## [0.1.15] - 2025-06-02

### Added

- Keyboard shortcuts are now customizable in the settings.
- Keyboard maps are now supported.

## [0.1.14] - 2025-05-31

### Changed

- Keyboard shortcuts are now global using Mousetrap instead of TipTap-based.
- The app menu is now created from-scratch.

### Fixed

- The color extension now works more reliably.
- Cursor movements around math formulas is more robust.

## [0.1.13] - 2025-05-23

### Added

- There are now list controls for indentation.

### Changed

- Documents are now compiled with the bundled typst rust crate instead of bundling the binary itself.

### Fixed

- Math selection is now less buggy.
- Table controls now show properly.

## [0.1.12] - 2025-05-17

### Added

- Separated the editor extensions so they are importable in SSR as well.

## [0.1.11] - 2025-05-17

### Added

- MathLive fonts are now included with TyX for the math editor.

### Changed

- Math formula conversion is now using ASCIIMath instead of MathJSON.

## [0.1.10] - 2025-05-14

### Added

- Documentation and a changelog.
