/**
 * @file The entry point to TyX - both the web editor and the local editor.
 */

import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "mathlive"
import "./index.css"
import "./translations"

import { MathfieldElement } from "mathlive"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { initializeBackend, open } from "./backend"
import initializeWasm from "./converters"
import { initializeKeyboardShortcuts } from "./shortcuts"
import { state } from "./state"

/** Initialize everything and render the main application. */
const main = () => {
  MathfieldElement.fontsDirectory = "/fonts"
  MathfieldElement.soundsDirectory = null
  initializeBackend()
  initializeKeyboardShortcuts()

  initializeWasm().then(() => (state.wasmInitialized = true))
  for (const file of window.openedFiles ?? []) {
    open(file)
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

  customElements
    .whenDefined("math-field")
    .then(() => document.body.classList.add("ready"))
}

main()
