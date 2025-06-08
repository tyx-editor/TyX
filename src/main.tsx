import { MathfieldElement } from "mathlive"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { initialize } from "./backend"
import { initializeKeyboardShortcuts } from "./shortcuts"
import "./translations"

MathfieldElement.fontsDirectory = "/fonts"

initialize()
initializeKeyboardShortcuts()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
