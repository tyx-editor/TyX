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
import { initializeBackend } from "./backend"
import { initializeKeyboardShortcuts } from "./shortcuts"

/** Initialize everything and render the main application. */
const main = () => {
  MathfieldElement.fontsDirectory = "/fonts"
  MathfieldElement.soundsDirectory = null
  initializeBackend()
  initializeKeyboardShortcuts()

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
