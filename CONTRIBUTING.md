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

## Developing the typst-tiptap Converter

TyX uses tiptap to build its wysiwyg editor. To convert typst documents into tiptap format, TyX adopts a custom converter. The converter is located in [`crates/tyx-tiptap-typst`](./crates/tyx-tiptap-typst).

To perform snapshot testing about the converter, please run:

```bash
cargo insta test -p tyx-tiptap-typst --accept
```

<!-- todo: build locally -->
