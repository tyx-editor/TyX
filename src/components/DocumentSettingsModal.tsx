import { Textarea } from "@mantine/core"
import { useLocalStorage } from "../hooks"
import { TyXDocument } from "../models"

const DocumentSettingsModal = () => {
  const [openDocuments, setOpenDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
  })
  const [currentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
  })

  return (
    <>
      <Textarea
        minRows={3}
        autosize
        label="Typst Preamble"
        value={openDocuments[currentDocument].preamble ?? ""}
        onChange={(e) => {
          openDocuments[currentDocument].preamble =
            e.currentTarget.value.replace(/“|”|“|‟|”|❝|❞|〝|〞/g, '"')
          setOpenDocuments([...openDocuments])
        }}
      />
    </>
  )
}

export default DocumentSettingsModal
