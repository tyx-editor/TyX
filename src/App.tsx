import "./index.css"
import "@mantine/core/styles.css"
import "@mantine/tiptap/styles.css"
import "@fortawesome/fontawesome-free/css/all.css"

import { ActionIcon, Button, MantineProvider, Tabs, Text } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import Editor from "./components/Editor"
import { useLocalStorage } from "./hooks"
import { TypStudioDocument } from "./models"
import { useEffect, useState } from "react"
import { getVersion } from "@tauri-apps/api/app"
import { onOpen, open } from "./backend"

const App = () => {
  const colorScheme = useColorScheme()
  const [openDocuments, setOpenDocuments] = useLocalStorage<
    TypStudioDocument[]
  >({
    key: "Open Documents",
    defaultValue: [],
  })
  const [currentDocument, setCurrentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
  })
  const [version, setVersion] = useState("")

  useEffect(() => {
    getVersion().then((v) => setVersion(v))
  }, [])

  return (
    <MantineProvider
      forceColorScheme={colorScheme}
      theme={{
        colors: {
          primary: [
            "#ffeef7",
            "#f4dde8",
            "#e0bbcc",
            "#ce96b0",
            "#be7698",
            "#b56289",
            "#b15781",
            "#9c476f",
            "#8c3e63",
            "#7c3256",
          ],
        },
        primaryColor: "primary",
      }}
    >
      {openDocuments.length > 0 && (
        <Tabs
          variant="outline"
          value={currentDocument.toString()}
          onChange={(v) => setCurrentDocument(parseInt(v ?? "0", 10))}
        >
          <Tabs.List>
            {openDocuments.map((doc, docIndex) => (
              <Tabs.Tab
                key={docIndex}
                value={docIndex.toString()}
                leftSection={<i className="fa-solid fa-file-lines" />}
                rightSection={
                  <ActionIcon
                    component="span"
                    size="xs"
                    variant="transparent"
                    color="red"
                    onClick={() => {
                      openDocuments.splice(docIndex, 1)
                      setOpenDocuments([...openDocuments])
                      if (docIndex <= currentDocument) {
                        setCurrentDocument(currentDocument - 1)
                      }
                    }}
                  >
                    <i className="fa-solid fa-xmark" />
                  </ActionIcon>
                }
              >
                {doc.filename?.split("/").pop() ?? "Untitled"}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {openDocuments.map((doc, docIndex) => (
            <Tabs.Panel key={docIndex} value={docIndex.toString()}>
              <div style={{ padding: 10 }}>
                <Editor
                  doc={doc}
                  update={(content) => {
                    openDocuments[docIndex].content = content
                    openDocuments[docIndex].dirty = true
                    setOpenDocuments([...openDocuments])
                  }}
                />
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      )}

      {openDocuments.length === 0 && (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Welcome to TypStudio!</h2>
          <Button.Group my="xs" orientation="vertical">
            <Button
              leftSection={<i className="fa-solid fa-plus" />}
              onClick={() => onOpen(undefined, "{}")}
            >
              New Empty Document
            </Button>
            <Button
              leftSection={<i className="fa-solid fa-folder-open" />}
              onClick={open}
            >
              Open a Document
            </Button>
          </Button.Group>
          <Text c="grey">v{version}</Text>
        </div>
      )}
    </MantineProvider>
  )
}

export default App
