# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
