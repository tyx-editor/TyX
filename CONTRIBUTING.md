## Project Structure

This project is structured as a monorepo. The main components are:

```bash
- tyx
  ├── src       # The tauri/web frontend
  ├── src-tauri # The tauri bridge to access the system
  ├── public    # The static assets for the frontend
  ├── crates    # The tauri backend components used by `src-tauri`
  │   └── ...
  └── scripts   # The scripts used to build and run the app
```

In particular, we would love to receive contributions to extend the current:

- Translations by copying and modifying a JSON in [src/translations](src/translations/) and adding it in [src/translations/index.ts](src/translations/index.ts).
- Keyboard maps by adding to [src/components/plugins/keyboardMap.ts](src/components/plugins/keyboardMap.ts).
- Functions by adding to [src/functions.ts](src/functions.ts)
- Document settings.
- App settings.
- Typst import.

## Setup

Install bun first, according to the instructions at https://bun.sh/docs/installation.

Then, install the dependencies:

```bash
bun install
```

## Developing

To start desktop app in dev mode, either run:

```bash
bun run dev:app
```

Or run:

```bash
bun run tauri dev
```

## Testing

To run rust tests, run:

```bash
cargo test --workspace
```

## Developing the Typst to TyX Converter

TyX uses lexical to build its wysiwyg editor. To convert typst documents into lexical format, TyX adopts a custom converter. The converter is located in [`crates/tyx-import-typst`](./crates/tyx-import-typst).

To perform snapshot testing about the converter, please run:

```bash
cargo insta test -p tyx-converters --accept
```

You may need to install [cargo-insta](https://crates.io/crates/cargo-insta)

<!-- todo: build locally -->
