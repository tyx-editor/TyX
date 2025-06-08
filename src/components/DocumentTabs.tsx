/**
 * @file A component showing the open document tabs as well as the current document.
 */

import { ActionIcon, Button, Tabs } from "@mantine/core"
import { IconFileText, IconPlus, IconX } from "@tabler/icons-react"
import { t } from "i18next"
import { ErrorBoundary } from "react-error-boundary"
import { onNew } from "../backend"
import { TyXDocument } from "../models"
import { showConfirmModal } from "../utilities"
import { useLocalStorage } from "../utilities/hooks"
import Editor from "./Editor"

const DocumentTabs = () => {
  const [openDocuments, setOpenDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
  })
  const [currentDocument, setCurrentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
  })

  const closeDocument = (index: number) => {
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
                      () => closeDocument(docIndex),
                    )
                  }
                }}
              >
                <IconX />
              </ActionIcon>
            }
          >
            {doc.filename?.split("/").pop()?.split("\\").pop() ?? "Untitled"}
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
        <Tabs.Panel key={currentDocument} value={currentDocument.toString()}>
          <div style={{ padding: 10 }}>
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
        </Tabs.Panel>
      )}
    </Tabs>
  )
}

export default DocumentTabs
