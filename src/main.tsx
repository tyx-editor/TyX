import { MathfieldElement } from "mathlive"
import React from "react"
import ReactDOM from "react-dom/client"
import { PoC } from "./EqPoC"
import { initialize } from "./backend"

MathfieldElement.fontsDirectory = "/fonts"

initialize()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PoC />
  </React.StrictMode>,
)
