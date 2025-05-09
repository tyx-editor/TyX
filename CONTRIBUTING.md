## Project Structure

This project is structured as a monorepo. The main components are:

```bash
- tyx
  ├── src       # The tauri frontend
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

To start the development server, run:

```
bun run dev:app
```

## Building

To build the app for production, run:

```bash
bun run build
```
