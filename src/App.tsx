import "./index.css"
import "@mantine/core/styles.css"
import "@mantine/tiptap/styles.css"

import { ActionIcon, Button, MantineProvider, Tabs, Text } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import Editor from "./components/Editor"
import { useLocalStorage } from "./hooks"
import { TyXDocument } from "./models"
import { useEffect, useState } from "react"
import { getVersion } from "@tauri-apps/api/app"
import { onOpen, open } from "./backend"
import {
  IconFileText,
  IconFolderOpen,
  IconPlus,
  IconX,
} from "@tabler/icons-react"

const App = () => {
  const colorScheme = useColorScheme()
  const [openDocuments, setOpenDocuments] = useLocalStorage<TyXDocument[]>({
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
                leftSection={<IconFileText />}
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
                    <IconX />
                  </ActionIcon>
                }
              >
                {doc.filename?.split("/").pop()?.split("\\").pop() ??
                  "Untitled"}
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
          <h2>Welcome to TyX!</h2>
          <Button.Group my="xs" orientation="vertical">
            <Button
              leftSection={<IconPlus />}
              onClick={() => onOpen(undefined, "{}")}
            >
              New Empty Document
            </Button>
            <Button leftSection={<IconFolderOpen />} onClick={open}>
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
