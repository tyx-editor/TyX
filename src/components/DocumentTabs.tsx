/**
 * @file A component showing the open document tabs as well as the current document.
 */

import { ActionIcon, Button, Tabs } from "@mantine/core"
import { IconFileText, IconPlus, IconX } from "@tabler/icons-react"
import { ErrorBoundary } from "react-error-boundary"
import { useTranslation } from "react-i18next"
import { executeCommandSequence } from "../commands"
import { TyXDocument } from "../models"
import { useLocalStorage } from "../utilities/hooks"
import Editor from "./Editor"

const DocumentTabs = () => {
  const { t } = useTranslation()
  const [openDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
  })
  const [currentDocument, setCurrentDocument] = useLocalStorage<number>({
    key: "Current Document",
    defaultValue: 0,
  })

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
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  executeCommandSequence(`fileClose ${docIndex}`)
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
          onClick={() => executeCommandSequence("fileNew")}
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
        </Tabs.Panel>
      )}
    </Tabs>
  )
}

export default DocumentTabs
