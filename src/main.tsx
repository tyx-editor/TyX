import React from "react"
import ReactDOM from "react-dom/client"
import { PoC } from "./EqPoC"
import { initialize } from "./backend"

initialize()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PoC />
  </React.StrictMode>,
)
