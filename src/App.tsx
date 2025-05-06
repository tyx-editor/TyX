import "@cortex-js/compute-engine"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/tiptap/styles.css"
import "mathlive"
import "./index.css"

import {
  ActionIcon,
  Anchor,
  Button,
  MantineProvider,
  Tabs,
  Text,
} from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import {
  IconBrandGithub,
  IconFileText,
  IconFolderOpen,
  IconPlus,
  IconX,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { getVersion, onNew, open } from "./backend"
import Editor from "./components/Editor"
import { useLocalStorage } from "./hooks"
import { TyXDocument } from "./models"
import { showConfirmModal } from "./utilities"

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

  const closeDocument = (index: number) => {
    openDocuments.splice(index, 1)
    setOpenDocuments([...openDocuments])
    if (index <= currentDocument) {
      setCurrentDocument(currentDocument - 1)
    }
  }

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
      <ModalsProvider>
        <Notifications />
        {openDocuments.length > 0 && (
          <Tabs
            variant="outline"
            value={currentDocument.toString()}
            onChange={(v) => {
              const tab = parseInt(v ?? "0", 10)
              if (tab !== currentDocument) {
                setCurrentDocument(tab)
              }
            }}
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
                        if (!openDocuments[currentDocument].dirty) {
                          closeDocument(docIndex)
                        } else {
                          showConfirmModal(
                            `Are you sure you want to discard ${
                              openDocuments[docIndex].filename
                                ? `the changes to ${openDocuments[docIndex].filename}`
                                : "the document"
                            }?`,
                            () => closeDocument(docIndex)
                          )
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

            {openDocuments[currentDocument] !== undefined && (
              <Tabs.Panel
                key={currentDocument}
                value={currentDocument.toString()}
              >
                <div style={{ padding: 10 }}>
                  <Editor
                    doc={openDocuments[currentDocument]}
                    update={(content) => {
                      openDocuments[currentDocument].content = content
                      openDocuments[currentDocument].dirty = true
                      setOpenDocuments([...openDocuments])
                    }}
                  />
                </div>
              </Tabs.Panel>
            )}
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
              <Button leftSection={<IconPlus />} onClick={onNew}>
                New Empty Document
              </Button>
              <Button leftSection={<IconFolderOpen />} onClick={open}>
                Open a Document
              </Button>
            </Button.Group>
            <Text c="grey">v{version}</Text>
            <Text
              c="grey"
              fz="xs"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActionIcon
                variant="light"
                size="sm"
                component="a"
                href="https://github.com/tyx-editor/TyX/"
                target="_blank"
                mr={5}
              >
                <IconBrandGithub />
              </ActionIcon>
              TyX is created with:
              <Anchor
                fz="inherit"
                href="https://github.com/typst/typst/"
                target="_blank"
                mx={5}
              >
                typst
              </Anchor>
              •
              <Anchor
                fz="inherit"
                href="https://github.com/Myriad-Dreamin/typst.ts/"
                target="_blank"
                mx={5}
              >
                typst.ts
              </Anchor>
              •
              <Anchor
                fz="inherit"
                href="https://github.com/arnog/mathlive/"
                mx={5}
                target="_blank"
              >
                mathlive
              </Anchor>
              •
              <Anchor
                fz="inherit"
                href="https://github.com/ueberdosis/tiptap/"
                mx={5}
                target="_blank"
              >
                tiptap
              </Anchor>
              •
              <Anchor
                fz="inherit"
                href="https://github.com/tauri-apps/tauri/"
                target="_blank"
                mx={5}
              >
                tauri
              </Anchor>
              •
              <Anchor
                fz="inherit"
                href="https://github.com/mantinedev/mantine/"
                target="_blank"
                mx={5}
              >
                mantine
              </Anchor>
              •
              <Anchor
                fz="inherit"
                href="https://github.com/tabler/tabler-icons/"
                target="_blank"
                mx={5}
              >
                tabler
              </Anchor>
              •
              <Anchor
                fz="inherit"
                href="https://github.com/vitejs/vite/"
                target="_blank"
                mx={5}
              >
                vite
              </Anchor>
            </Text>
          </div>
        )}
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
