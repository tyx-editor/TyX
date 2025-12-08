/**
 * @file The entry point to the React app.
 */

import { MantineProvider } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import "./backend"
import DocumentTabs from "./components/DocumentTabs"
import StatusBar from "./components/StatusBar"
import WelcomeScreen from "./components/WelcomeScreen"
import { TyXDocument, TyXSettings } from "./models"
import { RTL_LANGUAGES } from "./translations"
import { useLocalStorage } from "./utilities/hooks"

declare global {
  interface Window {
    openedFiles?: string[]
  }
}

const App = () => {
  const {
    i18n: { changeLanguage },
  } = useTranslation()
  const colorScheme = useColorScheme()
  const [openDocuments] = useLocalStorage<TyXDocument[]>({
    key: "Open Documents",
    defaultValue: [],
  })
  const [settings] = useLocalStorage<TyXSettings>({
    key: "Settings",
    defaultValue: {},
  })

  // Update the i18n language from the user settings and update the document's direction.
  useEffect(() => {
    changeLanguage(settings.language ?? "en")
    document.dir =
      settings.language && RTL_LANGUAGES.includes(settings.language)
        ? "rtl"
        : "ltr"
  }, [settings.language])

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
      <ModalsProvider modalProps={{ centered: true }}>
        <Notifications />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <div
            style={{
              overflowY: "auto",
              flex: 1,
            }}
          >
            {openDocuments.length > 0 ? <DocumentTabs /> : <WelcomeScreen />}
          </div>
          <StatusBar />
        </div>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
