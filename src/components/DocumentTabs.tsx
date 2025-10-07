/**
 * @file A component showing the open document tabs as well as the current document.
 */

import { ActionIcon, Button, Tabs } from "@mantine/core"
import { IconFileText, IconPlus, IconX } from "@tabler/icons-react"
import { ErrorBoundary } from "react-error-boundary"
import { useTranslation } from "react-i18next"
import { onNew } from "../backend"
import { TyXDocument } from "../models"
import { showConfirmModal } from "../utilities"
import { getLocalStorage, useLocalStorage } from "../utilities/hooks"
import Editor from "./Editor"
import StatusBar from "./StatusBar"

const DocumentTabs = () => {
  const { t } = useTranslation()
  const [openDocuments, setOpenDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
  })
  const [currentDocument, setCurrentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
  })

  const closeDocument = (index: number) => {
    const openDocuments = getLocalStorage<TyXDocument[]>("Open Documents")
    openDocuments.splice(index, 1)
    setOpenDocuments([...openDocuments])
    if (index <= currentDocument) {
      setCurrentDocument(currentDocument - 1)
    }
  }

  return (
    <Tabs
      variant="outline"
      value={currentDocument.toString()}
      onChange={(v) => {
        const tab = parseInt(v ?? "0", 10)
        if (tab !== currentDocument) {
          setCurrentDocument(tab)
        }
      }}
      display="flex"
      style={{ flexDirection: "column", overflow: "hidden" }}
      h="100%"
    >
      <Tabs.List flex="none">
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
                      t("pleaseConfirmYourAction"),
                      t("theChangesWontBeSaved") + "!",
                      t("confirm"),
                      t("cancel"),
                      () => closeDocument(docIndex),
                    )
                  }
                }}
              >
                <IconX />
              </ActionIcon>
            }
          >
            {doc.filename?.split("/").pop()?.split("\\").pop() ?? t("untitled")}
          </Tabs.Tab>
        ))}
        <Button
          variant="subtle"
          mt={1.25}
          ml={5}
          leftSection={<IconPlus />}
          onClick={onNew}
        >
          {t("new")}
        </Button>
      </Tabs.List>

      {openDocuments[currentDocument] !== undefined && (
        <Tabs.Panel
          key={currentDocument}
          value={currentDocument.toString()}
          display="flex"
          style={{
            flexDirection: "column",
            minHeight: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ErrorBoundary
              fallbackRender={({ error }) => (
                <>
                  <p>This document appears to be corrupted!</p>
                  <pre>
                    <code>{error.message}</code>
                  </pre>
                </>
              )}
            >
              <Editor />
            </ErrorBoundary>
          </div>
          <StatusBar />
        </Tabs.Panel>
      )}
    </Tabs>
  )
}

export default DocumentTabs
