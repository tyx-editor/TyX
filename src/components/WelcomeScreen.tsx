/**
 * @file The welcome screen shown if no documents are open.
 */

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ActionIcon, Anchor, Button, Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import {
  IconBrandGithub,
  IconFileTextSpark,
  IconFolderOpen,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { getVersion, isWeb, newFromTemplate, onNew, open } from "../backend"
import { initialConfig } from "../config"
import CurrentEditorPlugin from "./plugins/CurrentEditorPlugin"
import TyXCommandsPlugin from "./plugins/TyXCommandsPlugin"
import SettingsModal from "./SettingsModal"
import UpdateChecker from "./UpdateChecker"

const CREATED_WITH_LINKS = [
  { label: "typst", href: "https://github.com/typst/typst/" },
  { label: "typst.ts", href: "https://github.com/Myriad-Dreamin/typst.ts/" },
  { label: "tyx2typst", href: "https://github.com/qwinsi/tex2typst/" },
  { label: "tinymist", href: "https://github.com/Myriad-Dreamin/tinymist/" },
  { label: "mathlive", href: "https://github.com/arnog/mathlive/" },
  { label: "lexical", href: "https://github.com/facebook/lexical/" },
  { label: "tauri", href: "https://github.com/tauri-apps/tauri/" },
  { label: "mantine", href: "https://github.com/mantinedev/mantine/" },
  { label: "tabler", href: "https://github.com/tabler/tabler-icons/" },
  { label: "vite", href: "https://github.com/vitejs/vite/" },
]

const WelcomeScreen = () => {
  const [version, setVersion] = useState("")

  useEffect(() => {
    getVersion().then((v) => setVersion(v))
  }, [])

  return (
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
      <h2>{t("welcome")}</h2>
      <Button.Group my="xs" orientation="vertical">
        <Button leftSection={<IconPlus />} onClick={onNew}>
          {t("newEmptyDocument")}
        </Button>
        <Button
          leftSection={<IconFileTextSpark />}
          onClick={() => newFromTemplate()}
        >
          {t("newFromTemplate")}
        </Button>
        <Button leftSection={<IconFolderOpen />} onClick={() => open()}>
          {t("openDocument")}
        </Button>
        <Button
          leftSection={<IconSettings />}
          onClick={() =>
            modals.open({
              title: t("settings"),
              children: <SettingsModal />,
            })
          }
        >
          {t("settings")}
        </Button>
      </Button.Group>
      <Text c="grey">v{version}</Text>
      <Text
        c="grey"
        fz="xs"
        maw="100%"
        pb="xs"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          overflowX: "auto",
        }}
      >
        <ActionIcon
          variant="light"
          size="sm"
          component="a"
          href="https://github.com/tyx-editor/TyX/"
          target="_blank"
          style={{ marginInlineEnd: 5 }}
        >
          <IconBrandGithub />
        </ActionIcon>
        {t("createdWith")}:
        {CREATED_WITH_LINKS.map(({ label, href }, index) => (
          <Anchor key={index} fz="inherit" href={href} target="_blank" mx={5}>
            {label}
          </Anchor>
        ))}
      </Text>
      {!isWeb && <UpdateChecker />}
      {/* Invisible stub editor for TyX's commands. */}
      <LexicalComposer initialConfig={initialConfig}>
        <TyXCommandsPlugin />
        <CurrentEditorPlugin />
      </LexicalComposer>
    </div>
  )
}

export default WelcomeScreen
