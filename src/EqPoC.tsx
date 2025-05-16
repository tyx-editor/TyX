import { useEffect, useState } from "react"
import { clickPreview, eqPreview } from "./backend"
// todo: move me to backend.ts
import { listen } from "@tauri-apps/api/event"
import "./index.css"

export const PoC = () => {
  const [htmlPreview, setPreview] = useState<string>("")

  const onEqPreviewChange = (change: string) => {
    console.log("onEqPreviewChange")
    setPreview(change)
  }

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    console.log("typst-doc", event.target)
    clickPreview(event.clientX, event.clientY)
  }

  const onClickOther = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    console.log("click other", event.target)
    const result = await eqPreview("test")
    setPreview(result)
  }

  useEffect(() => {
    listen<string>("eqPreviewChange", (e) => onEqPreviewChange(e.payload))
    ;(async () => {
      const result = await eqPreview("test")
      setPreview(result)
    })()
  }, [])

  return (
    <div className="poc" onClick={onClickOther}>
      <div
        dangerouslySetInnerHTML={{ __html: htmlPreview }}
        onClick={onClick}
      ></div>
    </div>
  )
}
