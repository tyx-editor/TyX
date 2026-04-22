import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { useMemo } from "react"
import { initialConfig } from "../config"
import { TyXDocumentContent } from "../models"

const TyXContentEditor = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: TyXDocumentContent | undefined
  onChange: (content: TyXDocumentContent) => void
}) => {
  const config = useMemo(
    () => ({
      ...initialConfig,
      editorState: value ? JSON.stringify(value) : undefined,
    }),
    [],
  )

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        {label}
      </div>
      <LexicalComposer initialConfig={config}>
        <div
          style={{
            border: "1px solid var(--mantine-color-default-border)",
            borderRadius: "var(--mantine-radius-sm)",
            padding: "6px 10px",
            minHeight: 60,
          }}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable aria-placeholder="" placeholder={<></>} />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin
          ignoreSelectionChange
          onChange={(state) =>
            onChange(state.toJSON() as unknown as TyXDocumentContent)
          }
        />
      </LexicalComposer>
    </div>
  )
}

export default TyXContentEditor
